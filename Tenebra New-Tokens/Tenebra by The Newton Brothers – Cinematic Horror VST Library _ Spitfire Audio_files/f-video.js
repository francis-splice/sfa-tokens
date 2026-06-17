(function () {
  try {
    const props = window.analyzify.properties;
    const gtmVideoEnabled = props.GTM.status && props.GTM.video_tracking;
    const ga4VideoEnabled = props.GA4.status && (
      (props.GA4.primary.status && props.GA4.primary.events.video_tracking) ||
      (props.GA4.secondary.status && props.GA4.secondary.events.video_tracking)
    );

    if (!gtmVideoEnabled && !ga4VideoEnabled) return;

    const MILESTONES = [10, 25, 50, 75];
    const firedMilestones = new WeakMap();
    const startedVideos = new WeakSet();
    const trackedVideos = new WeakSet();
    const videoVisibility = new WeakMap();
    const videoSrcCache = new WeakMap();
    const videoTitleCache = new WeakMap();

    // --- Helpers ---

    function isAutoplayLooped(video) {
      return video.loop && (video.autoplay || (video.muted && !video.controls));
    }

    function getVideoSrc(video) {
      if (videoSrcCache.has(video)) return videoSrcCache.get(video);
      const src = video.currentSrc || video.src ||
        (video.querySelector('source') && video.querySelector('source').src) || '';
      videoSrcCache.set(video, src);
      return src;
    }

    function getVideoTitle(video) {
      if (videoTitleCache.has(video)) return videoTitleCache.get(video);
      let title = 'untitled';
      if (video.title) {
        title = video.title;
      } else if (video.getAttribute('alt')) {
        title = video.getAttribute('alt');
      } else {
        const src = getVideoSrc(video);
        if (src) {
          const filename = src.split('/').pop().split('?')[0];
          title = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        }
      }
      videoTitleCache.set(video, title);
      return title;
    }

    function getVideoData(video) {
      return {
        video_current_time: Math.round(video.currentTime),
        video_duration: Math.round(video.duration) || 0,
        video_percent: video.duration ? Math.floor((video.currentTime / video.duration) * 100) : 0,
        video_url: getVideoSrc(video),
        video_title: getVideoTitle(video),
        video_provider: 'html5',
        video_visible: videoVisibility.get(video) || false,
        video_muted: video.muted,
      };
    }

    function fireVideoEvent(type, videoData) {
      const gtmMethod = 'gtmVideo' + type;
      const gaMethod = 'gaVideo' + type;

      if (gtmVideoEnabled && typeof window.analyzify[gtmMethod] === 'function') {
        window.analyzify[gtmMethod](videoData);
      }
      if (ga4VideoEnabled && typeof window.analyzify[gaMethod] === 'function') {
        window.analyzify[gaMethod](videoData);
      }

      analyzify.log('Video ' + type + ': ' + videoData.video_title, 'f-video', 'fireVideoEvent');
    }

    // --- IntersectionObserver for visibility ---

    const visibilityObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        videoVisibility.set(entry.target, entry.isIntersecting);
      });
    }, { threshold: 0.5 });

    // --- Event Handlers ---

    function attachListeners(video) {
      if (trackedVideos.has(video)) return;
      if (isAutoplayLooped(video)) return;
      trackedVideos.add(video);
      // Set initial visibility synchronously before observer callback fires
      var rect = video.getBoundingClientRect();
      var viewHeight = window.innerHeight || document.documentElement.clientHeight;
      var viewWidth = window.innerWidth || document.documentElement.clientWidth;
      var visibleHeight = Math.max(0, Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0));
      var visibleWidth = Math.max(0, Math.min(rect.right, viewWidth) - Math.max(rect.left, 0));
      var visibleArea = visibleHeight * visibleWidth;
      var totalArea = rect.height * rect.width;
      videoVisibility.set(video, totalArea > 0 && (visibleArea / totalArea) >= 0.5);

      visibilityObserver.observe(video);
      firedMilestones.set(video, new Set());

      // Cache src and title at attachment time
      getVideoSrc(video);
      getVideoTitle(video);

      // PLAY — first play only, defer until metadata is loaded so duration is available
      video.addEventListener('play', function () {
        if (startedVideos.has(video)) return;
        startedVideos.add(video);

        if (video.readyState >= 1) {
          fireVideoEvent('Start', getVideoData(video));
        } else {
          video.addEventListener('loadedmetadata', function () {
            fireVideoEvent('Start', getVideoData(video));
          }, { once: true });
        }
      });

      // ERROR — playback failed (broken source, network issue)
      video.addEventListener('error', function () {
        const error = video.error;
        const data = getVideoData(video);
        data.video_error_code = error ? error.code : 0;
        data.video_error_message = error ? error.message : 'unknown';
        fireVideoEvent('Error', data);
      });

      // PAUSE — suppressed after 75% progress to reduce noise
      video.addEventListener('pause', function () {
        if (video.ended) return;
        const data = getVideoData(video);
        if (data.video_percent >= 75) return;
        fireVideoEvent('Pause', data);
      });

      // ENDED — video complete
      video.addEventListener('ended', function () {
        const milestones = firedMilestones.get(video);
        if (milestones.has('complete')) return;
        milestones.add('complete');
        const data = getVideoData(video);
        data.video_percent = 100;
        fireVideoEvent('Complete', data);
      });

      // TIMEUPDATE — milestone progress (10%, 25%, 50%, 75%) + 100% complete fallback
      video.addEventListener('timeupdate', function () {
        if (!video.duration) return;
        const percent = Math.floor((video.currentTime / video.duration) * 100);
        const milestones = firedMilestones.get(video);
        const videoData = getVideoData(video);

        MILESTONES.forEach(function (milestone) {
          if (percent >= milestone && !milestones.has(milestone)) {
            milestones.add(milestone);
            fireVideoEvent('Progress', { ...videoData, video_percent: milestone });
          }
        });

        // Fire complete at 100% via timeupdate as fallback for ended event
        if (percent >= 100 && !milestones.has('complete')) {
          milestones.add('complete');
          fireVideoEvent('Complete', { ...videoData, video_percent: 100 });
        }
      });
    }

    // --- Scan & Observe ---
    function scanVideos() {
      document.querySelectorAll('video').forEach(function (v) {
        attachListeners(v);
      });
    }

    const domObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'VIDEO') attachListeners(node);
          if (node.querySelectorAll) {
            node.querySelectorAll('video').forEach(function (v) {
              attachListeners(v);
            });
          }
        });
      });
    });

    scanVideos();
    domObserver.observe(document.body, { childList: true, subtree: true });

    analyzify.log('Video tracking initialized', 'f-video', 'init');
  } catch (error) {
    console.error('Error initializing video tracking:', error);
  }
})();

(function () {
  try {
    // --- Gate: only on product pages with GA4 or GTM enabled ---
    if (window.analyzify.shopify_template !== 'product') {
      analyzify.log('Skipped — not a product page', 'f-view-image', 'init');
      return;
    }

    const props = window.analyzify.properties;
    const gtmEnabled = props.GTM.status && props.GTM.view_image;
    const ga4Enabled = props.GA4.status && (
      (props.GA4.primary.status && props.GA4.primary.events.view_image) ||
      (props.GA4.secondary.status && props.GA4.secondary.events.view_image)
    );

    if (!gtmEnabled && !ga4Enabled) {
      analyzify.log('Skipped — GA4 and GTM view_image not enabled', 'f-view-image', 'init');
      return;
    }

    // --- Get product image filenames ---
    const productObj = window.analyzify.getProductObj;
    if (!productObj?.product?.images) {
      analyzify.log('Skipped — no product image data available', 'f-view-image', 'init');
      return;
    }

    const productImages = productObj.product.images;
    if (productImages.length <= 1) {
      analyzify.log('Skipped — product has ' + productImages.length + ' image(s)', 'f-view-image', 'init');
      return;
    }

    // Cache product-level identifiers (don't change during session)
    const productId = productObj.product.id || null;
    const productHandle = productObj.product.handle || null;

    // --- Helpers ---

    const SHOPIFY_NAMED_SIZES = 'pico|icon|thumb|small|compact|medium|large|grande|master';
    const SHOPIFY_SUFFIX_RE = new RegExp(
      '_(?:\\d+x\\d*(?:_crop_\\w+)?(?:@\\dx)?|' + SHOPIFY_NAMED_SIZES + ')(\\.[^.]+)$'
    );

    function getBaseFilename(url) {
      if (!url) return null;
      const src = typeof url === 'string' ? url : (url.src || '');
      const filename = src.split('/').pop().split('?')[0];
      return filename.replace(SHOPIFY_SUFFIX_RE, '$1');
    }

    function getImgSrc(img) {
      return img.src || img.dataset.src || '';
    }

    // --- Pre-compute filename → index map ---
    const filenameToIndex = new Map();
    const productFilenames = new Set();

    productImages.forEach(function (img, idx) {
      const filename = getBaseFilename(typeof img === 'string' ? img : img.src);
      if (filename) {
        productFilenames.add(filename);
        filenameToIndex.set(filename, idx);
      }
    });

    if (productFilenames.size === 0) {
      analyzify.log('Skipped — could not extract filenames from product images', 'f-view-image', 'init');
      return;
    }

    analyzify.log('Product has ' + productFilenames.size + ' images', 'f-view-image', 'init');

    // Featured image filename — guaranteed to be set when product has images
    const featuredFilename = getBaseFilename(productObj.product.featured_image) || '';

    // --- Find matching <img> elements in DOM ---
    const matchedFilenames = new Map(); // Map<Element, string> — caches matched filename per img
    const trackedImages = new WeakSet(); // prevents double-attaching listeners

    function getMatchedFilename(img) {
      // Try src / data-src first
      const src = getImgSrc(img);
      if (src && !src.startsWith('data:')) {
        // Cheap pre-check — skip regex/split for non-Shopify-CDN images
        if (src.indexOf('/cdn/shop/') === -1) {
          // Fall through to srcset check (might still be a lazy-loaded product image)
        } else {
          const filename = getBaseFilename(src);
          if (filename && productFilenames.has(filename)) return filename;
        }
      }
      // Fallback: check data-srcset for lazy-loaded images
      const srcset = img.dataset.srcset || img.getAttribute('srcset') || '';
      if (srcset && srcset.indexOf('/cdn/shop/') !== -1) {
        const firstUrl = srcset.split(',')[0].trim().split(' ')[0];
        const filename = getBaseFilename(firstUrl);
        if (filename && productFilenames.has(filename)) return filename;
      }
      return null;
    }

    function getRenderedWidth(img) {
      if (img.dataset.src || img.dataset.srcset) {
        return parseInt(img.getAttribute('width'), 10) || 0;
      }
      return img.offsetWidth || 0;
    }

    // Persistent across calls — once a filename has a main registered at page load,
    // later DOM additions (modal copies, zoom copies) are demoted to thumbnails.
    // Prevents false fires when modals open and add their own copies of gallery images.
    const mainFilenames = new Set();

    function findAndCacheGalleryImages(root) {
      const container = root || document;
      const imgs = container.querySelectorAll ? container.querySelectorAll('img') : [];

      // First in DOM = main gallery image. Later copies = thumbnails or modal copies.
      // Gallery images always appear before modal copies in Shopify themes.
      var matched = [];
      var thumbnails = [];

      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        if (trackedImages.has(img)) continue;
        var filename = getMatchedFilename(img);
        if (!filename) continue;
        var width = getRenderedWidth(img);

        if (!mainFilenames.has(filename)) {
          // First time seeing this filename (across all findAndCache calls) — main image
          mainFilenames.add(filename);
          matchedFilenames.set(img, filename);
          matched.push(img);
        } else if (width > 0) {
          // Later occurrence with rendered width — likely a thumbnail
          matchedFilenames.set(img, filename);
          thumbnails.push(img);
        }
      }
      return { main: matched, thumbnails: thumbnails };
    }

    // --- Fire event ---
    // Cross-mechanism dedup: if click and IO both trigger for the same filename within
    // this window, only the first one fires. Repeat views after the window are allowed.
    const DEDUP_WINDOW_MS = 2000;
    const lastFiredTime = new Map(); // filename → timestamp

    function fireViewImage(img, source) {
      const filename = matchedFilenames.get(img);
      if (!filename) return;

      const now = Date.now();
      if (now - (lastFiredTime.get(filename) || 0) < DEDUP_WINDOW_MS) return;
      lastFiredTime.set(filename, now);

      // Capture variant at fire time (user may have changed variant mid-session)
      const variantId = window.analyzify.getCurrentVariant?.()?.id
        || productObj.variant?.id
        || null;

      const eventData = {
        image_url: getImgSrc(img),
        image_filename: filename,
        image_index: filenameToIndex.get(filename) ?? null,
        image_alt: img.alt || '',
        is_featured_image: featuredFilename === filename,
        method: source || 'unknown',
        product_id: productId,
        product_handle: productHandle,
        variant_id: variantId ? variantId.toString() : null,
      };

      if (ga4Enabled && typeof window.analyzify.gaViewImage === 'function') {
        window.analyzify.gaViewImage(eventData);
      }
      if (gtmEnabled && typeof window.analyzify.gtmViewImage === 'function') {
        window.analyzify.gtmViewImage(eventData);
      }

      analyzify.log('view_image fired [' + (source || 'unknown') + '] — ' + filename + ' (index: ' + eventData.image_index + ')', 'f-view-image', 'fireViewImage');
    }

    // --- Shared state for observer/listener mode ---
    let currentMode = null; // 'slider' or 'grid'
    let sliderObserver = null;

    // Tracks click-target elements that already have a listener — prevents
    // stacking N listeners on a shared parent when multiple product images are
    // siblings (e.g., Dawn's product-modal stacks all images in one <div>).
    const attachedClickTargets = new WeakSet();

    function attachImage(img) {
      if (trackedImages.has(img)) return;

      if (currentMode === 'slider' && sliderObserver) {
        trackedImages.add(img);
        sliderObserver.observe(img);
      } else if (currentMode === 'grid') {
        const clickTarget = img.closest('li, figure, a, button, [role="button"]') || img.parentElement || img;
        if (attachedClickTargets.has(clickTarget)) return;
        attachedClickTargets.add(clickTarget);
        trackedImages.add(img);
        clickTarget.addEventListener('click', function () {
          fireViewImage(img, 'click');
        });
      }
    }

    function attachThumbnail(img) {
      if (trackedImages.has(img)) return;
      const filename = matchedFilenames.get(img);
      if (!filename) return;

      // Only attach if the thumbnail is inside a clickable element.
      // Hidden zoom/display copies live inside plain <div>s — skip those so the
      // click listener lands on the actual navigation thumbnail (inside a <button>/<a>).
      const clickTarget = img.closest('button, a, [role="button"]');
      if (!clickTarget) return;

      // Per-element dedup via trackedImages; cross-mechanism fire dedup via 2s window
      // in fireViewImage handles accidental multi-fires from same-filename listeners.
      trackedImages.add(img);

      clickTarget.addEventListener('click', function () {
        fireViewImage(img, 'click');
      });
    }

    // --- Layout detection (async via temporary IO) + setup ---
    function initTracking(galleryImgs, visibleCount) {
      const isSlider = visibleCount <= 2;
      currentMode = isSlider ? 'slider' : 'grid';

      if (isSlider) {
        // --- Slider mode: IO for swipe + click listeners on thumbnails ---
        const dwellTimers = new WeakMap();
        const seenByIO = new WeakSet();
        let lastActiveFilename = null; // tracks which image is currently "active" via IO

        sliderObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            const img = entry.target;

            // Skip first report per image — that's page load state
            if (!seenByIO.has(img)) {
              seenByIO.add(img);
              if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
                lastActiveFilename = matchedFilenames.get(img);
              }
              return;
            }

            if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
              const filename = matchedFilenames.get(img);
              // Same image re-entering (user scrolled away and back) — not navigation
              if (filename === lastActiveFilename) return;
              lastActiveFilename = filename;

              if (!dwellTimers.has(img)) {
                const timer = setTimeout(function () {
                  fireViewImage(img, 'view');
                  dwellTimers.delete(img);
                }, 500);
                dwellTimers.set(img, timer);
              }
            } else {
              if (dwellTimers.has(img)) {
                clearTimeout(dwellTimers.get(img));
                dwellTimers.delete(img);
              }
            }
          });
        }, { threshold: 0.65 });

        galleryImgs.main.forEach(function (img) {
          trackedImages.add(img);
          sliderObserver.observe(img);
        });

        galleryImgs.thumbnails.forEach(attachThumbnail);
      } else {
        // --- Grid mode: click listeners on main images + thumbnails ---
        galleryImgs.main.forEach(attachImage);
        galleryImgs.thumbnails.forEach(attachThumbnail);
      }

      analyzify.log('Initialized — ' + currentMode + ' mode, ' + galleryImgs.main.length + ' main + ' + galleryImgs.thumbnails.length + ' thumbnails (' + visibleCount + ' visible)', 'f-view-image', 'setup');
    }

    function detectLayoutAndInit(galleryImgs) {
      // Use temporary IO to count truly visible main images — handles overflow:hidden natively
      var visibleFilenames = new Set();
      var tempObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visibleFilenames.add(matchedFilenames.get(entry.target));
          }
        });
        tempObserver.disconnect();
        initTracking(galleryImgs, visibleFilenames.size);
      }, { threshold: 0.5 });

      galleryImgs.main.forEach(function (img) {
        tempObserver.observe(img);
      });
    }

    function setup() {
      const galleryImgs = findAndCacheGalleryImages(document);
      if (galleryImgs.main.length === 0) return false;
      detectLayoutAndInit(galleryImgs);
      return true;
    }

    if (!setup()) {
      analyzify.log('No gallery images found — retrying in 1s', 'f-view-image', 'setup');
      setTimeout(function () {
        if (!setup()) {
          analyzify.log('No gallery images found after retry', 'f-view-image', 'setup');
        }
      }, 1000);
    }

    // --- MutationObserver for dynamically added images (variant swaps, lazy sections) ---
    const domObserver = new MutationObserver(function (mutations) {
      if (!currentMode) return;
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          // Early bail: skip nodes that definitely don't contain images
          var hasImg = node.tagName === 'IMG' || (node.querySelector && node.querySelector('img'));
          if (!hasImg) return;

          var target = node.tagName === 'IMG' ? node.parentElement : node;
          var result = findAndCacheGalleryImages(target);
          if (currentMode === 'slider' && sliderObserver) {
            result.main.forEach(function (img) {
              trackedImages.add(img);
              sliderObserver.observe(img);
            });
            result.thumbnails.forEach(attachThumbnail);
          } else if (currentMode === 'grid') {
            result.main.forEach(attachImage);
            result.thumbnails.forEach(attachThumbnail);
          }
        });
      });
    });

    domObserver.observe(document.body, { childList: true, subtree: true });

  } catch (error) {
    console.error('Error initializing view_image tracking:', error);
  }
})();

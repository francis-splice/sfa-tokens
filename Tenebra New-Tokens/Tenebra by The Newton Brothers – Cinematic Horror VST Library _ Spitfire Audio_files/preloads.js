
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com","https://extensions.shopifycdn.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.DVDwr5NM.js","/cdn/shopifycloud/checkout-web/assets/c1/app.DUho7sCu.js","/cdn/shopifycloud/checkout-web/assets/c1/esnext-vendor.C1t7pH2p.js","/cdn/shopifycloud/checkout-web/assets/c1/context-browser.Vx48NXN7.js","/cdn/shopifycloud/checkout-web/assets/c1/NotFound.DJVZ-is5.js","/cdn/shopifycloud/checkout-web/assets/c1/Theme-utilities.WDi_mQ58.js","/cdn/shopifycloud/checkout-web/assets/c1/images-payment-icon.BfafdrDF.js","/cdn/shopifycloud/checkout-web/assets/c1/FullScreenBackground.BvCJ10iY.js","/cdn/shopifycloud/checkout-web/assets/c1/phone-phoneCountryCode.BVJ_q_cg.js","/cdn/shopifycloud/checkout-web/assets/c1/consent-manager-shared.C7ftD8lm.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayCheckoutGqlVersion.CwwAQwXm.js","/cdn/shopifycloud/checkout-web/assets/c1/shared-unactionable-errors.DjOo_XX6.js","/cdn/shopifycloud/checkout-web/assets/c1/utils-getCommonShopPayExternalTelemetryAttributes.ayVtNqLD.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-ShopPayCheckoutSessionQuery.Do43EoZS.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-UserPrivacySettingsSetMutation.BcMGPfGM.js","/cdn/shopifycloud/checkout-web/assets/c1/hydrate.BG521rra.js","/cdn/shopifycloud/checkout-web/assets/c1/images-flag-icon.C_eXYJRt.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.BgIjMRQj.js","/cdn/shopifycloud/checkout-web/assets/c1/page-Information.tNZ1NPAE.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useWalletsTimeout.6KtYuPdR.js","/cdn/shopifycloud/checkout-web/assets/c1/MarketsProDisclaimer.tyvckFws.js","/cdn/shopifycloud/checkout-web/assets/c1/OffsitePaymentFailed.CHBgyDNk.js","/cdn/shopifycloud/checkout-web/assets/c1/NoAddressLocationFullDetour.BKLQttHA.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUnauthenticatedErrorModal.C-gtFhNA.js","/cdn/shopifycloud/checkout-web/assets/c1/SplitDeliveryMerchandiseContainer.BecWQZ_q.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayButtonClassName.Dnf5HqwS.js","/cdn/shopifycloud/checkout-web/assets/c1/ChangeCompanyLocationLink.j9hF0iJ9.js","/cdn/shopifycloud/checkout-web/assets/c1/WalletsSandbox-WalletSandbox.Cu6C9POS.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useForceShopPayUrl.Dy5gusqg.js","/cdn/shopifycloud/checkout-web/assets/c1/GooglePayButton-index.Dlt-bWw0.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-publishMessage.RHYqxqQB.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayPaymentRequiredMethod.CKG0AVG7.js","/cdn/shopifycloud/checkout-web/assets/c1/AutocompleteField-hooks.DwbA6sMB.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingGroupsSummaryLine.BmfI53hE.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.Bzkpz3yH.js","/cdn/shopifycloud/checkout-web/assets/c1/component-RuntimeExtension.BOnTsojd.js","/cdn/shopifycloud/checkout-web/assets/c1/AnnouncementRuntimeExtensions.BLWzgqr0.js","/cdn/shopifycloud/checkout-web/assets/c1/MobileOrderSummary.D_chMLdb.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useSuppressShopPayModalOnLoad.BziIbmOO.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-rendering-extension-targets.BPRhEf-6.js","/cdn/shopifycloud/checkout-web/assets/c1/dist-v4.EwEgHOG0.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-shipping-options.ADAoqgZb.js","/cdn/shopifycloud/checkout-web/assets/c1/ExtensionsInner.C0s-RP4K.js","/cdn/shopifycloud/checkout-web/assets/c1/sandbox.Bts_5c3l.worker.js","/cdn/shopifycloud/checkout-web/assets/c1/sandbox-2025-07.BY7UTw_g.worker.js","https://extensions.shopifycdn.com/shopifycloud/checkout-web/assets/c1/polyfills-entry-modern.B5oIVJQI.worker.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.DmM1n0lz.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/NotFound.C-ppsiYq.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/utilities.BmzyrTr0.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/FullScreenBackground.B_iZlQze.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/index.BQCEwCxl.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SplitDeliveryMerchandiseContainer.Dgx1us3e.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/publishMessage.BEvzDDvy.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ChangeCompanyLocationLink.uqpm88mq.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/NoAddressLocationFullDetour.CpFaJIpx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.Ho_Bkwiw.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/WalletSandbox.CnR7qNLY.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.D6OuIVjc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RuntimeExtension.DWkDBM73.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/AnnouncementRuntimeExtensions.qDifMJI9.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.CqVkJv9Z.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0949/6294/2290/files/spitfire-audio-logo-white_x320.png?v=1755775469"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  
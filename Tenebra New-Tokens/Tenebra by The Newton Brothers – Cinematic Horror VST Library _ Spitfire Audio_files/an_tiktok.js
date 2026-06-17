window.analyzify.initTiktok = (ttObj, ttProps) => {
  try {
    if (!ttProps || !ttObj || !ttProps.status || !ttProps.id) return;

    // TEST block specific user agent for pupsik-studio.myshopify.com
    const currentShop = window?.Shopify?.shop || window?.analyzify?.shop;
    if (currentShop === 'pupsik-studio.myshopify.com') {
      const blockedUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36';
      if (navigator.userAgent === blockedUserAgent) {
        console.log('[Analyzify] TikTok blocked for specific user agent on pupsik-studio');
        return;
      }
    }
    
    const { id, events, product_id_format } = ttProps;

    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      (ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
        "holdConsent",
        "revokeConsent",
        "grantConsent"
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (var i = 0; i < ttq.methods.length; i++)
        ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = i),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          var o = document.createElement("script");
          (o.type = "text/javascript"),
            (o.async = !0),
            (o.src = i + "?sdkid=" + e + "&lib=" + t);
          var a = document.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(o, a);
        });
    })(window, document, "ttq");

    if(window.analyzify.consent_active) {
      ttq.holdConsent();
    }

    const getTiktokUserId = () => {

      const attributionMode = window.analyzify?.properties?.SERVERSIDE?.azfy_attribution;
      const isDualMode = attributionMode === 'dual';
      const isTrueMode = attributionMode === 'true' || attributionMode === true;
      const isAttributionOrDualMode = isDualMode || isTrueMode;

      const ga = isAttributionOrDualMode 
        ? window.analyzify?.cart_attributes?.azfy_cookies_atr?.ga 
        : window.analyzify?.unformattedCartDataObj?.ga;
      return ga || window.analyzify.cookieStorage.get("_ga")?.slice(6);
    } 

    function identifyObj(eventID) {
      return Object.fromEntries(
        Object.entries({
          external_id: getTiktokUserId() || window.analyzify.eventId.get(eventID ? eventID : 'default'),
          email: window.analyzify.shopify_customer?.sha256_email_address || window.analyzify.shopify_customer?.email_address || null,
          phone: window.analyzify.shopify_customer?.sha256_phone_number || window.analyzify.shopify_customer?.phone_number || null,
          first_name: window.analyzify.shopify_customer?.first_name || null,
          last_name: window.analyzify.shopify_customer?.last_name || null
        }).filter(([_, value]) => value != null)
      );
    }

    const updateTiktokConsent = (isGranted) => {
      isGranted ? ttq.grantConsent() : ttq.revokeConsent();
    };

    const identifyTiktokUser = (eventID) => {
      if (window.analyzify.shopify_customer?.email_address) {
        ttq.instance(id).identify(identifyObj(eventID));
      }
    };
    
    const initializeAndTrackTiktokPage = () => {
      if (window.analyzify.ttPageEventsFired) return;

      ttq.load(id);
      identifyTiktokUser('default');
      const pageObj = {
        event_id: window.analyzify.eventId.get('default'),
        ...identifyObj('default')
      };
      ttq.instance(id).page(pageObj);
      analyzify.log(pageObj, 'an_tiktok', 'ttPageView');

      const template = window.analyzify.shopify_template;
      if (template === "product" && events.view_item) {
        window.analyzify.ttViewContent(ttObj.getProductObj);
      } else if (template === "search" && events.search) {
        window.analyzify.ttSearch(ttObj.getSearchObj);
      }

      window.analyzify.ttPageEventsFired = true;
    };

    // page_view only (SPA navigation)
    window.analyzify.ttPageView = (eventId) => {
      try {
        const eid = eventId || window.analyzify.eventId.get('default');
        identifyTiktokUser('default');
        ttq.instance(id).page({
          event_id: eid,
          ...identifyObj('default')
        });
        analyzify.log('ttPageView (SPA)', 'an_tiktok', 'ttPageView');
      } catch (error) {
        console.error("Error processing TikTok page_view:", error);
      }
    };

    const getIdByFormat = (format, { product, variant }) => {
      const idMap = {
        'product_id': () => product?.product_id?.toString() || product?.id?.toString(),
        'variant_id': () => product?.variant_id?.toString() || variant?.id?.toString() || product?.variants?.[0]?.id?.toString(),
        'product_sku': () => variant?.sku?.toString() || product?.sku?.toString(),
        'shopify_item_id': () => {
          const productId = product?.product_id?.toString() || product?.id?.toString();
          const variantId = product?.variant_id?.toString() || variant?.id?.toString() || product?.variants?.[0]?.id?.toString();
          return `shopify_${window.analyzify?.feed_region}_${productId}_${variantId}`;
        }
      };
      return (idMap[format] || idMap['product_id'])()?.toString();
    };

    window.analyzify.ttViewContent = (productObj) => {
      try {
        if (!events.view_item || !productObj) return;
        const { product = productObj, variant } = productObj.product ? productObj : { product: productObj };
        const variantDetails = window.analyzify.getVariantDetails(product?.variants, variant?.id);
        const price = variantDetails?.price || window.analyzify.formatPrice(product?.price, true);
        identifyTiktokUser('view_item');
        const eventObj = {
          contents: [{
            content_id: getIdByFormat(product_id_format, { product, variant: variantDetails }),
            content_name: product?.title,
            content_type: 'product',
            content_category: product?.product_type,
            price: price,
            quantity: 1,
          }],
          currency: window.analyzify?.currency,
          value: price,
          ...identifyObj('view_item')
        };
        ttq.instance(id).track("ViewContent", eventObj, {
          event_id: window.analyzify.eventId.get('view_item'),
          ...identifyObj('view_item')
        });
        analyzify.log(eventObj, 'an_tiktok', 'ttViewContent');
      } catch (e) { console.error("Error in ttViewContent:", e); }
    };

    window.analyzify.ttSearch = (searchObj) => {
      try {
        if (!events.search || !searchObj?.searchPerformed) return;
        const eventObj = {
          search_string: searchObj.term,
          ...identifyObj('search')
        };
        ttq.instance(id).track("Search", eventObj, {
          event_id: window.analyzify.eventId.get('search'),
          ...identifyObj('search')
        });
        analyzify.log(eventObj, 'an_tiktok', 'ttSearch');
      } catch (e) { console.error("Error in ttSearch:", e); }
    };

    window.analyzify.ttAddToCart = (productObj, currentVariant, eventId) => {
      try {
        if (!events.add_to_cart || !productObj) return;

        const { product = productObj, variant } = productObj.product ? productObj : { product: productObj };
        const variantDetails = window.analyzify.getVariantDetails(product?.variants, currentVariant || variant?.id);
        if (!variantDetails) return;
        
        const quantity = window.analyzify.findQuantity() || 1;
        const price = variantDetails.price || window.analyzify.formatPrice(product?.price, true);

        const eventObj = {
          contents: [{
            content_id: getIdByFormat(product_id_format, { product, variant: variantDetails }),
            content_name: product?.title,
            content_type: 'product',
            content_category: product?.product_type,
            quantity: quantity,
            price: price,
          }],
          currency: window.analyzify?.currency,
          value: price * quantity,
          ...identifyObj('add_to_cart')
        };
        ttq.instance(id).track("AddToCart", eventObj, {
          event_id: eventId || window.analyzify.eventId.get('add_to_cart'),
          ...identifyObj('add_to_cart')
        });
        analyzify.log(eventObj, 'an_tiktok', 'ttAddToCart');
      } catch (e) { console.error("Error in ttAddToCart:", e); }
    };

    window.analyzify.ttBeginCheckout = (cart, eventId) => {
      try {
        if (!events.begin_checkout || !cart?.items?.length) return;
        
        const contents = cart.items.map((item) => ({
          content_id: getIdByFormat(product_id_format, { product: item, variant: item }),
          content_name: item?.product_title,
          content_type: 'product',
          content_category: item?.product_type,
          quantity: item?.quantity,
          price: window.analyzify.formatPrice(item?.price, true),
        }));
        
        const eventObj = {
          contents: contents,
          currency: window.analyzify?.currency,
          value: window.analyzify.formatPrice(cart.total_price, true),
          ...identifyObj('begin_checkout')
        };
        ttq.instance(id).track("InitiateCheckout", eventObj, {
          event_id: eventId || window.analyzify.eventId.get('begin_checkout'),
          ...identifyObj('begin_checkout')
        });
        analyzify.log(eventObj, 'an_tiktok', 'ttBeginCheckout');
      } catch (e) { console.error("Error in ttBeginCheckout:", e); }
    };

    (function(){
      try {
        /*
        FORMS
        - Shopify
        - Klaviyo
        - Hubspot
        */

        if(!ttProps?.all_forms) return;

        // SHOPIFY FORM SUBMITTED
        if(ttProps.events?.generate_lead){
          window.addEventListener("azfy:shopify:form_submitted", (event) => {
            try {
              const evDetail = event.detail;
              analyzify.log(evDetail, 'an_tiktok', 'shopifyFormSubmitted');
              if(
                event.type === "azfy:shopify:form_submitted" &&
                evDetail.name === "shopify:form_submitted"
              ){
                const tags = (evDetail.payload['contact_tags'] || evDetail.payload['customer_tags'] || '').toLowerCase();
                if (['newsletter', 'prospect'].some(tag => tags.includes(tag))) {
                  ttq.instance(id).track("Lead");
                  analyzify.log(evDetail, 'an_tiktok', 'newsletactForm');
                } else if(evDetail.payload["form_type"] === "customer_login"){
                  ttq.instance(id).track("Login");
                  analyzify.log(evDetail, 'an_tiktok', 'customerLogin');
                } else if(evDetail.payload["form_type"] === "create_customer"){
                  ttq.instance(id).track("Signup");
                  analyzify.log(evDetail, 'an_tiktok', 'customerRegister');
                } else if(evDetail.payload["form_type"] === "contact_form" || evDetail.payload["form_type"] === "contact"){
                  ttq.instance(id).track("Contact");
                  analyzify.log(evDetail, 'an_tiktok', 'contactForm');
                }
              }
            } catch (error) {
              console.error("Error processing newsletter form:", error);
            }
          });
  
          // KLAVIYO FORM SUBMITTED
          window.addEventListener("azfy:klaviyo:form_submitted", (event) => {
            try {
              const evDetail = event.detail;
              ttq.instance(id).track("Lead");
              analyzify.log(evDetail, 'an_tiktok', 'klaviyoForm');
            } catch (error) {
              console.error("Error processing klaviyo:form_submitted:", error);
            }
          });
  
          // HUBSPOT FORMS
          window.addEventListener("azfy:hubspot:form_submitted", (event) => {
            try {
              const evDetail = event.detail;
              ttq.instance(id).track("Lead");
              analyzify.log(evDetail, 'an_tiktok', 'hubspotFormSubmitted');
            } catch (error) {
              console.error("Error processing hubspot:form_submitted:", error);
            }
          });

          // JOTFORM FORMS
          window.addEventListener("azfy:jotform:form_submitted", (event) => {
            try {
              const evDetail = event.detail;
              ttq.instance(id).track("Lead");
              analyzify.log(evDetail, 'an_tiktok', 'jotformFormSubmitted');
            } catch (error) {
              console.error("Error processing jotform:form_submitted:", error);
            }
          });

          // HULK FORM BUILDER FORMS
          window.addEventListener("azfy:hulkformbuilder:form_submitted", (event) => {
            try {
              const evDetail = event.detail;
              ttq.instance(id).track("Lead");
              analyzify.log(evDetail, 'an_tiktok', 'hulkFormSubmitted');
            } catch (error) {
              console.error("Error processing hulkformbuilder:form_submitted:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error processing forms:", error);
      }
    })();

    if (window.analyzify.consent_active) {
      window.analyzify.consentManager.queueConsentAction((initialConsent) => {
        const isGranted = initialConsent.ad_storage === 'granted';
        updateTiktokConsent(isGranted);
        if (isGranted) {
          initializeAndTrackTiktokPage();
        }
      });

      window.analyzify.consentManager.onChange((newConsent) => {
        const isGranted = newConsent.ad_storage === 'granted';
        updateTiktokConsent(isGranted);
        if (isGranted) {
          initializeAndTrackTiktokPage();
        }
      });
    } else {
      updateTiktokConsent(true);
      initializeAndTrackTiktokPage();
    }

  } catch (error) {
    console.error('TikTok Init Error:', error);
  }
};
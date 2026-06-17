window.analyzify.initGa4Gads = (ga4Obj, ga4Props, gadsProps) => {
  try {

    // Allow function to run if at least one integration (GA4 or GADS) is enabled
    if (!ga4Obj || (!ga4Props && !gadsProps)) return;

    function gtag() {
      dataLayer.push(arguments);
    }

    const { primary: ga_primary, secondary: ga_secondary } = ga4Props;
    const { primary: gads_primary, secondary: gads_secondary } = gadsProps;

    // Initialize and track page

    // This flag ensures the initialization function only runs once.
    window.analyzify.ga4Initiated = false;
    const groups = [];

    const market = window.analyzify?.market || window.analyzify.cookieStorage.get('azfy_market') || null;
    const shop = window.analyzify?.shop || window.analyzify.cookieStorage.get('azfy_shop') || null;

    function saveToStorage(key, id, value) {
      if (!value || value === 'undefined') return;
      const payload = `${id}$${Date.now()}$${value}`;
      window.analyzify.sessionStorage.save(key, payload);
    }

    function getFromStoragePart(key, partIndex = 2) {
      const stored = window.analyzify?.sessionStorage?.get(key);
      if (!stored) return null;

      const parts = stored.split('$');
      return parts.length > partIndex && parts[partIndex] !== 'undefined' ? parts[partIndex] : null;
    }

    function handleGtagValue(config, keyName, storageKey) {
      if (!config?.id) return;

      gtag('get', config.id, keyName, value => {
        analyzify.log(`GA4: ${keyName}`, value, 'an_ga4_gads', 'gtag');
        saveToStorage(storageKey, config.id, value);
      });

      if (config[`replace_${keyName}`]) {
        const value = getFromStoragePart(storageKey);
        if (value) gtag('set', keyName, value);
      }
    }

    handleGtagValue(ga_primary, 'session_id', 'azfy_sid_pr');
    handleGtagValue(ga_secondary, 'session_id', 'azfy_sid_sc');
    handleGtagValue(gads_primary, 'gclid', 'azfy_gclid_pr');
    handleGtagValue(gads_secondary, 'gclid', 'azfy_gclid_sc');

    window.analyzify.ga4InitializeAndTrackPage = () => {
      if (window.analyzify.ga4Initiated) {
        analyzify.log('GA4 initialization already ran. Aborting.', 'an_ga4_gads', 'ga4InitializeAndTrackPage');
        return;
      }

      analyzify.log('GA4 initialization starting. ga4Initiated set to true.', 'an_ga4_gads', 'ga4InitializeAndTrackPage');

      const formatTemplate = (template = 'other') => {
        const templateMap = {
          'index': 'Homepage',
          'default': template.charAt(0).toUpperCase() + template.slice(1)
        };
        return templateMap[template] || templateMap.default;
      };

      const result_template = formatTemplate(window.analyzify?.shopify_template);

      const sh_info_obj = {
        content_group: result_template,
        ...window.analyzify.SSAP_vals(),
        page_currency: window.analyzify?.currency,
        implementation_type: "extension",
        cart_id: window.analyzify?.cart_id || null,
        send_page_view: false,
        ...window.analyzify.storeObj,
        shop_locale: shop?.locale || null,
        shop_country: shop?.country || null,
        market_country: market?.country || null,
        market_language: market?.language || null,
        market_handle: market?.handle || null,
      };

      window.analyzify.sh_info_obj = sh_info_obj || {};

      const groups = [];
    
      const configureGtag = (id, source, group, additionalParams = {}, configId) => {
        try {
          const initId = configId || id;
          const configObj = {
            ...sh_info_obj,
            analyzify_source: source,
            groups: group,
            send_to: id,
            ...additionalParams
          };
          const customer = window.analyzify.shopify_customer;
          const idFormat = window.analyzify.user_id_format;
          const localStorageUserID = window.analyzify.getFromLocalStorage('azfy_sha256_user_id');
          const localStorageEmail = window.analyzify.getFromLocalStorage('azfy_sha256_email_address');

          if (idFormat === 'email') {
            if (customer?.sha256_email_address) configObj.user_id = customer.sha256_email_address;
            else if (localStorageEmail) configObj.user_id = localStorageEmail;
          } else {
            if (customer?.user_id) configObj.user_id = customer.user_id;
            else if (localStorageUserID) configObj.user_id = localStorageUserID;
          }
          
          gtag("config", initId, configObj);
          window.analyzify.gtag_config[id] = configObj;
          analyzify.log(id, 'an_ga4_gads', 'configureGtag: gtag config -> id');
          analyzify.log(configObj, 'an_ga4_gads', 'configureGtag: gtag config -> configObj');

          // Emit a custom analyzify event for external listeners
          if (window.analyzify?.dispatchEvent) {
            if(configObj.event_callback){
              delete configObj.event_callback;
            }
            window.analyzify.dispatchEvent('gtag:gtag_config_updated', {
              id: id,
              source: source,
              group: group,
              config: configObj,
            });
          }

          groups.push(group);
        } catch (error) {
          console.error('Error processing configureGtag:', error);
        }
      };

      const gadsGlobal = window.analyzify?.properties?.GADS || {};
      const sharedConfigParams = {
        conversion_linker: gadsGlobal.conversion_linker,
        allow_ad_personalization_signals: gadsGlobal.allow_ad_personalization_signals,
        url_passthrough: gadsGlobal.url_passthrough,
        ads_data_redaction: gadsGlobal.ads_data_redaction
      };

      if(ga4Props?.status){
        if (ga4Props.primary?.status && ga4Props.primary?.id) configureGtag(ga_primary.id, "analyzify_ga_primary", "analyzify_ga_primary", sharedConfigParams, ga_primary.config_id);
        if (ga4Props.secondary?.status && ga4Props.secondary?.id) configureGtag(ga_secondary.id, "analyzify_ga_secondary", "analyzify_ga_secondary", sharedConfigParams);
      }

      if(gadsProps?.status){
        if (gadsProps.primary?.remarketing?.status && gadsProps.primary?.id) configureGtag(gads_primary.id, "analyzify_ads_primary", "analyzify_ads_primary", sharedConfigParams);
        if (gadsProps.secondary?.remarketing?.status && gadsProps.secondary?.id) configureGtag(gads_secondary.id, "analyzify_ads_secondary", "analyzify_ads_secondary", sharedConfigParams);
      }

      if (window.analyzify.op_cart_data_collection && !window.analyzify.checksendcartdata_status) {
        window.analyzify_checksendcartdata();
      }

      if (window.analyzify?.properties?.SERVERSIDE?.datalayer !== true) {
        analyzify.log('ga4InitializeAndTrackPage: ga4Props?.status || gadsProps?.status', ga4Props?.status || gadsProps?.status, 'an_ga4_gads', 'ga4InitializeAndTrackPage');
        if (ga4Props?.status || gadsProps?.status){
          const getMeasurementIds = () => {
            try {
              const measurementIds = [];
              if (ga4Props?.primary?.status && ga4Props?.primary?.id) measurementIds.push(ga4Props.primary.id);
              if (ga4Props?.secondary?.status && ga4Props?.secondary?.id) measurementIds.push(ga4Props.secondary.id);
              if (gadsProps?.primary?.remarketing?.status && gadsProps?.primary?.id) measurementIds.push(gadsProps.primary.id);
              if (gadsProps?.secondary?.remarketing?.status && gadsProps?.secondary?.id) measurementIds.push(gadsProps.secondary.id);

              analyzify.log('getMeasurementIds', measurementIds, 'an_ga4_gads', 'ga4InitializeAndTrackPage');
              return measurementIds;
            } catch (error) {
              console.error('Error processing getMeasurementIds:', error);
            }
          }
          gtag("event", "page_view", {
            send_to: getMeasurementIds(),
            groups: groups,
            cart_id: window.analyzify?.cart_id || null,
            event_callback: () => {
              analyzify.log('page_view event triggered', 'an_ga4_gads', 'ga4InitializeAndTrackPage');
            }
          });
          if (window.analyzify?.dispatchEvent) {
            window.analyzify.dispatchEvent('gtag:page_view', {
              send_to: getMeasurementIds(),
              groups: groups,
              cart_id: window.analyzify?.cart_id || null
            });
          }
        }
      }

      window.analyzify.ga4Initiated = true;
      analyzify.log('ga4InitializeAndTrackPage', 'an_ga4_gads', 'ga4InitializeAndTrackPage');
      continueWith();

    };

    // page_view only (SPA navigation)
    window.analyzify.gaPageView = () => {
      try {
        if (!ga4Props?.status && !gadsProps?.status) return;
        const measurementIds = [];
        if (ga4Props?.primary?.status && ga4Props?.primary?.id) measurementIds.push(ga4Props.primary.id);
        if (ga4Props?.secondary?.status && ga4Props?.secondary?.id) measurementIds.push(ga4Props.secondary.id);
        if (gadsProps?.primary?.remarketing?.status && gadsProps?.primary?.id) measurementIds.push(gadsProps.primary.id);
        if (gadsProps?.secondary?.remarketing?.status && gadsProps?.secondary?.id) measurementIds.push(gadsProps.secondary.id);

        if (!measurementIds.length) return;

        gtag("event", "page_view", {
          send_to: measurementIds,
          groups: groups,
          cart_id: window.analyzify?.cart_id || null,
        });
        analyzify.log('gaPageView (SPA)', 'an_ga4_gads', 'gaPageView');
      } catch (error) {
        console.error("Error processing GA4 page_view:", error);
      }
    };

    // The Consent Control Logic that calls the function above.
    if (window.analyzify.consent_active) {
      analyzify.log('consent_active', 'an_ga4_gads', 'ga4InitializeAndTrackPage');
      window.analyzify.consentManager.queueConsentAction((initialConsent) => {
        analyzify.log('initialConsent', 'an_ga4_gads', 'ga4InitializeAndTrackPage');
        analyzify.log(initialConsent, 'an_ga4_gads', 'ga4InitializeAndTrackPage');
        analyzify.log('consent -> queueConsentAction', 'an_ga4_gads', 'ga4InitializeAndTrackPage');
        // const defaultState = initialConsent || {
        //   ad_storage: 'denied', analytics_storage: 'denied',
        //   ad_user_data: 'denied', ad_personalization: 'denied',
        // };
        window.analyzify.ga4InitializeAndTrackPage();
      });

      // window.analyzify.consentManager.onChange((newConsent) => {
      //   analyzify.log('consent -> onChange', 'an_ga4_gads', 'ga4InitializeAndTrackPage');
      //   window.analyzify.ga4InitializeAndTrackPage();
      // });
    } else {
      window.analyzify.ga4InitializeAndTrackPage();
    }

    gtag("js", new Date());

      function continueWith(){
        const activeEvents = {
          ga4Primary: Object.keys(ga_primary.events).filter(
            (key) => ga_primary.events?.[key],
          ),
          ga4Secondary: Object.keys(ga_secondary.events).filter(
            (key) => ga_secondary.events?.[key],
          ),
          gadsRemPrimary: Object.keys(gads_primary.remarketing.events).filter(
            (key) => gads_primary.remarketing.events?.[key],
          ),
          gadsRemSecondary: Object.keys(gads_secondary.remarketing.events).filter(
            (key) => gads_secondary.remarketing.events?.[key],
          ),
          gadsConvPrimary: Object.keys(gads_primary.conversions).filter(
            (key) => gads_primary.conversions?.[key].status,
          ),
          gadsConvSecondary: Object.keys(gads_secondary.conversions).filter(
            (key) => gads_secondary.conversions?.[key].status,
          ),
        };

        const sendMultipleDests = (eventObj, eventId = null) => {
          try {

            const gaItemMapper = (product, product_id_format) => {
              try {
                const variantInput = window.analyzify?.getCurrentVariant()?.id || window.analyzify.getFirstVariant(product)?.id;
                const variantDetails = window.analyzify.getVariantDetails(product?.variants, variantInput);
                const itemId = window.analyzify.getItemIds({
                  productObj: product,
                  product_id_format: product_id_format,
                  variantDetails: variantDetails,
                  eventName: eventObj?.eventName,
                  feedRegion: window.analyzify.feed_region
                });

                const compareAtPrice =  variantDetails?.compare_at_price ? window.analyzify.formatPrice(variantDetails?.compare_at_price, false) : 0;
                let actualPrice = 0;
                if(eventObj?.eventName === 'add_to_cart'){
                  actualPrice = product?.price ? window.analyzify.formatPrice(product?.price, false) : variantDetails?.price;
                } else {
                  actualPrice = product?.price ? window.analyzify.formatPrice(product?.price, true) : variantDetails?.price;
                }

                const getDiscount = (compareAtPrice > 0 && compareAtPrice !== actualPrice) ? Math.abs(compareAtPrice - actualPrice) : 0;
                const getCartDiscount = window.analyzify.formatPrice(product?.line_level_total_discount) || 0;

                const itemObj = {
                  id: itemId?.selected?.toString() || itemId?.ids?.sku || itemId?.ids?.variant_id || null,
                  item_id: itemId?.selected?.toString() || null,
                  item_name: (product?.product_title || product?.title)?.trim() || null,
                  item_brand: product?.vendor?.trim() || null,
                  item_category: (product?.type || product?.product_type)?.trim() || null,
                  item_sku: itemId?.ids?.sku?.toString() || null,
                  item_handle: product?.handle || null,
                  discount: window.analyzify.formatPrice(getDiscount, false) || window.analyzify.formatPrice(getCartDiscount, false) || 0,
                  item_barcode: variantDetails?.barcode || null,
                  quantity: Number(product?.quantity) || 1,
                  item_variant: variantDetails?.title || product?.item_variant || product?.variant_title || null,
                  item_variant_id: variantDetails?.id?.toString() || itemId.ids?.variant_id?.toString() || null,
                  index: product.index || 0,
                  item_list_id: eventObj?.eventParams?.item_list_id?.toString() || null,
                  item_list_name: eventObj?.eventParams?.item_list_name?.trim() || null,
                  price: variantDetails?.price || window.analyzify.formatPrice(product?.price, true),
                  ...(ga4Props?.enhanced_params ? {
                    tags: product?.tags?.join(',') || null,
                    options: product?.options?.join(',') || product?.variant_options?.join(',') || null,
                    variant_ids: product?.variants?.map((v) => {
                      return v?.id?.toString() || null;
                    }).join(',') || product?.variant_id?.toString() || null,
                  } : {}),
                };

                analyzify.log('sendMultipleDests: eventObj', 'an_ga4_gads', 'sendMultipleDests: eventObj');
                analyzify.log(eventObj, 'an_ga4_gads', 'sendMultipleDests: eventObj');

                analyzify.log('sendMultipleDests: itemObj', 'an_ga4_gads', 'sendMultipleDests: itemObj');
                analyzify.log(itemObj, 'an_ga4_gads', 'sendMultipleDests: itemObj');

                return itemObj;
              } catch (error) {
                console.error("Error processing item mapper:", error);
              }
            };

            const gadsItemWrapper = (product, product_id_format, feedRegion) => {
              try {

                const variantInput = window.analyzify?.getCurrentVariant()?.id || window.analyzify.getFirstVariant(product)?.id;
                const variantDetails = window.analyzify.getVariantDetails(product?.variants, variantInput);

                const itemIds = window.analyzify.getItemIds({
                  productObj: product,
                  product_id_format: product_id_format,
                  variantDetails: variantDetails,
                  eventName: eventObj?.eventName,
                  feedRegion: feedRegion || window.analyzify?.feed_region || null
                });

                return {
                  id: itemIds?.selected || itemIds.ids?.sku || itemIds.ids?.variant_id || null,
                  google_business_vertical: "retail",
                  price: variantDetails?.price || product?.price || 0
                };
              } catch (error) {
                console.error("Error processing GAds item wrapper:", error);
              }
            };

            analyzify.log('sendMultipleDests: gadsItemWrapper', 'an_ga4_gads', 'sendMultipleDests: gadsItemWrapper');
            analyzify.log(gadsItemWrapper, 'an_ga4_gads', 'sendMultipleDests: gadsItemWrapper');

            const { eventName, eventParams, items, user_data } = eventObj;

            analyzify.log('sendMultipleDests: eventObj', 'an_ga4_gads', 'sendMultipleDests: eventObj');
            analyzify.log(eventObj, 'an_ga4_gads', 'sendMultipleDests: eventObj');

            /*
            GA4 SCOPE
            */

            const sendGA4Event = async (ga4Props, eventName, activeEvents, sendTo, eventId = null) => {
              try {

                analyzify.log("sendGA4Event -> eventName", eventName, 'an_ga4_gads', 'sendGA4Event');
                analyzify.log("sendGA4Event -> activeEvents", activeEvents, 'an_ga4_gads', 'sendGA4Event');

                if (ga4Props?.status && ga4Props?.id) {
                  if (eventName && activeEvents.includes(eventName)) {
                    eventParams.items = items && items.length > 0 ? items.map((product, index) => {
                      return { ...gaItemMapper(product, ga4Props?.product_id_format), index };
                    }) : [];

                    const {
                      sha256_email_address,
                      sha256_phone_number,
                      sha256_first_name,
                      sha256_last_name
                    } = window.analyzify?.shopify_customer || {};

                    // Prepare user data object
                    const userData = {
                      ...(window.analyzify?.hide_raw_userdata !== true ? {
                        email_address: window.analyzify?.shopify_customer?.email_address || null,
                      } : {}),
                      sha256_phone_number: sha256_phone_number || null,
                      sha256_email_address: sha256_email_address || null,
                      address: [{ // Ensure address is an array
                        sha256_first_name: sha256_first_name || null,
                        sha256_last_name: sha256_last_name || null,
                      }]
                    };

                    if(eventParams?.utf8){
                      delete eventParams?.utf8;
                    }
                    if(eventParams?.items && eventParams?.items.length === 0){
                      delete eventParams?.items;
                    }

                    const eventGa4Obj = {
                      ...eventParams,
                      send_to: ga4Props?.id,
                      groups: sendTo,
                      cart_id: window.analyzify?.cart_id || null,
                      event_callback: () => {
                        analyzify.log(`For ${ga4Props?.id}, the event "${eventName}" was triggered successfully for "${sendTo}".`, 'an_ga4_gads', 'sendGA4Event');
                      },
                      user_data: Object.keys(userData).length && window.analyzify?.shopify_customer?.type !== 'visitor' ? userData : user_data || null,
                      shop_locale: shop?.locale || null,
                      shop_country: shop?.country || null,
                      market_country: market?.country || null,
                      market_language: market?.language || null,
                      market_handle: market?.handle || null,
                      ...(eventId && { event_id: eventId }), // Add event_id if provided
                    };

                    if(eventParams?.contact_email){
                      const hashedEmail = await window.analyzify.hashUserData({
                        email_address: eventParams?.contact_email
                      });
                      eventGa4Obj.contact_email_hashed = hashedEmail?.email_address || null;
                    }

                    Object.keys(eventGa4Obj).forEach(key => {
                      if(eventGa4Obj[key] === null || eventGa4Obj[key] === undefined || eventGa4Obj[key] === ''){
                        delete eventGa4Obj[key];
                      }
                    });

                    // Send the event to GA4
                    if(eventGa4Obj['h-captcha-response']){
                      delete eventGa4Obj['h-captcha-response'];
                    }

                    if(eventGa4Obj['contact_email']){
                      delete eventGa4Obj['contact_email'];
                    }

                    // window.dataLayer.push({
                    //   event: eventName,
                    //   eventModel: {
                    //     ...eventGa4Obj
                    //   }
                    // });

                    if(gtag && typeof gtag === 'function'){
                      gtag('event', eventName, eventGa4Obj);
                    }

                    if (window.analyzify?.dispatchEvent) {
                      if(eventGa4Obj.event_callback){
                        delete eventGa4Obj.event_callback;
                      }
                      window.analyzify.dispatchEvent(`gtag:${eventName}`, {
                        send_to: ga4Props?.id,
                        groups: sendTo,
                        cart_id: window.analyzify?.cart_id || null,
                        event_params: eventGa4Obj,
                      });
                    }

                  }
                }
              } catch (error) {
                console.error("Error processing GA4 event:", error);
              }
            };

            // Sending primary GA4 event
            sendGA4Event(ga4Props.primary, eventName, activeEvents.ga4Primary, "analyzify_ga_primary", eventId);

            // Sending secondary GA4 event
            sendGA4Event(ga4Props.secondary, eventName, activeEvents.ga4Secondary, "analyzify_ga_secondary", eventId);

            /*
            ADS SCOPE
            */

            // Helper function to populate eccomm object
            const populateEccomm = (items, additionalObj) => {
              try {
                const eccomm = {
                  ecomm_prodid: [],
                  ecomm_prodname: [],
                  ecomm_prodvalue: [],
                  ecomm_totalvalue: 0,
                  ecomm_category: [],
                  ecomm_pagetype: window.analyzify?.shopify_template || null
                };

                try {
                  if (items && items.length > 0) { // Check if items has a value
                    items.forEach((item, index) => { // Corrected the forEach parameters
                      // Validate item properties before processing
                      if (!item) {
                        analyzify.log("Invalid item encountered:", item, 'an_ga4_gads', 'populateEccomm');
                        return; // Skip invalid items
                      }

                      eccomm.ecomm_prodid.push(item?.id || item?.sku || item?.item_id);
                      eccomm.ecomm_prodname.push(item?.item_name || additionalObj?.[index]?.title || null);
                      eccomm.ecomm_prodvalue.push(item?.price || 0);
                      eccomm.ecomm_category.push(item?.item_category || additionalObj?.[index]?.type || '');
                      eccomm.ecomm_totalvalue += (item?.price || 0) * (item?.quantity || 1);
                    });
                  }
                } catch (error) {
                  console.error("Error populating eccomm:", error);
                }

                return eccomm;
              } catch (error) {
                console.error("Error populating eccomm:", error);
              }
            };

            const sendGAdsEvent = (eventName, eventParams, groups, sendTo, items) => {
              try {
                // Populate ecomm object using the provided items
                const eccomm = populateEccomm(items, {});

                // Create the eventAdsObj with only the necessary parameters
                const eventAdsObj = {
                  ...eventParams,
                  send_to: sendTo,
                  groups: groups,
                  cart_id: window.analyzify?.cart_id || null,
                  // Conditionally add ecomm parameters if they have values
                  ...(eccomm.ecomm_prodid.length > 0 && { ecomm_prodid: eccomm.ecomm_prodid }),
                  ...(eccomm.ecomm_prodname.length > 0 && { ecomm_prodname: eccomm.ecomm_prodname }),
                  ...(eccomm.ecomm_prodvalue.length > 0 && { ecomm_prodvalue: eccomm.ecomm_prodvalue }),
                  ...(eccomm.ecomm_totalvalue > 0 && { ecomm_totalvalue: window.analyzify.formatPrice(eccomm.ecomm_totalvalue, false) }),
                  ...(eccomm.ecomm_category.length > 0 && { ecomm_category: eccomm.ecomm_category }),
                  ...(eccomm.ecomm_pagetype && { ecomm_pagetype: eccomm.ecomm_pagetype }),
                  event_callback: () => {
                    analyzify.log(`Event "${eventName}" successfully triggered for "${sendTo}" with groups: ${groups}.`, 'an_ga4_gads', 'sendGAdsEvent');
                  },
                };

                if(gtag && typeof gtag === 'function'){
                  gtag("event", eventName, eventAdsObj);
                }

                if (window.analyzify?.dispatchEvent) {
                  if(eventAdsObj.event_callback){
                    delete eventAdsObj.event_callback;
                  }
                  window.analyzify.dispatchEvent(`gtag:${eventName}`, {
                    send_to: sendTo,
                    groups: groups,
                    cart_id: window.analyzify?.cart_id || null,
                    event_params: eventAdsObj,
                  });
                }
              } catch (error) {
                console.error("Error processing GAds event:", error);
              }
            };

            const processItemsForGads = (items, product_id_format, feedRegion) => {
              try {
                return items.map((product) => gadsItemWrapper(product, product_id_format, feedRegion));
              } catch (error) {
                console.error("Error processing items for GAds:", error);
              }
            };

            const handleGAdsRMEvents = (gadsProps, eventName, activeEvents, gadsConfig, isSecondary = false) => {
              try {
                if (eventName === "page_404") {
                  return;
                }

                if (gadsProps.status || gadsProps.remarketing?.status) {

                  const product_id_format = gadsConfig.remarketing.gads_remarketing_id_format;
                  const feedRegion = gadsConfig?.feed_region || window.analyzify?.feed_region || null;
                  const newItems = processItemsForGads(items, product_id_format, feedRegion);
                  eventParams.items = newItems;

                  // Populate ecomm object
                  const eccomm = populateEccomm(newItems, items);

                  if (
                    eventName && activeEvents.includes(eventName) &&
                    eventName !== "remove_from_cart" &&
                    eventName !== "generate_lead"
                  ) {
                    sendGAdsEvent(eventName, {
                      ...eventParams,
                      // Conditionally add ecomm parameters if they have values
                      ...(eccomm.ecomm_prodid.length > 0 && { ecomm_prodid: eccomm.ecomm_prodid }),
                      ...(eccomm.ecomm_prodname.length > 0 && { ecomm_prodname: eccomm.ecomm_prodname }),
                      ...(eccomm.ecomm_prodvalue.length > 0 && { ecomm_prodvalue: eccomm.ecomm_prodvalue }),
                      ...(eccomm.ecomm_totalvalue > 0 && { ecomm_totalvalue: window.analyzify.formatPrice(eccomm.ecomm_totalvalue, false) }),
                      ...(eccomm.ecomm_category.length > 0 && { ecomm_category: eccomm.ecomm_category }),
                      ...(eccomm.ecomm_pagetype && { ecomm_pagetype: eccomm.ecomm_pagetype })
                    }, isSecondary ? "analyzify_ads_secondary" : "analyzify_ads_primary", gadsProps.id?.toString());
                  }

                  // @check
                  if (
                    gadsProps.remarketing?.status &&
                    gadsProps.remarketing.events[eventName]
                  ) {
                    if (eventName === "remove_from_cart") {
                      sendGAdsEvent("remove_from_cart", {
                        ...eventParams,
                        // Conditionally add ecomm parameters if they have values
                        ...(eccomm.ecomm_prodid.length > 0 && { ecomm_prodid: eccomm.ecomm_prodid }),
                        ...(eccomm.ecomm_prodname.length > 0 && { ecomm_prodname: eccomm.ecomm_prodname }),
                        ...(eccomm.ecomm_prodvalue.length > 0 && { ecomm_prodvalue: eccomm.ecomm_prodvalue }),
                        ...(eccomm.ecomm_totalvalue > 0 && { ecomm_totalvalue: window.analyzify.formatPrice(eccomm.ecomm_totalvalue, false) }),
                        ...(eccomm.ecomm_category.length > 0 && { ecomm_category: eccomm.ecomm_category }),
                        ...(eccomm.ecomm_pagetype && { ecomm_pagetype: eccomm.ecomm_pagetype })
                      }, isSecondary ? "analyzify_ads_secondary" : "analyzify_ads_primary", gadsProps.id?.toString());
                    }

                    if (eventName === "generate_lead") {
                      sendGAdsEvent("generate_lead", {
                        form_method: eventParams?.form_method || null,
                        lead_source: eventParams?.lead_source || null,
                        form_source: eventParams?.form_source || null,
                        form_type: eventParams?.form_type || null,
                        cart_id: eventParams?.cart_id || null,
                        event_id: eventParams?.event_id || null,
                        send_to: `${gadsProps.id}`,
                        event_callback: () => {
                          analyzify.log(`Generate lead event successfully sent to: ${gadsProps.id}/${gadsProps.remarketing.conversions[eventName].value}`, 'an_ga4_gads', 'handleGAdsRMEvents');
                        },
                      }, isSecondary ? "analyzify_ads_secondary" : "analyzify_ads_primary", gadsProps.id?.toString());
                    }

                  }

                }
              } catch (error) {
                console.error("Error processing GAds events:", error);
              }
            };

            const handleGAdsConversion = (gadsProps, eventName, activeEvents, gadsConfig, isSecondary = false) => {
              try {
                if (eventName === "page_404") {
                  return;
                }

                if (gadsProps?.status && gadsConfig.conversions[eventName]?.status) {
                  // Initialize items array
                  let items = [];

                  if (window.analyzify.shopify_template === "product") {
                    const getProducts = window.analyzify?.getProductObj?.product;
                    const variantInput = window.analyzify?.getCurrentVariant()?.id || window.analyzify.getFirstVariant(getProducts)?.id;
                    const variantDetails = window.analyzify.getVariantDetails(getProducts?.variants, variantInput);
                    if(!getProducts || !variantDetails) return analyzify.log('Product object is not found', 'an_ga4_gads', 'handleGAdsConversion');

                    const itemIds = window.analyzify.getItemIds({
                      productObj: getProducts,
                      product_id_format: gadsProps.product_id_format,
                      variantDetails: variantDetails,
                      eventName: 'view_item',
                      feedRegion: gadsConfig?.feed_region || window.analyzify.feed_region || null
                    });

                    const compareAtPrice = variantDetails?.compare_at_price || getProducts?.compare_at_price || 0;
                    const actualPrice = variantDetails?.price || window.analyzify.formatPrice(product?.price) || 0;
                    const getDiscount = (compareAtPrice > 0 && compareAtPrice !== actualPrice) ? compareAtPrice - actualPrice : 0;

                    items = [{
                      id: itemIds.selected,
                      item_id: itemIds.selected,
                      google_business_vertical: "retail",
                      item_name: getProducts?.title?.trim() || null,
                      item_category: getProducts?.type || (getProducts?.tags && getProducts?.tags?.length > 0 ? getProducts?.tags[0] : ""),
                      item_brand: getProducts?.vendor?.trim() || null,
                      item_sku: itemIds.ids.sku,
                      discount: getDiscount || 0,
                      item_barcode: variantDetails?.barcode || null,
                      item_variant: variantDetails?.title?.trim() || null,
                      item_variant_id: itemIds.ids.variant_id,
                      price: actualPrice || 0,
                      quantity: 1,
                      currency: window.analyzify?.currency
                    }];

                  } else if (window.analyzify.shopify_template === "cart") {
                    const cartItems = window.analyzify?.detectedCart?.items || [];

                    items = cartItems.map(item => {
                      const itemIds = window.analyzify.getItemIds({
                        productObj: item,
                        product_id_format: gadsProps.product_id_format,
                        variantDetails: null,
                        eventName: 'view_cart',
                        feedRegion: gadsProps?.feed_region || window.analyzify.feed_region || null
                      });

                      const getDiscount = Array.isArray(item?.line_level_discount_allocations)
                        ? item.line_level_discount_allocations.reduce(
                            (total, item) => total + (Number(item.amount) || 0),
                            0
                          )
                        : 0;

                      return {
                        id: itemIds.selected,
                        google_business_vertical: "retail",
                        item_name: item?.product_title?.trim() || item?.title?.trim() || null,
                        item_category: item?.product_type || (item?.tags && item?.tags?.length > 0 ? item?.tags[0] : ""),
                        item_brand: item?.vendor?.trim() || null,
                        item_sku: itemIds.ids.sku,
                        discount: window.analyzify.formatPrice(getDiscount) || 0,
                        item_variant: item?.variant_title?.trim() || null,
                        item_variant_id: itemIds.ids.variant_id,
                        price: window.analyzify.formatPrice(item?.line_price || item?.price) || 0,
                        quantity: item?.quantity || 1,
                        currency: window.analyzify?.currency
                      };
                    });
                  }

                  // Check if items exist and proceed with conversion
                  if (items?.length > 0) {
                    if (
                      eventName &&
                      activeEvents.includes(eventName) &&
                      gadsConfig.id &&
                      gadsConfig.conversions[eventName].value
                    ) {
                      const {
                        sha256_email_address,
                        sha256_phone_number,
                        sha256_first_name,
                        sha256_last_name
                      } = window.analyzify?.shopify_customer || {};

                      // Prepare user data object
                      const userData = {
                        sha256_phone_number: sha256_phone_number || null,
                        sha256_email_address: sha256_email_address || null,
                        address: [{ // Ensure address is an array
                          sha256_first_name: sha256_first_name || null,
                          sha256_last_name: sha256_last_name || null,
                        }]
                      };
                      const convObj = {
                        ...eventParams,
                        send_to: `${gadsConfig.id}/${gadsConfig.conversions[eventName].value}`,
                        items: items,
                        event_callback: () => {
                          analyzify.log(`Conversion event successfully sent to: ${gadsConfig.id}/${gadsConfig.conversions[eventName].value}`, 'an_ga4_gads', 'handleGAdsConversion');
                        },
                        user_data: Object.keys(userData).length && window.analyzify?.shopify_customer?.type !== 'visitor' ? userData : null,
                        discount: Number(parseFloat(items.reduce((total, item) => total + (item?.discount || 0), 0) || 0).toFixed(2)),
                        new_customer: Object.keys(userData).length ? window.analyzify?.shopify_customer?.orders_count > 0 ? false : true : null,
                      };

                      // COGS check
                      if(
                        gadsProps?.is_cogs_active ||
                        (
                          gadsProps?.feed_language &&
                          gadsProps?.feed_country &&
                          gadsProps?.merchant_id
                        )
                      ){
                        if(gadsProps?.feed_language && gadsProps?.feed_language !== '') convObj.aw_feed_language = gadsProps?.feed_language;
                        if(gadsProps?.feed_country && gadsProps?.feed_country !== '') convObj.aw_feed_country = gadsProps?.feed_country;
                        if(gadsProps?.merchant_id && gadsProps?.merchant_id !== '') convObj.aw_merchant_id = gadsProps?.merchant_id ? Number(gadsProps?.merchant_id) : null;
                      }

                      analyzify.log(convObj, 'convObj', 'handleGAdsConversion');
                      if(gtag && typeof gtag === 'function'){
                        gtag("event", "conversion", convObj);
                      }
                      if (window.analyzify?.dispatchEvent) {
                        if(convObj.event_callback){
                          delete convObj.event_callback;
                        }
                        window.analyzify.dispatchEvent(`gtag:${eventName}`, {
                          send_to: `${gadsConfig.id}/${gadsConfig.conversions[eventName].value}`,
                          groups: groups,
                          cart_id: window.analyzify?.cart_id || null,
                          event_params: convObj,
                        });
                      }
                    }
                  } else {
                    analyzify.log("No items found for conversion event.", 'an_ga4_gads', 'handleGAdsConversion');
                  }

                  if (eventName === "generate_lead" && gadsConfig.conversions[eventName].status) {
                    const {
                      sha256_email_address,
                      sha256_phone_number,
                      sha256_first_name,
                      sha256_last_name
                    } = window.analyzify?.shopify_customer || {};

                    // Prepare user data object
                    const userData = {
                      sha256_phone_number: sha256_phone_number || null,
                      sha256_email_address: sha256_email_address || null,
                      address: [{ // Ensure address is an array
                        sha256_first_name: sha256_first_name || null,
                        sha256_last_name: sha256_last_name || null,
                      }]
                    };
                    const convObj = {
                      cart_id: eventParams?.cart_id || null,
                      event_id: eventParams?.event_id || null,
                      form_method: eventParams?.form_method || null,
                      form_source: eventParams?.form_source || null,
                      form_type: eventParams?.form_type || null,
                      lead_source: eventParams?.lead_source || null,
                      send_to: `${gadsConfig.id}/${gadsConfig.conversions[eventName].value}`,
                      event_callback: () => {
                        analyzify.log(`Conversion event successfully sent to: ${gadsConfig.id}/${gadsConfig.conversions[eventName].value}`, 'an_ga4_gads', 'handleGAdsConversion');
                      },
                      user_data: Object.keys(userData).length && window.analyzify?.shopify_customer?.type !== 'visitor' ? userData : null,
                      new_customer: Object.keys(userData).length ? window.analyzify?.shopify_customer?.orders_count > 0 ? false : true : null,
                    };
                    analyzify.log(convObj, 'convObj', 'handleGAdsConversion');
                    if(gtag && typeof gtag === 'function'){
                      gtag("event", "conversion", convObj);
                    }
                    if (window.analyzify?.dispatchEvent) {
                      if(convObj.event_callback){
                        delete convObj.event_callback;
                      }
                      window.analyzify.dispatchEvent(`gtag:${eventName}`, {
                        send_to: `${gadsConfig.id}/${gadsConfig.conversions[eventName].value}`,
                        groups: groups,
                        cart_id: window.analyzify?.cart_id || null,
                        event_params: convObj,
                      });
                    }
                  }
                }
              } catch (error) {
                console.error("Error processing GAds conversion:", error);
              }
            };

            // Handle primary events
            handleGAdsRMEvents(gadsProps.primary, eventName, activeEvents.gadsRemPrimary, gads_primary);
            handleGAdsConversion(gadsProps.primary, eventName, activeEvents.gadsConvPrimary, gads_primary);

            // Handle secondary events
            handleGAdsRMEvents(gadsProps.secondary, eventName, activeEvents.gadsRemSecondary, gads_secondary, true);
            handleGAdsConversion(gadsProps.secondary, eventName, activeEvents.gadsConvSecondary, gads_secondary, true);

          } catch (error) {
            console.error("Error processing GAds events:", error);
          }
        };

        if (window.analyzify.shopify_customer) {
          const {
            user_id,
            id,
            sha256_user_id,
            sha256_email_address,
            first_name,
            last_name,
            email_address,
            phone_number,
            orders_count = 0,
            total_spent = 0,
            sha256_first_name,
            sha256_last_name,
            type = 'visitor'
          } = analyzify.shopify_customer;

          const {
            user_id_format = 'cid',
            send_user_id = false
          } = window.analyzify || {};

          const userProperties = type === 'member' ? {
            first_name: first_name || null,
            last_name: last_name || null,
            id: id || null,
            sha256_user_id: sha256_user_id || null,
            sha256_first_name: sha256_first_name || null,
            sha256_last_name: sha256_last_name || null,
            sha256_email_address: sha256_email_address || null,
            type: type || null,
            email_address: email_address || null,
            phone_number: phone_number || null,
            orders_count: orders_count || 0,
            total_spent: total_spent || null
          } : { type };

          analyzify.log('userProperties', 'an_ga4_gads', 'userProperties');
          analyzify.log(userProperties, 'an_ga4_gads', 'userProperties');

          if (
            userProperties?.type === "member" &&
            (
              userProperties?.sha256_email_address === undefined ||
              userProperties?.sha256_email_address === null
            )
          ) {
            analyzify.log(`User properties are incomplete for a ${userProperties?.type}.`, 'an_ga4_gads', 'userProperties');

            // Check if analyzify.shopify_customer has a valid sha256_email_address
            if (analyzify?.shopify_customer?.sha256_email_address) {
              gtag("set", "user_properties", userProperties || analyzify?.shopify_customer);
              if (send_user_id) {
                const userId = user_id_format === 'email' ? analyzify?.shopify_customer?.sha256_email_address :
                  user_id_format === 'hashed_cid' ? analyzify?.shopify_customer?.sha256_user_id :
                    analyzify?.shopify_customer?.user_id || null;

                if (userId) gtag("set", "user_id", userId);
              }
            } else {
              let attempts = 0;
              const maxAttempts = 3;
              const intervalTime = 1000; // 1 second

              const intervalId = setInterval(() => {

                if (
                  userProperties?.type === "member" &&
                  userProperties?.sha256_email_address !== undefined &&
                  userProperties?.sha256_email_address !== null
                ) {
                  if(gtag && typeof gtag === 'function'){
                    gtag("set", "user_properties", userProperties || analyzify?.shopify_customer);
                  }
                  if (window.analyzify?.dispatchEvent) {
                    if(userProperties.event_callback){
                      delete userProperties.event_callback;
                    }
                    window.analyzify.dispatchEvent('gtag:user_properties_set', {
                      user_properties: userProperties || analyzify?.shopify_customer,
                    });
                  }
                  analyzify.log('user_properties set', 'an_ga4_gads', 'userProperties');
                  analyzify.log(userProperties || analyzify?.shopify_customer, 'an_ga4_gads', 'userProperties');
                  if (send_user_id) {
                    const userId = user_id_format === 'email' ? analyzify?.shopify_customer?.sha256_email_address :
                      user_id_format === 'hashed_cid' ? analyzify?.shopify_customer?.sha256_user_id :
                        analyzify?.shopify_customer?.user_id || null;

                    if (userId) gtag("set", "user_id", userId);
                  }
                  clearInterval(intervalId); // Clear the interval once successful
                } else {
                  attempts++;
                  if (attempts >= maxAttempts) {
                    analyzify.log("Failed to set user_properties after 3 attempts.", 'an_ga4_gads', 'userProperties');
                    clearInterval(intervalId); // Clear the interval after max attempts
                    gtag("set", "user_properties", analyzify?.shopify_customer || userProperties || {});
                    if (send_user_id) {
                      const userId = user_id_format === 'email' ? analyzify?.shopify_customer?.sha256_email_address :
                        user_id_format === 'hashed_cid' ? analyzify?.shopify_customer?.sha256_user_id :
                          analyzify?.shopify_customer?.user_id || null;

                      if (userId) gtag("set", "user_id", userId);
                    }
                  }
                }
              }, intervalTime);
            }
          } else {
            if(gtag && typeof gtag === 'function'){
              gtag("set", "user_properties", userProperties);
            }
            if (window.analyzify?.dispatchEvent) {
              if(userProperties.event_callback){
                delete userProperties.event_callback;
              }
              window.analyzify.dispatchEvent('gtag:user_properties_set', {
                user_properties: userProperties,
              });
            }
            if (send_user_id) {
              const userId = user_id_format === 'email' ? analyzify?.shopify_customer?.sha256_email_address :
                user_id_format === 'hashed_cid' ? analyzify?.shopify_customer?.sha256_user_id :
                  analyzify?.shopify_customer?.user_id || null;

              if (userId) gtag("set", "user_id", userId);
            }
          }

          document.addEventListener('userDataReady', (event) => {
            analyzify.log('userDataReady', 'an_ga4_gads', 'userDataReady');
            analyzify.log(event.detail, 'an_ga4_gads', 'userDataReady');
          });

        } else {
          analyzify.log('shopify_customer is not ready.', 'an_ga4_gads', 'userProperties');
        }

        // add_to_cart
        window.analyzify.gaAddToCart = (productObj, currentVariant, eventId) => {
          try {

            if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaAddToCart');

            let { product, variant, collection } = productObj;

            if(!product) product = productObj;

            const addedItem = { ...product };
            const firstVariant = window.analyzify.getFirstVariant(product);
            const variantDetails = window.analyzify.getVariantDetails(product?.variants, currentVariant || variant?.id || firstVariant?.id);
            const compareAtPrice = variantDetails?.compare_at_price || product?.compare_at_price || 0;
            const actualPrice = variantDetails?.price || window.analyzify.formatPrice(product?.price) || 0;
            const getDiscount = (compareAtPrice > 0 && compareAtPrice !== actualPrice) ? compareAtPrice - actualPrice : 0;

            const prodQty = product?.quantity || analyzify.findQuantity() || 1;

            if (!variantDetails) {
              return analyzify.log(`Variant with id ${variant?.id} not found`, 'an_ga4_gads', 'gaAddToCart');
            }

            addedItem.item_variant_id = variantDetails?.id;
            addedItem.price = variantDetails?.price || window.analyzify.formatPrice(product?.price) || 0,
            addedItem.discount = window.analyzify.formatPrice(getDiscount) || 0,
            addedItem.item_sku = variantDetails?.sku;
            addedItem.item_variant = variantDetails?.public_title || variantDetails?.title;
            addedItem.quantity = prodQty;
            addedItem.index = 0;

            if (collection) addedItem.item_list_id = collection?.id || null;
            if (collection?.title) addedItem.item_list_name = collection?.title || null;

            const multipleDestsObj = {
              eventName: "add_to_cart",
              eventParams: {
                currency: window.analyzify?.currency,
                value: window.analyzify.formatPrice(variantDetails?.price * prodQty || 0, false),
                cart_id: window.analyzify?.cart_id || null,
              },
              items: [addedItem],
            };

            sendMultipleDests(multipleDestsObj, eventId);
            analyzify.log("Product add_to_cart", 'an_ga4_gads', 'gaAddToCart');
            analyzify.log(window.dataLayer, 'an_ga4_gads', 'gaAddToCart');
          } catch (error) {
            console.error("Error processing gaAddToCart:", error);
          }
        };

        window.analyzify.gaAddToWishlist = (productObj) => {
          try {
            if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaAddToWishlist');

            let { product, variant, collection } = productObj;

            if(!product) product = productObj;

            const wishedItem = { ...product };
            const firstVariant = window.analyzify.getFirstVariant(product);
            const variantDetails = window.analyzify.getVariantDetails(product?.variants, variant?.id || firstVariant?.id);

            if (!variantDetails) {
              return analyzify.log(`Variant with id ${variant?.id} not found`, 'an_ga4_gads', 'gaAddToWishlist');
            }

            wishedItem.item_variant_id = variantDetails?.id;
            wishedItem.price = variantDetails?.price;
            wishedItem.item_sku = variantDetails?.sku;
            wishedItem.item_variant = variantDetails?.public_title || variantDetails?.title

            const prodQty = analyzify.findQuantity() || 1;

            wishedItem.quantity = prodQty;
            wishedItem.index = 0;

            if (collection) wishedItem.item_list_id = collection?.id || null;
            if (collection?.title) wishedItem.item_list_name = collection?.title || null;

            const multipleDestsObj = {
              eventName: "add_to_wishlist",
              eventParams: {
                currency: window.analyzify?.currency,
                value: window.analyzify.formatPrice(variantDetails?.price * prodQty || 0, false),
                cart_id: window.analyzify?.cart_id || null,
              },
              items: [wishedItem],
            };

            sendMultipleDests(multipleDestsObj, window.analyzify.getCurrentEcommerceEventId());
            analyzify.log("Product add_to_wishlist", 'an_ga4_gads', 'gaAddToWishlist');
            analyzify.log(window.dataLayer, 'an_ga4_gads', 'gaAddToWishlist');
          } catch (error) {
            console.error("Error processing gaAddToWishlist:", error);
          }
        };

        window.analyzify.gaBeginCheckout = (cartObj, eventId) => {
          try {
            if(!cartObj) return analyzify.log('Cart object is not found', 'an_ga4_gads', 'gaBeginCheckout');
            if(!cartObj?.items) return analyzify.log('Cart items are not found', 'an_ga4_gads', 'gaBeginCheckout');

            const multipleDestsObj = {
              eventName: "begin_checkout",
              eventParams: {
                currency: window.analyzify?.currency,
                value: window.analyzify.formatPrice(cartObj?.total_price, true),
                total_quantity: Number(cartObj?.item_count),
                total_items: cartObj?.items?.length,
                cart_id: cartObj?.token.split('?')[0] || window.analyzify?.cart_id || null,
              },
              items: cartObj?.items?.map(item => ({
                ...item,
                price: window.analyzify.formatPrice(item.price, true)
              })),
            };
            sendMultipleDests(multipleDestsObj, eventId);
            analyzify.log('multipleDestsObj: begin_checkout', 'an_ga4_gads', 'gaBeginCheckout');
            analyzify.log(multipleDestsObj, 'an_ga4_gads', 'gaBeginCheckout');
          } catch (error) {
            console.error("Error processing gaBeginCheckout:", error);
          }
        };

        window.analyzify.gaHeroBannerClick = (hbElement) => {
          try {
            const allChildren = Array.from(hbElement.children);
            const targetChild = allChildren.find((sibling) => {
              const titleElement = analyzify.findElemInPath(
                Array.from(sibling.children).flatMap((child) =>
                  Array.from(child.children),
                ),
                analyzify.hero_banner_title_attributes,
              );
              const subtitleElement = analyzify.findElemInPath(
                Array.from(sibling.children).flatMap((child) =>
                  Array.from(child.children),
                ),
                analyzify.hero_banner_subtitle_attributes,
              );
              const ctaElement = analyzify.findElemInPath(
                Array.from(sibling.children).flatMap((child) =>
                  Array.from(child.children),
                ),
                analyzify.hero_banner_cta_attributes,
              );
              const link = path.find(
                (element) =>
                  (element.tagName === "A" || element.tagName === "BUTTON") &&
                  element.href,
              );
              if ((titleElement || subtitleElement) && link) {
                const heroBannerClickObj = {
                  send_to: groups,
                  heading: titleElement
                    ? titleElement.textContent.trim().substring(0, 100)
                    : null,
                  description: subtitleElement
                    ? subtitleElement.textContent.trim().substring(0, 100)
                    : null,
                  cta_title:
                    ctaElement && link
                      ? ctaElement.textContent.trim().substring(0, 100)
                      : null,
                  cta_url: link ? link.href : null,
                };
                gtag("event", "hero_banner_click", heroBannerClickObj);

                analyzify.log('heroBannerClickObj', 'an_ga4_gads', 'gaHeroBannerClick');
                analyzify.log(heroBannerClickObj, 'an_ga4_gads', 'gaHeroBannerClick');

              }
              return titleElement || subtitleElement;
            });
          } catch (error) {
            console.error("Error processing gaHeroBannerClick:", error);
          }
        };

        window.analyzify.gaProductDetailAccordion = (pdaElement) => {
          try {
            const multipleDestsObj = {
              send_to: groups,
              title: pdaElement.textContent.replace(/\s+/g, " ").trim() || null,
            };
            gtag("event", "product_detail_accordion", multipleDestsObj);
            analyzify.log('multipleDestsObj: product_detail_accordion', 'an_ga4_gads', 'gaProductDetailAccordion');
            analyzify.log(multipleDestsObj, 'an_ga4_gads', 'gaProductDetailAccordion');
          } catch (error) {
            console.error("Error processing gaProductDetailAccordion:", error);
          }
        };

        window.analyzify.gaDisclosureChange = (disclosureElement) => {
          try {
            const multipleDestsObj = {
              send_to: groups,
              data_value: disclosureElement
                ? disclosureElement.hasAttribute("data-value")
                  ? disclosureElement.getAttribute("data-value").trim()
                  : null
                : null,
              selected_option: disclosureElement
                ? disclosureElement.textContent.replace(/\s+/g, " ").trim()
                : null,
              type: disclosureElement
                .closest("form")
                .classList.contains("localization-form")
                ? "localization-form"
                : null,
            };
            gtag("event", "disclosure_changed", multipleDestsObj);
            analyzify.log('multipleDestsObj: disclosure_changed', 'an_ga4_gads', 'gaDisclosureChange');
            analyzify.log(multipleDestsObj, 'an_ga4_gads', 'gaDisclosureChange');
          } catch (error) {
            console.error("Error processing gaDisclosureChange:", error);
          }
        };

        // nav_click
        window.analyzify.gaNavClick = (nav_elem, navTitle) => {
          try {
            if (!nav_elem) return analyzify.log("No navigation element found.", 'an_ga4_gads', 'gaNavClick');

            const tagName = nav_elem.tagName;
            const type = window.analyzify.getTypeFromTag(tagName);
            const title = nav_elem.innerText.trim().split("\n")[0] || "";

            let url = null;

            // Step 1: Check the element itself for data attributes or href
            if (nav_elem.hasAttribute("data-url") || nav_elem.hasAttribute("data-link")) {
              url = nav_elem.getAttribute("data-url") || nav_elem.getAttribute("data-link");
            } else if (nav_elem.hasAttribute("href")) {
              url = nav_elem.getAttribute("href");
            } else {
              // Step 2: Look for various common elements that might contain URLs

              // Check for any summary elements with data attributes
              const summaryElements = nav_elem.querySelectorAll('summary[data-link], summary[data-url]');
              if (summaryElements.length > 0) {
                url = summaryElements[0].getAttribute("data-link") || summaryElements[0].getAttribute("data-url");
              }

              // If still no URL, check for anchor tags
              if (!url) {
                const anchorElements = nav_elem.querySelectorAll('a[href]');
                if (anchorElements.length > 0) {
                  url = anchorElements[0].href;
                }
              }

              // If still no URL, check parent element
              if (!url) {
                const parent = nav_elem.parentElement;
                if (parent?.hasAttribute("href")) {
                  url = parent.getAttribute("href");
                } else if (parent?.hasAttribute("data-url") || parent?.hasAttribute("data-link")) {
                  url = parent.getAttribute("data-url") || parent.getAttribute("data-link");
                }
              }

              // If still no URL, check for closest elements with relevant attributes
              if (!url) {
                const closestAnchor = nav_elem.closest("a[href]");
                if (closestAnchor) {
                  url = closestAnchor.href;
                } else {
                  const closestDataLink = nav_elem.closest("[data-url], [data-link]");
                  if (closestDataLink) {
                    url = closestDataLink.getAttribute("data-url") || closestDataLink.getAttribute("data-link");
                  }
                }
              }
            }

            const navObj = {
                send_to: groups,
                nav: { position: navTitle, type, title, url },
            };

            if(ga4Props.status &&ga4Props.primary.status && ga4Props.primary.events.nav_click){
              navObj.send_to = ga4Props.primary.id;
              gtag("event", "nav_click", navObj);
            }
            if(ga4Props.status && ga4Props.secondary.status && ga4Props.secondary.events.nav_click){
              navObj.send_to = ga4Props.secondary.id;
              gtag("event", "nav_click", navObj);
            }
            analyzify.log(`navObj: nav_click -> ${JSON.stringify(navObj)}`, 'an_ga4_gads', 'gaNavClick');
          } catch (error) {
            console.error("Error processing gaNavClick:", error);
          }
        };

        // remove_from_cart
        window.analyzify.gaRebuyRfc = (productObj) => {
          try {
            if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaRebuyRfc');
            analyzify.log('productObj: gaRebuyRfc', 'an_ga4_gads', 'gaRebuyRfc');
            analyzify.log(productObj, 'an_ga4_gads', 'gaRebuyRfc');
            const multipleDestsObj = {
              eventName: "remove_from_cart",
              eventParams: {
                currency: window.analyzify?.currency,
                value: window.analyzify.formatPrice(productObj.price, false) * productObj.quantity,
                cart_id: window.analyzify?.cart_id || null,
              },
              items: [productObj],
            };
            sendMultipleDests(multipleDestsObj);
          } catch (error) {
            console.error("Error processing gaRebuyRfc:", error);
          }
        };

        // select_item
        // global fallback select_item (for Shogun and unknown templates)
        window.analyzify.gaSelectItem = (productObj, eventId) => {
          try {
            if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaSelectItem');

            analyzify.log('productObj: gaSelectItem', 'an_ga4_gads', 'gaSelectItem');
            analyzify.log(productObj, 'an_ga4_gads', 'gaSelectItem');

            const firstVariant = window.analyzify.getFirstVariant(productObj);
            const multipleDestsObj = {
              eventName: "select_item",
              eventParams: {
                currency: window.analyzify?.currency,
                value: window.analyzify.formatPrice(firstVariant?.price || productObj?.price, true),
                item_list_id: null,
                item_list_name: null,
                cart_id: window.analyzify?.cart_id || null,
              },
              items: [productObj],
            };
            sendMultipleDests(multipleDestsObj, eventId);
          } catch (error) {
            console.error("Error processing gaSelectItem:", error);
          }
        };

        if (window.analyzify.shopify_template == "collection") {

          // collection-specific select_item
          window.analyzify.gaSelectItem = (productObj, eventId) => {
            try {
              if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaSelectItem');

              analyzify.log('productObj: gaSelectItem (collection)', 'an_ga4_gads', 'gaSelectItem');
              analyzify.log(productObj, 'an_ga4_gads', 'gaSelectItem');

              const collection = window.analyzify.getCollectionObj;
              const firstVariant = window.analyzify.getFirstVariant(productObj);
              const multipleDestsObj = {
                eventName: "select_item",
                eventParams: {
                  currency: window.analyzify?.currency,
                  value: window.analyzify.formatPrice(firstVariant?.price || productObj?.price, true),
                  item_list_id: collection?.id || null,
                  item_list_name: collection?.title || null,
                  cart_id: window.analyzify?.cart_id || null,
                },
                items: [productObj],
              };
              sendMultipleDests(multipleDestsObj, eventId);
            } catch (error) {
              console.error("Error processing gaSelectItem:", error);
            }
          };
          // view_item_list
          window.analyzify.gaViewItemList = () => {
            try {
              const { products, id, title, handle } = ga4Obj.getCollectionObj;
              if(!title || !products?.length) return analyzify.log('Collection title or products not found', 'an_ga4_gads', 'gaViewItemList');

              if(ga4Props?.multiple_view_item_list) {
                const chunkSize = ga4Obj?.chunk_size;
                const itemsChunks = products.length > chunkSize ?
                products.map((item, index) => ({
                  ...item,
                  index: index
                })).reduce((resultArray, item, index) => {
                  const chunkIndex = Math.floor(index/chunkSize);
                  if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [];
                  }
                  resultArray[chunkIndex].push(item);
                  return resultArray;
                }, []) : [products.map((item, index) => ({
                  ...item,
                  index: index
                }))];

                itemsChunks.forEach((chunk, chunkIndex) => {
                  const multipleDestsObj = {
                    eventName: "view_item_list",
                    eventParams: {
                    item_list_id: id ? id : null,
                    item_list_name: title ? title : null,
                    value: window.analyzify.formatPrice(products.reduce((acc, curr) => acc + window.analyzify.formatPrice(curr.price), 0), true),
                    currency: window.analyzify?.currency,
                    total_quantity: products.length || 1,
                    total_items: products.length || 1,
                    cart_id: window.analyzify?.cart_id || null,
                  },
                  items: chunk || [],
                };
                window.analyzify.collection = {
                  id: id ? id : null,
                  title: title ? title : null,
                    handle: handle ? handle : null,
                  }
                  sendMultipleDests(multipleDestsObj);
                });

              } else {
                const multipleDestsObj = {
                  eventName: "view_item_list",
                  eventParams: {
                    item_list_id: id ? id : null,
                    item_list_name: title ? title : null,
                    value: window.analyzify.formatPrice(products.reduce((acc, curr) => acc + window.analyzify.formatPrice(curr.price), 0), true),
                    currency: window.analyzify?.currency,
                    total_quantity: products.length || 1,
                    total_items: products.length || 1,
                    cart_id: window.analyzify?.cart_id || null,
                  },
                  items: products || [],
                };
                window.analyzify.collection = {
                  id: id ? id : null,
                  title: title ? title : null,
                  handle: handle ? handle : null,
                }
                sendMultipleDests(multipleDestsObj);
              }

            } catch (error) {
              console.error("Error processing gaViewItemList:", error);
            }
          };
          analyzify.gaViewItemList();

        } else if (window.analyzify.shopify_template == "product") {

          const { getProductObj } = ga4Obj;

          // view_item
          window.analyzify.gaViewItem = (productObj, variantId) => {
            try {
              if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaViewItem');

              const { product, variant } = productObj;

              if(!product) return analyzify.log('Product object is not found', 'an_ga4_gads', 'gaViewItem');

              const variantInput = variantId || window.analyzify?.getCurrentVariant()?.id || variant?.id;
              const variantDetails = window.analyzify.getVariantDetails(product?.variants, variantInput);

              const ecommerce = {
                currency: window.analyzify?.currency || null,
                value: window.analyzify.formatPrice(variantDetails?.price, false),
              };
              const multipleDestsObj = {
                eventName: "view_item",
                eventParams: ecommerce,
                cart_id: window.analyzify?.cart_id || null,
                items: [product]
              };
              sendMultipleDests(multipleDestsObj);

              window.analyzify.gadsRemViewItem = (product) => {
                try {
                  const ecommerce = {
                    currency: window.analyzify?.currency || null,
                    value: window.analyzify.formatPrice(firstVariant?.price, false),
                  };
                  const multipleDestsObj = {
                    eventName: "view_item",
                    eventParams: ecommerce,
                    cart_id: window.analyzify?.cart_id || null,
                    items: [product],
                  };
                  analyzify.log('multipleDestsObj: view_item', multipleDestsObj, 'an_ga4_gads', 'gadsRemViewItem');
                  sendMultipleDests(multipleDestsObj);
                } catch (error) {
                  console.error("Error processing gadsRemViewItem:", error);
                }
              };

            } catch (error) {
              console.error("Error processing gaViewItem:", error);
            }
          };
          analyzify.gaViewItem(getProductObj);

          // variant_changed
          window.analyzify.gaVariantChange = (variantData) => {
            try {
              if (!variantData) return analyzify.log('Variant data is not found', 'an_ga4_gads', 'gaVariantChange');
              const { product } = window.analyzify.getProductObj;
              if(!product) return analyzify.log('Product object is not found', 'an_ga4_gads', 'gaVariantChange');

              const selectedVariant = product?.variants?.find((variant) => variant.id.toString() === variantData.id.toString());
              if(!selectedVariant) return analyzify.log('Selected variant is not found', 'an_ga4_gads', 'gaVariantChange');

              const variantDetails = window.analyzify.getVariantDetails(product?.variants, selectedVariant?.id);
              if(!variantDetails) return analyzify.log('Variant details are not found', 'an_ga4_gads', 'gaVariantChange');

              const variantObj = {
                variant_id: variantDetails?.id?.toString() || null,
                variant_title: variantDetails?.title || null,
                product_price: window.analyzify.formatPrice(variantDetails?.price, false),
                product_sku: variantDetails?.sku || null,
                product_id: product?.id || null,
                product_title: product?.title || null,
                cart_id: window.analyzify?.cart_id || null,
                variant_availability: selectedVariant?.available || false,
              };

              if(!variantObj) return analyzify.log('Multiple destinations object is not found', 'an_ga4_gads', 'gaVariantChange');

              if(ga4Props.status &&ga4Props.primary.status && ga4Props.primary.events.variant_changed){
                variantObj.send_to = ga4Props.primary.id;
                gtag("event", "variant_changed", variantObj);
              }

              if(ga4Props.status && ga4Props.secondary.status && ga4Props.secondary.events.variant_changed){
                variantObj.send_to = ga4Props.secondary.id;
                gtag("event", "variant_changed", variantObj);
              }

              if(ga4Props.status &&ga4Props.primary.status && ga4Props.primary.events.variant_changed && ga4Obj.variant_changed_with_view_item){
                window.analyzify.gaViewItem(window.analyzify.getProductObj, selectedVariant?.id);
              }

              if(ga4Props.status && ga4Props.secondary.status && ga4Props.secondary.events.variant_changed && ga4Obj.variant_changed_with_view_item){
                window.analyzify.gaViewItem(window.analyzify.getProductObj, selectedVariant?.id);
              }

              analyzify.log('variantObj: variant_changed', variantObj, 'an_ga4_gads', 'gaVariantChange');

            } catch (error) {
              console.error("Error processing gaVariantChange:", error);
            }

          };
          analyzify.gaVariantChange(getProductObj.product);

        } else if (window.analyzify.shopify_template == "cart") {

          window.analyzify.gaViewCart = (cartObj) => {
            try {
              if (!cartObj) return analyzify.log('Cart object is not found', 'an_ga4_gads', 'gaViewCart');
              if (cartObj?.items?.length == 0) return;

              const ecommerce = {
                currency: window.analyzify?.currency,
                value: window.analyzify.formatPrice(cartObj?.total_price, true),
                cart_id: window.analyzify?.cart_id || null,
                total_quantity: Number(cartObj.item_count),
                total_items: cartObj.items.length,
              };
              const multipleDestsObj = {
                eventName: "view_cart",
                eventParams: ecommerce,
                items: cartObj?.items,
              };
              sendMultipleDests(multipleDestsObj);
            } catch (error) {
              console.error("Error processing gaViewCart:", error);
            }
          };
          window.analyzify.gaViewCart(window.analyzify?.detectedCart);

        } else if (window.analyzify.shopify_template == "search") {

          // Search related view_item_list scope
          window.analyzify.gaSearch = (searchObj) => {
            try {
              const { term, products, resultsCount } = searchObj;
              gtag("event", "search", { send_to: groups, search_term: term });
              const multipleDestsObj = {
                eventName: "view_item_list",
                eventParams: {
                  item_list_id: "search_results",
                  item_list_name: `Search Results: ${term}`,
                  value: window.analyzify.formatPrice(products.reduce((acc, curr) => acc + window.analyzify.formatPrice(curr?.price), 0), true),
                  currency: window.analyzify?.currency,
                  total_quantity: resultsCount || 1,
                  total_items: resultsCount || 1,
                  cart_id: window.analyzify?.cart_id || null,
                },
                items: products ? products : [],
              };
              sendMultipleDests(multipleDestsObj);
            } catch (error) {
              console.error("Error processing searchHandle:", error);
            }
          };
          // search-specific select_item
          window.analyzify.gaSelectItem = (productObj, eventId) => {
            try {
              if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaSelectItem');

              analyzify.log('productObj: gaSelectItem (search)', 'an_ga4_gads', 'gaSelectItem');
              analyzify.log(productObj, 'an_ga4_gads', 'gaSelectItem');

              const searchObj = window.analyzify.getSearchObj;
              const firstVariant = window.analyzify.getFirstVariant(productObj);
              const multipleDestsObj = {
                eventName: "select_item",
                eventParams: {
                  currency: window.analyzify?.currency,
                  value: window.analyzify.formatPrice(firstVariant?.price || productObj?.price, true),
                  item_list_id: "search_results",
                  item_list_name: searchObj?.term ? `Search Results: ${searchObj.term}` : null,
                  cart_id: window.analyzify?.cart_id || null,
                },
                items: [productObj],
              };
              sendMultipleDests(multipleDestsObj, eventId);
            } catch (error) {
              console.error("Error processing gaSelectItem:", error);
            }
          };

          analyzify.gaSearch(ga4Obj.getSearchObj);

        } else if (window.analyzify.shopify_template == "index" || window.analyzify.shopify_template == "page") {

          // index/page-specific select_item
          window.analyzify.gaSelectItem = (productObj, eventId) => {
            try {
              if (!productObj) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaSelectItem');

              analyzify.log('productObj: gaSelectItem (index)', 'an_ga4_gads', 'gaSelectItem');
              analyzify.log(productObj, 'an_ga4_gads', 'gaSelectItem');

              const firstVariant = window.analyzify.getFirstVariant(productObj);
              const multipleDestsObj = {
                eventName: "select_item",
                eventParams: {
                  currency: window.analyzify?.currency,
                  value: window.analyzify.formatPrice(firstVariant?.price || productObj?.price, true),
                  item_list_id: "homepage_products",
                  item_list_name: "Homepage Products",
                  cart_id: window.analyzify?.cart_id || null,
                },
                items: [productObj],
              };
              sendMultipleDests(multipleDestsObj, eventId);
            } catch (error) {
              console.error("Error processing gaSelectItem:", error);
            }
          };

        } else if (window.analyzify.shopify_template == "404") {
        const latestUtm = window.analyzify.getLatestUtmFromHistory();
        const {
          sha256_email_address,
          sha256_phone_number,
          sha256_first_name,
          sha256_last_name
        } = window.analyzify?.shopify_customer || {};
        // Prepare user data object
        const userData = {
          sha256_phone_number: sha256_phone_number || null,
          sha256_email_address: sha256_email_address || null,
          address: [{ // Ensure address is an array
            sha256_first_name: sha256_first_name || null,
            sha256_last_name: sha256_last_name || null,
          }]
        };
        try {
            const multipleDestsObj = {
              eventName: "page_404",
              eventParams: {
                c_page_title: "404",
                event_id: window.analyzify.eventId.get('404') || null,
                c_error_message: 'Page Not Found',
                c_page_location: window.location.href,
                c_event_time: Date.now(),
                c_page_referrer: window.analyzify.getEffectiveReferrer(),
                c_content_group: "404",
                c_page_url: window.location.href,
                c_page_path: window.location.pathname,
                c_cart_id: window.analyzify?.cart_id || null,
                c_utm_source: latestUtm?.src || null,
                c_utm_medium: latestUtm?.med || null,
                c_utm_campaign: latestUtm?.camp || null,
                c_utm_content: latestUtm?.cont || null,
              },
                // user_data: Object.keys(userData).length && window.analyzify?.shopify_customer?.type !== 'visitor' ? userData : null,
            };
            sendMultipleDests(multipleDestsObj);
          } catch (error) {
            console.error("Error processing 404 page view event:", error);
          }
        }

        // remove from cart
        window.analyzify.gaRemoveFromCart = (product, eventId) => {
          try {
            if (product) {
              if (!product) return analyzify.log("Product object is not found", 'an_ga4_gads', 'gaRemoveFromCart');
              analyzify.log('productObj: gaRemoveFromCart', 'an_ga4_gads', 'gaRemoveFromCart');
              analyzify.log(product, 'an_ga4_gads', 'gaRemoveFromCart');
              const price = window.analyzify.formatPrice(product?.price || 0, false);
              const quantity = product?.quantity || 1;
              const totalPrice = price * quantity || 0;
              const multipleDestsObj = {
                eventName: "remove_from_cart",
                eventParams: {
                  currency: window.analyzify?.currency,
                  value: window.analyzify.formatPrice(totalPrice, false),
                  cart_id: window.analyzify?.cart_id || null,
                },
                items: [product],
              };
              sendMultipleDests(multipleDestsObj, eventId);
              analyzify.log('multipleDestsObj: remove_from_cart', multipleDestsObj, 'an_ga4_gads', 'gaRemoveFromCart');
            }
          } catch (error) {
            console.error("Error processing gaRemoveFromCart:", error);
          }
        };

        (function(){
          try {
            /*
              FORMS
              - Shopify
              - Klaviyo
              - Hubspot
            */

            // if(!ga4Props?.all_forms) return;

            // SHOPIFY FORM SUBMITTED
            window.addEventListener("azfy:shopify:form_submitted", async (event) => {
              try {
                const evDetail = event.detail;
                const email = evDetail.payload['contact_email'] || evDetail.payload['email'];
                const hashedEmail = await window.analyzify?.hashUserData({
                  email_address: email
                });
                analyzify.log("evDetail", 'an_ga4_gads', 'shopifyFormSubmitted');
                analyzify.log(evDetail, 'an_ga4_gads', 'shopifyFormSubmitted');
                if(
                  event.type === "azfy:shopify:form_submitted" &&
                  evDetail.name === "shopify:form_submitted"
                ){
                  const tags = (evDetail.payload['contact_tags'] || evDetail.payload['customer_tags'] || '').toLowerCase();
                  if (['newsletter', 'prospect'].some(tag => tags.includes(tag))) {
                    const multipleDestsObj = {
                      eventName: "generate_lead",
                      eventParams: {
                        form_method: 'shopify:newsletter',
                        lead_source: 'shopify:newsletter',
                        currency: window.analyzify?.currency || null,
                        value: 1,
                        form_source: 'shopify_native',
                        cart_id: window.analyzify?.cart_id || null,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          contact_email: email || null,
                        } : {}),
                        ...evDetail.payload
                      },
                      user_data: {
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          email_address: window?.analyzify?.shopify_customer?.email_address || email ||  null,
                        } : {}),
                        sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || (email ? hashedEmail?.email_address : null),
                      },
                      items: []
                    };
                    sendMultipleDests(multipleDestsObj);
                    analyzify.log(multipleDestsObj, 'an_ga4_gads', 'newsletactForm');
                  } else if(evDetail.payload["form_type"] === "customer_login"){
                    const multipleDestsObj = {
                      eventName: "login",
                      eventParams: {
                        form_method: 'shopify:customer_login',
                        form_source: 'shopify_native',
                        cart_id: window.analyzify?.cart_id || null,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          contact_email: email || null,
                        } : {}),
                        ...evDetail.payload
                      },
                      user_data: {
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          email_address: window?.analyzify?.shopify_customer?.email_address || email || null,
                        } : {}),
                        sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || (email ? hashedEmail?.email_address : null),
                      },
                    }
                    sendMultipleDests(multipleDestsObj);
                    analyzify.log(multipleDestsObj, 'an_ga4_gads', 'customerLogin');
                  } else if(evDetail.payload["form_type"] === "create_customer"){
                    const multipleDestsObj = {
                      eventName: "sign_up",
                      eventParams: {
                        form_method: 'shopify:customer_register',
                        form_source: 'shopify_native',
                        cart_id: window.analyzify?.cart_id || null,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          contact_email: email || null,
                        } : {}),
                        ...evDetail.payload
                      },
                      user_data: {
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          email_address: window?.analyzify?.shopify_customer?.email_address || email || null,
                        } : {}),
                        sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || (email ? hashedEmail?.email_address : null),
                      },
                    }
                    sendMultipleDests(multipleDestsObj);
                    analyzify.log(multipleDestsObj, 'an_ga4_gads', 'customerRegister');
                  } else if(evDetail.payload["form_type"] === "contact_form" || evDetail.payload["form_type"] === "contact"){
                    const multipleDestsObj = {
                      eventName: "generate_lead",
                      eventParams: {
                        form_method: 'shopify:contact_form',
                        form_source: 'shopify_native',
                        cart_id: window.analyzify?.cart_id || null,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          contact_email: email || null,
                        } : {}),
                        ...evDetail.payload
                      },
                      user_data: {
                        ...(window.analyzify?.hide_raw_userdata !== true ? {
                          email_address: window?.analyzify?.shopify_customer?.email_address || email || null,
                        } : {}),
                        sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || (email ? hashedEmail?.email_address : null),
                      },
                      items: []
                    }
                    sendMultipleDests(multipleDestsObj);
                    analyzify.log(multipleDestsObj, 'an_ga4_gads', 'contactForm');
                  }
                }
              } catch (error) {
                console.error("Error processing newsletter form:", error);
              }
            });

            // KLAVIYO FORM SUBMITTED
            window.addEventListener("azfy:klaviyo:form_submitted", async (event) => {
              try {
                const evDetail = event.detail;
                const email = evDetail.payload['contact_email'] || evDetail.payload['email'];
                const hashedEmail = await window.analyzify?.hashUserData({
                  email_address: email
                });

                const multipleDestsObj = {
                  eventName: "generate_lead",
                  eventParams: {
                    method: 'klaviyo:form_submitted',
                    lead_source: 'klaviyo:form_submitted',
                    form_source: 'klaviyo',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...(window.analyzify?.hide_raw_userdata !== true ? {
                      contact_email: email || null,
                    } : {}),
                    ...evDetail.payload
                  },
                  user_data: {
                    ...(window.analyzify?.hide_raw_userdata !== true ? {
                      email_address: window?.analyzify?.shopify_customer?.email_address || email || null,
                    } : {}),
                    sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || (email ? hashedEmail?.email_address : null),
                  },
                  items: []
                };
                sendMultipleDests(multipleDestsObj);
                analyzify.log(multipleDestsObj, 'an_ga4_gads', 'klaviyoForm');
              } catch (error) {
                console.error("Error processing klaviyo:form_submitted:", error);
              }
            });

            // HUBSPOT FORMS
            window.addEventListener("azfy:hubspot:form_submitted", async (event) => {
              try {
                const evDetail = event.detail;
                const email = evDetail.payload['contact_email'] || evDetail.payload['email'];
                const hashedEmail = await window.analyzify?.hashUserData({
                  email_address: email
                });
                const multipleDestsObj = {
                  eventName: "generate_lead",
                  eventParams: {
                    method: 'hubspot:form_submitted',
                    lead_source: 'hubspot:form_submitted',
                    form_source: 'hubspot',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...(window.analyzify?.hide_raw_userdata !== true ? {
                      contact_email: email || null,
                    } : {}),
                    ...evDetail.payload
                  },
                  user_data: {
                    email_address: window?.analyzify?.shopify_customer?.email_address || email || null,
                    sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || (email ? hashedEmail?.email_address : null),
                  },
                  items: []
                };
                sendMultipleDests(multipleDestsObj);
                analyzify.log(multipleDestsObj, 'an_ga4_gads', 'hubspotFormSubmitted');
              } catch (error) {
                console.error("Error processing hubspot:form_submitted:", error);
              }
            });

            // JOTFORM FORMS
            window.addEventListener("azfy:jotform:form_submitted", (event) => {
              try {
                const evDetail = event.detail;
                const multipleDestsObj = {
                  eventName: "generate_lead",
                  eventParams: {
                    method: 'jotform:form_submitted',
                    lead_source: 'jotform:form_submitted',
                    form_source: 'jotform',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...evDetail.payload
                  },
                  user_data: {
                    email_address: window?.analyzify?.shopify_customer?.email_address || null,
                    sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || null,
                  },
                  items: []
                };
                sendMultipleDests(multipleDestsObj);
                analyzify.log(multipleDestsObj, 'an_ga4_gads', 'jotformFormSubmitted');
              } catch (error) {
                console.error("Error processing jotform:form_submitted:", error);
              }
            });

            // HULK FORM BUILDER FORMS
            window.addEventListener("azfy:hulkformbuilder:form_submitted", (event) => {
              try {
                const evDetail = event.detail;
                const multipleDestsObj = {
                  eventName: "generate_lead",
                  eventParams: {
                    method: 'hulkformbuilder:form_submitted',
                    lead_source: 'hulkformbuilder:form_submitted',
                    form_source: 'hulkformbuilder',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...evDetail.payload
                  },
                  user_data: {
                    email_address: window?.analyzify?.shopify_customer?.email_address || null,
                    sha256_email_address: window?.analyzify?.shopify_customer?.sha256_email_address || null,
                  },
                  items: []
                };
                sendMultipleDests(multipleDestsObj);
                analyzify.log(multipleDestsObj, 'an_ga4_gads', 'hulkFormSubmitted');
              } catch (error) {
                console.error("Error processing hulkformbuilder:form_submitted:", error);
              }
            });
          } catch (error) {
            console.error("Error processing forms:", error);
          }
        })();

        analyzify.log('continueWith', 'an_ga4_gads', 'continueWith');

      // ==========================================
      // Video Tracking
      // ==========================================
      // videoData: {
      //   video_current_time: Number,
      //   video_duration: Number,
      //   video_percent: Number,
      //   video_url: String,
      //   video_title: String,
      //   video_provider: String,
      //   video_visible: Boolean,
      //   video_muted: Boolean,
      // }

      window.analyzify.gaVideoStart = (videoData) => {
        gtag('event', 'video_start', videoData);
        analyzify.log('gaVideoStart', 'an_ga4_gads', 'gaVideoStart');
        analyzify.log(videoData, 'an_ga4_gads', 'gaVideoStart');
      };

      window.analyzify.gaVideoPause = (videoData) => {
        gtag('event', 'video_pause', videoData);
        analyzify.log('gaVideoPause', 'an_ga4_gads', 'gaVideoPause');
        analyzify.log(videoData, 'an_ga4_gads', 'gaVideoPause');
      };

      window.analyzify.gaVideoComplete = (videoData) => {
        gtag('event', 'video_complete', videoData);
        analyzify.log('gaVideoComplete', 'an_ga4_gads', 'gaVideoComplete');
        analyzify.log(videoData, 'an_ga4_gads', 'gaVideoComplete');
      };

      window.analyzify.gaVideoProgress = (videoData) => {
        gtag('event', 'video_progress', videoData);
        analyzify.log('gaVideoProgress', 'an_ga4_gads', 'gaVideoProgress');
        analyzify.log(videoData, 'an_ga4_gads', 'gaVideoProgress');
      };

      window.analyzify.gaVideoError = (videoData) => {
        gtag('event', 'video_error', videoData);
        analyzify.log('gaVideoError', 'an_ga4_gads', 'gaVideoError');
        analyzify.log(videoData, 'an_ga4_gads', 'gaVideoError');
      };

      // --- view_image (custom event) ---
      window.analyzify.gaViewImage = (imageData) => {
        if (ga4Props.status && ga4Props.primary.status && ga4Props.primary.events.view_image) {
          gtag('event', 'view_image', { ...imageData, send_to: ga4Props.primary.id });
        }
        if (ga4Props.status && ga4Props.secondary.status && ga4Props.secondary.events.view_image) {
          gtag('event', 'view_image', { ...imageData, send_to: ga4Props.secondary.id });
        }
        analyzify.log('gaViewImage', 'an_ga4_gads', 'gaViewImage');
        analyzify.log(imageData, 'an_ga4_gads', 'gaViewImage');
      };

      }

    // Ending of the an_ga4_gads js function
  } catch (error) {
    console.error("Error processing an_ga4_gads:", error);
  }
};

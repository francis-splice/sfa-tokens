
window.analyzify.initGTAG_SS = (gtag_SSObj) => {
    try {

        window.dataLayer = window.dataLayer || [];

        if(!gtag_SSObj) return window.analyzify.log('gtag_SSObj is not found', 'an_gtag_ss', 'initGTAG_SS');
        window.analyzify.log(gtag_SSObj, 'an_gtag_ss', 'gtag_SSObj');

        const gaItemMapper = (product, variantDetails) => {
            try {

                analyzify.log(product, 'an_gtag_ss', 'gaItemMapper: product');
                analyzify.log(variantDetails, 'an_gtag_ss', 'gaItemMapper: variantDetails');

                if(!product) analyzify.log('product is not found', 'an_gtag_ss', 'gaItemMapper');

                // Get ID based on format
                const getIdByFormat = (format, { product, variant }) => {
                    try {
                    const idMap = {
                        'product_id': () => product?.product_id ||product?.id || null,
                        'variant_id': () => product?.variant_id || variant?.id || null,
                        'product_sku': () => product?.sku || variant?.sku || null
                    };

                    return (idMap[format]?.() || idMap['variant_id']?.())?.toString() || null;
                    } catch (error) {
                        console.error("Error getting ID by format:", error);
                        return null;
                    }
                };

                const itemObj = {
                    item_id: getIdByFormat(gtag_SSObj.product_id_format, { product, variant: variantDetails }),
                    item_name: (product?.product_title || product?.title)?.trim(),
                    affiliation: "Analyzify SS",
                    item_brand: product?.vendor?.trim() || null,
                    item_category: product?.type?.trim() || product?.product_type?.trim() || null,
                    item_sku: variantDetails?.sku?.toString() || null,
                    quantity: product?.quantity || window.analyzify?.findQuantity() || 1,
                    price: variantDetails?.price || window.analyzify.formatPrice(product?.price, true),
                    item_variant: product?.variant_title?.trim() || variantDetails?.title?.trim() || null,
                    item_variant_id: product?.variant_id?.toString() || variantDetails?.id?.toString() || null,
                    item_product_id: product?.product_id?.toString() || product?.id?.toString() || null,
                    item_shopify_id: `shopify_${window.analyzify?.feed_region}_${product.product_id || product?.id}_${product.variant_id || variantDetails?.id}`,
                    item_url: window.analyzify.getProductUrl(product?.handle || product?.item_handle) || null
                };

                analyzify.log('itemObj', 'an_gtag_ss', 'itemObj');
                analyzify.log(itemObj, 'an_gtag_ss', 'itemObj');
                return itemObj;
            } catch (error) {
                console.error("Error mapping item:", error);
            }
        };

        const handlePageView = async () => {
            try {
                // Check if page view already sent to prevent duplicates
                if (window.analyzify.ssPageViewSent) {
                    analyzify.log('Page view already sent, skipping duplicate', 'an_gtag_ss', 'handlePageView');
                    return;
                }

                // Always send page_view event - the send_SSEventData function will handle cart_attributes
                analyzify.log('Sending page_view event', 'an_gtag_ss', 'handlePageView');
                send_SSEventData({ eventName: "page_view" });
            } catch (error) {
                console.error("Error handling page_view:", error);
            }
        };

        const eventQueue = [];

        const processEventQueue = async () => {
            try {
                let processedCount = 0;
                const maxProcessLimit = 5;

                while (eventQueue.length > 0 && processedCount < maxProcessLimit) {
                    const queuedEvent = eventQueue.shift();
                    await send_SSEventData(queuedEvent);
                    processedCount++;
                }
            } catch (error) {
                console.error("Error processing event queue:", error);
            }
        };

        if (window.analyzify.consent_active) {
            window.analyzify.consentManager.queueConsentAction((initialConsent) => {

                analyzify.log('initialConsent', 'an_gtag_ss', 'AnalyzifyConsent');
                analyzify.log(initialConsent, 'an_gtag_ss', 'AnalyzifyConsent');
                analyzify.log('eventQueue (AnalyzifyConsent)', 'an_gtag_ss', 'AnalyzifyConsent');
                analyzify.log(eventQueue, 'an_gtag_ss', 'AnalyzifyConsent');

                const isGranted = initialConsent?.ad_storage === 'granted' && initialConsent?.analytics_storage === 'granted';
                if (isGranted) {
                    processEventQueue(); // Process queued events when consent is granted
                    analyzify.log('Consent updated (AnalyzifyConsent) with:', 'an_gtag_ss', 'AnalyzifyConsent');
                    analyzify.log(initialConsent, 'an_gtag_ss', 'AnalyzifyConsent');
                }
            });

            window.analyzify.consentManager.onChange((newConsent) => {
                const isGranted = newConsent?.ad_storage === 'granted' && newConsent?.analytics_storage === 'granted';
                if (isGranted) {
                    processEventQueue(); // Process queued events when consent is granted
                    analyzify.log('Consent updated (AnalyzifyConsent) with:', 'an_gtag_ss', 'AnalyzifyConsent');
                    analyzify.log(newConsent, 'an_gtag_ss', 'AnalyzifyConsent');
                }
            });
        } else {
            // Fallback for when the consent system is disabled entirely.
            processEventQueue(); // Process queued events when consent is granted
            analyzify.log('Consent updated (AnalyzifyConsent) with:', 'an_gtag_ss', 'AnalyzifyConsent');
            analyzify.log(true, 'an_gtag_ss', 'AnalyzifyConsent');
        }

        const send_SSEventData = async (eventObj, { immediate = false } = {}) => {
            try {
                const executeSend = async () => {
                    // Check if consent is given
                    const isConsentGiven = !window.analyzify.consent_active ||
                    (
                        window.analyzify.current_consent?.ad_storage === "granted" &&
                        window.analyzify.current_consent?.analytics_storage === "granted"
                    );

                    if (!isConsentGiven) {
                        analyzify.log(`Consent not given, event queued: ${eventObj.eventName}`, 'an_gtag_ss', 'send_SSEventData');
                        eventQueue.push(eventObj);
                        return;
                    }

                    const attributionMode = window.analyzify?.properties?.SERVERSIDE?.azfy_attribution;
                    const isDualMode = attributionMode === 'dual';
                    const isTrueMode = attributionMode === 'true' || attributionMode === true;
                    const isAttributionOrDualMode = isDualMode || isTrueMode;

                    // Process any queued events first (only if consent is given, skip for immediate/form events)
                    if (isConsentGiven && !immediate) {
                        await processEventQueue();
                    };

                    const buildCartDataFromAttributes = () => {

                        try {
                            // This function only runs in attribution/dual mode
                            const attrs = window.analyzify?.cart_attributes || {};
                            const cookies = attrs?.azfy_cookies_atr || {};
                            const clids = attrs?.azfy_clids_atr || {};

                            // Find GA4 session ID - look for keys starting with "ga_"
                            let gaSessionId = null;
                            for (const key in cookies) {
                                if (key.startsWith('ga_') && key !== 'ga') {
                                    gaSessionId = cookies[key];
                                    break;
                                }
                            }

                            return {
                                fbp: cookies.fbp || window.analyzify?.getCookieValue?.('_fbp') || null,
                                fbc: cookies.fbc || window.analyzify?.getCookieValue?.('_fbc') || null,
                                ttp: cookies.tt || window.analyzify?.getCookieValue?.('_ttp') || null,
                                ga: cookies.ga || window.analyzify?.getCookieValue?.('_ga') || null,
                                kx: cookies.kx || window.analyzify.decodeKlaviyoCookie?.url?.() || window.analyzify.decodeKlaviyoCookie?.cookie?.()?.$exchange_id || null,
                                gclid: clids.g || null,
                                fbclid: clids.fb || null,
                                ttclid: clids.tt || null,
                                sessionId: gaSessionId || null
                            };
                        } catch (_) { return null; }
                    };

                    let cartData = isAttributionOrDualMode ? buildCartDataFromAttributes() : (window.analyzify.unformattedCartDataObj || null);
                    // For immediate/form events, ensure cartData is not null to prevent errors
                    if (immediate) cartData = cartData || {};
                    // Determine measurementId (available to the retry handler)
                    let measurementId = null;
                    const computeMeasurementId = () => {
                        const getValue = (val) => val && val !== 'null' && val !== 'undefined' ? val : null;
                        const id = getValue(window?.analyzify_measurement_id) ||
                            getValue(window?.analyzify?.measurement_id) ||
                            getValue(window?.analyzify?.properties?.GA4?.primary?.id) ||
                            getValue(window?.analyzify?.properties?.SERVERSIDE?.measurement_id) ||
                            getValue(window?.analyzify_measurement_id_v3);
                        return id?.toString()?.trim() || null;
                    };
                    // For page_view and view_item events, make sure cart_attributes are loaded
                    if (["page_view", "view_item", ].includes(eventObj.eventName)) {
                        measurementId = computeMeasurementId();


                        // Check if cart_attributes is missing important parameters
                        const hasParams = window.analyzify.cart_attributes &&
                                        Object.keys(window.analyzify.cart_attributes).length > 0 && cartData

                        // If cart_attributes is empty or missing the key parameters, collect them
                        if (!hasParams) {
                            window.analyzify.log('Cart attributes not ready, collecting now', 'an_gtag_ss', 'send_SSEventData');
                            try {
                                await window.collectCartData(measurementId);
                                cartData = window.analyzify.unformattedCartDataObj || null;
                                window.analyzify.log('cartData', cartData, 'an_gtag_ss', 'send_SSEventData');
                            } catch (error) {
                                window.analyzify.log(`Error collecting cart data: ${error}`, 'an_gtag_ss', 'send_SSEventData');
                            }

                            window.analyzify.log('Cart attributes after collection:', 'an_gtag_ss', 'send_SSEventData');
                            window.analyzify.log(window.analyzify.cart_attributes, 'an_gtag_ss', 'send_SSEventData');
                        }
                    }
                    // Check platform status once (outside retry loop for efficiency) - with safety checks
                    const isFacebookEnabled = Boolean(window.analyzify?.properties?.FACEBOOK?.status);
                    const isTikTokEnabled = Boolean(window.analyzify?.properties?.TIKTOK?.status);
                    const isGAEnabled = Boolean(window.analyzify?.properties?.GA4?.status) || Boolean(window.analyzify?.properties?.GTM?.status) || Boolean(window.analyzify?.properties?.GADS?.status);

                    const urlParams = new URLSearchParams(window.location.search);
                    const hasFbClidinUrl = urlParams.has('fbclid');

                    // Determine what we need to wait for based on platform status and URL parameters
                    const needsFbp = isFacebookEnabled && !cartData?.fbp;
                    const needsFbc = hasFbClidinUrl && !cartData?.fbc;
                    const needsTtp = isTikTokEnabled && !cartData?.ttp;
                    const needsGa = isGAEnabled && !cartData?.ga;
                    const needsConsent = !window.analyzify.cart_attributes?.azfy_consent;

                    // Only wait if we need specific attributes or for certain events (skip for immediate/form events)
                    if (!immediate && (["page_view", "view_item", "search"].includes(eventObj.eventName) ||
                        (needsFbp || needsFbc || needsTtp || needsGa || needsConsent))) {

                        let retries = 0;
                        const maxRetries = 10;
                        const retryDelay = 500;

                        const waitForAttributes = () => {
                            return new Promise((resolve) => {
                                const checkAttributes = async () => {
                                    try {
                                        if (typeof window.collectCartData === 'function') {
                                            try {
                                                await window.collectCartData(measurementId);
                                            } catch (e) {
                                                window.analyzify.log(`Error re-collecting cart data in retry: ${e}`, 'an_gtag_ss', 'waitForAttributes');
                                            }
                                        }
                                        cartData = isAttributionOrDualMode ? buildCartDataFromAttributes() : window.analyzify.unformattedCartDataObj;

                                    } catch (error) {
                                        window.analyzify.log(`Error extracting cart attributes in retry: ${error}`, 'an_gtag_ss', 'waitForAttributes');
                                    }

                                    const hasFbp = cartData?.fbp;
                                    const hasFbc = cartData?.fbc;
                                    const hasTtp = cartData?.ttp;
                                    const hasCartId = window.analyzify.cart_id;
                                    const hasGa = cartData?.ga;
                                    const hasConsent = window.analyzify.cart_attributes?.azfy_consent;
                                    const fbpCondition = isFacebookEnabled ? hasFbp : true;
                                    const fbcCondition = hasFbClidinUrl ? hasFbc : true;
                                    const ttCondition = isTikTokEnabled ? hasTtp : true;
                                    const gaCondition = isGAEnabled ? hasGa : true;

                                    if ((fbpCondition && fbcCondition && gaCondition && hasConsent && ttCondition && hasCartId) || retries >= maxRetries) {
                                        window.analyzify.log(`Attributes ready: fbp=${!!hasFbp}(${isFacebookEnabled ? 'req' : 'opt'}), fbc=${!!hasFbc}(${hasFbClidinUrl ? 'req' : 'opt'}), ttp=${!!hasTtp}(${isTikTokEnabled ? 'req' : 'opt'}), ga=${!!hasGa}(${isGAEnabled ? 'req' : 'opt'}), cartId=${!!hasCartId}, consent=${!!hasConsent}, retries=${retries}`, 'an_gtag_ss', 'waitForAttributes');
                                        resolve();
                                    } else {
                                        retries++;
                                        window.analyzify.log(`Waiting retry ${retries}/${maxRetries}: fbp=${!!hasFbp}, fbc=${!!hasFbc}, ttp=${!!hasTtp}, ga=${!!hasGa}(${isGAEnabled ? 'req' : 'opt'}), cartId=${!!hasCartId}, consent=${!!hasConsent}`, 'an_gtag_ss', 'waitForAttributes');
                                        setTimeout(() => { checkAttributes(); }, retryDelay);
                                    }
                                };

                                checkAttributes();
                            });
                        };

                        await waitForAttributes();
                    }

                    const payload = {
                        version:"0.0.1",
                        eventName: eventObj.eventName,
                        actionSource: "website",
                        url: window?.location?.href || null,
                        title: document?.title || null,
                        device: {
                            screenResolution: `${window.screen.width}x${window.screen.height}`,
                            colors: "24-bit",
                            encoding: document.characterSet || "UTF-8",
                            language: navigator.language || "en-US",
                            viewportSize: `${window.innerWidth}x${window.innerHeight}`
                        },
                        userData: {
                            measurementId: (() => {
                                const getValue = (val) => val && val !== 'null' && val !== 'undefined' ? val : null;
                                const id = getValue(window?.analyzify_measurement_id) ||
                                getValue(window?.analyzify?.measurement_id) ||
                                getValue(window?.analyzify?.properties?.GA4?.primary?.id) ||
                                getValue(window?.analyzify?.properties?.SERVERSIDE?.measurement_id) ||
                                getValue(window?.analyzify_measurement_id_v3)
                                return id?.toString()?.trim() || null;
                            })(),
                            cartId: window.analyzify.cart_id || eventObj.cart_id || null,
                            id: window.analyzify.properties?.SERVERSIDE?.store_id || null,
                            storeId: window.analyzify.properties?.SERVERSIDE?.store_id || null,
                            fbp: cartData.fbp || null,
                            fbc: cartData.fbc || null,
                            eventId: eventObj.eventId || eventObj.event_id || window.analyzify.eventId.get(eventObj.eventName == "page_view" ? "default" : eventObj.eventName),
                            gclid: cartData.gclid || null,
                            ttclid: cartData.ttclid || null,
                            fbclid: cartData.fbclid || null,
                            ttp: cartData.ttp || null,
                            ga: cartData.ga || null,
                            kx: cartData.kx || null,
                            sessionId: cartData.sessionId || null,
                            email: window.analyzify.getEmail?.() || eventObj?.email_address || null,
                            phone: window.analyzify?.shopify_customer?.phone_number || null,
                            address: {
                                first_name: window.analyzify?.shopify_customer?.first_name || null,
                                last_name: window.analyzify?.shopify_customer?.last_name || null,
                            },
                            consent: isConsentGiven ||window.analyzify.cart_attributes?.azfy_consent || null
                        },
                        data: eventObj.ecomObj || {}
                    };

                    window.analyzify.log('Sending event:', 'an_gtag_ss', 'send_SSEventData');
                    window.analyzify.log(payload, 'an_gtag_ss', 'send_SSEventData');

                    if(!gtag_SSObj?.endpoint) {
                        return window.analyzify.log('Endpoint not found', 'an_gtag_ss', 'send_SSEventData');
                    }


                    const response = await fetch(gtag_SSObj.endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload),
                        ...(immediate ? { keepalive: true } : {})
                    });

                    window.analyzify.log('Response:', 'an_gtag_ss', 'send_SSEventData');
                    window.analyzify.log(response, 'an_gtag_ss', 'send_SSEventData');

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    return response;
                };

                if (immediate) {
                    await executeSend();
                } else {
                    setTimeout(executeSend, 500);
                }
            } catch (error) {
                console.error("Error sending event:", error);
                throw error;
            }
        };

        // Define ssCartUpdateFailureEvent after send_SSEventData
        window.analyzify.ssCartUpdateFailureEvent = function (details) {
          try {
            if (!window.analyzify?.properties?.SERVERSIDE?.sendCartUpdateDebug) {
              return;
            }
            const srv = window.analyzify?.properties?.SERVERSIDE || {};
            const endpoint = srv.testEndpoint;
            if (!endpoint) {
              return window.analyzify.log('SS endpoint not configured', 'an_gtag_ss', 'ssCartUpdateFailureEvent');
            }

            const nowIso = new Date().toISOString();
            const traceId = details?.trace_id || window.analyzify.generateEventId('tr', '', `${Date.now()}`);
            const sessionId = (window.analyzify.storageService && window.analyzify.storageService('sessionId')) || null;

            const consent = window.analyzify?.current_consent || {};
            const toBool = (v) => v === 'granted' || v === true;

            const payload = {
              eventName: details?.eventName || 'cart_update_failure',
              actionSource: 'website',
              url: window?.location?.href || null,
              title: document?.title || null,
              device: {
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                colors: '24-bit',
                encoding: document.characterSet || 'UTF-8',
                language: navigator.language || 'en-US',
                viewportSize: `${window.innerWidth}x${window.innerHeight}`
              },
              userData: {
                user_agent: navigator.userAgent || null,
                id: window.analyzify.properties?.SERVERSIDE?.store_id || null,
                eventId: details?.eventId || (window.analyzify?.generateEventId && window.analyzify.generateEventId('ev','cart_update_failure', String(Date.now()))) || traceId || null,
              },
              data: {
                consent: {
                    analytics_storage: toBool(consent.analytics_storage),
                    ad_storage: toBool(consent.ad_storage),
                    ad_user_data: toBool(consent.ad_user_data),
                    ad_personalization: toBool(consent.ad_personalization)
                  },
                azfy_cart_id: window.analyzify?.cart_id || null,
                shop_domain: srv?.shop_domain || null,
                session_id: details?.session_id || sessionId,
                trace_id: traceId,
                request_url_path: details?.request_url_path || '/cart/update.js',
                method: details?.method || 'POST',
                body_size_bytes: Number(details?.body_size_bytes) || null,
                attempt_number: Number(details?.attempt_number) || 1,
                timeout_ms: Number(details?.timeout_ms) || null,
                status_code: typeof details?.status_code !== 'undefined' ? Number(details.status_code) : null,
                error_category: details?.error_category || null,
                error_message_sanitized: details?.error_message_sanitized || null,
                duration_ms: Number(details?.duration_ms) || null,
                // Runtime diagnostics for debugging
                transport_hint: details?.transport || null, // optional hint from caller
                page_url: window?.location?.href || null,
                referrer: document?.referrer || null,
                visibility_state: document?.visibilityState || null,
                online: typeof navigator?.onLine === 'boolean' ? navigator.onLine : null,
                locale: navigator.language || null,
                timezone_offset: new Date().getTimezoneOffset(),
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                sdk_env: window.analyzify?.testing_environment ? 'staging' : 'production',
                reported_at: details?.reported_at || nowIso,
                // Extra env signals
                origin: window?.location?.origin || null,
                is_top_level: (function(){ try { return window.top === window; } catch(_) { return null; } })(),
                fetch_is_native: (function(){ try { return /\[native code\]/.test(String(window.fetch)); } catch(_) { return null; } })(),
                beacon_supported: (function(){ try { return typeof navigator.sendBeacon === 'function'; } catch(_) { return null; } })(),
                sw_active: (function(){ try { return !!(navigator.serviceWorker && navigator.serviceWorker.controller); } catch(_) { return null; } })(),
                sw_registration: (async function(){ try { const regs = await navigator.serviceWorker.getRegistrations(); const r = regs && regs[0]; return r && r.scope ? r.scope : null; } catch(_) { return null; } })(),
                connection: (function(){
                  try {
                    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                    if (!c) return null;
                    return {
                      type: c.type || null,
                      effectiveType: c.effectiveType || null,
                      rtt: typeof c.rtt === 'number' ? c.rtt : null,
                      downlink: typeof c.downlink === 'number' ? c.downlink : null,
                      saveData: !!c.saveData
                    };
                  } catch(_) { return null; }
                })(),
                cookies_enabled: (function(){ try { return !!navigator.cookieEnabled; } catch(_) { return null; } })(),
                cookie_len: (function(){ try { return (document.cookie || '').length; } catch(_) { return null; } })()
              }
            };

            const bodyStr = JSON.stringify(payload);
            let sent = false;
            try {
              if (navigator.sendBeacon) {
                const blob = new Blob([bodyStr], { type: 'application/json' });
                sent = navigator.sendBeacon(endpoint, blob);
              }
            } catch (_) {}
            if (!sent) {
              try {
                fetch(endpoint, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                  body: bodyStr,
                  keepalive: true,
                  mode: 'no-cors',
                  credentials: 'omit'
                }).catch(() => {});
              } catch (_) {}
            }

            window.analyzify.log('cart_update_failure event emitted', 'an_gtag_ss', 'ssCartUpdateFailureEvent');
          } catch (error) {
            window.analyzify.log(error, 'an_gtag_ss', 'ssCartUpdateFailureEvent');
          }
        };

        // view_item
        window.analyzify.ssViewItem = async (productObj, variantId) => {
            try {
                if (!productObj) return analyzify.log("Product object is not found", 'an_gtag_ss', 'ssViewItem');
                if (!gtag_SSObj?.events?.view_item) return analyzify.log('View item event not found', 'an_gtag_ss', 'ssViewItem');
                let { product, variant } = productObj;

                if(!product) product = productObj;

                analyzify.log('ssViewItem', 'an_gtag_ss', 'ssViewItem');
                analyzify.log(product, 'an_gtag_ss', 'ssViewItem');
                analyzify.log(`variantId: ${variantId}`, 'an_gtag_ss', 'ssViewItem');

                const firstVariant = window.analyzify.getFirstVariant(product);
                const variantDetails = window.analyzify.getVariantDetails(product?.variants, variantId || variant?.id || firstVariant?.id);
                const price = variantDetails?.price || window.analyzify.formatPrice(product.price, true);

                const rawImg = variantDetails?.featured_image || product?.featured_image || product?.images?.[0] || null;
                const image_url = window.analyzify.normalizeImageUrl(!rawImg ? null : (typeof rawImg === "string" ? rawImg : (rawImg.src || rawImg.url || null)));

                // Always send view_item event - the send_SSEventData function will handle cart_attributes
                analyzify.log('Sending view_item event', 'an_gtag_ss', 'ssViewItem');
                send_SSEventData({
                    eventName: "view_item",
                    ecomObj: {
                        currency: window.analyzify?.currency,
                        value: price || 0,
                        items: [{ ...gaItemMapper(product, variantDetails), image_url }]
                    }
                });
            } catch (error) {
                console.error("Error processing server-side view_item:", error);
            }
        };

        // view_item_list
        window.analyzify.ssViewItemList = (collectionObj, eventId) => {
            try {
                if (!collectionObj) return analyzify.log("Collection object is not found", 'an_gtag_ss', 'ssViewItemList');
                if (!gtag_SSObj?.events?.view_item_list) return analyzify.log('view_item_list event not enabled', 'an_gtag_ss', 'ssViewItemList');

                analyzify.log('ssViewItemList', 'an_gtag_ss', 'ssViewItemList');
                analyzify.log(collectionObj, 'an_gtag_ss', 'ssViewItemList');

                send_SSEventData({
                    eventName: "view_item_list",
                    eventId: eventId,
                    ecomObj: {
                        currency: window.analyzify?.currency,
                        collection: {
                            id: collectionObj.id,
                            handle: collectionObj.handle,
                            title: collectionObj.title,
                            url: window.location.href,
                            item_count: collectionObj.products?.length || 0
                        }
                    }
                });
            } catch (error) {
                console.error("Error processing server-side view_item_list:", error);
            }
        };

        // Event handlers
        window.analyzify.ssAddToCart = (productObj, variantId, eventId) => {
            try {
                if (!productObj) return analyzify.log("Product object is not found", 'an_gtag_ss', 'ssAddToCart');
                if (!gtag_SSObj?.events?.add_to_cart) return analyzify.log('Add to cart event not found', 'an_gtag_ss', 'ssAddToCart');

                let { product, variant } = productObj;

                if(!product) product = productObj;

                const firstVariant = window.analyzify.getFirstVariant(product);
                const variantDetails = window.analyzify.getVariantDetails(product?.variants, variantId || variant?.id || firstVariant?.id);
                const prodQty = analyzify.findQuantity() || product?.quantity || 1;
                const price = variantDetails?.price || window.analyzify.formatPrice(product.price, true);
                const value = Number(parseFloat((price * prodQty).toFixed(2)));

                analyzify.log('ssAddToCart', 'an_gtag_ss', 'ssAddToCart');
                analyzify.log(product, 'an_gtag_ss', 'ssAddToCart');
                analyzify.log(`variantId: ${variantId}`, 'an_gtag_ss', 'ssAddToCart');
                analyzify.log(`prodQty: ${prodQty}`, 'an_gtag_ss', 'ssAddToCart');
                analyzify.log(`price: ${price}`, 'an_gtag_ss', 'ssAddToCart');
                analyzify.log(`value: ${value}`, 'an_gtag_ss', 'ssAddToCart');

                send_SSEventData({
                    eventName: "add_to_cart",
                    ecomObj: {
                        currency: window.analyzify?.currency,
                        value: value || 0,
                        items: [gaItemMapper(product, variantDetails)]
                    },
                    eventId: eventId // Pass the eventId along
                });
            } catch (error) {
                console.error("Error processing server-side add_to_cart:", error);
            }
        };

        // begin_checkout
        window.analyzify.ssBeginCheckout = (cart, eventId) => {
            try {
                if (!cart?.items) return analyzify.log('Cart items not found', 'an_gtag_ss', 'ssBeginCheckout');
                if (!gtag_SSObj?.events?.begin_checkout) return analyzify.log('Begin checkout event not found', 'an_gtag_ss', 'ssBeginCheckout');

                analyzify.log('ssBeginCheckout', 'an_gtag_ss', 'ssBeginCheckout');
                analyzify.log(cart, 'an_gtag_ss', 'ssBeginCheckout');

                send_SSEventData({
                    eventName: "begin_checkout",
                    ecomObj: {
                        currency: window.analyzify?.currency,
                        value: window.analyzify.formatPrice(cart?.total_price, true),
                        items: cart?.items?.map(item => gaItemMapper(item)) || [],
                        checkout_url: window.analyzify.buildCartPermalink?.(cart) || null
                    },
                    eventId: eventId // Pass the eventId along
                });
            } catch (error) {
                console.error("Error processing server-side begin_checkout:", error);
            }
        };

        // search
        window.analyzify.ssSearch = (searchObj) => {
            try {
                const { term, resultsCount, searchPerformed, products} = searchObj;
                analyzify.log('ssSearch', 'an_gtag_ss', 'ssSearch');
                analyzify.log(`searchTerm: ${term}`, 'an_gtag_ss', 'ssSearch');

                send_SSEventData({
                    eventName: "search",
                    ecomObj: {
                        search_term: term,
                        // results_count: resultsCount,
                        // search_performed: searchPerformed,
                        // items: searchPerformed && resultsCount > 0 ? products?.map(item => gaItemMapper(item)) : []
                    },
                });
            } catch (error) {
                console.error("Error processing server-side search:", error);
            }
        };

        // page_view (SPA navigation)
        window.analyzify.ssPageView = (eventId) => {
            try {
                // Reset all cached event IDs for the new page context
                if (typeof window.analyzify.eventId?.resetAll === 'function') {
                    window.analyzify.eventId.resetAll();
                }
                analyzify.log('ssPageView', 'an_gtag_ss', 'ssPageView');
                send_SSEventData({ eventName: "page_view", eventId: eventId || window.analyzify.eventId.get('default') });
            } catch (error) {
                console.error("Error processing server-side page_view:", error);
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

              if(!gtag_SSObj?.all_forms) return;

              // SHOPIFY FORM SUBMITTED
              analyzify.log(gtag_SSObj, 'an_gtag_ss', 'forms: gtag_SSObj');
              if(gtag_SSObj?.events?.generate_lead){
                window.addEventListener("azfy:shopify:form_submitted", async (event) => {
                  try {
                    const evDetail = event.detail;
                    const email = evDetail.payload['contact_email'];
                    const hashedEmail = await window.analyzify?.hashUserData({
                        email_address: email
                    });

                    analyzify.log(evDetail, 'an_gtag_ss', 'shopifyFormSubmitted');
                    if(
                      event.type === "azfy:shopify:form_submitted" &&
                      evDetail.name === "shopify:form_submitted"
                    ){
                    const tags = (evDetail.payload['contact_tags'] || evDetail.payload['customer_tags'] || '').toLowerCase();
                    if (['newsletter', 'prospect'].some(tag => tags.includes(tag))) {

                        const formObj = {
                            method: 'shopify:newsletter',
                            form_source: 'shopify_native',
                            cart_id: window.analyzify?.cart_id || null,
                            event_id: window.analyzify.eventId.get('generate_lead') || null,
                            email_address: email,
                            sha256_email_address: hashedEmail?.email_address,
                            ...evDetail.payload
                        };
                        send_SSEventData({
                            eventName: "generate_lead",
                            ...formObj
                        }, { immediate: true });
                        analyzify.log(formObj, 'an_gtag_ss', 'newsletactForm');
                      } else if(evDetail.payload["form_type"] === "customer_login"){
                        const formObj = {
                            method: 'shopify:customer_login',
                            form_source: 'shopify_native',
                            cart_id: window.analyzify?.cart_id || null,
                            event_id: window.analyzify.eventId.get('generate_lead') || null,
                            email_address: email,
                            sha256_email_address: hashedEmail?.email_address,
                            ...evDetail.payload
                        };
                        send_SSEventData({
                            eventName: "generate_lead",
                            ...formObj
                        }, { immediate: true });
                        analyzify.log(formObj, 'an_gtag_ss', 'customerLogin');
                      } else if(evDetail.payload["form_type"] === "create_customer"){
                        const formObj = {
                            method: 'shopify:customer_register',
                            form_source: 'shopify_native',
                            cart_id: window.analyzify?.cart_id || null,
                            event_id: window.analyzify.eventId.get('generate_lead') || null,
                            email_address: email,
                            sha256_email_address: hashedEmail?.email_address,
                            ...evDetail.payload
                        };
                        send_SSEventData({
                            eventName: "generate_lead",
                            ...formObj
                        }, { immediate: true });
                        analyzify.log(formObj, 'an_gtag_ss', 'customerRegister');
                      } else if(evDetail.payload["form_type"] === "contact_form" || evDetail.payload["form_type"] === "contact"){
                        const formObj = {
                            method: 'shopify:contact_form',
                            form_source: 'shopify_native',
                            cart_id: window.analyzify?.cart_id || null,
                            event_id: window.analyzify.eventId.get('generate_lead') || null,
                            email_address: email,
                            sha256_email_address: hashedEmail?.email_address,
                            ...evDetail.payload
                        };
                        send_SSEventData({
                            eventName: "generate_contact",
                            ...formObj
                        }, { immediate: true });
                        analyzify.log(formObj, 'an_gtag_ss', 'contactForm');
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
                    const email = evDetail.payload['contact_email'] || evDetail.payload['email'];

                    const formObj = {
                        method: 'klaviyo:form_submitted',
                        form_source: 'klaviyo',
                        cart_id: window.analyzify?.cart_id || null,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        email_address: email,
                        ...evDetail.payload
                    };
                    send_SSEventData({
                        eventName: "generate_lead",
                        ...formObj
                    }, { immediate: true });
                    analyzify.log(formObj, 'an_gtag_ss', 'klaviyoForm');
                  } catch (error) {
                    console.error("Error processing klaviyo:form_submitted:", error);
                  }
                });

                // HUBSPOT FORMS
                window.addEventListener("azfy:hubspot:form_submitted", (event) => {
                  try {
                    const evDetail = event.detail;
                    const email = evDetail.payload['contact_email'] || evDetail.payload['email'];

                    const formObj = {
                        method: 'hubspot:form_submitted',
                        form_source: 'hubspot',
                        cart_id: window.analyzify?.cart_id || null,
                        email_address: email,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        ...evDetail.payload
                    };
                    send_SSEventData({
                        eventName: "generate_lead",
                        ...formObj
                    }, { immediate: true });
                    analyzify.log(formObj, 'an_gtag_ss', 'hubspotFormSubmitted');
                  } catch (error) {
                    console.error("Error processing hubspot:form_submitted:", error);
                  }
                });

                // JOTFORM FORMS
                window.addEventListener("azfy:jotform:form_submitted", (event) => {
                  try {
                    const evDetail = event.detail;
                    const formObj = {
                        method: 'jotform:form_submitted',
                        form_source: 'jotform',
                        cart_id: window.analyzify?.cart_id || null,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        ...evDetail.payload
                    };
                    send_SSEventData({
                        eventName: "generate_lead",
                        ...formObj
                    }, { immediate: true });
                    analyzify.log(formObj, 'an_gtag_ss', 'jotformFormSubmitted');
                  } catch (error) {
                    console.error("Error processing jotform:form_submitted:", error);
                  }
                });

                // HULK FORM BUILDER FORMS
                window.addEventListener("azfy:hulkformbuilder:form_submitted", (event) => {
                  try {
                    const evDetail = event.detail;
                    const formObj = {
                        method: 'hulkformbuilder:form_submitted',
                        form_source: 'hulkformbuilder',
                        cart_id: window.analyzify?.cart_id || null,
                        event_id: window.analyzify.eventId.get('generate_lead') || null,
                        ...evDetail.payload
                    };
                    send_SSEventData({
                        eventName: "generate_lead",
                        ...formObj
                    }, { immediate: true });
                    analyzify.log(formObj, 'an_gtag_ss', 'hulkFormSubmitted');
                  } catch (error) {
                    console.error("Error processing hulkformbuilder:form_submitted:", error);
                  }
                });
              }
            } catch (error) {
              console.error("Error processing forms:", error);
            }
          })();

        // Initialize page view tracking
        // new MutationObserver(() => {
        //     const url = location.href;
        //     if (url !== lastUrl) {
        //         lastUrl = url;
        //         handlePageView();
        //     }
        // }).observe(document, { subtree: true, childList: true });

        let lastUrl = location.href;

        // Add deduplication flag for page view events
        if (!window.analyzify.ssPageViewSent) {
            handlePageView();
            window.analyzify.ssPageViewSent = true;
        }

        if (window.analyzify.op_cart_data_collection && !window.analyzify.checksendcartdata_status) {
            window.analyzify_checksendcartdata();
        }

        switch (window.analyzify.shopify_template) {
            case "product":
                window.analyzify.ssViewItem(window.analyzify.getProductObj?.product, window.analyzify.getProductObj?.variant?.id);
                break;
            case "collection":
                window.analyzify.ssViewItemList(window.analyzify.getCollectionObj);
                break;
            case "search":
                window.analyzify.ssSearch(window.analyzify.getSearchObj);
                break;
            //..
        }

        // Event listener for consent changes (supports both builder and SDK formats)
        document.addEventListener('AnalyzifyConsent', (e) => {
            try {
                const consent = e.detail?.consent || e.detail;
                if (consent?.ad_storage === "granted" && consent?.analytics_storage === "granted") {
                    processEventQueue();
                }
            } catch (error) {
                console.error("Error processing consent changes:", error);
            }
        });
    } catch (error) {
        console.error("Error initializing GTAG_SS:", error);
    }
};

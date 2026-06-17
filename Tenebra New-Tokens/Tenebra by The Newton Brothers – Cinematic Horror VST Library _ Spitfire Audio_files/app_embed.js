window.analyzify.appStartSection1 = () => {
    try {

        window.analyzify = window.analyzify || {};

        analyzify.log('appStartSection1 initialized', 'app_embed');

        if (window.analyzify.shopify_template == 'collection') {

        } else if (window.analyzify.shopify_template == "product") {
          setTimeout(() => {
            try {
              const getVariantOptions = document.querySelector(window.analyzify.attributes.variant_options.class.join(","));
              analyzify.log(getVariantOptions, 'app_embed', 'getVariantOptions');
          
              if (getVariantOptions !== null) {

                // Add debounce to prevent multiple rapid calls
                let lastCallTime = 0;
                const DEBOUNCE_DELAY = 100; // milliseconds
                let currentVariantId = window.analyzify.getCurrentVariant();
                let firstRun = false;
                analyzify.log('currentVariantId in appStartSection1', currentVariantId, 'app_embed', 'appStartSection1');

                window.analyzify.handleVariantChange = (source) => {
                  try {
                    analyzify.log('handleVariantChange triggered by:', source, 'app_embed', 'appStartSection1');
                
                    const now = Date.now();
                    if (now - lastCallTime < DEBOUNCE_DELAY) {
                      analyzify.log('Skipping call due to debounce; too soon after last call.', 'app_embed', 'appStartSection1');
                      return;
                    }
                    lastCallTime = now;
                
                    const variantData = window.analyzify.getCurrentVariant();
                    
                    if (!variantData?.id) {
                      analyzify.log('Variant ID not found in variantData.', 'app_embed', 'handleVariantChange');
                      return;
                    }
                
                    analyzify.log('Current variantData ID:', variantData.id, '| Previously processed currentVariantId:', currentVariantId, 'app_embed', 'handleVariantChange');
                
                    // If the fetched variant ID is the same as the one we've already processed,
                    // it means this event is for the same variant state, so we don't need to fire again.
                    if (variantData.id === currentVariantId) {
                      analyzify.log('Variant ID is the same as the current. No new change to process.', 'app_embed', 'handleVariantChange');
                      return;
                    }
                
                    // If we're here, it's a genuinely new variant ID. Update currentVariantId.
                    currentVariantId = variantData.id;
                    analyzify.log('New variant ID detected. Updating currentVariantId to:', currentVariantId, 'app_embed', 'handleVariantChange');
                
                    // Fire Google Analytics event if the function exists
                    if (typeof window.analyzify.gaVariantChange === 'function') {
                      window.analyzify.gaVariantChange(variantData);
                    } else {
                      analyzify.log('gaVariantChange function not available.', 'app_embed', 'handleVariantChange');
                    }
                
                    // Fire GTM event if the function exists
                    if (typeof window.analyzify.gtmVariantChange === 'function') {
                      window.analyzify.gtmVariantChange(variantData);
                    } else {
                      analyzify.log('gtmVariantChange function not available.', 'app_embed', 'handleVariantChange');
                    }
                
                    analyzify.log(`Variant change processed successfully from ${source}. New variant ID: ${currentVariantId}`, 'app_embed', 'handleVariantChange');
                    analyzify.log('Variant data:', variantData, 'app_embed', 'handleVariantChange');
                
                  } catch (error) {
                    console.error("Error processing variant change in handleVariantChange:", error);
                  }
                };
          
                // Listen for both DOM changes and URL changes
                getVariantOptions.addEventListener("change", () => {
                  try {
                    window.analyzify.handleVariantChange('DOM change');
                    analyzify.log('Variant changed from DOM change', 'app_embed', 'appStartSection1');
                  } catch (error) {
                    console.error("Error processing variant change:", error);
                  }
                });
                    
                // Listen for URL changes
                window.addEventListener('popstate', () => {
                  try {
                    window.analyzify.handleVariantChange('URL change');
                    analyzify.log('Variant changed from URL change', 'app_embed', 'appStartSection1');
                  } catch (error) {
                    console.error("Error processing variant change:", error);
                  }
                });
                    
                // Monitor pushState/replaceState
                const originalPushState = history.pushState;
                history.pushState = function() {
                  try {
                    originalPushState.apply(this, arguments);
                    window.analyzify.handleVariantChange('pushState');
                    analyzify.log('Variant changed from pushState', 'app_embed', 'appStartSection1');
                  } catch (error) {
                    console.error("Error processing variant change:", error);
                  }
                };
          
                const originalReplaceState = history.replaceState;
                history.replaceState = function() {
                  try {
                    originalReplaceState.apply(this, arguments);
                    window.analyzify.handleVariantChange('replaceState');
                    analyzify.log('Variant changed from replaceState', 'app_embed', 'appStartSection1');
                  } catch (error) {
                    console.error("Error processing variant change:", error);
                  }
                };
                  
              } else {
                analyzify.log('getVariantOptions not found', 'app_embed', 'appStartSection1');
              }
              analyzify.log('Analyzify is ready.', 'app_embed', 'appStartSection1');

            } catch (error) {
              console.error("Error setting up variant change tracking:", error);
            }
          }, 2000);
        }

        window.analyzify.initial_load.app_embed = true;

    } catch (error) {
        console.error("Error processing appStartSection1:", error);
    }
};
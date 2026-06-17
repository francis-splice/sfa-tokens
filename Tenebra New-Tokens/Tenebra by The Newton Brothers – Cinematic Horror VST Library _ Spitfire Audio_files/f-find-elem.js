/* eslint-disable no-undef */
window.analyzify.checkUpdatedCart = (send) => {
  try {
    let currentCartItems = [];
    const props = window.analyzify.properties;
    fetch("/cart.js")
      .then((response) => response.json())
      .then((cart) => {
        currentCartItems = cart.items;
        let addedItems = currentCartItems.filter(
          (item) =>
            !previousCartItems.some((prevItem) => prevItem.id === item.id),
        );

        let removedItems = previousCartItems.filter(
          (prevItem) => !currentCartItems.some((item) => item.id.toString() === prevItem.id.toString()),
        );

        let quantityIncreasedItems = [];
        let quantityDecreasedItems = [];
        previousCartItems.forEach((prevItem) => {
          let currentItem = currentCartItems.find(
            (item) => item.id.toString() === prevItem.id.toString(),
          );
          if (currentItem && currentItem.quantity !== prevItem.quantity) {
            let quantityDiff = currentItem.quantity - prevItem.quantity;
            currentItem.changeType = quantityDiff > 0 ? "Artan" : "Azalan";
            currentItem.quantityDiff = Math.abs(quantityDiff);
            if (quantityDiff > 0) {
              quantityIncreasedItems.push(currentItem);
            } else {
              quantityDecreasedItems.push(currentItem);
            }
          }
        });

        let totalIncreasedQuantity = quantityIncreasedItems.reduce(
          (total, item) => total + item.quantityDiff,
          0,
        );

        let totalDecreasedQuantity = quantityDecreasedItems.reduce(
          (total, item) => total + item.quantityDiff,
          0,
        );

        function sendEachItem(items, eventName, changedQuantity) {
          if (items.length >= 1) {
            // Get current eventId if we're in an ecommerce event context
            const eventId = window.analyzify?.getCurrentEcommerceEventId?.() || null;
            
            items.forEach((item) => {
              const quantityToSend = changedQuantity !== undefined ? changedQuantity : item.quantity;
              if (eventName === "add_to_cart") {
                if (props.GA4.status || props.GADS.status) {
                  analyzify.gaAddToCart({ ...item, quantity: quantityToSend }, null, eventId);
                }
                if (props.SERVERSIDE.status) {
                  analyzify.ssAddToCart({ ...item, quantity: quantityToSend }, null, eventId);
                }
              } else if (eventName === "remove_from_cart") {
                if (props.GA4.status || props.GADS.status) {
                  analyzify.gaRemoveFromCart({
                    ...item,
                    quantity: quantityToSend,
                  }, eventId);
                }
                if (props.GTM.status) {
                  //ACTUAL CHECK WAS  {% if app.metafields.analyzify.gtm_dataLayer %}
                  analyzify.gtmRemoveFromCart({
                    ...item,
                    quantity: quantityToSend,
                  }, eventId);
                }
              }
            });
          }
        }

        if (send) {
          sendEachItem(addedItems, "add_to_cart");
          
          // Wrap remove from cart calls in ecommerce event context
          if (removedItems.length > 0) {
            window.analyzify.withEcommerceEventContext('remove_from_cart', () => {
              sendEachItem(removedItems, "remove_from_cart");
            });
          }
          
          sendEachItem(
            quantityIncreasedItems,
            "add_to_cart",
            totalIncreasedQuantity,
          );
          
          // Wrap quantity decreased (remove from cart) calls in ecommerce event context
          if (quantityDecreasedItems.length > 0) {
            window.analyzify.withEcommerceEventContext('remove_from_cart', () => {
              sendEachItem(
                quantityDecreasedItems,
                "remove_from_cart",
                totalDecreasedQuantity,
              );
            });
          }
        }
        previousCartItems = currentCartItems;
      });
  } catch (error) {
    console.error("Error processing checkUpdatedCart:", error);
  }
};

document.addEventListener("click", (event) => {
  const props = window.analyzify.properties;

  let ga4_atc_elem = null;
  let ga4_wishlist_elem = null;
  let ga4_col_prod_click_elem = null;
  let ga4_coll_atc_elem = null;
  let ga4_search_prod_click_elem = null;
  let ga4_index_select_item_elem = null;
  let ga4_search_atc_elem = null;
  let ga4_index_prod_click_elem = null;

  let path = event.path || (event.composedPath && event.composedPath());
  const ga4_checkout_elem = analyzify.findElemInPath(
    path,
    analyzify.checkout_btn_attributes,
  );
  const ga4_rfc_elem = analyzify.findElemInPath(
    path,
    analyzify.removefromcart_btn_attributes,
  );
  const header_nav_btn_elem = analyzify.findElemInPath(
    path,
    analyzify.header_nav_btn_attributes,
  );
  const disclosure_elem = analyzify.findElemInPath(
    path,
    analyzify.disclosure_attributes,
  );
  const accordion_summary_elem = analyzify.findElemInPath(
    path,
    analyzify.accordion_summary_attributes,
  );
  const hero_banner_area_elem = analyzify.findElemInPath(
    path,
    analyzify.hero_banner_area_attributes,
  );

  if (window.analyzify.shopify_template == "product") {
    ga4_atc_elem = analyzify.findElemInPath(
      path,
      analyzify.addtocart_btn_attributes,
    );
    // If findElemInPath matched a <form> (not an actual button), verify the click target
    if (ga4_atc_elem !== null && ga4_atc_elem.tagName === 'FORM') {
      const isButtonClick = event.target.closest('button, input[type="submit"], input[type="image"]');
      if (!isButtonClick) {
        ga4_atc_elem = null;
      }
    }
    ga4_wishlist_elem = analyzify.findElemInPath(
      path,
      analyzify.wishlist_btn_attributes,
    );
  } else if (window.analyzify.shopify_template == "collection") {
    ga4_wishlist_elem = analyzify.findElemInPath(
      path,
      analyzify.wishlist_btn_attributes,
    );
    ga4_col_prod_click_elem = analyzify.findElemInPath(
      path,
      analyzify.collection_prod_click_attributes,
    );
    ga4_coll_atc_elem = analyzify.findElemInPath(
      path,
      analyzify.collection_atc_attributes,
    );
  } else if (window.analyzify.shopify_template == "search") {
    ga4_search_prod_click_elem = analyzify.findElemInPath(
      path,
      analyzify.search_prod_click_attributes,
    );
    ga4_search_atc_elem = analyzify.findElemInPath(
      path,
      analyzify.addtocart_btn_attributes,
    );
  } else if (window.analyzify.shopify_template == "index" || window.analyzify.shopify_template == "page") {
    ga4_index_prod_click_elem = analyzify.findElemInPath(
      path,
      analyzify.addtocart_btn_attributes,
    );
    ga4_index_select_item_elem = analyzify.findElemInPath(
      path,
      analyzify.collection_prod_click_attributes,
    );
  }

  if (window.analyzify.shopify_template == "product") {
    
    const getProduct = window.analyzify.getProductObj;

    if (!getProduct) return analyzify.log('Product object is not found', 'f-find-elem', 'product');

    if (ga4_atc_elem !== null) {
      let currentVariant = window.analyzify.getVariantInput(
        ga4_atc_elem.closest("form"),
      );
      
      // Wrap all add to cart events in ecommerce event context for consistent eventId
      window.analyzify.withEcommerceEventContext('add_to_cart', (eventId) => {
        if ((props.GA4.status || props.GADS.status) && typeof window.analyzify.gaAddToCart === 'function') {
          window.analyzify.gaAddToCart(getProduct, currentVariant, eventId);
        }
        if (props.FACEBOOK.status) {
          window.analyzify.fbAddToCart(getProduct, currentVariant, eventId);
        }
        if (props.SNAPCHAT.status) {
          window.analyzify.snapchatAddToCart(getProduct, currentVariant, eventId);
        }
        if (props.SERVERSIDE.status) {
          window.analyzify.ssAddToCart(getProduct, currentVariant, eventId);
        }
        if (props.BING.status) {
          window.analyzify.bingAddtoCart(getProduct, currentVariant, eventId);
        }
        if (props.CLARITY.status) {
          window.analyzify.clarityAddToCart(eventId);
        }
        if (props.HOTJAR.status) {
          window.analyzify.hotjarAddToCart(eventId);
        }
        if (props.X.status) {
          window.analyzify.xAddtoCart(getProduct, currentVariant, eventId);
        }
        if (props.CRITEO.status) {
          window.analyzify.criteoAddToCart(getProduct, currentVariant, eventId);
        }
        if (props.PINTEREST.status) {
          window.analyzify.pinterestAddtoCart(
            getProduct,
            currentVariant,
            eventId
          );
        }
        if (props.KLAVIYO.status) {
          window.analyzify.klaviyoAddToCart(getProduct, currentVariant, eventId);
        }
        if (props.TIKTOK.status) {
          window.analyzify.ttAddToCart(getProduct, currentVariant, eventId);
        }
        if (props.GTM.status) {
          window.analyzify.gtmAddToCart(getProduct, currentVariant, eventId);
        }
      });

    } else if (ga4_wishlist_elem !== null) {

      let currentVariant = window.analyzify.getVariantInput(
        ga4_wishlist_elem.closest("form"),
      );

      // Wrap all add to wishlist events in ecommerce event context for consistent eventId
      window.analyzify.withEcommerceEventContext('add_to_wishlist', (eventId) => {
        if (props.GA4.status || props.GADS.status) {
          analyzify.gaAddToWishlist(getProduct);
        }
        if (props.FACEBOOK.status) {
          analyzify.fbAddWishList(getProduct, currentVariant);
        }
        if (props.CLARITY.status) {
          analyzify.clarityAddToWishlist();
        }
        if (props.HOTJAR.status) {
          analyzify.hotjarAddToWishlist();
        }
        if (props.GTM.status) {
          //ACTUAL CHECK WAS  {% if app.metafields.analyzify.gtm_dataLayer %}
          analyzify.gtmAddToWishList(getProduct, currentVariant);
        }
        if (props.KLAVIYO.status) {
          analyzify.klaviyoAddToWishlist(getProduct, currentVariant);
        }
      });

    } else if (ga4_atc_elem == null && analyzify.global_atc_functions.length) {

      analyzify.global_atc_functions.forEach(function (fname) {
        window.addEventListener(fname, function (e) {
          let currentVariant = window.analyzify.getVariantInput(
            analyzify.foundAtcElementForms[0],
          );
          
          // Wrap all add to cart events in ecommerce event context for consistent eventId
          window.analyzify.withEcommerceEventContext('add_to_cart', (eventId) => {
            if ((props.GA4.status || props.GADS.status) && typeof window.analyzify.gaAddToCart === 'function') {
              window.analyzify.gaAddToCart(getProduct, currentVariant, eventId);
            }
            if (props.SERVERSIDE.status) {
              analyzify.ssAddToCart(getProduct, currentVariant, eventId);
            }
            if (props.FACEBOOK.status) {
              analyzify.fbAddToCart(getProduct, currentVariant, eventId);
            }
            if (props.SNAPCHAT.status) {
              analyzify.snapchatAddToCart(getProduct, currentVariant, eventId);
            }
            if (props.BING.status) {
              analyzify.bingAddtoCart(getProduct, currentVariant, eventId);
            }
            if (props.CLARITY.status) {
              analyzify.clarityAddToCart(eventId);
            }
            if (props.HOTJAR.status) {
              analyzify.hotjarAddToCart(eventId);
            }
            if (props.X.status) {
              analyzify.xAddtoCart(getProduct, currentVariant, eventId);
            }
            if (props.CRITEO.status) {
              analyzify.criteoAddToCart(getProduct, currentVariant, eventId);
            }
            if (props.PINTEREST.status) {
              analyzify.pinterestAddtoCart(getProduct, currentVariant, eventId);
            }
            if (props.KLAVIYO.status) {
              analyzify.klaviyoAddToCart(getProduct, currentVariant, eventId);
            }
            if (props.TIKTOK.status) {
              analyzify.ttAddToCart(getProduct, currentVariant, eventId);
            }
            if (props.GTM.status) {
              //ACTUAL CHECK WAS  {% if app.metafields.analyzify.gtm_dataLayer %}
              analyzify.gtmAddToCart(getProduct, currentVariant, eventId);
            }
          });
          
          analyzify.log("customized product added", 'f-find-elem', 'customized product added');
          analyzify.log(e, 'f-find-elem', 'customized product added');
          window.e = e;
        });
      });
    }

  } else if (window.analyzify.shopify_template == "collection") {

    // select item

    if(!window.analyzify.getCollectionObj) return analyzify.log('Collection object not found', 'f-find-elem', 'collection');

    if (ga4_col_prod_click_elem !== null) {
      let clickedProduct = window.analyzify.findClickedProduct(
        ga4_col_prod_click_elem,
        window.analyzify.getCollectionObj.products,
      );

      if (!clickedProduct) {
        // Fallback: fetch product via API (e.g. Boost AJAX-loaded products not in Liquid array)
        (async () => {
          try {
            clickedProduct = await window.analyzify.getProductFromElement(ga4_col_prod_click_elem);
            if (!clickedProduct) return analyzify.log('Could not fetch product from element', 'f-find-elem', 'collection select_item');

            window.analyzify.withEcommerceEventContext('select_item', (eventId) => {
              if (props.GA4.status || props.GADS.status) {
                analyzify.gaSelectItem(clickedProduct, eventId);
              }
              if (props.GTM.status) {
                analyzify.gtmSelectItem(clickedProduct, eventId);
              }
            });
          } catch (e) {
            console.error('Error in collection select_item fallback:', e);
          }
        })();
      } else {
        // Wrap select item events in ecommerce event context for consistent eventId
        window.analyzify.withEcommerceEventContext('select_item', (eventId) => {
          if (props.GA4.status || props.GADS.status) {
            analyzify.gaSelectItem(clickedProduct, eventId);
          }
          if (props.GTM.status) {
            analyzify.gtmSelectItem(clickedProduct, eventId);
          }
        });
      }

    } else if (ga4_coll_atc_elem !== null) {
      const collectionObj = window.analyzify.getCollectionObj;
      if(!collectionObj) return analyzify.log('Collection object not found', 'f-find-elem', 'collection');
      
      const addedProduct = window.analyzify.findClickedProduct(
        ga4_coll_atc_elem,
        collectionObj.products,
      );
      if(!addedProduct) return analyzify.log('Added product not found', 'f-find-elem', 'collection');

      const currentVariant = addedProduct._clickedVariant?.id || addedProduct.variants[0]?.id || null;
      if(!currentVariant) return analyzify.log('Current variant not found', 'f-find-elem', 'collection');

      // Wrap all add to cart events in ecommerce event context for consistent eventId
      window.analyzify.withEcommerceEventContext('add_to_cart', (eventId) => {
        if ((props.GA4.status || props.GADS.status) && typeof window.analyzify.gaAddToCart === 'function') {
          window.analyzify.gaAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.SERVERSIDE.status) {
          analyzify.ssAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.FACEBOOK.status) {
          analyzify.fbAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.BING.status) {
          analyzify.bingAddtoCart(addedProduct, currentVariant, eventId);
        }
        if (props.SNAPCHAT.status) {
          analyzify.snapchatAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.X.status) {
          analyzify.xAddtoCart(addedProduct, currentVariant, eventId);
        }
        if (props.CRITEO.status) {
          analyzify.criteoAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.CLARITY.status) {
          analyzify.clarityAddToCart(eventId);
        }
        if (props.HOTJAR.status) {
          analyzify.hotjarAddToCart(eventId);
        }
        if (props.PINTEREST.status) {
          analyzify.pinterestAddtoCart(addedProduct, currentVariant, eventId);
        }
        if (props.KLAVIYO.status) {
          analyzify.klaviyoAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.TIKTOK.status) {
          analyzify.ttAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.GTM.status) {
          analyzify.gtmAddToCart(addedProduct, currentVariant, eventId);
        }
      });

    } else if (ga4_wishlist_elem !== null) {

      // wishlist - find clicked product and wrap in ecommerce event context for consistent eventId
      const collectionObj = window.analyzify.getCollectionObj;
      if(!collectionObj) return analyzify.log('Collection object not found', 'f-find-elem', 'collection wishlist');
      
      const clickedProduct = window.analyzify.findClickedProduct(
        ga4_wishlist_elem,
        collectionObj.products,
      );
      if(!clickedProduct) return analyzify.log('Clicked product not found', 'f-find-elem', 'collection wishlist');
      
      window.analyzify.withEcommerceEventContext('add_to_wishlist', (eventId) => {
        if (props.GA4.status || props.GADS.status) {
          analyzify.gaAddToWishlist(clickedProduct);
        }
        if (props.FACEBOOK.status) {
          analyzify.fbAddWishList(clickedProduct, null);
        }
        if (props.CLARITY.status) {
          analyzify.clarityAddToWishlist();
        }
        if (props.HOTJAR.status) {
          analyzify.hotjarAddToWishlist();
        }
        if (props.GTM.status) {
          analyzify.gtmAddToWishList(clickedProduct, null);
        }
        if (props.KLAVIYO.status) {
          analyzify.klaviyoAddToWishlist(clickedProduct, null);
        }
      });
    }

  } else if (window.analyzify.shopify_template == "search") {

    const { products, searchPerformed, resultsCount } = window.analyzify?.getSearchObj || {};
    // search
    if (
      searchPerformed &&
      resultsCount > 0 &&
      ga4_search_prod_click_elem !== null
    ) {
      
      let clickedProduct = window.analyzify.findClickedProduct(
        ga4_search_prod_click_elem,
        products,
      );

      if (!clickedProduct) {
        // Fallback: fetch product via API (e.g. Boost AJAX-loaded products not in Liquid array)
        (async () => {
          try {
            clickedProduct = await window.analyzify.getProductFromElement(ga4_search_prod_click_elem);
            if (!clickedProduct) return analyzify.log('Could not fetch product from element', 'f-find-elem', 'search select_item');

            window.analyzify.withEcommerceEventContext('select_item', (eventId) => {
              if (props.GA4.status || props.GADS.status) {
                analyzify.gaSelectItem(clickedProduct, eventId);
              }
              if (props.GTM.status) {
                analyzify.gtmSelectItem(clickedProduct, eventId);
              }
            });
          } catch (e) {
            console.error('Error in search select_item fallback:', e);
          }
        })();
      } else {
        // Wrap select item events in ecommerce event context for consistent eventId
        window.analyzify.withEcommerceEventContext('select_item', (eventId) => {
          if (props.GA4.status || props.GADS.status) {
            analyzify.gaSelectItem(clickedProduct, eventId);
          }
          if (props.GTM.status) {
            analyzify.gtmSelectItem(clickedProduct, eventId);
          }
        });
      }

    }

    if (ga4_search_atc_elem !== null) {
      const addedProduct = window.analyzify.findAddedProduct(
        ga4_search_atc_elem,
        products,
      );
      if(!addedProduct) return analyzify.log('Added product not found', 'f-find-elem', 'search');

      const currentVariant = addedProduct._clickedVariant?.id || addedProduct.variants[0]?.id || null;
      if(!currentVariant) return analyzify.log('Current variant not found', 'f-find-elem', 'search');

      // Wrap all add to cart events in ecommerce event context for consistent eventId
      window.analyzify.withEcommerceEventContext('add_to_cart', (eventId) => {
        if ((props.GA4.status || props.GADS.status) && typeof window.analyzify.gaAddToCart === 'function') {
          window.analyzify.gaAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.SERVERSIDE.status) {
          analyzify.ssAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.GTM.status) {
          analyzify.gtmAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.FACEBOOK.status) {
          analyzify.fbAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.CLARITY.status) {
          analyzify.clarityAddToCart(eventId);
        }
        if (props.SNAPCHAT.status) {
          analyzify.snapchatAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.HOTJAR.status) {
          analyzify.hotjarAddToCart(eventId);
        }
        if (props.X.status) {
          analyzify.xAddtoCart(addedProduct, currentVariant, eventId);
        }
        if (props.TIKTOK.status) {
          analyzify.ttAddToCart(addedProduct, currentVariant, eventId);
        }
        if (props.BING.status) {
          analyzify.bingAddtoCart(addedProduct, currentVariant, eventId);
        }
        if (props.CRITEO.status) {
          analyzify.criteoAddToCart(addedProduct, currentVariant, eventId);
        }
      });

    }

  } else if (window.analyzify.shopify_template == "index" || window.analyzify.shopify_template == "page") {

    // select_item on index/page — product link clicks
    if (ga4_index_select_item_elem !== null) {
      (async () => {
        try {
          const clickedProduct = await window.analyzify.getProductFromElement(ga4_index_select_item_elem);

          if (!clickedProduct) return analyzify.log('Could not fetch product from element', 'f-find-elem', 'index select_item');

          window.analyzify.withEcommerceEventContext('select_item', (eventId) => {
            if (props.GA4.status || props.GADS.status) {
              analyzify.gaSelectItem(clickedProduct, eventId);
            }
            if (props.GTM.status) {
              analyzify.gtmSelectItem(clickedProduct, eventId);
            }
          });
        } catch (e) {
          console.error('Error in index/page select_item:', e);
        }
      })();
    }

    // add_to_cart on index/page — existing behavior
    if (ga4_index_prod_click_elem !== null) {
      (async () => {
        try {
          const addedProduct = await window.analyzify.getProductFromElement(ga4_index_prod_click_elem);

          if (!addedProduct) return analyzify.log('Could not fetch product from element', 'f-find-elem', 'index');

          const variantIdFromAttr = ga4_index_prod_click_elem.getAttribute('data-variant-id');
          let currentVariant = addedProduct.variants?.[0]?.id || null;

          // If variant from attribute exists, find and attach it for proper variant lookup
          if (variantIdFromAttr) {
            const foundVariant = addedProduct.variants?.find(v => v.id?.toString() === variantIdFromAttr.toString());
            if (foundVariant) {
              addedProduct._clickedVariant = foundVariant;
              currentVariant = foundVariant.id;
            }
          }

          window.analyzify.withEcommerceEventContext('add_to_cart', (eventId) => {
            if ((props.GA4.status || props.GADS.status) && typeof window.analyzify.gaAddToCart === 'function') {
              window.analyzify.gaAddToCart(addedProduct, currentVariant, eventId);
            }
            if (props.SERVERSIDE.status) {
              analyzify.ssAddToCart(addedProduct, currentVariant, eventId);
            }
            if (props.FACEBOOK.status) {
              analyzify.fbAddToCart(addedProduct, currentVariant, eventId);
            }
            if (props.BING.status) {
              analyzify.bingAddtoCart(addedProduct, currentVariant, eventId);
            }
            if (props.SNAPCHAT.status) {
              analyzify.snapchatAddToCart(addedProduct, currentVariant, eventId);
            }
            if (props.X.status) {
              analyzify.xAddtoCart(addedProduct, currentVariant, eventId);
            }
            if (props.CRITEO.status) {
              analyzify.criteoAddToCart(addedProduct, currentVariant, eventId);
            }
            if (props.CLARITY.status) {
              analyzify.clarityAddToCart(eventId);
            }
            if (props.HOTJAR.status) {
              analyzify.hotjarAddToCart(eventId);
            }
            if (props.PINTEREST.status) {
              analyzify.pinterestAddtoCart(addedProduct, currentVariant, eventId);
            }
            if (props.KLAVIYO.status) {
              analyzify.klaviyoAddToCart(addedProduct, currentVariant, eventId);
            }
            if (props.TIKTOK.status) {
              analyzify.ttAddToCart(addedProduct, currentVariant, eventId);
            }
            if (props.GTM.status) {
              analyzify.gtmAddToCart(addedProduct, currentVariant, eventId);
            }
          });
        } catch (e) {
          console.error('Error in index/page add to cart:', e);
        }
      })();
    }

  }

  if (header_nav_btn_elem !== null) {
    if (props.GA4.status || props.GADS.status) {
      analyzify.gaNavClick(header_nav_btn_elem, "header-nav");
    }
    if (props.GTM.status) {
      analyzify.gtmNavClick(header_nav_btn_elem, "header-nav");
    }
  }

  if (disclosure_elem !== null) {
    if (props.GA4.status || props.GADS.status) {
      analyzify.gaDisclosureChange(disclosure_elem);
    }
    if (props.GTM.status) {
      //ACTUAL CHECK WAS  {% if app.metafields.analyzify.gtm_dataLayer %}
      analyzify.gtmDisclosureChange(disclosure_elem);
    }
  }

  if (accordion_summary_elem !== null) {
    if (props.GA4.status || props.GADS.status) {
      analyzify.gaProductDetailAccordion(accordion_summary_elem);
    }
    if (props.GTM.status) {
      //ACTUAL CHECK WAS  {% if app.metafields.analyzify.gtm_dataLayer %}
      analyzify.gtmProductDetailAccordion(accordion_summary_elem);
    }
  }

  if (hero_banner_area_elem !== null) {
    // analyzify.log(hero_banner_area_elem);
    if (props.GA4.status || props.GADS.status) {
      analyzify.gaHeroBannerClick(hero_banner_area_elem);
    }
    if (props.GTM.status) {
      analyzify.gtmHeroBannerClick(hero_banner_area_elem);
    }
  }
  
  if (ga4_checkout_elem !== null) {

    // begin checkout
    const cartObj = fetch("/cart.js")
      .then(async (r) => {
        const res = await r.json();
        
        // Wrap all begin checkout platform calls in ecommerce event context
        window.analyzify.withEcommerceEventContext('begin_checkout', () => {
          const eventId = window.analyzify.getCurrentEcommerceEventId();
          
          if (props.GA4.status || props.GADS.status) {
            analyzify.gaBeginCheckout(res, eventId);
          }
          if (props.FACEBOOK.status) {
            analyzify.fbBeginCheckout(res, eventId);
          }
          if (props.CLARITY.status) {
            analyzify.clarityBeginCheckout();
          }
          if (props.HOTJAR.status) {
            analyzify.hotjarBeginCheckout();
          }
          if (props.SERVERSIDE.status) {
            analyzify.ssBeginCheckout(res, eventId);
          }
          if (props.BING.status) {
            analyzify.bingBeginCheckout(res);
          }
          if (props.X.status) {
            analyzify.xBeginCheckout(res);
          }
          if (props.GTM.status) {
            //ACTUAL CHECK WAS  {% if app.metafields.analyzify.gtm_dataLayer %}
            analyzify.gtmBeginCheckout(res, eventId);
          }
          if (props.TIKTOK.status) {
            analyzify.ttBeginCheckout(res, eventId);
          }
          if (props.SNAPCHAT.status) {
            analyzify.snapchatBeginCheckout(res);
          }
          if (props.KLAVIYO.status) {
            analyzify.klaviyoBeginCheckout(res, eventId);
          }
        });
      })
      .catch(function (e) {
        analyzify.log(e, 'f-find-elem', 'beginCheckout');
      });

  } else if (ga4_rfc_elem !== null) {
    
    // remove from cart
    const rfcEventHandle = async () => {
      const removedItem = [];
      const possibleIDs = [];
      const cartItems = await fetch("/cart.js").then((response) =>
        response.json(),
      );

      for (let i = 0; i < window.analyzify.foundElements.length; i++) {
        const formElement = window.analyzify.foundElements[i];
        if (formElement) {
          if (formElement.getAttribute("href")) {
            if (
              formElement.getAttribute("href").includes("/cart/change?line=")
            ) {
              const productCartOrder_1 = formElement.getAttribute("href").split("change?line=")[1];
              const productCartOrder = productCartOrder_1.split("&quantity")[0];
              for (let i = 0; i < cartItems.items.length; i++) {
                if (i + 1 == productCartOrder) {
                  removedItem.push(cartItems.items[i]);
                  analyzify.log("Product removed from cart (if with href)", 'f-find-elem', 'rfcEventHandle');
                  analyzify.log(cartItems.items[i], 'f-find-elem', 'rfcEventHandle');
                }
              }
            } else if (formElement.getAttribute("href").includes("/cart/change?quantity=0&line=")) {
              const productCartOrder = formElement.getAttribute("href").split("/cart/change?quantity=0&line=")[1];
              for (let i = 0; i < cartItems.items.length; i++) {
                if (i + 1 == productCartOrder) {
                  removedItem.push(cartItems.items[i]);
                  analyzify.log("Product removed from cart (elseif with href)", 'f-find-elem', 'rfcEventHandle');
                  analyzify.log(cartItems.items[i], 'f-find-elem', 'rfcEventHandle');
                }
              }
            }
          } else if (formElement.getAttribute("alt")) {
            const productName_1 = formElement.getAttribute("alt");
            const productName_2 = productName_1.replace("Remove ", "");
            for (let i = 0; i < cartItems.items.length; i++) {
              if (cartItems.items[i].product_title == productName_2) {
                removedItem.push(cartItems.items[i]);
                analyzify.log("Product removed from cart (elseif with alt)", 'f-find-elem', 'rfcEventHandle');
                analyzify.log(cartItems.items[i], 'f-find-elem', 'rfcEventHandle');
              }
            }
          } else if (formElement.getAttribute("data-index")) {
            const productCartOrder = formElement.getAttribute("data-index");
            for (let i = 0; i < cartItems.items.length; i++) {
              if (i + 1 == productCartOrder) {
                removedItem.push(cartItems.items[i]);
                analyzify.log("Product removed from cart (elseif with data-index)", 'f-find-elem', 'rfcEventHandle');
                analyzify.log(cartItems.items[i], 'f-find-elem', 'rfcEventHandle');
              }
            }
          } else {
            // Check parent elements for data-id
            let parent = formElement.parentElement;
            let found = false;
            let maxDepth = 2;
            let currentDepth = 0;

            while (parent && currentDepth < maxDepth && !found) {
              const dataId = parent.getAttribute("data-id");
              if (dataId) {
                for (let i = 0; i < cartItems.items.length; i++) {
                  if (cartItems.items[i].id.toString() === dataId) {
                    removedItem.push(cartItems.items[i]);
                    analyzify.log("Product removed from cart (parent data-id)", 'f-find-elem', 'rfcEventHandle');
                    analyzify.log(cartItems.items[i], 'f-find-elem', 'rfcEventHandle');
                    found = true;
                    break;
                  }
                }
              }
              parent = parent.parentElement;
              currentDepth++;
            }
          }

          if (!removedItem.length) {
            const attrValues = formElement
              .getAttributeNames()
              .map((name) => formElement.getAttribute(name));
            attrValues.forEach((formElement) => {
              if (formElement.match(/([0-9]+)/g)) {
                possibleIDs.push(formElement.match(/([0-9]+)/g));
              }
            });
            possibleIDs.forEach((possibleID) => {
              possibleID.forEach((id) => {
                cartItems.items.filter(function (product) {
                  if (product.variant_id == Number(id)) {
                    removedItem.push(product);
                  }
                });
              });
            });
          }
          if (removedItem[0]) {
            // Wrap remove from cart platform calls in ecommerce event context
            window.analyzify.withEcommerceEventContext('remove_from_cart', () => {
              const eventId = window.analyzify.getCurrentEcommerceEventId();
              
              if (props.GA4.status || props.GADS.status) {
                analyzify.gaRemoveFromCart(removedItem[0], eventId);
              }
              if (props.GTM.status) {
                //ACTUAL CHECK WAS  {% if app.metafields.analyzify.gtm_dataLayer %}
                analyzify.gtmRemoveFromCart(removedItem[0], eventId);
              }
              if (props.CLARITY.status) {
                analyzify.clarityRemoveFromCart();
              }
              if (props.HOTJAR.status) {
                analyzify.hotjarRemoveFromCart();
              }
            });
            
            analyzify.log("Product ee_removeFromCart", 'f-find-elem', 'rfcEventHandle');
            analyzify.log(window.dataLayer, 'f-find-elem', 'rfcEventHandle');
            break; // Döngüyü sonlandr
          } else {
            analyzify.log("Removed element not found", 'f-find-elem', 'rfcEventHandle');
          }
        }
      }
    };
    rfcEventHandle();

  } else {
    analyzify.log(
      "The clicked button/link was not a addtocart, removefromcart or checkout button.",
      'f-find-elem',
      'The clicked button/link was not a addtocart, removefromcart or checkout button.'
    );
    analyzify.log(event.target, 'f-find-elem', 'The clicked button/link was not a addtocart, removefromcart or checkout button.');
  }
});

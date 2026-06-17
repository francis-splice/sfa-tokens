window.analyzify.initFacebook = (fbObj, fbProps) => {
  try {
    if (!fbProps || !fbProps.status) return;

    !(function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

    if (fbProps.primary?.status) fbq('set', 'autoConfig', false, fbProps.primary.id);
    if (fbProps.secondary?.status) fbq('set', 'autoConfig', false, fbProps.secondary.id);
    
    const updateFacebookConsent = (isGranted) => {
      fbq('consent', isGranted ? 'grant' : 'revoke');
    };
    
    const getGA = () => window.analyzify?.cookieStorage.get('_ga');
    const gaCookie = () => {
      const useAttribution = window.analyzify?.properties?.SERVERSIDE?.azfy_attribution;
      const ga = useAttribution 
        ? window.analyzify?.cart_attributes?.azfy_cookies?.ga 
        : window.analyzify?.unformattedCartDataObj?.ga;
      return ga || (getGA() && getGA().startsWith('GA') ? getGA().slice(6).trim() : getGA());
    }
    
    const identifyObj = (eventID) => {
      return Object.fromEntries(
        Object.entries({
          external_id: gaCookie() || window.analyzify.eventId.get(eventID ? eventID : 'default'),
          em: window.analyzify?.shopify_customer?.email_address || null,
          fn: window.analyzify?.shopify_customer?.first_name || null,
          ln: window.analyzify?.shopify_customer?.last_name || null,
          ph: window.analyzify?.shopify_customer?.phone_number || null
        }).filter(([_, value]) => value != null)
      );
    };

    window.analyzify.initializeFacebookPixel = (pixelId) => {
      if (!pixelId) return;
      fbq.disablePushState = true;
      // fbq.allowDuplicatePageViews = true;
      fbq('init', pixelId.toString(), identifyObj('default'), {
        autoConfig: false,
        advanced_matching: window.analyzify?.shopify_customer?.email_address ? true : false
      });
    };

    window.analyzify.trackFacebookEvent = (pixelId, eventName, params, eventId, custom) => {
      if (!pixelId) return;
      fbq(custom ? 'trackSingleCustom' : 'trackSingle', pixelId.toString(), eventName, params, eventId ? {
        eventID: eventId,
        ...identifyObj(eventId)
      } : {});
      analyzify.log(`Facebook event '${eventName}' tracked for pixel ID: ${pixelId}`, 'an_fb', eventName);
      analyzify.log(params, 'an_fb', eventName);
    };
    
    const getProductId = (product, variant, idFormat) => {
      if(!product) return;
      const variantDetails = window.analyzify.getVariantDetails(product?.variants, variant?.id);
      switch (idFormat) {
        case 'variant_id': return variantDetails?.id?.toString() || product?.variant_id?.toString() || product?.variants[0]?.id?.toString();
        case 'product_sku': return variantDetails?.sku?.toString() || product?.sku?.toString();
        case 'shopify_item_id': return `shopify_${window.analyzify?.feed_region}_${product?.id}_${variantDetails?.id}`;
        default: return product?.id?.toString() || product?.product_id?.toString();
      }
    };
    
    window.analyzify.fbInitializeAndTrackPageEvents = () => {
      if (window.analyzify.fbPageEventsFired) return;

      if (fbProps.primary?.status) {
        window.analyzify.initializeFacebookPixel(fbProps.primary.id);
        window.analyzify.trackFacebookEvent(fbProps.primary.id, 'PageView', {
          ...identifyObj('default')
        }, window.analyzify.eventId.get('default'));
      }
      if (fbProps.secondary?.status) {
        window.analyzify.initializeFacebookPixel(fbProps.secondary.id);
        window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'PageView', {
          ...identifyObj('default')
        }, window.analyzify.eventId.get('default'));
      }

      const template = window.analyzify.shopify_template;
      if (template === 'product') window.analyzify.fbViewContent(fbObj.getProductObj);
      else if (template === 'search') window.analyzify.fbSearch(fbObj.getSearchObj);
      else if (template === 'cart') window.analyzify.fbViewCart(window.analyzify.detectedCart);
      else if (template === 'collection') window.analyzify.fbViewCollection(fbObj.getCollectionObj);
      else if (template === 'index') window.analyzify.fbViewHome();

      window.analyzify.fbPageEventsFired = true;
    };

    // page_view only (SPA navigation)
    window.analyzify.fbPageView = (eventId) => {
      try {
        const eid = eventId || window.analyzify.eventId.get('default');
        if (fbProps.primary?.status) {
          window.analyzify.trackFacebookEvent(fbProps.primary.id, 'PageView', {
            ...identifyObj('default')
          }, eid);
        }
        if (fbProps.secondary?.status) {
          window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'PageView', {
            ...identifyObj('default')
          }, eid);
        }
        analyzify.log('fbPageView (SPA)', 'an_fb', 'fbPageView');
      } catch (error) {
        console.error("Error processing FB page_view:", error);
      }
    };

    window.analyzify.fbViewContent = (productObj, variantId) => {

      // Check if at least one pixel has ViewContent event enabled - if both disabled, exit early
      if (!fbProps.primary?.events?.view_content && !fbProps.secondary?.events?.view_content) return;
      // First check if productObj exists
      if (!productObj) return;
      
      const { product, variant } = productObj.product ? productObj : { product: productObj };
      if(!product) return analyzify.log('Product object is not found', 'an_ga4_gads', 'gaViewItem');

      const variantInput = variantId || window.analyzify?.getCurrentVariant()?.id || variant?.id;
      const variantDetails = window.analyzify.getVariantDetails(product?.variants, variantInput);

      const baseObj = {
        content_name: product?.title,
        content_type: 'product_group',
        content_brand: product?.vendor,
        content_category: product?.type,
        currency: window.analyzify?.currency || null,
        cart_id: window.analyzify.cart_id,
        value: window.analyzify.formatPrice(variantDetails?.price || product?.price),
        contents: [{
          quantity: 1,
          name: product?.title,
          item_category: product?.type,
          item_brand: product?.vendor
        }]
      };

      if (fbProps.primary?.status && fbProps.primary.events.view_content) {
        const id = getProductId(product, variantDetails, fbProps.primary.product_id_format);
        const eventObj = {
          ...baseObj,
          content_ids: [id],
          contents: [{
            ...baseObj.contents[0], id,
            item_price: window.analyzify.formatPrice(variantDetails?.price || product?.price),
            currency: window.analyzify?.currency || null
          }]
        };
        analyzify.log(eventObj, 'an_fb', 'fbViewContent');
        window.analyzify.trackFacebookEvent(fbProps.primary.id, 'ViewContent', eventObj, window.analyzify.eventId.get('view_item'));
      }
      if (fbProps.secondary?.status && fbProps.secondary.events.view_content) {
        const id = getProductId(product, variantDetails, fbProps.secondary.product_id_format);
        const eventObj = {
          ...baseObj,
          content_ids: [id],
          contents: [{
            ...baseObj.contents[0], id,
            item_price: window.analyzify.formatPrice(variantDetails?.price || product?.price),
            currency: window.analyzify?.currency || null
          }]
        };
        analyzify.log(eventObj, 'an_fb', 'fbViewContent');
        window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'ViewContent', eventObj, window.analyzify.eventId.get('view_item'));
      }
    };

    window.analyzify.fbViewCollection = (collectionObj) => {
      if (!collectionObj?.title || !collectionObj?.products?.length) return;
      if (!fbProps.primary?.events?.view_collection && !fbProps.secondary?.events?.view_collection) return;
      const primaryEventObj = {
        content_name: collectionObj?.title || null,
        content_type: 'product_group',
        content_brand: collectionObj?.vendor || null,
        content_category: collectionObj?.type || null,
        content_ids: collectionObj.products.map(product => {
          const firstVariant = window.analyzify.getFirstVariant(product);
          return getProductId(product, firstVariant, fbProps.primary.product_id_format);
        }),
        cart_id: window.analyzify.cart_id,
        currency: window.analyzify?.currency || null,
        value: window.analyzify.formatPrice(collectionObj?.products.reduce((acc, product) => acc + product.price, 0) || 0, true),
        contents: collectionObj.products.map(product => {
          const firstVariant = window.analyzify.getFirstVariant(product);
          return {
            id: getProductId(product, firstVariant, fbProps.primary.product_id_format),
            quantity: 1,
            name: product.title,
            item_category: product.type,
            item_price: window.analyzify.formatPrice(firstVariant?.price || product.price, true),
            item_brand: product.vendor,
            currency: window.analyzify?.currency || null
          }
        }),
        num_items: collectionObj.all_products_count
      };
      const secondaryEventObj = {
        content_name: collectionObj?.title || null,
        content_type: 'product_group',
        content_brand: collectionObj?.vendor || null,
        content_category: collectionObj?.type || null,
        cart_id: window.analyzify.cart_id,
        content_ids: collectionObj.products.map(product => {
          const firstVariant = window.analyzify.getFirstVariant(product);
          return getProductId(product, firstVariant, fbProps.secondary.product_id_format);
        }),
        currency: window.analyzify?.currency || null,
        value: window.analyzify.formatPrice(collectionObj?.products.reduce((acc, product) => acc + product.price, 0) || 0, true),
        contents: collectionObj.products.map(product => {
          const firstVariant = window.analyzify.getFirstVariant(product);
          return {
            id: getProductId(product, firstVariant, fbProps.secondary.product_id_format),
            quantity: 1,
            name: product.title,
            item_category: product.type,
            item_price: window.analyzify.formatPrice(firstVariant?.price || product.price, true),
            item_brand: product.vendor,
            currency: window.analyzify?.currency || null
          }
        }),
        num_items: collectionObj.all_products_count
      };
      
      if (fbProps.primary?.status && fbProps.primary?.events?.view_collection) window.analyzify.trackFacebookEvent(fbProps.primary.id, 'ViewCollection', primaryEventObj, window.analyzify.eventId.get('view_item_list'), true);
      if (fbProps.secondary?.status && fbProps.secondary?.events?.view_collection) window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'ViewCollection', secondaryEventObj, window.analyzify.eventId.get('view_item_list'), true);
    };

    window.analyzify.fbViewHome = () => {
      if (!fbProps.status) return;
      if (fbProps.primary?.status) window.analyzify.trackFacebookEvent(fbProps.primary.id, 'ViewHome', {
        cart_id: window.analyzify.cart_id || null,
        ...identifyObj(window.analyzify.eventId.get('default'))
      }, window.analyzify.eventId.get('default'), true);
      if (fbProps.secondary?.status) window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'ViewHome', {
        cart_id: window.analyzify.cart_id || null,
        ...identifyObj(window.analyzify.eventId.get('default'))
      }, window.analyzify.eventId.get('default'), true);
    };

    window.analyzify.fbSearch = (searchObj) => {
      if (!searchObj?.searchPerformed) return;
      if (!fbProps.primary?.events?.search && !fbProps.secondary?.events?.search) return;
      
      const eventObj = { search_string: searchObj.term, contents: [] };
      if (fbProps.primary?.status && fbProps.primary?.events?.search) window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Search', eventObj, window.analyzify.eventId.get('search'));
      if (fbProps.secondary?.status && fbProps.secondary?.events?.search) window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Search', eventObj, window.analyzify.eventId.get('search'));
    };
    
    window.analyzify.fbViewCart = (cartObj) => {
      if (!cartObj?.items?.length || !cartObj?.item_count) return;
      if (!fbProps.primary?.events?.view_cart && !fbProps.secondary?.events?.view_cart) return;
      
      const baseObj = {
        num_items: cartObj.item_count,
        value: window.analyzify.formatPrice(cartObj.total_price, true),
        currency: cartObj.currency || window.analyzify?.currency,
        cart_id: window.analyzify.cart_id,
        content_type: 'product_group'
      };

      if (fbProps.primary?.status && fbProps.primary.events.view_cart) {
        const contents = cartObj.items.map(item => {
          return {
            id: getProductId(item, item, fbProps.primary.product_id_format),
            quantity: item.quantity,
            name: item.title,
            item_category: item.type,
            item_brand: item.vendor,
            currency: window.analyzify?.currency || null,
            item_price: window.analyzify.formatPrice(item.price, true)
          };
        });
        const eventObj = {
          ...baseObj,
          content_ids: contents.map(c => c.id),
          content_type: 'product_group',
          contents: contents,
          num_items: cartObj.item_count
        };
        window.analyzify.trackFacebookEvent(fbProps.primary.id, 'ViewCart', eventObj, window.analyzify.eventId.get('view_cart'));
      }
      if (fbProps.secondary?.status && fbProps.secondary.events.view_cart) {
        const contents = cartObj.items.map(item => {
          return {
            id: getProductId(item, item, fbProps.secondary.product_id_format),
            quantity: item.quantity,
            name: item.title,
            item_category: item.type,
            item_brand: item.vendor,
            currency: window.analyzify?.currency || null,
            item_price: window.analyzify.formatPrice(item.price, true)
          };
        });
        const eventObj = {
          ...baseObj,
          content_ids: contents.map(c => c.id),
          content_type: 'product_group',
          value: window.analyzify.formatPrice(cartObj.total_price, true),
          currency: window.analyzify?.currency || null,
          contents: contents,
          num_items: cartObj.item_count
        };
        window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'ViewCart', eventObj, window.analyzify.eventId.get('view_cart'));
      }
    };

    window.analyzify.fbAddToCart = (prodObj, variantId, eventId) => {
      if (!prodObj) return;
      if (!fbProps.primary?.events?.add_to_cart && !fbProps.secondary?.events?.add_to_cart) return;

      const { product, variant } = prodObj.product ? prodObj : { product: prodObj };
      const variantDetails = window.analyzify.getVariantDetails(product?.variants, variantId || variant?.id);
      if (!variantDetails) return;
      const quantity = window.analyzify.findQuantity() || 1;
      const baseObj = {
        value: window.analyzify.formatPrice(variantDetails.price * quantity),
        currency: window.analyzify.currency,
        content_name: product?.title,
        content_type: 'product_group',
        cart_id: window.analyzify.cart_id,
        content_brand: product?.vendor,
        content_category: product?.type,
        contents: [{ quantity }]
      };

      if (fbProps.primary?.status && fbProps.primary.events.add_to_cart) {
        const id = getProductId(product, variantDetails, fbProps.primary.product_id_format);
        const eventObj = {
          ...baseObj,
          content_ids: [id],
          contents: [{
            ...baseObj.contents[0],
            id,
            quantity,
            item_price: window.analyzify.formatPrice(variantDetails.price),
            item_category: product?.type,
            item_brand: product?.vendor,
            currency: window.analyzify?.currency || null
          }]
        };
        window.analyzify.trackFacebookEvent(fbProps.primary.id, 'AddToCart', eventObj, eventId || window.analyzify.eventId.get('add_to_cart'));
      }
      if (fbProps.secondary?.status && fbProps.secondary.events.add_to_cart) {
        const id = getProductId(product, variantDetails, fbProps.secondary.product_id_format);
        const eventObj = {
          ...baseObj,
          content_ids: [id],
          contents: [{
            ...baseObj.contents[0],
            id,
            quantity,
            item_price: window.analyzify.formatPrice(variantDetails.price),
            item_category: product?.type,
            item_brand: product?.vendor,
            currency: window.analyzify?.currency || null
          }]
        };
        window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'AddToCart', eventObj, eventId || window.analyzify.eventId.get('add_to_cart'));
      }
    };

      // Add to Wishlist
      window.analyzify.fbAddWishList = (productObj) => {
        try {
          // First check if productObj exists
          if (!productObj) {
            analyzify.log('Product object is not found', 'an_fb', 'fbAddWishList');
            return;
          }

          // Check if at least one pixel has AddToWishlist event enabled - if both disabled, exit early
          if (!fbProps.primary?.events?.add_to_wishlist && !fbProps.secondary?.events?.add_to_wishlist) {
            analyzify.log('AddToWishlist event not enabled on any pixel', 'an_fb', 'fbAddWishList');
            return;
          }
          
          // Then check if at least one pixel is active - if both are inactive, exit early
          if (!fbProps.primary?.status && !fbProps.secondary?.status) {
            analyzify.log('No active Facebook pixels found', 'an_fb', 'fbAddWishList');
            return;
          }
          
          let { product, variant } = productObj;
          if (!product) product = productObj;

          const firstVariant = window.analyzify.getFirstVariant(product);
          const variantDetails = window.analyzify.getVariantDetails(
            product?.variants,
            variant?.id || firstVariant?.id,
          );

          if (!variantDetails) {
            analyzify.log('Variant details are not found', 'an_fb', 'fbAddWishList');
            return;
          }

          const prodQty = window.analyzify.findQuantity() || 1;
          const price = variantDetails?.price || product?.price;

          const baseFbObj = {
            content_name: product?.title || null,
            content_type: 'product_group',
            cart_id: window.analyzify?.cart_id || null,
            value: window.analyzify.formatPrice(price * prodQty || 0),
            currency: window.analyzify?.currency,
            content_brand: product?.vendor || null,
            contents: [
              {
                id: null,
                name: product?.title || null,
                quantity: prodQty,
                item_price: window.analyzify.formatPrice(price || 0),
                item_category: product?.type || null,
                item_brand: product?.vendor || null,
              },
            ],
            eventId: window.analyzify.getCurrentEcommerceEventId() || window.analyzify.eventId.get('add_to_wishlist'),
          };
          
          if (fbProps?.primary?.status && fbProps?.primary?.events?.add_to_wishlist) {
            const primaryProductId = getProductId(
              product,
              variantDetails,
              fbProps.primary.product_id_format,
            );
            const primaryFbObj = {
              ...baseFbObj,
              content_ids: primaryProductId,
              contents: [{ ...baseFbObj.contents[0], id: primaryProductId }],
            };
            window.analyzify.trackFacebookEvent(
              fbProps.primary.id,
              'AddToWishlist',
              primaryFbObj,
              baseFbObj.eventId,
            );
          }
          if (fbProps?.secondary?.status && fbProps?.secondary?.events?.add_to_wishlist) {
            const secondaryProductId = getProductId(
              product,
              variantDetails,
              fbProps.secondary.product_id_format,
            );
            const secondaryFbObj = {
              ...baseFbObj,
              content_ids: secondaryProductId,
              contents: [{ ...baseFbObj.contents[0], id: secondaryProductId }],
            };
            window.analyzify.trackFacebookEvent(
              fbProps.secondary.id,
              'AddToWishlist',
              secondaryFbObj,
              baseFbObj.eventId,
            );
          }
          
          analyzify.log('fbq: AddToWishlist', 'an_fb', 'fbAddWishList');
        } catch (error) {
          console.error('Error processing fbAddWishList:', error);
        }
      };

    window.analyzify.fbBeginCheckout = (cartObj, eventId) => {
      if (!cartObj?.items?.length) return;
      if (!fbProps.primary?.events?.initiate_checkout && !fbProps.secondary?.events?.initiate_checkout) return;
      if (!fbProps.primary?.status && !fbProps.secondary?.status) return;

      const baseObj = {
        num_items: cartObj.item_count,
        value: window.analyzify.formatPrice(cartObj.total_price, true),
        currency: cartObj.currency || window.analyzify?.currency,
        content_type: 'product_group',
        cart_id: window.analyzify.cart_id
      };

      if (fbProps.primary?.status && fbProps.primary.events.initiate_checkout) {
        analyzify.log(cartObj, 'an_fb', 'fbBeginCheckout');
        const contents = cartObj.items.map(item => ({
          id: getProductId(item, item, fbProps.primary.product_id_format),
          quantity: item.quantity,
          name: item.title,
          item_category: item.type,
          item_brand: item.vendor,
          item_price: window.analyzify.formatPrice(item.price, true),
          currency: window.analyzify?.currency || null
        }));
        const eventObj = {
          ...baseObj,
          content_ids: contents.map(c => c.id),
          contents: contents,
          num_items: cartObj.item_count
        };
        window.analyzify.trackFacebookEvent(fbProps.primary.id, 'InitiateCheckout', eventObj, eventId || window.analyzify.eventId.get('begin_checkout'));
      }
      if (fbProps.secondary?.status && fbProps.secondary.events.initiate_checkout) {
        const contents = cartObj.items.map(item => ({ id: getProductId(item, item, fbProps.secondary.product_id_format), quantity: item.quantity }));
        const eventObj = {
          ...baseObj,
          content_ids: contents.map(c => c.id),
          contents: contents,
          num_items: cartObj.item_count
        };
        window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'InitiateCheckout', eventObj, eventId || window.analyzify.eventId.get('begin_checkout'));
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

        // if(!fbProps?.all_forms) return;
  
        // SHOPIFY FORM SUBMITTED
        if(fbProps.primary?.events?.generate_lead || fbProps.secondary?.events?.generate_lead){
          window.addEventListener("azfy:shopify:form_submitted", async (event) => {
            try {
              const evDetail = event.detail;
              const email = evDetail.payload['contact_email'] || evDetail.payload['email'];
              const hashEmail = await window.analyzify?.hashUserData({
                email_address: email
              });
              analyzify.log(evDetail, 'an_fb', 'shopifyFormSubmitted');
              if(
                event.type === "azfy:shopify:form_submitted" &&
                evDetail.name === "shopify:form_submitted"
              ){
                const tags = (evDetail.payload['contact_tags'] || evDetail.payload['customer_tags'] || '').toLowerCase();
                if (["newsletter", "prospect"].some(tag => tags.includes(tag))) {
                  const formObj = {
                    method: 'shopify:newsletter',
                    form_source: 'shopify_native',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...evDetail.payload
                  };
                  if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Lead', {
                      method: 'shopify:newsletter',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'newsletactForm');
                  }
                  if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Lead', {
                      method: 'shopify:newsletter',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'newsletactForm');
                  }
                } else if(evDetail.payload["form_type"] === "customer_login"){
                  const formObj = {
                    method: 'shopify:customer_login',
                    form_source: 'shopify_native',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...evDetail.payload
                  }
                  if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Login', {
                      method: 'shopify:customer_login',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'customerLogin');
                  }
                  if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Login', {
                      method: 'shopify:customer_login',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'customerLogin');
                  }
                } else if(evDetail.payload["form_type"] === "create_customer"){
                  const formObj = {
                    method: 'shopify:customer_register',
                    form_source: 'shopify_native',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...evDetail.payload
                  }
                  if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.primary.id, 'CompleteRegistration', {
                      method: 'shopify:customer_register',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'customerRegister');
                  }
                  if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'CompleteRegistration', {
                      method: 'shopify:customer_register',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'customerRegister');
                  }
                } else if(evDetail.payload["form_type"] === "contact_form" || evDetail.payload["form_type"] === "contact"){
                  const formObj = {
                    method: 'shopify:contact_form',
                    form_source: 'shopify_native',
                    cart_id: window.analyzify?.cart_id || null,
                    event_id: window.analyzify.eventId.get('generate_lead') || null,
                    ...evDetail.payload
                  };
                  if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Contact', {
                      method: 'shopify:contact_form',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'contactForm');
                  }
                  if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                    window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Contact', {
                      method: 'shopify:contact_form',
                      form_source: 'shopify_native',
                      cart_id: window.analyzify?.cart_id || null,
                      event_id: window.analyzify.eventId.get('generate_lead') || null,
                      ...evDetail.payload
                    }, window.analyzify.eventId.get('generate_lead'));
                    analyzify.log(formObj, 'an_fb', 'contactForm');
                  }
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
              const hashEmail = await window.analyzify?.hashUserData({
                email_address: email
              });

              const formObj = {
                eventName: "generate_lead",
                eventParams: {
                  method: 'klaviyo:form_submitted',
                  form_source: 'klaviyo',
                  cart_id: window.analyzify?.cart_id || null,
                  event_id: window.analyzify.eventId.get('generate_lead') || null,
                  ...evDetail.payload
                }
              };
              if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'klaviyoForm');
              }
              if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'klaviyoForm');
              }
            } catch (error) {
              console.error("Error processing klaviyo:form_submitted:", error);
            }
          });
  
          // HUBSPOT FORMS
          window.addEventListener("azfy:hubspot:form_submitted", async (event) => {
            try {
              const evDetail = event.detail;
              const email = evDetail.payload['contact_email'] || evDetail.payload['email'];
              const hashEmail = await window.analyzify?.hashUserData({
                email_address: email
              });
              const formObj = {
                eventName: "generate_lead",
                eventParams: {
                  method: 'hubspot:form_submitted',
                  form_source: 'hubspot',
                  cart_id: window.analyzify?.cart_id || null,
                  event_id: window.analyzify.eventId.get('generate_lead') || null,
                  ...evDetail.payload
                }
              };
              if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'hubspotFormSubmitted');
              }
              if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'hubspotFormSubmitted');
              }
            } catch (error) {
              console.error("Error processing hubspot:form_submitted:", error);
            }
          });

          // JOTFORM FORMS
          window.addEventListener("azfy:jotform:form_submitted", (event) => {
            try {
              const evDetail = event.detail;
              const formObj = {
                eventName: "generate_lead",
                eventParams: {
                  method: 'jotform:form_submitted',
                  form_source: 'jotform',
                  cart_id: window.analyzify?.cart_id || null,
                  event_id: window.analyzify.eventId.get('generate_lead') || null,
                  ...evDetail.payload
                }
              };
              if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'jotformFormSubmitted');
              }
              if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'jotformFormSubmitted');
              }
            } catch (error) {
              console.error("Error processing jotform:form_submitted:", error);
            }
          });

          // HULK FORM BUILDER FORMS
          window.addEventListener("azfy:hulkformbuilder:form_submitted", (event) => {
            try {
              const evDetail = event.detail;
              const formObj = {
                eventName: "generate_lead",
                eventParams: {
                  method: 'hulkformbuilder:form_submitted',
                  form_source: 'hulkformbuilder',
                  cart_id: window.analyzify?.cart_id || null,
                  event_id: window.analyzify.eventId.get('generate_lead') || null,
                  ...evDetail.payload
                }
              };
              if(fbProps.primary?.status && fbProps.primary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.primary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'hulkFormSubmitted');
              }
              if(fbProps.secondary?.status && fbProps.secondary.events.generate_lead){
                window.analyzify.trackFacebookEvent(fbProps.secondary.id, 'Lead', formObj, window.analyzify.eventId.get('generate_lead'));
                analyzify.log(formObj, 'an_fb', 'hulkFormSubmitted');
              }
            } catch (error) {
              console.error("Error processing hulkformbuilder:form_submitted:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error processing forms:", error);
      }
    })();
    
    // Consent Control Logic
    if (window.analyzify.consent_active) {
      window.analyzify.consentManager.queueConsentAction((initialConsent) => {
        const isGranted = initialConsent.ad_storage === 'granted';
        updateFacebookConsent(isGranted);
        if (isGranted) {
          window.analyzify.fbInitializeAndTrackPageEvents();
        }
      });

      window.analyzify.consentManager.onChange((newConsent) => {
        const isGranted = newConsent.ad_storage === 'granted';
        updateFacebookConsent(isGranted);
        if (isGranted) {
          window.analyzify.fbInitializeAndTrackPageEvents();
        }
      });
    } else {
      updateFacebookConsent(true);
      window.analyzify.fbInitializeAndTrackPageEvents();
    }

  } catch (error) {
    console.error('Error processing initFacebook:', error);
  }
};
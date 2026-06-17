try {

  window.dataLayer = window.dataLayer || [];
  window.analyzify = window.analyzify || {};

  window.analyzify = {
    ...window.analyzify,
    ...window.analyzify_settings,
    logs: [],
    stopAtLog: false,
    analyzify_version: "4.3.90",
    attributes: {
      variant_options: {
        class: [
          "variant-radios",
          "variant-picker",
          ".product-form__input",
          ".variant-selects",
          ".product-form__variants",
        ],
      },
    },
    addtocart_btn_attributes: {
      type: ["submit"],
      name: ["add-to-cart", "add"],
      "data-add-to-cart-text": ["Add to Cart"],
      class: [
        "addtocart-button",
        "pdp-form--atc-button",
        "button-add",
        "add-to-cart",
        "add_to_cart",
        "buttonAddtoCart",
        "product-form__add-to-cart",
        "gtmatc",
        "product-form__cart-submit",
        "AddToCartText",
        "AddToCart",
        "AddToCart-product-template",
        "product__add-to-cart",
        "single_add_to_cart_button",
        "js_frm_cart",
        "product-buy-buttons--cta",
        "jsfrmcart",
        "product-buy-buttons--cta",
      ],
      id: ["AddToCart"],
    },
    wishlist_btn_attributes: {
      class: ["test-wishlist", "wishlist_button"],
      name: ["wishlist"],
      "aria-label": ["In Wishlist"],
    },
    product_quantity: {
      name: ["quantity", "updates[]"],
      class: ["quantity-selector__input"],
    },
    removefromcart_btn_attributes: {
      "data-remove-item": ["cart-template"],
      "data-cart-remove": ["Remove"],
      "aria-label": ["Remove"],
      class: [
        "cart__remove-btn",
        "cart__remove",
        "cart__removee",
        "cart-item__remove",
        "item-remove",
        "remove",
        "rebuy-cart__flyout-item-remove",
        "cart_ac_remove",
        "cartacremove",
        "previewCartItem-remove",
        "cart-remove",
        "btn-remove",
        "remove-product",
        "ajaxcart__qty-remove",
        "quick-cart__item-remove",
        "cart-remove-line",
      ],
      id: ["CartDrawer-Remove"],
      href: ["/cart/change?id=", "/cart/change?line="],
    },
    checkout_btn_attributes: {
      name: ["checkout"],
      class: [
        "upcart-checkout-button",
        "cart__submit",
        "checkout-trigger",
        "rebuy-cart__checkout-button",
        "button-checkout",
        "checkout-btn",
        "cart__checkout-button",
      ],
      href: ["/checkout"],
      id: ["CartDrawer-Checkout", "checkout"],
      value: ["Checkout"],
    },
    collection_prod_click_attributes: {
      href: ["/products/"],
      class: ["boost-pfs-addtocart-select-options"],
    },
    collection_atc_attributes: {
      name: ["add"],
      class: [
        "add-to-cart-btn",
        "hit-buy-button",
        "product-form__cart-submit",
        "spf-product__form-btn-addtocart",
        "add-to-cart",
        "boost-pfs-addtocart-btn",
        "js_addtc",
        "pratc",
      ],
      type: ["submit"],
      "aria-label": ["Add to cart"],
      id: ["product-add-to-cart"],
    },
    search_prod_click_attributes: {
      href: ["/products/"],
      class: [
        "add-to-cart-btn",
        "hit-buy-button",
        "product-form__cart-submit",
        "spf-product__form-btn-addtocart",
        "add-to-cart",
        "boost-pfs-addtocart-btn",
        "js_addtc",
        "pratc",
      ],
    },
    header_nav_btn_attributes: {
      class: ["header-shortlink", "header__menu-item", "nav-bar__link"],
      id: [],
    },
    disclosure_attributes: {
      class: ["disclosure__link"],
    },
    accordion_summary_attributes: {
      class: ["accordion__title", "accordion"],
    },
    hero_banner_area_attributes: {
      class: [
        "banner__box",
        "banner__column-inner banner__column-inner--hero banner__column-inner--hero-large",
      ],
    },
    hero_banner_title_attributes: {
      class: [
        "banner__heading",
        "content__title content__title--hero content__title--hero-large",
      ],
    },
    hero_banner_subtitle_attributes: {
      class: [
        "content__subtitle content__subtitle--hero content__subtitle--hero-large",
      ],
    },
    hero_banner_cta_attributes: {
      class: [
        "content__buttons content__buttons--hero content__buttons--hero-large",
      ],
    },
    general_atc_btn_attributes: {
      class: ["Sd_addProduct"],
    },
    global_atc_functions: ["pplrAddToCartCompleted"],
    foundElements: [],
    foundAtcElementForms: [],
    foundBoostElements: [],
  };

  /*
  Methods defined in this version:
  - analyzify
    - log
    - findQuantity
    - getQueryParam
    - getCookieValue
    - GetClickedProductPosition
    - hashUserData
    - getEffectiveReferrer
    - fetchProductByHandle
    - extractProductHandle
    - normalizeProductObj
    - getProductFromElement
    - getProductUrl
    - normalizeImageUrl
  - getClientId
  - getSessionId
  - analyzify_updateCartAttributes
  - analyzify_checksendcartdata
  - findElemInPath
  - processProductIDFormat
  */

  if (
    window.analyzify.hasOwnProperty("log") === false ||
    window.analyzify.log === undefined
  ) {
    window.analyzify.log = function (message, ...args) {
      console.log(message, ...args);
    };
  }

  let custom_classes = window.analyzify_custom_classes;
  let each_element;

  if (
    custom_classes !== undefined &&
    custom_classes != "" &&
    custom_classes != "null"
  ) {
    if (custom_classes.includes(",")) {
      each_element = custom_classes.split(",");
    } else {
      custom_classes = custom_classes + ",";
      each_element = custom_classes.split(",");
    }
    for (var i = 0; i < each_element.length; i++) {
      if (each_element[i].includes(":")) {
        var aClass = each_element[i].split(":");
        if (aClass[0] == "delete") {
          if (analyzify.hasOwnProperty(aClass[1])) {
            if (analyzify[aClass[1]].hasOwnProperty(aClass[2])) {
              if (analyzify[aClass[1]][aClass[2]].includes(aClass[3])) {
                var ind = analyzify[aClass[1]][aClass[2]].indexOf(aClass[3]);
                analyzify[aClass[1]][aClass[2]].splice(ind, 1);
              }
            }
          }
        } else if (analyzify.hasOwnProperty(aClass[0])) {
          if (analyzify[aClass[0]].hasOwnProperty(aClass[1])) {
            if (!analyzify[aClass[0]][aClass[1]].includes(aClass[2])) {
              analyzify[aClass[0]][aClass[1]].push(aClass[2]);
            }
          } else {
            analyzify[aClass[0]][aClass[1]] = [];
            analyzify[aClass[0]][aClass[1]].push(aClass[2]);
          }
        }
      }
    }
  }

  // Fast hash function (djb2 algorithm) for cart attribute change detection
  window.analyzify.hashString = function(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(36);
  };

  /**
   * Per-key hash-based change detection for cart attributes
   * @param {Object} attributes - The attributes to check for changes
   * @param {Object} options - Configuration options
   * @param {string} options.namespace - Storage namespace ('cart' for update.js, 'upsert' for cart upsert)
   * @param {Array<string>} options.skipKeys - Keys to skip from comparison (e.g., for consent-based filtering)
   * @param {boolean} options.ignoreRemovedKeys - If true, don't detect removed/undefined keys as changes
   * @returns {{ hasChanges: boolean, changedKeys: string[] }}
   */
  window.analyzify.detectChangesByHash = function(attributes, options = {}) {
    const { namespace = 'cart', skipKeys = [], ignoreRemovedKeys = false } = options;

    const storageKey = `azfy_hashes_${namespace}`;
    let prevHashes = {};

    try {
      const stored = window.analyzify.sessionStorage.get(storageKey);
      if (stored) {
        prevHashes = JSON.parse(stored);
      }
    } catch (e) {
      prevHashes = {};
    }

    const changedKeys = [];
    const newHashes = {};
    const hashFn = window.analyzify.hashString;
    const skipSet = new Set(skipKeys);

    for (const key in attributes) {
      if (skipSet.has(key)) continue;
      if (attributes[key] === undefined || attributes[key] === null) continue;

      const valueStr = typeof attributes[key] === 'string'
        ? attributes[key]
        : JSON.stringify(attributes[key]);
      const hash = hashFn(valueStr);
      newHashes[key] = hash;

      if (prevHashes[key] !== hash) {
        changedKeys.push(key);
      }
    }

    // Check for removed keys (excluding skipped ones) - skip if ignoreRemovedKeys is true
    if (!ignoreRemovedKeys) {
      for (const key in prevHashes) {
        if (skipSet.has(key)) continue;
        if (!(key in newHashes)) {
          changedKeys.push(key);
        }
      }
    }

    const hasChanges = changedKeys.length > 0;

    if (hasChanges) {
      window.analyzify.sessionStorage.save(storageKey, JSON.stringify(newHashes));
    }

    if (hasChanges) {
      changedKeys.forEach(key => {
        const prevHash = prevHashes[key] || 'none';
        const newHash = newHashes[key] || 'removed';
        const newValue = attributes[key];
        window.analyzify.log(
          `[${namespace}] Key changed: ${key}`,
          "an_analyzify",
          `prevHash: ${prevHash}, newHash: ${newHash}, value: ${JSON.stringify(newValue)}`
        );
      });
    } else {
      window.analyzify.log(
        `[${namespace}] Hash detection: NO CHANGE`,
        "an_analyzify",
        "No changes detected"
      );
    }

    return { hasChanges, changedKeys };
  };

  window.analyzify.findQuantity = function () {
    try {
      const getQuantityValues = (attributes) => {
        const quantities = [];
        try {
          Object.entries(attributes).forEach(([key, values]) => {
            values.forEach((value) => {
              const selector = `[${key}="${value}"]`;
              const element = document.querySelector(selector);
              if (element && element.value) {
                quantities.push(element.value);
              }
            });
          });
        } catch (error) {
          console.error("Error finding quantity elements:", error);
        }
        return quantities;
      };

      try {
        const quantities = getQuantityValues(analyzify.product_quantity);
        return Number(quantities.length > 0 ? quantities[0] : 1);
      } catch (error) {
        console.error("Error in findQuantity function:", error);
        return 1;
      }
    } catch (error) {
      console.error("Error in findQuantity function:", error);
      return 1;
    }
  };


  window.analyzify.getQueryParam = function (name) {
    const NULL_BYTE_PATTERNS = /\x00|%00|%C0%80|\\u0000|\\\\u0000|\\x00|\\\\x00|\\0+(?![0-9])|\\\\0+(?![0-9])|&#0+;|&#x0+;|\\u\{0+\}/gi;
    try {
      const value = new URLSearchParams(window.location.search).get(name);
      if (!value) return null;

      let cleaned = value.replace(NULL_BYTE_PATTERNS, '');

      try {
        return decodeURIComponent(encodeURIComponent(cleaned)) || null;
      } catch (_) {
        return cleaned.replace(/[^\x20-\x7E]/g, '') || null;
      }
    } catch (_) {
      return null;
    }
  };

  window.analyzify.isPathSegmentPresent = function (segment) {
    try {
      if (typeof segment !== "string" || segment.trim() === "") {
        throw new Error("Invalid segment: must be a non-empty string.");
      }

      const currentPath = window.location.pathname;
      return currentPath.includes(segment);
    } catch (error) {
      console.error(`Error in isPathSegmentPresent function:`, error);
      return false; // Return false as a fallback in case of an error
    }
  };

  // Local Storage Helpers
  window.analyzify.checkLocalStorageSize = function () {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
      const usagePercentage = (totalSize / estimatedLimit) * 100;

      window.analyzify.log(
        `LocalStorage usage: ${totalSize} bytes (${usagePercentage.toFixed(
          2
        )}%)`,
        "an_analyzify",
        "checkLocalStorageSize"
      );

      return {
        totalSize: totalSize,
        usagePercentage: usagePercentage,
        isOverLimit: usagePercentage >= 75,
      };
    } catch (error) {
      window.analyzify.log(error, "an_analyzify", "checkLocalStorageSize");
      return { totalSize: 0, usagePercentage: 0, isOverLimit: false };
    }
  };

  // Dispatches a custom event for external listeners
  window.analyzify.dispatchEvent = function (name, payload) {
    try {
      analyzify.log(payload, "an_analyzify", "dispatchEvent");
      if (window.hasOwnProperty("CustomEvent")) {
        window.dispatchEvent(
          new CustomEvent(`azfy:${name}`, {
            detail: { name, payload: payload || {} },
          })
        );
        analyzify.log(
          "CustomEvent dispatched",
          `azfy:${name}`,
          "an_analyzify",
          "dispatchEvent"
        );
      }
      if (window.hasOwnProperty("Shopify")) {
        let publishToShopify = function(retryCount) {
          if (Shopify.analytics && Shopify.analytics.publish) {
            Shopify.analytics.publish(`azfy:${name}`, {
              name,
              payload: payload || {},
            });
            analyzify.log(
              "Shopify.analytics.publish dispatched",
              `azfy:${name}`,
              "an_analyzify",
              "dispatchEvent"
            );
          } else if (retryCount < 10) {
            setTimeout(function() { publishToShopify(retryCount + 1); }, 100);
          }
        };
        publishToShopify(0);
      }
    } catch (e) {
      window.analyzify.log(e, "an_analyzify", "dispatchEvent");
    }
  };

  // Flattens nested objects into dot notation keys
  // Example: { a: { b: 1 } } → { 'a.b': 1 }
  window.analyzify.flattenObject = function (obj, parentKey = "", result = {}) {
    try {
      if (obj && typeof obj === "object") {
        for (const key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          const value = obj[key];

          // Normalize all brackets: key[value] → key.value
          const safeKey = key.replace(/\[|\]/g, ".").replace(/\.+/g, ".");
          const newKey = parentKey ? `${parentKey}.${safeKey}` : safeKey;

          if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            window.analyzify.flattenObject(value, newKey, result);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              const arrayKey = `${newKey}.${index}`;
              if (item !== null && typeof item === "object") {
                window.analyzify.flattenObject(item, arrayKey, result);
              } else {
                result[arrayKey] = String(item);
              }
            });
          } else {
            result[newKey] = String(value);
          }
        }
      }
      analyzify.log(result, "an_analyzify.js", "flattenObject");
      return result;
    } catch (e) {
      console.error("Error in flattenObject", e);
    }
  };

  window.analyzify.resetLocalStorage = function (key) {
    try {
      if (key) {
        // Reset specific key only
        analyzify.log(
          `Resetting ${key} due to localStorage size limit`,
          key,
          "an_analyzify",
          "resetLocalStorage"
        );
        localStorage.removeItem(key);
        analyzify.log(
          `${key} reset completed`,
          key,
          "an_analyzify",
          "resetLocalStorage"
        );
      } else {
        localStorage.clear();
        analyzify.log(
          "All localStorage reset completed",
          "an_analyzify",
          "resetLocalStorage",
          "localStorage.clear()"
        );
      }
    } catch (error) {
      window.analyzify.log(error, "an_analyzify", "resetLocalStorage");
    }
  };

  window.analyzify.saveToLocalStorage = function (key, value) {
    try {
      if (value) {
        const valueToStore =
          typeof value === "object" ? JSON.stringify(value) : value;
        localStorage.setItem(key, valueToStore);
      }
    } catch (error) {
      window.analyzify.log(error, "an_analyzify", "saveToLocalStorage");

      // Check localStorage size and reset if over 70%
      const sizeInfo = window.analyzify.checkLocalStorageSize();
      if (sizeInfo.isOverLimit) {
        window.analyzify.resetLocalStorage("azfy_utm_history");
        window.analyzify.resetLocalStorage("azfy_utm_history_atr");
        try {
          if (value) {
            const valueToStore =
              typeof value === "object" ? JSON.stringify(value) : value;
            localStorage.setItem(key, valueToStore);
            window.analyzify.log(
              `Successfully saved ${key} after localStorage reset`,
              "an_analyzify",
              "saveToLocalStorage"
            );
          }
        } catch (retryError) {
          window.analyzify.log(
            `Failed to save ${key} even after localStorage reset`,
            "an_analyzify",
            "saveToLocalStorage"
          );
          window.analyzify.log(
            retryError,
            "an_analyzify",
            "saveToLocalStorage"
          );
        }
      }
    }
  };

  window.analyzify.getFromLocalStorage = function (key) {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch (error) {
      analyzify.log(error, "an_analyzify", "getFromLocalStorage");
      return null;
    }
  };

  window.analyzify.deleteFromLocalStorage = function (key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      analyzify.log(
        `Error removing ${key} from localStorage:`,
        "an_analyzify",
        "deleteFromLocalStorage"
      );
      analyzify.log(error, "an_analyzify", "deleteFromLocalStorage");
    }
  };

  window.analyzify.cookieStorage = {
    get: function (cookieName) {
      try {
        const name = cookieName + "=";
        let cookies;

        try {
          const decodedCookie = decodeURIComponent(document.cookie);
          cookies = decodedCookie.split(";");
        } catch (decodeError) {
          window.analyzify.log(decodeError, "an_analyzify", "cookieStorage.get");
          cookies = document.cookie.split(";");
        }

        for (let cookie of cookies) {
          cookie = cookie.trim();
          if (cookie.startsWith(name)) {
            const value = cookie.substring(name.length);
            try {
              return decodeURIComponent(value);
            } catch (decodeError) {
              window.analyzify.log(decodeError, "an_analyzify", "cookieStorage.get");
              return value;
            }
          }
        }
        return null;
      } catch (error) {
        window.analyzify.log(error, "an_analyzify", "cookieStorage.get");
        return null;
      }
    },
    save: function (key, value, maxAge = 2592000) {
      try {
        if (value) {
          const cookieValue =
            typeof value === "object" ? JSON.stringify(value) : value;
          document.cookie = `${key}=${cookieValue}; path=/; max-age=${maxAge}`; // Default: 30 days (30 * 24 * 60 * 60)
        }
      } catch (error) {
        window.analyzify.log(error, "an_analyzify", "cookieStorage.save");
      }
    },

    delete: function (key) {
      try {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      } catch (error) {
        window.analyzify.log(error, "an_analyzify", "cookieStorage.delete");
      }
    },

    // If data exceeds limit, reset the cookie
    saveWithSizeLimit: function (key, data, maxAge = 2592000) {
      try {
        const MAX_COOKIE_SIZE = 2048;

        const valueStr = typeof data === 'string' ? data : JSON.stringify(data);

        if (valueStr.length > MAX_COOKIE_SIZE) {
          window.analyzify.log(
            `Cookie ${key} exceeds ${MAX_COOKIE_SIZE}B (${valueStr.length}B), deleting`,
            'an_analyzify',
            'cookieStorage.saveWithSizeLimit'
          );
          this.delete(key);
          return false;
        }

        this.delete(key);
        document.cookie = `${key}=${valueStr}; path=/; max-age=${maxAge}`;
        return true;
      } catch (error) {
        window.analyzify.log(error, 'an_analyzify', 'cookieStorage.saveWithSizeLimit');
        return false;
      }
    },
  };

  // Safe cart id reader with fallbacks
  window.analyzify.getCartId = function () {
    try {
      const getFn = window?.analyzify?.cookieStorage && typeof window.analyzify.cookieStorage.get === "function" ? window.analyzify.cookieStorage.get : null;
      const rawCart = getFn ? getFn("cart") : (document?.cookie || "").split("; ").find(c => c.startsWith("cart="))?.split("=")[1];
      if (typeof rawCart === "string" && rawCart) {
        return rawCart.split("?")[0] || null;
      }
      return null;
    } catch (_e) {
      return null;
    }
  };

  // Backward compatibility function for v3; see analyzify-functions-v3.js
  window.analyzify.getCookieValue = function (cookieName) {
    return window.analyzify.cookieStorage.get(cookieName);
  };

  window.analyzify.parseQueryString = function (queryString) {
    const query = {};

    try {
      if (!queryString || typeof queryString !== "string") {
        analyzify.log(
          "queryString is empty",
          "an_analyzify",
          "parseQueryString"
        );
        return query;
      }

      const pairs = (
        queryString[0] === "?" ? queryString.slice(1) : queryString
      ).split("&");

      for (const pair of pairs) {
        if (!pair) continue;
        const [key, ...values] = pair.split("=");
        const decodedKey = decodeURIComponent(key);
        if (decodedKey) {
          query[decodedKey] = decodeURIComponent(values.join("=") || "");
        }
      }
    } catch (error) {
      analyzify.log(error, "an_analyzify", "parseQueryString");
    }
    analyzify.log(query, "an_analyzify", "parseQueryString");
    return query;
  };

  window.analyzify.urlReplace = (function (param) {
    let initialParams = null;

    return function (param) {
      try {
        if (!param) {
          analyzify.log("No param found", "an_analyzify", "urlReplace");
          return window.location.href;
        }

        if (!initialParams) {
          initialParams = window.analyzify.parseQueryString(param);
        }

        const currentParams = window.analyzify.parseQueryString(
          window.location.search
        );
        const params = new URLSearchParams(window.location.search);
        let updated = false;

        for (const key in initialParams) {
          if (initialParams.hasOwnProperty(key) && !currentParams[key]) {
            params.set(key, initialParams[key]);
            updated = true;
          }
        }

        if (!updated) return window.location.href;

        const url = new URL(window.location.href);
        url.search = params.toString();
        return url.toString();
      } catch (error) {
        analyzify.log(error, "an_analyzify", "urlReplace");
        return window.location.href;
      }
    };
  })();

  window.analyzify.storageService = function (key, value) {
    if (typeof key !== "string") return null;
    if (typeof value === "undefined") {
      return localStorage.getItem(key);
    } else {
      localStorage.setItem(key, value);
      return true;
    }
  };

  // Master email — captured at any email source (forms, generate_lead),
  // used as fallback for any event that needs email (Klaviyo, server-side, etc.).
  // Consent-gated on write. 30-day expiration via cookie.
  window.analyzify.setEmail = function (email) {
    if (!email || typeof email !== "string" || !email.includes("@")) return;
    if (window.analyzify?.current_consent?.ad_storage !== "granted") return;
    window.analyzify.cookieStorage.save("azfy_email", email, 30 * 24 * 60 * 60);
    // Clean up any legacy localStorage entry from previous storage strategy
    try { localStorage.removeItem("azfy_email"); } catch (e) {}
  };

  window.analyzify.getEmail = function () {
    try {
      return window.analyzify?.shopify_customer?.email_address
        || window.analyzify.cookieStorage.get("azfy_email")
        || null;
    } catch (e) {
      return null;
    }
  };

  // Builds a Shopify cart permalink (e.g. https://shop.com/cart/12345:1,67890:2).
  // Used for Klaviyo Started Checkout's checkout_url before a real Shopify
  // checkout token is available — the click-based fire point doesn't have one.
  window.analyzify.buildCartPermalink = function (cart) {
    try {
      const shopDomain =
        window.location.hostname ||
        window.analyzify?.properties?.SERVERSIDE?.shop_domain;
      if (!cart?.items?.length || !shopDomain) return null;
      const path = cart.items
        .filter((i) => i?.variant_id && i?.quantity)
        .map((i) => `${i.variant_id}:${i.quantity}`)
        .join(",");
      if (!path) return null;
      return `https://${shopDomain}/cart/${path}`;
    } catch (e) {
      return null;
    }
  };

  window.analyzify.SSAP_vals = function () {
    try {
      const get_SSAP = window.analyzify.cookieStorage.get("_shopify_sa_p");
      let SSAP_vals = {};

      if (get_SSAP) {
        try {
          const decodedValue = decodeURIComponent(get_SSAP);
          if (decodedValue) {
            SSAP_vals = {
              cookie_decoded: decodedValue || null,
              herited_url: window.analyzify.urlReplace(decodedValue) || null,
            };
          }
        } catch (error) {
          console.error("Error decoding _shopify_sa_p cookie:", error);
        }
      } else {
        // If no cookie, use URL parameters
        const urlParams = window.location.search;
        if (urlParams) {
          SSAP_vals = {
            cookie_decoded: urlParams.slice(1) || null,
            herited_url: window.location.href || null,
          };
        }
      }
      return SSAP_vals;
    } catch (error) {
      analyzify.log(error, "an_analyzify", "SSAP_vals");
      return {};
    }
  };

  if (window?.analyzify?.market) {
    window.analyzify.cookieStorage.save('azfy_market', window.analyzify.market);
  }
  if (window?.analyzify?.shop) {
    window.analyzify.cookieStorage.save('azfy_shop', window.analyzify.shop);
  }

  window.getClientId = async function (measurementId) {
    try {
      // const cachedClientId = getFromLocalStorage("clientId");
      // if (cachedClientId) return cachedClientId;

      const gaCookie = window.analyzify.cookieStorage.get("_ga");

      if (gaCookie) {
        const match = gaCookie.match(/GA\d+\.\d+\.(\d+\.\d+)/);
        if (match) {
          const clientId = match[1];
          window.analyzify.saveToLocalStorage("clientId", clientId);

          analyzify.log(
            `Client ID from cookie: ${clientId}`,
            "an_analyzify",
            "getClientId"
          );

          return clientId;
        }
      }

      if (window.gtag && measurementId) {
        try {
          const clientId = await new Promise((resolve) =>
            window.gtag("get", measurementId, "client_id", resolve)
          ).then((clientId) => clientId);
          window.analyzify.saveToLocalStorage("clientId", clientId);

          analyzify.log(
            `Client ID from gtag: ${clientId}`,
            "an_analyzify",
            "getClientId"
          );

          return clientId;
        } catch (error) {
          analyzify.log(error, "an_analyzify", "getClientId");
        }
      }
      return null;
    } catch (error) {
      analyzify.log(error, "an_analyzify", "getClientId");
      return null;
    }
  };

  window.getSessionId = async function (measurementId) {
    try {
      if (!measurementId) {
        const isValid = (id) =>
          id && id !== "null" && id !== "undefined" && id.startsWith("G-");

        measurementId =
          [
            window?.analyzify_measurement_id,
            window?.analyzify?.measurement_id,
            window?.analyzify?.properties?.GA4?.primary?.id,
            window.analyzify?.properties?.SERVERSIDE?.measurement_id,
            window?.analyzify_measurement_id_v3,
          ].find(isValid) || null;
      }
      if (!measurementId?.startsWith("G-")) {
        window.analyzify.log(
          "No valid measurementId found - unable to retrieve session ID, or measurementId does not start with G-",
          null,
          "an_analyzify",
          "getSessionId"
        );
        return null;
      }

      const cookieName = `_ga_${measurementId.substring(2)}`;
      const gaCookie = window.analyzify.cookieStorage.get(cookieName);

      if (gaCookie) {
        let match;
        if (gaCookie.startsWith("GS1")) {
          match = gaCookie.match(/GS1\.\d+\.(\d+)/);
        } else if (gaCookie.startsWith("GS2")) {
          match = gaCookie.match(/GS2\.\d+\.s(\d+)/);
        }
        const sessionId = match?.[1];

        if (
          sessionId &&
          window.analyzify.storageService("sessionId") !== sessionId
        ) {
          window.analyzify.storageService("sessionId", sessionId);
        }

        window.analyzify.log(
          `sessionId (gaCookie): ${sessionId}`,
          sessionId ? sessionId : null,
          "an_analyzify",
          "getSessionId"
        );
        if (sessionId) return sessionId;
      } else {
        // Try to find any _ga_ cookie with sessionId
        const allCookies = document.cookie.split(';');
        const gaCookies = allCookies.filter(cookie => cookie.trim().startsWith('_ga_'));

        for (const cookie of gaCookies) {
          const [cookieName, cookieValue] = cookie.trim().split('=');
          if (cookieValue) {
            let match;
            if (cookieValue.startsWith("GS1")) {
              match = cookieValue.match(/GS1\.\d+\.(\d+)/);
            } else if (cookieValue.startsWith("GS2")) {
              match = cookieValue.match(/GS2\.\d+\.s(\d+)/);
            }
            const sessionId = match?.[1];
            if (sessionId) {
              if (window.analyzify.storageService("sessionId") !== sessionId) {
                window.analyzify.storageService("sessionId", sessionId);
              }
              return sessionId;
            }
          }
        }
      }

      if (window.gtag) {
        const sessionId = await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("gtag session_id retrieval timed out"));
          }, 1000);

          window.gtag("get", measurementId, "session_id", (sessionId) => {
            clearTimeout(timeoutId);
            resolve(sessionId);
          });
        }).catch((error) => {
          console.warn("Error fetching session ID from gtag:", error);
          return null;
        });

        if (
          sessionId &&
          window.analyzify.storageService("sessionId") !== sessionId
        ) {
          window.analyzify.storageService("sessionId", sessionId);
        }

        window.analyzify.log(
          `sessionId (gtag): ${sessionId}`,
          sessionId ? sessionId : null,
          "an_analyzify",
          "getSessionId"
        );
        if (sessionId) return sessionId;
      }

      const fallbackSessionId = window.analyzify.storageService("sessionId") || null;
      return fallbackSessionId;
    } catch (error) {
      window.analyzify.log(`getSessionId error: ${error}`, "an_analyzify", "getSessionId");
      return null;
    }
  };

  // Session Storage Utility
  window.analyzify.sessionStorage = {
    save: function (key, value) {
      try {
        if (value) {
          // If value is an object or array, stringify it
          const valueToStore =
            typeof value === "object" ? JSON.stringify(value) : value;
          sessionStorage.setItem(key, valueToStore);
        }
      } catch (error) {
        analyzify.log(error, "an_analyzify", "sessionStorage.save");
      }
    },
    get: function (key) {
      try {
        const value = sessionStorage.getItem(key);
        return value;
      } catch (error) {
        analyzify.log(error, "an_analyzify", "sessionStorage.get");
        return null;
      }
    },
    remove: function (key) {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        analyzify.log(
          `Error removing ${key} from sessionStorage:`,
          "an_analyzify",
          "sessionStorage.remove"
        );
        analyzify.log(error, "an_analyzify", "sessionStorage.remove");
      }
    },
  };

  // UTM History Utility - Get latest UTM parameters from session storage
  window.analyzify.getLatestUtmFromHistory = function () {
    try {
      const utmHistory = window.analyzify.sessionStorage.get("azfy_utm_history");

      if (!utmHistory) {
        return {
          utm_source: null,
          utm_medium: null,
          utm_campaign: null,
          utm_content: null,
          utm_term: null
        };
      }

      // Parse the JSON if it's a string
      const parsedHistory = typeof utmHistory === 'string' ? JSON.parse(utmHistory) : utmHistory;

      if (!Array.isArray(parsedHistory) || parsedHistory.length === 0) {
        return {
          utm_source: null,
          utm_medium: null,
          utm_campaign: null,
          utm_content: null,
          utm_term: null
        };
      }

      // Find the entry with the latest timestamp
      const latestEntry = parsedHistory.reduce((latest, current) => {
        return (current.timestamp > latest.timestamp) ? current : latest;
      });

      // Map the abbreviated keys to full UTM parameter names
      return {
        utm_source: latestEntry.src || null,
        utm_medium: latestEntry.med || null,
        utm_campaign: latestEntry.camp || null,
        utm_content: latestEntry.cont || null,
        utm_term: latestEntry.term || null
      };

    } catch (error) {
      analyzify.log(`getLatestUtmFromHistory error: ${error}`, "an_analyzify", "getLatestUtmFromHistory");
      return {
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null
      };
    }
  };

  // Collect Cart Data
  window.collectCartData = async function (measurementId) {
    try {
      const attributionMode = window.analyzify?.properties?.SERVERSIDE?.azfy_attribution;
      const isDualMode = attributionMode === 'dual';
      const isTrueMode = attributionMode === 'true' || attributionMode === true;
      const isAttributionOrDualMode = isDualMode || isTrueMode;

      const useCookies = window.analyzify.useCookiesForAttributionStoring !== false;

      const paramConfig = {
        azfy_clids: {
          type: "clids",
          params: {
            gclid: {
              type: "query",
              method: "gclid",
              default: null,
              prefix: "g",
            },
            fbclid: {
              type: "query",
              method: "fbclid",
              default: null,
              prefix: "fb",
            },
            ttclid: {
              type: "query",
              method: "ttclid",
              default: null,
              prefix: "tt",
            },
          },
        },
        azfy_cookies: {
          type: "cookies",
          params: {
            fbp: {
              type: "cookie",
              method: "_fbp",
              default: null,
              prefix: "fbp",
            },
            fbc: {
              type: "cookie",
              method: "_fbc",
              default: null,
              prefix: "fbc",
            },
            ttp: {
              type: "cookie",
              method: "_ttp",
              default: null,
              prefix: "tt",
            },
            ga: {
              type: "async",
              method: "getClientId",
              args: [measurementId],
              default: null,
              prefix: "ga",
            },
            kx: {
              type: "direct",
              method: () => {
                try {
                  // URL param takes priority on email-click landings
                  const urlKx = new URLSearchParams(window.location.search).get("_kx");
                  if (urlKx) return urlKx;
                  // Fall back to __kla_id cookie
                  const match = document.cookie.match(/(?:^|;\s*)__kla_id=([^;]+)/);
                  if (!match) return null;
                  const decoded = JSON.parse(atob(decodeURIComponent(match[1])));
                  return decoded?.$exchange_id || null;
                } catch (e) {
                  return null;
                }
              },
              default: null,
              prefix: "kx",
            },
            ...(measurementId
              ? {
                  [`ga_${measurementId.substring(2)}`]: {
                    type: "async",
                    method: "getSessionId",
                    args: [measurementId],
                    default: null,
                    prefix: `ga_${measurementId.substring(2)}`,
                  },
                }
              : {}),
          },
        },
        azfy_utm_history: {
          type: "utm_history",
          params: {
            utm_source: {
              type: "query",
              method: "utm_source",
              default: null,
              prefix: "src",
            },
            utm_medium: {
              type: "query",
              method: "utm_medium",
              default: null,
              prefix: "med",
            },
            utm_campaign: {
              type: "query",
              method: "utm_campaign",
              default: null,
              prefix: "camp",
            },
            utm_content: {
              type: "query",
              method: "utm_content",
              default: null,
              prefix: "cont",
            },
            utm_term: {
              type: "query",
              method: "utm_term",
              default: null,
              prefix: "term",
            },
            utm_id: {
              type: "query",
              method: "utm_id",
              default: null,
              prefix: "id",
            },
            azfy_pid: {
              type: "query",
              method: "pida",
              default: null,
              prefix: "pid",
            },
            azfy_referrer: {
              type: "direct",
              method: () => {
                const ref = document.referrer;
                if (ref === "") return "direct";

                const extractDomain = (hostname) => {
                  if (!hostname) return hostname;
                  const parts = hostname.split('.');

                  if (parts.length === 1) return hostname;

                  if (parts.length === 2) return hostname;

                  const ccTLDs = ['co.uk', 'com.de', 'co.fr', 'com.es', 'com.it', 'com.pl', 'com.nl', 'com.be', 'com.se', 'com.dk', 'com.fi', 'com.no', 'com.at', 'com.ch', 'com.ie', 'com.pt', 'com.gr', 'com.cz', 'com.hu', 'com.sk', 'com.si', 'com.hr', 'com.lt', 'com.lv', 'com.ee', 'com.ro', 'com.bg', 'com.cy', 'com.mt'];
                  const lastTwoParts = parts.slice(-2).join('.');

                  if (parts.length >= 3 && ccTLDs.includes(lastTwoParts)) {
                    return parts.slice(-3).join('.');
                  }
                  return parts.slice(-2).join('.');
                };
                try {
                  const currentDomain = extractDomain(window.location.hostname);
                  const referrerDomain = extractDomain(new URL(ref).hostname);
                  return currentDomain === referrerDomain ? null : ref;
                } catch (error) {
                  return ref;
                }
              },
              default: null,
              prefix: "ref",
            },
          },
        },
        azfy_consent: {
          type: "direct",
          method: () =>
            !window.analyzify.consent_active ||
            (window.analyzify.current_consent?.ad_storage === "granted" &&
              window.analyzify.current_consent?.analytics_storage ===
                "granted"),
          default: null,
        },
        azfy_cart_id: {
          type: "direct",
          method: () => window.analyzify.cart_id,
          default: null,
        },
      };

      if (!window.analyzify.cart_attributes) {
        window.analyzify.cart_attributes = {};
      }
      if (!window.analyzify.extractedCartDataObj) {
        window.analyzify.extractedCartDataObj = {};
      }

      async function formatClidsAndCookies(config) {
        const values = {};

        // For CLIDs: preserve existing values from session storage
        if (config.type === "clids") {
          const storedValue = window.analyzify.sessionStorage.get("azfy_clids");
          if (storedValue) {
            try {
              const parsed = JSON.parse(storedValue);
              if (Array.isArray(parsed)) {
                // Parse existing array format like ["g:123", "fb:456"]
                parsed.forEach(item => {
                  if (typeof item === 'string' && item.includes(':')) {
                    const [prefix, ...valueParts] = item.split(':');
                    const value = valueParts.join(':');
                    // Find the key for this prefix
                    for (const [k, cfg] of Object.entries(config.params)) {
                      if (cfg.prefix === prefix) {
                        values[k] = item; // Keep the full prefixed format
                        break;
                      }
                    }
                  }
                });
              }
            } catch (e) {
              // Continue with empty values if parsing fails
            }
          }
        }

        for (const [key, paramConfig] of Object.entries(config.params)) {
          if (paramConfig.type === "query") {
            const value =
              window.analyzify.getQueryParam(paramConfig.method) ||
              paramConfig.default;

            if (value) {
              values[key] = paramConfig.prefix
                ? `${paramConfig.prefix}:${value}`
                : value;
            }
            // If no value in URL and this is NOT a CLID config, set to null
            // If it IS a CLID config and no value in URL, keep existing (already set above)
            else if (config.type !== "clids") {
              values[key] = null;
            } else if (!values[key]) {
              // CLID not in URL and no existing value - set to null
              values[key] = null;
            }
          } else if (
            paramConfig.type === "cookie" ||
            paramConfig.type === "async"
          ) {
            let value;
            if (paramConfig.type === "cookie") {
              value =
                window.analyzify.cookieStorage.get(paramConfig.method) ||
                paramConfig.default;

              // for the cases where fbclid changes but our method runs before meta sets the new fbc cookie
              //causing mismatched fbc and fbclid values. retrying a few times with delays to get the updated fbc cookie.
              if (paramConfig.method === "_fbc") {
                const fbclid = window.analyzify.getQueryParam('fbclid');

                if (fbclid && value) {
                  const maxRetries = 10;

                  for (let i = 0; i < maxRetries; i++) {
                    const fbcLastPart = value.split('.').pop();

                    if (fbcLastPart === fbclid) {
                      if (i > 0) window.analyzify.log(`_fbc match found after ${i} retries: ${value}`, 'an_analyzify', 'formatClidsAndCookies');
                      break;
                    }

                    window.analyzify.log(`_fbc mismatch: cookie=${fbcLastPart}, fbclid=${fbclid}. Retry ${i + 1}/${maxRetries}`, 'an_analyzify', 'formatClidsAndCookies');

                    await new Promise(resolve => setTimeout(resolve, 500));

                    value = window.analyzify.cookieStorage.get(paramConfig.method) || paramConfig.default;

                    if (!value) break;

                    if (i === maxRetries - 1) {
                      window.analyzify.log(`_fbc still mismatched after ${maxRetries} retries: cookie=${value}, fbclid=${fbclid}`, 'an_analyzify', 'formatClidsAndCookies');
                    }
                  }
                } else {
                  window.analyzify.log(`_fbc cookie retrieved: ${value} (fbclid: ${fbclid || 'null'})`, 'an_analyzify', 'formatClidsAndCookies');
                }
              }
            } else {
              value =
                (await window[paramConfig.method](...paramConfig.args)) ||
                paramConfig.default;
            }
            if (value) {
              values[key] = paramConfig.prefix
                ? `${paramConfig.prefix}:${value}`
                : value;
            } else {
              values[key] = null;
            }
          } else if (paramConfig.type === "direct") {
            const value = paramConfig.method();
            if (value) {
              values[key] = paramConfig.prefix
                ? `${paramConfig.prefix}:${value}`
                : value;
            } else {
              values[key] = null;
            }
          }
        }

        const valuesArray = Object.values(values);
        if (valuesArray.every((value) => value === null)) {
          return undefined;
        }
        return valuesArray;
      }

      async function formatClidsAndCookiesAttribution(config) {
        const record = {};

        // persist existing attributes from cart_attributes or session storage
        const existingAttributeKey = config.type === "clids" ? "azfy_clids_atr" : "azfy_cookies_atr";
        let existingAttributes = window.analyzify.cart_attributes?.[existingAttributeKey];

        if (!existingAttributes) {
          const storedValue = window.analyzify.sessionStorage.get(existingAttributeKey);
          if (storedValue) {
            try {
              const parsed = JSON.parse(storedValue);
              if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                existingAttributes = parsed;
              }
            } catch (e) {
              window.analyzify.log(`Error parsing stored ${existingAttributeKey}: ${e}`, 'an_analyzify', 'formatClidsAndCookiesAttribution');
            }
          }
        }

        if (existingAttributes && typeof existingAttributes === "object" && !Array.isArray(existingAttributes)) {
          // Copy existing attribution to preserve it
          Object.assign(record, existingAttributes);
          window.analyzify.log(`Preserving existing ${existingAttributeKey}: ${JSON.stringify(existingAttributes)}`, 'an_analyzify', 'formatClidsAndCookiesAttribution');
        }

        for (const [, paramConfig] of Object.entries(config.params)) {
          if (paramConfig.type === "query") {
            const currentValue = window.analyzify.getQueryParam(paramConfig.method);
            if (currentValue && paramConfig.prefix) {
              // Always update with the latest URL parameter value
              const existingValue = record[paramConfig.prefix];
              record[paramConfig.prefix] = String(currentValue);
              if (!existingValue) {
                window.analyzify.log(`New attribution detected: ${paramConfig.prefix}=${currentValue}`, 'an_analyzify', 'formatClidsAndCookiesAttribution');
              } else if (existingValue !== currentValue) {
                window.analyzify.log(`Updated attribution: ${paramConfig.prefix}=${existingValue} → ${currentValue}`, 'an_analyzify', 'formatClidsAndCookiesAttribution');
              }
            }
            // If URL parameter is not present, keep existing value (already preserved above)
          } else if (
            paramConfig.type === "cookie" ||
            paramConfig.type === "async"
          ) {
            let value;
            if (paramConfig.type === "cookie") {
              // First try cookieStorage, then fallback to direct cookie reading
              value = window.analyzify.cookieStorage.get(paramConfig.method) ||
                      window.analyzify?.getCookieValue?.(paramConfig.method) ||
                      (typeof window.getCookieValue === 'function' ? window.getCookieValue(paramConfig.method) : null) ||
                paramConfig.default;

              // for the cases where fbclid changes but our method runs before meta sets the new fbc cookie
              //causing mismatched fbc and fbclid values. retrying a few times with delays to get the updated fbc cookie.
              if (paramConfig.method === "_fbc") {
                const fbclid = window.analyzify.getQueryParam('fbclid');

                if (fbclid && value) {
                  const maxRetries = 10;

                  for (let i = 0; i < maxRetries; i++) {
                    const fbcLastPart = value.split('.').pop();

                    if (fbcLastPart === fbclid) {
                      if (i > 0) window.analyzify.log(`_fbc match found after ${i} retries: ${value}`, 'an_analyzify', 'formatClidsAndCookiesAttribution');
                      break;
                    }

                    window.analyzify.log(`_fbc mismatch: cookie=${fbcLastPart}, fbclid=${fbclid}. Retry ${i + 1}/${maxRetries}`, 'an_analyzify', 'formatClidsAndCookiesAttribution');

                    await new Promise(resolve => setTimeout(resolve, 500));

                    value = window.analyzify.cookieStorage.get(paramConfig.method) ||
                            window.analyzify?.getCookieValue?.(paramConfig.method) ||
                            (typeof window.getCookieValue === 'function' ? window.getCookieValue(paramConfig.method) : null) ||
                            paramConfig.default;

                    if (!value) break;

                    if (i === maxRetries - 1) {
                      window.analyzify.log(`_fbc still mismatched after ${maxRetries} retries: cookie=${value}, fbclid=${fbclid}`, 'an_analyzify', 'formatClidsAndCookiesAttribution');
                    }
                  }
                } else {
                  window.analyzify.log(`_fbc cookie retrieved: ${value} (fbclid: ${fbclid || 'null'})`, 'an_analyzify', 'formatClidsAndCookiesAttribution');
                }
              }
            } else {
              value =
                (await window[paramConfig.method](...paramConfig.args)) ||
                paramConfig.default;
            }
            if (value && paramConfig.prefix) {
              record[paramConfig.prefix] = String(value);
            }
          } else if (paramConfig.type === "direct") {
            const value = paramConfig.method();
            if (value && paramConfig.prefix) {
              record[paramConfig.prefix] = String(value);
            }
          }
        }
        return Object.keys(record).length ? record : undefined;
      }
      // Formatting to be used if azfy_attrbution is false
      function formatUtmHistory(config) {
        const currentCartId = window.analyzify.cart_id;
        const lastKnownCartId =
          window.analyzify.getFromLocalStorage("azfy_cart_id");
        const cartIdChanged = currentCartId !== lastKnownCartId;

        const restoreSessionFromStorage = () => {
          const sessionHistoryStr =
            window.analyzify.sessionStorage.get("azfy_utm_history");
          const fallbackHistoryStr = !useCookies
            ? window.analyzify.getFromLocalStorage("azfy_utm_history")
            : window.analyzify.cookieStorage.get("azfy_utm_history");
          const currentCartId = window.analyzify.cart_id;

          if (
            (!sessionHistoryStr || sessionHistoryStr === "{}") &&
            fallbackHistoryStr &&
            currentCartId
          ) {
            try {
              const fallbackHistory = JSON.parse(fallbackHistoryStr);
              const matchingEntries = {};

              Object.keys(fallbackHistory).forEach((timestamp) => {
                const entry = fallbackHistory[timestamp];
                const entryCartId =
                  entry.cartId || (Array.isArray(entry) ? currentCartId : null);

                if (entryCartId === currentCartId) {
                  matchingEntries[timestamp] = entry;
                }
              });

              if (Object.keys(matchingEntries).length > 0) {
                window.analyzify.sessionStorage.save(
                  "azfy_utm_history",
                  JSON.stringify(matchingEntries)
                );
              }
            } catch (e) {
              window.analyzify.log("error restoring session from storage:", e);
            }
          }
        };

        restoreSessionFromStorage();

        // Format referrer value to strip protocol and www, keeping only domain
        const formatRefValue = (refUrl) => {
          if (!refUrl || refUrl === "direct") return refUrl;

          try {
            const url = new URL(refUrl);
            let hostname = url.hostname;

            // Remove www. prefix if present
            if (hostname.startsWith("www.")) {
              hostname = hostname.substring(4);
            }

            // Return only the clean domain name
            return hostname;
          } catch (e) {
            // Fallback to original referrer if URL parsing fails
            return refUrl;
          }
        };

        // Check if UTM value is a placeholder that should be excluded
        const isPlaceholderValue = (value) => {
          if (!value || typeof value !== "string") return false;

          const placeholderPatterns = [
            "{source}",
            "{medium}",
            "{campaign}",
            "{content}",
            "{term}",
            "{id}",
          ];

          return placeholderPatterns.includes(value.toLowerCase());
        };

        const currentValues = {};

        const utmValues = {
          utm_source: config.params.utm_source.default,
          utm_medium: config.params.utm_medium.default,
          utm_campaign: config.params.utm_campaign.default,
          utm_content: config.params.utm_content.default,
          utm_term: config.params.utm_term.default,
          utm_id: config.params.utm_id.default,
          azfy_pid: config.params.azfy_pid.default,
          azfy_referrer: config.params.azfy_referrer.default,
        };

        for (const [utmKey, utmConfig] of Object.entries(config.params)) {
          if (utmConfig.type === "direct") {
            currentValues[utmKey] = utmConfig.method();
          } else if (utmConfig.type === "query") {
            const queryValue = window.analyzify.getQueryParam(utmConfig.method);
            currentValues[utmKey] = queryValue || utmConfig.default;
          }
          if (currentValues[utmKey] !== null) {
            // Check if UTM value is a placeholder and treat as empty
            if (isPlaceholderValue(currentValues[utmKey])) {
              utmValues[utmKey] = null;
            } else {
              // Format referrer value if it's the azfy_referrer
              if (utmKey === "azfy_referrer") {
                utmValues[utmKey] = formatRefValue(currentValues[utmKey]);
              } else {
                utmValues[utmKey] = currentValues[utmKey];
              }
            }
          }
        }

        // Format UTM values with prefixes like clids/cookies
        const formattedUtmValues = [];
        for (const [key, value] of Object.entries(utmValues)) {
          if (value !== null && value !== undefined) {
            const paramConfig = config.params[key];
            if (paramConfig && paramConfig.prefix) {
              formattedUtmValues.push(`${paramConfig.prefix}:${value}`);
            }
          }
        }

        // Return undefined if no UTM values exist
        if (formattedUtmValues.length === 0) {
          return undefined;
        }

        const existingSessionHistoryStr =
          window.analyzify.sessionStorage.get("azfy_utm_history");
        const existingCookieHistoryStr = !useCookies
          ? null
          : window.analyzify.cookieStorage.get("azfy_utm_history");
        const existingLocalHistoryStr =
          window.analyzify.getFromLocalStorage("azfy_utm_history");
        let existingSessionHistory = {};
        let existingCookieHistory = {};
        let existingLocalHistory = {};

        // Parse session storage history
        if (existingSessionHistoryStr && existingSessionHistoryStr !== "{}") {
          try {
            existingSessionHistory = JSON.parse(existingSessionHistoryStr);
          } catch (e) {
            window.analyzify.log(
              "Error parsing utm_history",
              e,
              "an_analyzify",
              "handleUtmHistory"
            );
            existingSessionHistory = {};
          }
        }

        // Parse cookie history
        if (existingCookieHistoryStr && existingCookieHistoryStr !== "{}") {
          try {
            existingCookieHistory = JSON.parse(existingCookieHistoryStr);
          } catch (e) {
            console.log("Error parsing cookie utm_history", e);
            existingCookieHistory = {};
          }
        }

        // Parse local storage history
        if (existingLocalHistoryStr && existingLocalHistoryStr !== "{}") {
          try {
            existingLocalHistory = JSON.parse(existingLocalHistoryStr);
          } catch (e) {
            console.log("Error parsing local utm_history", e);
            existingLocalHistory = {};
          }
        }

        if (cartIdChanged) {
          if (currentCartId) {
            window.analyzify.saveToLocalStorage("azfy_cart_id", currentCartId);
          }
        }

        // Add cartId to all existing entries that don't have it
        const addCartIdToHistory = (history) => {
          const updated = {};
          Object.keys(history).forEach((timestamp) => {
            const entry = history[timestamp];
            if (Array.isArray(entry)) {
              // Old format - convert to new format with cartId
              updated[timestamp] = {
                values: entry,
                cartId: window.analyzify.cart_id,
              };
            } else if (entry && typeof entry === "object" && entry.values) {
              // Already has cartId format, but check if cartId is null/undefined
              updated[timestamp] = {
                values: entry.values,
                cartId: entry.cartId || window.analyzify.cart_id,
              };
            }
          });
          return updated;
        };

        // Merge all histories prioritizing session > cookie > local
        let existingHistory = {
          ...existingLocalHistory,
          ...existingCookieHistory,
          ...existingSessionHistory,
        };

        // Get the most recent entry (highest timestamp)
        const timestamps = Object.keys(existingHistory).sort(
          (a, b) => parseInt(b) - parseInt(a)
        );
        const lastTimestamp = timestamps[0];

        // Check if last entry needs cartId update (check against original format)
        let needsCartIdUpdate = false;
        if (lastTimestamp) {
          const lastEntry = existingHistory[lastTimestamp];
          needsCartIdUpdate =
            Array.isArray(lastEntry) ||
            !lastEntry.cartId ||
            lastEntry.cartId === null;
        }

        let isDuplicate = false;
        if (lastTimestamp) {
          const lastEntry = existingHistory[lastTimestamp];
          // Handle both old format (array) and new format (object with values)
          const entryValues = Array.isArray(lastEntry)
            ? lastEntry
            : lastEntry.values;

          // Compare formatted UTM values array with last entry
          if (Array.isArray(entryValues) && Array.isArray(formattedUtmValues)) {
            isDuplicate =
              entryValues.length === formattedUtmValues.length &&
              entryValues.every(
                (value, index) => value === formattedUtmValues[index]
              );
          } else if (
            entryValues &&
            typeof entryValues === "object" &&
            !Array.isArray(entryValues)
          ) {
            // Handle old object format - force new entry for migration
            isDuplicate = false;
          }
        }

        // Check if session storage is empty - if so, always allow adding UTM values
        const isSessionStorageEmpty =
          Object.keys(existingSessionHistory).length === 0;

        // SPA: flag set by SDK | Full page load: fallback to referrer hostname check
        const referrerIsSameDomain = document.referrer
          ? new URL(document.referrer).hostname === window.location.hostname
          : false;
        const isSameDomain = window.analyzify._isSameDomainNavigation || referrerIsSameDomain;

        if ((!isDuplicate && !isSameDomain) || isSessionStorageEmpty) {
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const cartId = window.analyzify.cart_id;

          // Ensure all histories have cartId structure before adding new entry
          existingSessionHistory = addCartIdToHistory(existingSessionHistory);
          existingCookieHistory = addCartIdToHistory(existingCookieHistory);
          existingLocalHistory = addCartIdToHistory(existingLocalHistory);

          // Create UTM entry with both values and cartId for all storage types
          const utmEntryWithCartId = {
            values: formattedUtmValues,
            cartId: cartId,
          };

          existingHistory[timestamp] = utmEntryWithCartId;
          existingSessionHistory[timestamp] = utmEntryWithCartId;
          existingCookieHistory[timestamp] = utmEntryWithCartId;
          existingLocalHistory[timestamp] = utmEntryWithCartId;

          // Save to all storage types with cartId structure - save each individual history
          window.analyzify.sessionStorage.save(
            "azfy_utm_history",
            JSON.stringify(existingSessionHistory)
          );
          if (useCookies) {
            window.analyzify.cookieStorage.saveWithSizeLimit(
              "azfy_utm_history",
              JSON.stringify(existingCookieHistory)
            );
          }
          window.analyzify.saveToLocalStorage(
            "azfy_utm_history",
            JSON.stringify(existingLocalHistory)
          );
        } else if (needsCartIdUpdate) {
          existingSessionHistory = addCartIdToHistory(existingSessionHistory);
          if (useCookies) {
            existingCookieHistory = addCartIdToHistory(existingCookieHistory);
          }
          existingLocalHistory = addCartIdToHistory(existingLocalHistory);

          window.analyzify.sessionStorage.save(
            "azfy_utm_history",
            JSON.stringify(existingSessionHistory)
          );
          if (useCookies) {
            window.analyzify.cookieStorage.saveWithSizeLimit(
              "azfy_utm_history",
              JSON.stringify(existingCookieHistory)
            );
          }
          window.analyzify.saveToLocalStorage(
            "azfy_utm_history",
            JSON.stringify(existingLocalHistory)
          );
        }

        // For cart_attributes, return only the values without cartId structure
        const sessionHistoryForCartAttributes = {};
        Object.keys(existingSessionHistory).forEach((timestamp) => {
          const entry = existingSessionHistory[timestamp];
          sessionHistoryForCartAttributes[timestamp] = entry.values || entry;
        });

        const formattedUTMHistory =
          Object.keys(sessionHistoryForCartAttributes).length === 0
            ? null
            : sessionHistoryForCartAttributes;

        return formattedUTMHistory;
      }


      const formatUtmHistoryAttribution = (config) => {
        const currentCartId = window.analyzify.cart_id;
        const lastKnownCartId =
          window.analyzify.getFromLocalStorage("azfy_cart_id");
        const cartIdChanged = currentCartId !== lastKnownCartId;

        const restoreSessionFromStorage = () => {
          const sessionHistoryStr =
            window.analyzify.sessionStorage.get("azfy_utm_history_atr");
          const fallbackHistoryStr = !useCookies
            ? window.analyzify.getFromLocalStorage("azfy_utm_history_atr")
            : window.analyzify.cookieStorage.get("azfy_utm_history_atr");
          const currentCartId = window.analyzify.cart_id;

          if (
            (!sessionHistoryStr || sessionHistoryStr === "{}") &&
            fallbackHistoryStr &&
            currentCartId
          ) {
            try {
              const parsed = JSON.parse(fallbackHistoryStr);
              const matchingEntries = {};

              const tokensFromEntryObj = (obj) => {
                if (!obj || typeof obj !== "object") return [];
                const pairs = [];
                const mapping = { src: "src", med: "med", camp: "camp", cont: "cont", term: "term", id: "id", ref: "ref", pid: "pid" };
                Object.keys(mapping).forEach((k) => {
                  if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
                    pairs.push(`${mapping[k]}:${obj[k]}`);
                  }
                });
                return pairs;
              };

              if (Array.isArray(parsed)) {
                // New array format in storage
                parsed.forEach((item) => {
                  const ts = item && (item.timestamp || item.ts);
                  const entryCartId = item && item.cartId ? item.cartId : null;
                  if (ts && entryCartId === currentCartId) {
                    matchingEntries[String(ts)] = {
                      values: tokensFromEntryObj(item),
                      cartId: entryCartId,
                    };
                  }
                });
              } else if (parsed && typeof parsed === "object") {
                // Legacy object map in storage
                Object.keys(parsed).forEach((timestamp) => {
                  const entry = parsed[timestamp];
                  const entryCartId = entry && entry.cartId ? entry.cartId : (Array.isArray(entry) ? currentCartId : null);
                  if (entryCartId === currentCartId) {
                    matchingEntries[timestamp] = entry;
                  }
                });
              }

              if (Object.keys(matchingEntries).length > 0) {
                // Write session as array-of-objects
                const keyMap = { src: "src", med: "med", camp: "camp", cont: "cont", term: "term", id: "id", ref: "ref", pid: "pid" };
                const toArrayFormat = (obj) => {
                  return Object.keys(obj)
                    .sort((a, b) => parseInt(a) - parseInt(b))
                    .map((ts) => {
                      const entry = obj[ts];
                      const values = Array.isArray(entry?.values) ? entry.values : (Array.isArray(entry) ? entry : []);
                      const out = { timestamp: Number(ts) || parseInt(ts, 10) || null };
                      values.forEach((token) => {
                        const parts = String(token || "").split(":");
                        const p = parts[0];
                        const v = parts.slice(1).join(":");
                        const mapped = keyMap[p];
                        if (mapped && v) out[mapped] = v;
                      });
                      return out;
                    });
                };
                const arrSession = toArrayFormat(matchingEntries);
                window.analyzify.sessionStorage.save(
                  "azfy_utm_history_atr",
                  JSON.stringify(arrSession)
                );
              }
            } catch (e) {
              window.analyzify.log("error restoring session from storage:", e);
            }
          }
        };

        restoreSessionFromStorage();

        // Format referrer value to strip protocol and www, keeping only domain
        const formatRefValue = (refUrl) => {
          if (!refUrl || refUrl === "direct") return refUrl;

          try {
            const url = new URL(refUrl);
            let hostname = url.hostname;

            // Remove www. prefix if present
            if (hostname.startsWith("www.")) {
              hostname = hostname.substring(4);
            }

            // Return only the clean domain name
            return hostname;
          } catch (e) {
            // Fallback to original referrer if URL parsing fails
            return refUrl;
          }
        };

        // Check if UTM value is a placeholder that should be excluded
        const isPlaceholderValue = (value) => {
          if (!value || typeof value !== "string") return false;

          const placeholderPatterns = [
            "{source}",
            "{medium}",
            "{campaign}",
            "{content}",
            "{term}",
            "{id}",
          ];

          return placeholderPatterns.includes(value.toLowerCase());
        };

        const currentValues = {};

        const utmValues = {
          utm_source: config.params.utm_source.default,
          utm_medium: config.params.utm_medium.default,
          utm_campaign: config.params.utm_campaign.default,
          utm_content: config.params.utm_content.default,
          utm_term: config.params.utm_term.default,
          utm_id: config.params.utm_id.default,
          azfy_pid: config.params.azfy_pid.default,
          azfy_referrer: config.params.azfy_referrer.default,
        };

        for (const [utmKey, utmConfig] of Object.entries(config.params)) {
          if (utmConfig.type === "direct") {
            currentValues[utmKey] = utmConfig.method();
          } else if (utmConfig.type === "query") {
            const queryValue = window.analyzify.getQueryParam(utmConfig.method);
            currentValues[utmKey] = queryValue || utmConfig.default;
          }
          if (currentValues[utmKey] !== null) {
            // Check if UTM value is a placeholder and treat as empty
            if (isPlaceholderValue(currentValues[utmKey])) {
              utmValues[utmKey] = null;
            } else {
              // Format referrer value if it's the azfy_referrer
              if (utmKey === "azfy_referrer") {
                utmValues[utmKey] = formatRefValue(currentValues[utmKey]);
              } else {
                utmValues[utmKey] = currentValues[utmKey];
              }
            }
          }
        }

        // Format UTM values with prefixes like clids/cookies
        const formattedUtmValues = [];
        for (const [key, value] of Object.entries(utmValues)) {
          if (value !== null && value !== undefined) {
            const paramConfig = config.params[key];
            if (paramConfig && paramConfig.prefix) {
              formattedUtmValues.push(`${paramConfig.prefix}:${value}`);
            }
          }
        }

        // Return undefined if no UTM values exist
        if (formattedUtmValues.length === 0) {
          return undefined;
        }

        const existingSessionHistoryStr =
          window.analyzify.sessionStorage.get("azfy_utm_history_atr");
        const existingCookieHistoryStr = !useCookies
          ? null
          : window.analyzify.cookieStorage.get("azfy_utm_history_atr");
        const existingLocalHistoryStr =
          window.analyzify.getFromLocalStorage("azfy_utm_history_atr");
        let existingSessionHistory = {};
        let existingCookieHistory = {};
        let existingLocalHistory = {};

        // Parse session storage history (supports array-of-objects and object map)
        if (existingSessionHistoryStr && existingSessionHistoryStr !== "{}") {
          try {
            const parsedSession = JSON.parse(existingSessionHistoryStr);
            if (Array.isArray(parsedSession)) {
              const rebuilt = {};
              const tokensFromEntryObj = (obj) => {
                if (!obj || typeof obj !== "object") return [];
                const pairs = [];
                const mapping = { src: "src", med: "med", camp: "camp", cont: "cont", term: "term", id: "id", ref: "ref", pid: "pid" };
                Object.keys(mapping).forEach((k) => {
                  if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
                    pairs.push(`${mapping[k]}:${obj[k]}`);
                  }
                });
                return pairs;
              };
              parsedSession.forEach((item) => {
                const ts = item && (item.timestamp || item.ts);
                if (!ts) return;
                rebuilt[String(ts)] = {
                  values: tokensFromEntryObj(item),
                  cartId: item && item.cartId ? item.cartId : null,
                };
              });
              existingSessionHistory = rebuilt;
            } else if (parsedSession && typeof parsedSession === "object") {
              existingSessionHistory = parsedSession;
            } else {
              existingSessionHistory = {};
            }
          } catch (e) {
            window.analyzify.log(
              "Error parsing utm_history_atr",
              e,
              "an_analyzify",
              "handleUtmHistory"
            );
            existingSessionHistory = {};
          }
        }

        // Parse cookie history (supports array-of-objects and object map)
        if (existingCookieHistoryStr && existingCookieHistoryStr !== "{}") {
          try {
            const parsedCookie = JSON.parse(existingCookieHistoryStr);
            if (Array.isArray(parsedCookie)) {
              const rebuiltCookie = {};
              const tokensFromEntryObj = (obj) => {
                if (!obj || typeof obj !== "object") return [];
                const pairs = [];
                const mapping = { src: "src", med: "med", camp: "camp", cont: "cont", term: "term", id: "id", ref: "ref", pid: "pid" };
                Object.keys(mapping).forEach((k) => {
                  if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
                    pairs.push(`${mapping[k]}:${obj[k]}`);
                  }
                });
                return pairs;
              };
              parsedCookie.forEach((item) => {
                const ts = item && (item.timestamp || item.ts);
                if (!ts) return;
                rebuiltCookie[String(ts)] = {
                  values: tokensFromEntryObj(item),
                  cartId: item && item.cartId ? item.cartId : null,
                };
              });
              existingCookieHistory = rebuiltCookie;
            } else if (parsedCookie && typeof parsedCookie === "object") {
              existingCookieHistory = parsedCookie;
            } else {
              existingCookieHistory = {};
            }
          } catch (e) {
            console.log("Error parsing cookie utm_history", e);
            existingCookieHistory = {};
          }
        }

        // Parse local storage history (supports array-of-objects and object map)
        if (existingLocalHistoryStr && existingLocalHistoryStr !== "{}") {
          try {
            const parsedLocal = JSON.parse(existingLocalHistoryStr);
            if (Array.isArray(parsedLocal)) {
              const rebuiltLocal = {};
              const tokensFromEntryObj = (obj) => {
                if (!obj || typeof obj !== "object") return [];
                const pairs = [];
                const mapping = { src: "src", med: "med", camp: "camp", cont: "cont", term: "term", id: "id", ref: "ref", pid: "pid" };
                Object.keys(mapping).forEach((k) => {
                  if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
                    pairs.push(`${mapping[k]}:${obj[k]}`);
                  }
                });
                return pairs;
              };
              parsedLocal.forEach((item) => {
                const ts = item && (item.timestamp || item.ts);
                if (!ts) return;
                rebuiltLocal[String(ts)] = {
                  values: tokensFromEntryObj(item),
                  cartId: item && item.cartId ? item.cartId : null,
                };
              });
              existingLocalHistory = rebuiltLocal;
            } else if (parsedLocal && typeof parsedLocal === "object") {
              existingLocalHistory = parsedLocal;
            } else {
              existingLocalHistory = {};
            }
          } catch (e) {
            console.log("Error parsing local utm_history", e);
            existingLocalHistory = {};
          }
        }

        if (cartIdChanged) {
          if (currentCartId) {
            window.analyzify.saveToLocalStorage("azfy_cart_id", currentCartId);
          }
        }

        // Add cartId to all existing entries that don't have it
        const addCartIdToHistory = (history) => {
          const updated = {};
          Object.keys(history).forEach((timestamp) => {
            const entry = history[timestamp];
            if (Array.isArray(entry)) {
              // Old format - convert to new format with cartId
              updated[timestamp] = {
                values: entry,
                cartId: window.analyzify.cart_id,
              };
            } else if (entry && typeof entry === "object" && entry.values) {
              // Already has cartId format, but check if cartId is null/undefined
              updated[timestamp] = {
                values: entry.values,
                cartId: entry.cartId || window.analyzify.cart_id,
              };
            }
          });
          return updated;
        };

        // Merge all histories prioritizing session > cookie > local
        let existingHistory = {
          ...existingLocalHistory,
          ...existingCookieHistory,
          ...existingSessionHistory,
        };

        // Get the most recent entry (highest timestamp)
        const timestamps = Object.keys(existingHistory).sort(
          (a, b) => parseInt(b) - parseInt(a)
        );
        const lastTimestamp = timestamps[0];

        // Check if last entry needs cartId update (check against original format)
        let needsCartIdUpdate = false;
        if (lastTimestamp) {
          const lastEntry = existingHistory[lastTimestamp];
          needsCartIdUpdate =
            Array.isArray(lastEntry) ||
            !lastEntry.cartId ||
            lastEntry.cartId === null;
        }

        // Order-insensitive duplicate check against last entry only
        const tokensToMap = (arr) => {
          const map = {};
          if (Array.isArray(arr)) {
            arr.forEach((token) => {
              if (typeof token !== "string") return;
              const idx = token.indexOf(":");
              if (idx === -1) return;
              const k = token.slice(0, idx);
              const v = token.slice(idx + 1);
              if (k) map[k] = v;
            });
          }
          return map;
        };
        const mapsEqual = (a, b) => {
          const aKeys = Object.keys(a);
          const bKeys = Object.keys(b);
          if (aKeys.length !== bKeys.length) return false;
          for (let i = 0; i < aKeys.length; i++) {
            const k = aKeys[i];
            if (a[k] !== b[k]) return false;
          }
          return true;
        };
        const currMap = tokensToMap(formattedUtmValues);
        let isDuplicate = false;
        // Only check the last entry for duplicates to allow proper journey tracking
        if (lastTimestamp) {
          const lastEntry = existingHistory[lastTimestamp];
          const lastEntryValues = Array.isArray(lastEntry) ? lastEntry : lastEntry?.values;
          if (Array.isArray(lastEntryValues)) {
            const lastMap = tokensToMap(lastEntryValues);
            isDuplicate = mapsEqual(lastMap, currMap);
          }
        }

        // Check if session storage is empty - if so, always allow adding UTM values
        const isSessionStorageEmpty =
          Object.keys(existingSessionHistory).length === 0;

        // SPA: flag set by SDK | Full page load: fallback to referrer hostname check
        const referrerIsSameDomain = document.referrer
          ? new URL(document.referrer).hostname === window.location.hostname
          : false;
        const isSameDomain = window.analyzify._isSameDomainNavigation || referrerIsSameDomain;

        // Add only if not duplicate, and either cross-domain referrer or session history is empty
        if ((!isDuplicate && !isSameDomain) || isSessionStorageEmpty) {
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const cartId = window.analyzify.cart_id;

          // Ensure all histories have cartId structure before adding new entry
          existingSessionHistory = addCartIdToHistory(existingSessionHistory);
          existingCookieHistory = addCartIdToHistory(existingCookieHistory);
          existingLocalHistory = addCartIdToHistory(existingLocalHistory);

          // Create UTM entry with both values and cartId for all storage types
          const utmEntryWithCartId = {
            values: formattedUtmValues,
            cartId: cartId,
          };

          existingHistory[timestamp] = utmEntryWithCartId;
          existingSessionHistory[timestamp] = utmEntryWithCartId;
          existingCookieHistory[timestamp] = utmEntryWithCartId;
          existingLocalHistory[timestamp] = utmEntryWithCartId;

          // Save all storages as array-of-objects; include cartId for cookie/local
          const keyMap = { src: "src", med: "med", camp: "camp", cont: "cont", term: "term", id: "id", ref: "ref", pid: "pid" };
          const toArrayFormat = (obj, includeCartId) => {
            return Object.keys(obj)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((ts) => {
                const entry = obj[ts];
                const values = Array.isArray(entry?.values) ? entry.values : (Array.isArray(entry) ? entry : []);
                const out = { timestamp: Number(ts) || parseInt(ts, 10) || null };
                values.forEach((token) => {
                  const parts = String(token || "").split(":");
                  const p = parts[0];
                  const v = parts.slice(1).join(":");
                  const mapped = keyMap[p];
                  if (mapped && v) out[mapped] = v;
                });
                if (includeCartId) out.cartId = entry?.cartId || null;
                return out;
              });
          };
          const sessionArray = toArrayFormat(existingSessionHistory, false);
          const localArray = toArrayFormat(existingLocalHistory, true);

          // Attribution format always uses _atr suffix
          window.analyzify.sessionStorage.save("azfy_utm_history_atr", JSON.stringify(sessionArray));
          if (useCookies) {
            const cookieArray = toArrayFormat(existingCookieHistory, true);
            window.analyzify.cookieStorage.saveWithSizeLimit("azfy_utm_history_atr", cookieArray);
          }
          window.analyzify.saveToLocalStorage("azfy_utm_history_atr", JSON.stringify(localArray));
        } else if (needsCartIdUpdate) {
          existingSessionHistory = addCartIdToHistory(existingSessionHistory);
          if (useCookies) {
            existingCookieHistory = addCartIdToHistory(existingCookieHistory);
          }
          existingLocalHistory = addCartIdToHistory(existingLocalHistory);

          // Save all storages as array-of-objects; include cartId for cookie/local
          const keyMap2 = { src: "src", med: "med", camp: "camp", cont: "cont", term: "term", id: "id", ref: "ref", pid: "pid" };
          const toArrayFormat2 = (obj, includeCartId) => {
            return Object.keys(obj)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((ts) => {
                const entry = obj[ts];
                const values = Array.isArray(entry?.values) ? entry.values : (Array.isArray(entry) ? entry : []);
                const out = { timestamp: Number(ts) || parseInt(ts, 10) || null };
                values.forEach((token) => {
                  const parts = String(token || "").split(":");
                  const p = parts[0];
                  const v = parts.slice(1).join(":");
                  const mapped = keyMap2[p];
                  if (mapped && v) out[mapped] = v;
                });
                if (includeCartId) out.cartId = entry?.cartId || null;
                return out;
              });
          };
          const sessionArray2 = toArrayFormat2(existingSessionHistory, false);
          const localArray2 = toArrayFormat2(existingLocalHistory, true);

          // Attribution format always uses _atr suffix
          window.analyzify.sessionStorage.save("azfy_utm_history_atr", JSON.stringify(sessionArray2));
          if (useCookies) {
            const cookieArray2 = toArrayFormat2(existingCookieHistory, true);
            window.analyzify.cookieStorage.saveWithSizeLimit("azfy_utm_history_atr", cookieArray2);
          }
          window.analyzify.saveToLocalStorage("azfy_utm_history_atr", JSON.stringify(localArray2));
        }

        // Build array-of-objects format for attribution
        const keyMap = {
          src: "src",
          med: "med",
          camp: "camp",
          cont: "cont",
          term: "term",
          id: "id",
          ref: "ref",
          pid: "pid",
        };
        // Prefer array stored in session; fallback to converting in-memory map
        let utmArray = null;
        try {
          const sessionStr = window.analyzify.sessionStorage.get("azfy_utm_history");
          const parsed = sessionStr ? JSON.parse(sessionStr) : null;
          if (Array.isArray(parsed)) utmArray = parsed;
        } catch (_) {}
        if (!utmArray) {
          utmArray = [];
          Object.keys(existingSessionHistory)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach((timestamp) => {
              const entry = existingSessionHistory[timestamp];
              const values = Array.isArray(entry?.values)
                ? entry.values
                : Array.isArray(entry)
                ? entry
                : [];
              const obj = { timestamp: Number(timestamp) || parseInt(timestamp, 10) || null };
              values.forEach((token) => {
                const parts = String(token || "").split(":");
                const p = parts[0];
                const v = parts.slice(1).join(":");
                const mapped = keyMap[p];
                if (mapped && v !== undefined && v !== null && v !== "") {
                  obj[mapped] = v;
                }
              });
              utmArray.push(obj);
            });
        }
        return utmArray && utmArray.length ? utmArray : null;
      }

      async function getValue(key, config) {
        try {
          let value;

          switch (config.type) {
            case "utm_history":
              if (isDualMode) {
                // Dual mode: generate both formats
                const legacyValue = formatUtmHistory(config);
                const attributionValue = formatUtmHistoryAttribution(config);

                // Store attribution format separately
                window.analyzify.cart_attributes['azfy_utm_history_atr'] = attributionValue;

                window.analyzify.log(
                  `dual mode: legacy=${JSON.stringify(legacyValue)}, attribution=${JSON.stringify(attributionValue)}`,
                  'an_analyzify',
                  'getValue'
                );

                // Return legacy format for main cart_attributes
                value = legacyValue || config.default;
              } else {
                value = (attributionMode
                  ? formatUtmHistoryAttribution(config)
                  : formatUtmHistory(config)) || config.default;

                // In 'true' mode, also store in _atr key for consistency with dual mode
                if (attributionMode) {
                  window.analyzify.cart_attributes['azfy_utm_history_atr'] = value;

                  window.analyzify.log(
                    `true mode azfy_utm_history: attribution=${JSON.stringify(value)}`,
                    'an_analyzify',
                    'getValue'
                  );
                }
              }
              break;
            case "clids":
            case "cookies":
              if (isDualMode) {
                // Dual mode: generate both formats
                const legacyValue = await formatClidsAndCookies(config);
                const attributionValue = await formatClidsAndCookiesAttribution(config);

                // Store attribution format separately with _atr suffix
                const atrKey = `${key}_atr`;
                window.analyzify.cart_attributes[atrKey] = attributionValue;

                window.analyzify.log(
                  `dual mode ${key}: legacy=${JSON.stringify(legacyValue)}, attribution=${JSON.stringify(attributionValue)}`,
                  'an_analyzify',
                  'getValue'
                );

                // Return legacy format for main cart_attributes
                value = legacyValue;
              } else {
                value = (attributionMode
                  ? await formatClidsAndCookiesAttribution(config)
                  : await formatClidsAndCookies(config));

                // In 'true' mode, also store in _atr key for consistency with dual mode
                if (attributionMode) {
                  const atrKey = `${key}_atr`;
                  window.analyzify.cart_attributes[atrKey] = value;

                  window.analyzify.log(
                    `true mode ${key}: attribution=${JSON.stringify(value)}`,
                    'an_analyzify',
                    'getValue'
                  );
                }
              }
              break;
            case "cookie":
              value =
                window.analyzify.cookieStorage.get(config.method) ||
                config.default;
              break;
            case "query":
              value =
                window.analyzify.getQueryParam(config.method) || config.default;
              break;
            case "async":
              value =
                (await window[config.method](...config.args)) || config.default;
              break;
            case "direct":
              value = config.method();
              break;
            default:
              value = config.default;
          }

          return value;
        } catch (error) {
          window.analyzify.log(
            `Error getting ${key}: ${error}`,
            "an_analyzify",
            "collectCartData"
          );
          return null;
        }
      }

      async function processParam(key, config) {
        let value = await getValue(key, config);

        if (value === null || value === undefined) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          value = await getValue(key, config);
        }

        if (value !== null && value !== undefined) {
          // in 'true' mode, skip creating main keys for attribution-tracked params
          const shouldSkipAssignment = isTrueMode && (key === "azfy_clids" || key === "azfy_cookies" || key === "azfy_utm_history");
          if (!shouldSkipAssignment) {
            window.analyzify.cart_attributes[key] = value;
          }

          // skip normal storage for azfy_utm_history as it's handled internally with cartId structure
          if (key !== "azfy_utm_history") {
            // for CLIDs, cookies, and consent, only save to session storage
            if (
              key === "azfy_clids" ||
              key === "azfy_cookies" ||
              key === "azfy_consent"
            ) {
              // in 'true' mode, skip creating main keys for attribution-tracked params
              const shouldSkip = isTrueMode && (key === "azfy_clids" || key === "azfy_cookies");
              if (!shouldSkip) {
                window.analyzify.sessionStorage.save(key, value);
              }

              // In dual or true mode, also save the attribution versions if they exist
              if (isAttributionOrDualMode && (key === "azfy_clids" || key === "azfy_cookies")) {
                const atrKey = `${key}_atr`;
                const atrValue = window.analyzify.cart_attributes[atrKey];
                if (atrValue !== null && atrValue !== undefined) {
                  window.analyzify.sessionStorage.save(atrKey, atrValue);
                }
              }
            } else {
              // For other parameters, save to all storage types
              window.analyzify.sessionStorage.save(key, value);
              window.analyzify.cookieStorage.save(key, value);
              window.analyzify.saveToLocalStorage(key, value);
            }
          }
        } else {
          let storedValue;

          // For CLIDs, cookies, and consent, only check session storage
          if (
            key === "azfy_clids" ||
            key === "azfy_cookies" ||
            key === "azfy_consent"
          ) {
            storedValue = window.analyzify.sessionStorage.get(key);

            // In dual or true mode, also retrieve and restore _atr versions
            if (isAttributionOrDualMode && (key === "azfy_clids" || key === "azfy_cookies")) {
              const atrKey = `${key}_atr`;
              const atrStoredValue = window.analyzify.sessionStorage.get(atrKey);
              if (atrStoredValue) {
                try {
                  const parsed = typeof atrStoredValue === 'string' &&
                    (atrStoredValue.startsWith("{") || atrStoredValue.startsWith("["))
                    ? JSON.parse(atrStoredValue)
                    : atrStoredValue;
                  window.analyzify.cart_attributes[atrKey] = parsed;
                } catch (e) {
                  window.analyzify.cart_attributes[atrKey] = atrStoredValue;
                }
              }
            }
          } else {
            // For other parameters (mainly UTM history), try all storage types as fallback
            storedValue = window.analyzify.sessionStorage.get(key);

            if (!storedValue && useCookies) {
              storedValue = window.analyzify.cookieStorage.get(key);
            }
            if (!storedValue) {
              storedValue = window.analyzify.getFromLocalStorage(key);
            }

            // For azfy_utm_history in attribution/dual mode, always check for _atr version
            if (key === "azfy_utm_history" && isAttributionOrDualMode) {
              const atrStoredValue = window.analyzify.sessionStorage.get('azfy_utm_history_atr');
              if (atrStoredValue) {
                try {
                  const atrParsed = typeof atrStoredValue === 'string' &&
                    (atrStoredValue.startsWith("{") || atrStoredValue.startsWith("["))
                    ? JSON.parse(atrStoredValue)
                    : atrStoredValue;
                  window.analyzify.cart_attributes['azfy_utm_history_atr'] = atrParsed;
                } catch (e) {
                  window.analyzify.cart_attributes['azfy_utm_history_atr'] = atrStoredValue;
                }
              }
            }
          }

          if (storedValue) {
            // Parse JSON strings back to objects for specific keys
            if (
              ((key === "azfy_clids" || key === "azfy_cookies") &&
                typeof storedValue === "string" &&
                (storedValue.startsWith("{") || storedValue.startsWith("["))) ||
              (key === "azfy_utm_history" &&
                typeof storedValue === "string" &&
                (storedValue.startsWith("{") || storedValue.startsWith("[")))
            ) {
              try {
                const parsed = JSON.parse(storedValue);

                if (key === "azfy_utm_history") {
                  // in 'true' mode, skip creating main keys for attribution-tracked params
                  if (!isTrueMode) {
                    if (Array.isArray(parsed)) {
                      // New array format in storage
                      window.analyzify.cart_attributes[key] = isAttributionOrDualMode ? parsed : [];
                    } else if (parsed && typeof parsed === "object") {
                      // Legacy map { ts: {values:[],cartId} }
                      const valuesOnly = {};
                      Object.keys(parsed).forEach((timestamp) => {
                        const entry = parsed[timestamp];
                        if (Array.isArray(entry?.values)) {
                          valuesOnly[timestamp] = entry.values;
                        } else if (Array.isArray(entry)) {
                          valuesOnly[timestamp] = entry;
                        } else {
                          valuesOnly[timestamp] = [];
                        }
                      });
                      window.analyzify.cart_attributes[key] = valuesOnly;
                    } else {
                      window.analyzify.cart_attributes[key] = isAttributionOrDualMode ? [] : {};
                    }
                  }
                } else if (key === "azfy_clids" || key === "azfy_cookies") {
                  // in 'true' mode, skip creating main keys for attribution-tracked params
                  if (!isTrueMode) {
                    // Accept stored JSON object or legacy array
                    if (Array.isArray(parsed)) {
                      window.analyzify.cart_attributes[key] = parsed;
                    } else if (parsed && typeof parsed === "object") {
                      window.analyzify.cart_attributes[key] = parsed;
                    } else {
                      window.analyzify.cart_attributes[key] = {};
                    }
                  }
                } else {
                  window.analyzify.cart_attributes[key] = parsed;
                }
              } catch (e) {
                // in 'true' mode, skip creating main keys for attribution-tracked params
                const shouldSkipRestore = isTrueMode && (key === "azfy_clids" || key === "azfy_cookies" || key === "azfy_utm_history");
                if (!shouldSkipRestore) {
                  if (key === "azfy_utm_history" && typeof storedValue === "string") {
                    window.analyzify.cart_attributes[key] = isAttributionOrDualMode ? [] : {}; // Empty fallback by mode
                  } else if ((key === "azfy_clids" || key === "azfy_cookies") && typeof storedValue === "string") {
                    // Fallback to empty object for malformed JSON
                    window.analyzify.cart_attributes[key] = {};
                  } else {
                    window.analyzify.cart_attributes[key] = storedValue;
                  }
                }
              }
            } else {
              // in 'true' mode, skip creating main keys for attribution-tracked params
              const shouldSkipRestore = isTrueMode && (key === "azfy_clids" || key === "azfy_cookies" || key === "azfy_utm_history");
              if (!shouldSkipRestore) {
                if (key === "azfy_utm_history" && typeof storedValue === "string") {
                  window.analyzify.cart_attributes[key] = isAttributionOrDualMode ? [] : {};
                } else {
                  window.analyzify.cart_attributes[key] = storedValue;
                }
              }
            }
          }
        }
      }

      const promises = Object.keys(paramConfig).map(async (key) => {
        await processParam(key, paramConfig[key]);
      });
      await Promise.all(promises);

      for (const key in paramConfig) {
        if (
          paramConfig.hasOwnProperty(key) &&
          !window.analyzify.cart_attributes.hasOwnProperty(key)
        ) {
          // in 'true' mode, skip creating main keys for attribution-tracked params
          const hasAtrVersion = key === "azfy_clids" || key === "azfy_cookies" || key === "azfy_utm_history";
          const shouldSkipMainKey = isTrueMode && hasAtrVersion;

          if (!shouldSkipMainKey) {
            window.analyzify.cart_attributes[key] = null;
          }
        }
      }

      window.analyzify.log(
        "Final cart_attributes",
        "an_analyzify",
        "collectCartData"
      );
      window.analyzify.log(
        window.analyzify.cart_attributes,
        "an_analyzify",
        "collectCartData"
      );
      if (!window.analyzify?.properties?.SERVERSIDE?.azfy_attribution) {
      const extractCartData = async (cartAttributes) => {
        const cookies = cartAttributes?.azfy_cookies || [];
        const clids = cartAttributes?.azfy_clids || [];

        const findValue = (arr, prefix) => {
          if (!Array.isArray(arr) || !arr.length) return undefined;
          const item = arr.find(
            (c) => typeof c === "string" && c.startsWith(`${prefix}:`)
          );
          return item ? item.split(":")[1] : undefined;
        };

        return {
          fbp: findValue(cookies, "fbp"),
          fbc: findValue(cookies, "fbc"),
          ttp: findValue(cookies, "tt"),
          ga: findValue(cookies, "ga"),
          kx: findValue(cookies, "kx"),
          gclid: findValue(clids, "g"),
          ttclid: findValue(clids, "tt"),
          fbclid: findValue(clids, "fb"),
        };
      };

      window.analyzify.unformattedCartDataObj = await extractCartData(
        window.analyzify.cart_attributes
      );
      // Fallback to storageService if sessionId wasn't extracted from cart attributes
      if (!window.analyzify.unformattedCartDataObj.sessionId) {
      window.analyzify.unformattedCartDataObj.sessionId =
        window.analyzify.storageService("sessionId") || null;
      }
    }

      return window.analyzify.cart_attributes;
    } catch (error) {
      window.analyzify.log(
        "Error in collectCartData:",
        "an_analyzify",
        "collectCartData"
      );

      window.analyzify.log(error, "an_analyzify", "collectCartData");
      const fallbackObject = {};
      for (const key in paramConfig) {
        if (paramConfig.hasOwnProperty(key)) {
          fallbackObject[key] = null;
        }
      }
      return fallbackObject;
    }
  };

  window.analyzify_updateCartAttributes = async function (attributes, hasChanges = false) {
    // Skip if already completed, unless hasChanges is true (force update when attributes changed)
    if (window.analyzify._updateCartAttributesCompleted && !hasChanges) {
      window.analyzify.log("updateCartAttributes already completed for this page, skipping", "an_analyzify", "analyzify_updateCartAttributes");
      return;
    }
    window.analyzify._updateCartAttributesCompleted = true;

    try {
      window.analyzify.log(
        JSON.stringify(attributes, null, 2),
        "an_analyzify",
        "analyzify_updateCartAttributes"
      );

      const requestUrlPath = "/cart/update.js?app=azfy";
      const method = "POST";
      const bodyString = JSON.stringify({ attributes });
      const bodySizeBytes = bodyString ? bodyString.length : 0;
      const buildContextLabel = () => {
        const parts = [];
        try {
          if (typeof document !== 'undefined' && document.visibilityState) {
            parts.push(`vs=${document.visibilityState}`);
          }
        } catch (_) {}
        try {
          if (typeof navigator !== 'undefined') {
            if (typeof navigator.onLine === 'boolean') parts.push(`on=${navigator.onLine ? '1' : '0'}`);
            const swActive = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
            parts.push(`sw=${swActive ? '1' : '0'}`);
          }
        } catch (_) {}
        try {
          const isNativeFetch = (typeof window !== 'undefined' && window.fetch) ? /\[native code\]/.test(String(window.fetch)) : null;
          if (isNativeFetch !== null) parts.push(`fetch=${isNativeFetch ? 'native' : 'wrapped'}`);
        } catch (_) {}
        return parts.length ? ` [ctx:${parts.join(',')}]` : '';
      };
      const canUseBeacon = (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function');
      const tryBeacon = () => {
        if (!canUseBeacon) return false;
        try {
          const blob = new Blob([bodyString], { type: 'application/json' });
          return navigator.sendBeacon(requestUrlPath, blob);
        } catch (_) { return false; }
      };
      // Optional hook: queue a beacon if page goes hidden while pending
      let removeVisibilityHook = null;
      try {
        if (canUseBeacon && typeof document !== 'undefined') {
          const onHidden = () => {
            try {
              if (document.visibilityState === 'hidden') {
                try { window.analyzify.log('sendBeacon due to visibilitychange/pagehide', 'an_analyzify', 'analyzify_updateCartAttributes'); } catch (_) {}
                tryBeacon();
              }
            } catch (_) {}
            try {
              document.removeEventListener('visibilitychange', onHidden, true);
              window.removeEventListener('pagehide', onHidden, true);
            } catch (_) {}
          };
          document.addEventListener('visibilitychange', onHidden, { once: true, capture: true });
          window.addEventListener('pagehide', onHidden, { once: true, capture: true });
          removeVisibilityHook = () => {
            try {
              document.removeEventListener('visibilitychange', onHidden, true);
              window.removeEventListener('pagehide', onHidden, true);
            } catch (_) {}
          };
        }
      } catch (_) {}

      // if page is already hidden (likely navigating/unloading), prefer beacon immediately
      try {
        if (canUseBeacon && (typeof document !== 'undefined' && document.visibilityState === 'hidden')) {
          try { window.analyzify.log('Attempting sendBeacon for cart/update.js (pre-fetch path: hidden)', 'an_analyzify', 'analyzify_updateCartAttributes'); } catch (_) {}
          const queued = tryBeacon();
          if (queued) {
            try { window.analyzify.log('sendBeacon queued for cart/update.js (pre-fetch path: hidden)', 'an_analyzify', 'analyzify_updateCartAttributes'); } catch (_) {}
            if (removeVisibilityHook) { try { removeVisibilityHook(); } catch (_) {} }
            return;
          } else {
            try { window.analyzify.log('sendBeacon queue failed (pre-fetch path), falling back to fetch', 'an_analyzify', 'analyzify_updateCartAttributes'); } catch (_) {}
          }
        }
      } catch (_) {}

      const timeoutMsCfg = Number(window.analyzify?.properties?.SERVERSIDE?.cartUpdateTimeoutMs);
      const timeoutMs = Number.isFinite(timeoutMsCfg) && timeoutMsCfg > 0 ? timeoutMsCfg : null;
      const maxRetriesCfg = Number(window.analyzify?.properties?.SERVERSIDE?.cartUpdateRetries);
      const maxRetries = Number.isFinite(maxRetriesCfg) && maxRetriesCfg >= 0 ? maxRetriesCfg : 2;
      const baseBackoffCfg = Number(window.analyzify?.properties?.SERVERSIDE?.cartUpdateRetryBackoffMs);
      const baseBackoffMs = Number.isFinite(baseBackoffCfg) && baseBackoffCfg > 0 ? baseBackoffCfg : 400;

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for (let attempt = 1; attempt <= (maxRetries + 1); attempt++) {
        const start = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const hasAbortController = (typeof AbortController !== 'undefined');
        const abortController = hasAbortController ? new AbortController() : null;
        let didTimeout = false;
        let timeoutId = null;
        if (abortController && timeoutMs) {
          timeoutId = setTimeout(() => {
            didTimeout = true;
            try { abortController.abort(); } catch (_) {}
          }, timeoutMs);
        }

        try {
          const response = await fetch(requestUrlPath, {
            method,
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            credentials: 'same-origin',
            keepalive: true,
            body: bodyString,
            signal: abortController ? abortController.signal : undefined
          });

          const duration = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) - start;
          if (timeoutId) { try { clearTimeout(timeoutId); } catch (_) {} }

          window.analyzify.log(
            `Shopify API Response: ${response.status}`,
            "an_analyzify",
            "analyzify_updateCartAttributes"
          );

            if (response.ok) {
                window.analyzify.log(
                  "Cart attributes updated successfully",
                  "an_analyzify",
                  "analyzify_updateCartAttributes"
                );
                if (removeVisibilityHook) { try { removeVisibilityHook(); } catch (_) {} }
                  // Fetch and log the cart response after successful update
                  try {
                    const cartResponse = await fetch('/cart.js', { credentials: 'same-origin' });
                    if (cartResponse.ok) {
                      const cartData = await cartResponse.json();
                      window.analyzify.log('Cart response after update:', 'an_analyzify', 'analyzify_updateCartAttributes');
                      window.analyzify.log(cartData.attributes, 'an_analyzify', 'analyzify_updateCartAttributes');
                    } else {
                      window.analyzify.log('Failed to fetch cart.js after update', 'an_analyzify', 'analyzify_updateCartAttributes');
                    }
                  } catch (err) {
                    window.analyzify.log('Error fetching cart.js after update:', 'an_analyzify', 'analyzify_updateCartAttributes');
                    window.analyzify.log(err, 'an_analyzify', 'analyzify_updateCartAttributes');
                  }
                return;
            }

            // If response is 409, fetch cart, merge attributes, and retry
            if (response.status === 409) {
              try {
                const cartResponse = await fetch('/cart.js', { credentials: 'same-origin' });
                if (cartResponse.ok) {
                  const cartData = await cartResponse.json();
                  const mergedAttributes = { ...cartData.attributes, ...attributes };
                  // Retry update.js with merged attributes
                  await fetch(requestUrlPath, {
                    method,
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    credentials: 'same-origin',
                    keepalive: true,
                    body: JSON.stringify({ attributes: mergedAttributes })
                  });
                }
              } catch (err) {
                // Silent fail
              }
                if (removeVisibilityHook) { try { removeVisibilityHook(); } catch (_) {} }
                return;
            }

          window.analyzify.log(
            `Failed to update cart attributes: ${response.status}`,
            "an_analyzify",
            "analyzify_updateCartAttributes"
          );

          if (typeof window.analyzify.ssCartUpdateFailureEvent === 'function') {
            const category = response.status >= 500 ? 'http_5xx' : (response.status >= 400 ? 'http_4xx' : 'http');
            const statusText = (typeof response.statusText === 'string' && response.statusText) ? response.statusText : '';
            const statusLabel = ({
              400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 408: 'Request Timeout', 409: 'Conflict', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout'
            }[response.status]) || '';
            const httpMessage = `HTTP ${response.status}${(statusText || statusLabel) ? ' ' + (statusText || statusLabel) : ''}`;
            let extraDetail = '';
            try {
              const ct = response.headers ? (response.headers.get && response.headers.get('content-type')) || '' : '';
              if (ct && typeof ct === 'string' && ct.indexOf('application/json') !== -1) {
                const data = await response.clone().json();
                const reason = (data && (data.message || data.error || data.errors)) ? (data.message || data.error || data.errors) : '';
                const reasonStr = typeof reason === 'string' ? reason : JSON.stringify(reason);
                extraDetail = reasonStr || '';
              } else {
                const text = await response.clone().text();
                extraDetail = text || '';
              }
            } catch (_) {}
            extraDetail = extraDetail ? String(extraDetail).replace(/\s+/g, ' ').slice(0, 120) : '';
            const fullMessage = (httpMessage + (extraDetail ? `: ${extraDetail}` : '') + buildContextLabel()).replace(/\s+/g, ' ').slice(0, 300);

            const headers_cf_ray = response && response.headers && response.headers.get ? response.headers.get('cf-ray') : null;
            const headers_server = response && response.headers && response.headers.get ? response.headers.get('server') : null;
            const headers_via = response && response.headers && response.headers.get ? response.headers.get('via') : null;
            const headers_cf_cache_status = response && response.headers && response.headers.get ? response.headers.get('cf-cache-status') : null;
            const headers_content_type = response && response.headers && response.headers.get ? response.headers.get('content-type') : null;
            const response_url = (typeof response.url === 'string' && response.url) ? response.url : null;
            const response_type = (typeof response.type === 'string' && response.type) ? response.type : null;
            const response_redirected = (typeof response.redirected === 'boolean') ? response.redirected : null;
            window.analyzify.ssCartUpdateFailureEvent({
              request_url_path: requestUrlPath,
              method,
              body_size_bytes: bodySizeBytes,
              attempt_number: attempt,
              status_code: response.status,
              error_category: category,
              error_message_sanitized: fullMessage,
              duration_ms: Math.round(duration),
              http_message: httpMessage,
              status_text: statusText || statusLabel || '',
              response_url,
              response_type,
              response_redirected,
              response_headers_cf_ray: headers_cf_ray,
              response_headers_server: headers_server,
              response_headers_via: headers_via,
              response_headers_cf_cache_status: headers_cf_cache_status,
              response_headers_content_type: headers_content_type,
              response_body_excerpt: extraDetail
            });
          }

          const isRetryableHttp = (response.status === 408 || response.status === 429 || (response.status >= 500 && response.status <= 504));
          if (attempt <= maxRetries && isRetryableHttp) {
            await sleep(baseBackoffMs * attempt);
            continue;
          }
          if (removeVisibilityHook) { try { removeVisibilityHook(); } catch (_) {} }
          return;
        } catch (err) {
          const duration = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) - start;
          if (timeoutId) { try { clearTimeout(timeoutId); } catch (_) {} }

          window.analyzify.log(err, "an_analyzify", "analyzify_updateCartAttributes");
          // If aborted/canceled or generic load failure, attempt to queue via sendBeacon as a last resort
          try {
            const name = err && err.name ? String(err.name) : '';
            const msg = err && err.message ? String(err.message) : '';
            const isAbortLike = name === 'AbortError' || /abort|cancel/i.test(msg);
            const isLoadFailed = /load failed|failed to fetch/i.test(msg);
            if (canUseBeacon && (isAbortLike || isLoadFailed)) {
              const queued = tryBeacon();
              if (queued) { if (removeVisibilityHook) { try { removeVisibilityHook(); } catch (_) {} } return; }
            }
          } catch (_) {}
          if (typeof window.analyzify.ssCartUpdateFailureEvent === 'function') {
            const isOffline = (typeof navigator !== 'undefined' && navigator.onLine === false);
            const errorName = err && err.name ? String(err.name) : null;
            const rawMessage = err && err.message ? String(err.message) : null;
            let errorMessage = 'Network error: fetch failed';
            if (isOffline) {
              errorMessage = 'Network error: browser is offline';
            } else if (errorName === 'AbortError') {
              errorMessage = didTimeout ? 'Network error: request timed out' : 'Network error: request aborted by browser';
            } else if (rawMessage) {
              errorMessage = `Network error: ${rawMessage}`;
            }
            errorMessage = (errorMessage + buildContextLabel()).replace(/\s+/g, ' ').slice(0, 300);
            const errorCategory = isOffline
              ? 'network_offline'
              : (errorName === 'AbortError'
                ? (didTimeout ? 'network_timeout' : 'network_aborted')
                : 'network');
            window.analyzify.ssCartUpdateFailureEvent({
              request_url_path: requestUrlPath,
              method,
              body_size_bytes: bodySizeBytes,
              attempt_number: attempt,
              status_code: 0,
              error_category: errorCategory,
              error_message_sanitized: errorMessage,
              duration_ms: Math.round(duration),
              timeout_ms: didTimeout && timeoutMs ? Number(timeoutMs) : null
            });
          }

          if (attempt <= maxRetries) {
            await sleep(baseBackoffMs * attempt);
            continue;
          }
          if (removeVisibilityHook) { try { removeVisibilityHook(); } catch (_) {} }
          return;
        }
      }
    } catch (error) {
      window.analyzify.log(
        error,
        "an_analyzify",
        "analyzify_updateCartAttributes"
      );
    }
  };
  window.analyzify.ssCartUpsertEvent = async (cartAttributes) => {
    try {
      const endpoint = window.analyzify.properties?.SERVERSIDE?.endpoint;
        if (!endpoint) {
            return window.analyzify.log('Endpoint not found for cart_upsert', 'an_analyzify', 'ssCartUpsertEvent');
        }

        window.analyzify.log(
            "Sending cart_upsert event with attributes",
            "an_analyzify",
            "ssCartUpsertEvent"
        );
        window.analyzify.log(cartAttributes, "an_analyzify", "ssCartUpsertEvent");
        const { azfy_cart_id, ...filteredCartAttributes } = cartAttributes;
        if (filteredCartAttributes.azfy_consent !== undefined) {
            filteredCartAttributes.azfy_consent = filteredCartAttributes.azfy_consent === "true" || filteredCartAttributes.azfy_consent === true;
        }
        if (!filteredCartAttributes.azfy_consent) {
            delete filteredCartAttributes.azfy_cookies;
            window.analyzify.log(
                "Consent denied: filtered out azfy_cookies from cart_upsert payload",
                "an_analyzify",
                "ssCartUpsertEvent"
            );
        }
        // VALIDATION: Attribution mode only
        if (filteredCartAttributes.azfy_utm_history !== undefined) {
            const uh = filteredCartAttributes.azfy_utm_history;
            if (uh === null) {
                // allow null
            } else if (!Array.isArray(uh)) {
                window.analyzify.log(`azfy_utm_history validation failed: expected array`, "an_analyzify", "ssCartUpsertEvent");
                return;
            }
            if (Array.isArray(uh)) {
                const allowedKeys = new Set(["timestamp","src","med","camp","cont","term","id","ref","pid","cartId"]);
                for (const entry of uh) {
                    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                        window.analyzify.log(`azfy_utm_history entry must be an object`, "an_analyzify", "ssCartUpsertEvent");
                        return;
                    }
                    if (typeof entry.timestamp !== 'number' || !isFinite(entry.timestamp)) {
                        window.analyzify.log(`azfy_utm_history entry.timestamp must be number`, "an_analyzify", "ssCartUpsertEvent");
                        return;
                    }
                    for (const [k,v] of Object.entries(entry)) {
                        if (!allowedKeys.has(k)) {
                            window.analyzify.log(`azfy_utm_history entry has unsupported key: ${k}`, "an_analyzify", "ssCartUpsertEvent");
                            return;
                        }
                        if (k !== 'timestamp' && k !== 'cartId' && v != null && typeof v !== 'string') {
                            window.analyzify.log(`azfy_utm_history entry field ${k} must be string`, "an_analyzify", "ssCartUpsertEvent");
                            return;
                        }
                    }
                }
            }
        }
        if (filteredCartAttributes.azfy_clids !== undefined) {
            const cl = filteredCartAttributes.azfy_clids;
            if (cl === null) {
                // allow null
            } else if (!cl || typeof cl !== 'object' || Array.isArray(cl)) {
                window.analyzify.log(`azfy_clids must be an object`, "an_analyzify", "ssCartUpsertEvent");
                return;
            }
            if (cl && typeof cl === 'object' && !Array.isArray(cl)) {
                for (const [k,v] of Object.entries(cl)) {
                    if (v != null && typeof v !== 'string') {
                        window.analyzify.log(`azfy_clids.${k} must be string`, "an_analyzify", "ssCartUpsertEvent");
                        return;
                    }
                }
            }
        }
        if (filteredCartAttributes.azfy_cookies !== undefined) {
            const ck = filteredCartAttributes.azfy_cookies;
            if (ck === null) {
                // allow null
            } else if (!ck || typeof ck !== 'object' || Array.isArray(ck)) {
                window.analyzify.log(`azfy_cookies must be an object`, "an_analyzify", "ssCartUpsertEvent");
                return;
            }
            if (ck && typeof ck === 'object' && !Array.isArray(ck)) {
                for (const [k,v] of Object.entries(ck)) {
                    if (v != null && typeof v !== 'string') {
                        window.analyzify.log(`azfy_cookies.${k} must be string`, "an_analyzify", "ssCartUpsertEvent");
                        return;
                    }
                }
            }
        }
        const payload = {
            eventName: "cart_upsert",
            userData: {
                eventId: window.analyzify.cart_id || null,
                id: window.analyzify.properties?.SERVERSIDE?.store_id || null,
                azfy_consent: filteredCartAttributes.azfy_consent,
            },
            attributes: filteredCartAttributes
        };
        window.analyzify.log('Sending cart_upsert payload:', 'an_analyzify', 'ssCartUpsertEvent');
        window.analyzify.log(payload, 'an_analyzify', 'ssCartUpsertEvent');
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        window.analyzify.log('Response:', 'an_analyzify', 'ssCartUpsertEvent');
        window.analyzify.log(response, 'an_analyzify', 'ssCartUpsertEvent');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        window.analyzify.log(
            "Cart upsert event sent successfully",
            "an_analyzify",
            "ssCartUpsertEvent"
        );
    } catch (error) {
        window.analyzify.log(
            `Error sending cart_upsert event: ${error}`,
            "an_analyzify",
            "ssCartUpsertEvent"
        );
        throw error;
    }
  };

  window.analyzify_checksendcartdata = async function () {
    try {
      if (!window.analyzify.op_cart_data_collection) {
        window.analyzify.log(
          "Cart data collection disabled (op_cart_data_collection: false), exiting early",
          "an_analyzify",
          "analyzify_checksendcartdata"
        );
        return;
      }

      const attributionMode = window.analyzify.properties.SERVERSIDE?.azfy_attribution;
      const isAttributionOrDualMode = Boolean(attributionMode === 'dual' || attributionMode === 'true' || attributionMode === true);

      {
        const isValid = (id) =>
          id && id !== "null" && id !== "undefined" && id.startsWith("G-");

        const measurementId =
          [
            window?.analyzify_measurement_id,
            window?.analyzify?.measurement_id,
            window?.analyzify?.properties?.GA4?.primary?.id,
            window.analyzify?.properties?.SERVERSIDE?.measurement_id,
            window?.analyzify_measurement_id_v3,
          ].find(isValid) || null;

        if (!measurementId) {
          window.analyzify.log(
            "Measurement ID not found - GA data collection disabled, continuing with other tracking",
            "an_analyzify",
            "analyzify_checksendcartdata"
          );
        }

        const cartData = await window.collectCartData(measurementId);

        // Shared cart ID attempt counter
          if (!window.analyzify._sharedCartIdAttempts) {
            window.analyzify._sharedCartIdAttempts = 0;
          }
          const maxCartIdAttempts = 10;

          const updateCartIdWithTimeout = async () => {
            if (window.analyzify._sharedCartIdAttempts >= maxCartIdAttempts) {
              window.analyzify.log(`Cart ID update stopped after ${maxCartIdAttempts} total attempts.`, "an_analyzify", "updateCartIdWithTimeout");
              return;
            }
            window.analyzify._sharedCartIdAttempts++;

            let cart_id = null;
            try {
              const getFn = window?.analyzify?.cookieStorage && typeof window.analyzify.cookieStorage.get === "function" ? window.analyzify.cookieStorage.get : null;
              const rawCart = getFn ? getFn("cart") : (document?.cookie || "").split("; ").find(c => c.startsWith("cart="))?.split("=")[1];
              if (typeof rawCart === "string" && rawCart) {
                cart_id = rawCart.split("?")[0] || null;
              }
            } catch (e) {
              cart_id = null;
            }

            setTimeout(async () => {
              try {
                let attributes = {};

                const includeUtm = window.analyzify.report_cart_atr_admin_utm !== false;
                const includeCook = window.analyzify.report_cart_atr_admin_cook !== false;
                const includeClid = window.analyzify.report_cart_atr_admin_clid !== false;
                const includeConsent = window.analyzify.report_cart_atr_admin_consent !== false;

                if (includeConsent) {
                  await new Promise((resolve) => {
                    let retries = 0;
                    const maxRetries = 10;
                    const retryDelay = 500;
                    const checkConsent = () => {
                      if (window.analyzify.consentManager?.consentReady === true) {
                        resolve();
                      } else if (retries >= maxRetries) {
                        window.analyzify.log(`Consent polling timeout after ${retries} retries`, 'an_analyzify', 'updateCartIdWithTimeout');
                        resolve();
                      } else {
                        retries++;
                        setTimeout(checkConsent, retryDelay);
                      }
                    };
                    checkConsent();
                  });
                }

                if (attributionMode === "dual") {
                  attributes = {
                    ...(includeUtm && window.analyzify.cart_attributes?.azfy_utm_history !== undefined && { azfy_utm_history: window.analyzify.cart_attributes.azfy_utm_history }),
                    ...(includeClid && window.analyzify.cart_attributes?.azfy_clids !== undefined && { azfy_clids: window.analyzify.cart_attributes.azfy_clids }),
                    ...(includeCook && window.analyzify.cart_attributes?.azfy_cookies !== undefined && { azfy_cookies: window.analyzify.cart_attributes.azfy_cookies }),
                    ...(includeConsent && window.analyzify.cart_attributes?.azfy_consent !== undefined && { azfy_consent: window.analyzify.cart_attributes.azfy_consent }),
                    azfy_cart_id: cart_id,
                  };
                } else if (attributionMode === 'true' || attributionMode === true) {
                  attributes = {
                    azfy_cart_id: cart_id
                  };
                } else {
                  attributes = {
                    ...(includeUtm && window.analyzify.cart_attributes?.azfy_utm_history !== undefined && { azfy_utm_history: window.analyzify.cart_attributes.azfy_utm_history }),
                    ...(includeClid && window.analyzify.cart_attributes?.azfy_clids !== undefined && { azfy_clids: window.analyzify.cart_attributes.azfy_clids }),
                    ...(includeCook && window.analyzify.cart_attributes?.azfy_cookies !== undefined && { azfy_cookies: window.analyzify.cart_attributes.azfy_cookies }),
                    ...(includeConsent && window.analyzify.cart_attributes?.azfy_consent !== undefined && { azfy_consent: window.analyzify.cart_attributes.azfy_consent })
                  };
                }

                const { hasChanges } = window.analyzify.detectChangesByHash(attributes, { namespace: 'cart' });
                if (hasChanges || !cart_id) {
                await window.analyzify_updateCartAttributes(attributes, hasChanges);
                }
              } catch (error) {
                console.error("Failed to update cart attributes:", error);
              }
              if (!cart_id && window.analyzify._sharedCartIdAttempts < maxCartIdAttempts) {
                window.analyzify.log(`Cart ID is still null after request, retrying (attempt ${window.analyzify._sharedCartIdAttempts}/${maxCartIdAttempts})...`, "an_analyzify", "updateCartIdWithTimeout");
                updateCartIdWithTimeout();
              } else if (!cart_id) {
                window.analyzify.log(`Cart ID is still null after ${maxCartIdAttempts} attempts, skipping cart update.`, "an_analyzify", "updateCartIdWithTimeout");
              }
            }, 1000);
          };
        updateCartIdWithTimeout();

    window.analyzify.sendUpsertCart = async function (cartDATA) {

      // Dedicated function to detect changes in cart attributes (using hash-based detection)
      window.analyzify.detectCartAttributesChange = async function () {
        if (window.analyzify._cartChangeDetectionInProgress) {
          window.analyzify.log("Cart change detection already in progress, returning previous result", "an_analyzify");
          return window.analyzify._lastCartChangeResult || { cartAttributesChanged: false, changedKeys: [], currObj: {} };
        }
        window.analyzify._cartChangeDetectionInProgress = true;

        try {
          cartDATA.azfy_consent = !window.analyzify.consent_active ||
            (window.analyzify.current_consent?.ad_storage === "granted" &&
              window.analyzify.current_consent?.analytics_storage === "granted");

          cartDATA.azfy_cart_id = window.analyzify.getCartId();

          // Check consent status to determine if azfy_cookies_atr should be skipped
          const consentValue = cartDATA.azfy_consent;
          const hasConsent = consentValue === "true" || consentValue === true;
          const skipKeys = hasConsent ? [] : ['azfy_cookies_atr'];

          // Use hash-based detection for optimized comparison
          // ignoreRemovedKeys: true - don't detect undefined values as "removed" since data populates asynchronously
          const { hasChanges, changedKeys } = window.analyzify.detectChangesByHash(cartDATA, { namespace: 'upsert', skipKeys, ignoreRemovedKeys: true });
          const cartAttributesChanged = hasChanges;

          return { cartAttributesChanged, changedKeys, cartDATA };
        } finally {
          setTimeout(() => {
            window.analyzify._cartChangeDetectionInProgress = false;
          }, 100);
        }
      };

      const { cartAttributesChanged, cartDATA: detectedCartData } = await window.analyzify.detectCartAttributesChange(cartDATA);

      if (cartAttributesChanged) {
        if (!window.analyzify.properties?.SERVERSIDE?.store_id) return window.analyzify.log('Store ID not found for cart_upsert', 'an_analyzify', 'ssCartUpsertEvent');
        window.analyzify.ssCartUpsertEvent(detectedCartData);
        window.analyzify.log("Upsert cart event sent", "an_analyzify");
      } else {
        window.analyzify.log("No cart attribute changes detected, upsert_cart event not sent.", "an_analyzify");
      }
   };

    const updateCartWithTimeoutAndTriggerCartUpsert = async (measurementID) => {

        const retryCartUpdate = async (attempt = 1) => {
          const cartData = await window.collectCartData(measurementID);

          if (cartData && Object.keys(cartData).length) {
            const cart_id = window.analyzify.getCartId();

            if (cart_id) {
              window.analyzify.cart_id = cart_id; // Update the cart_id
              // Check platform status and URL parameters
              const isFacebookEnabled = Boolean(window.analyzify?.properties?.FACEBOOK?.status);
              const isTikTokEnabled = Boolean(window.analyzify?.properties?.TIKTOK?.status);
              const isGAEnabled = Boolean(window.analyzify?.properties?.GA4?.status) || Boolean(window.analyzify?.properties?.GTM?.status) || Boolean(window.analyzify?.properties?.GADS?.status);

              const urlParams = new URLSearchParams(window.location.search);
              const hasFbClidinUrl = urlParams.has('fbclid');
              // Wait for required cookies and consent before proceeding
              if (isFacebookEnabled || isTikTokEnabled || hasFbClidinUrl || isGAEnabled) {
                let retries = 0;
                const maxRetries = 10;
                const retryDelay = 500;
                const waitForAttributes = () => {
                  return new Promise((resolve) => {
                    const checkAttributes = () => {
                      const attrs = window.analyzify?.cart_attributes || {};
                      const cookies = attrs?.azfy_cookies_atr || {};

                      const fbp = cookies.fbp || window.analyzify?.getCookieValue?.('_fbp') || null;
                      const fbc = cookies.fbc || window.analyzify?.getCookieValue?.('_fbc') || null;
                      const ttp = cookies.tt || window.analyzify?.getCookieValue?.('_ttp') || null;
                      const ga = cookies.ga || window.analyzify?.getCookieValue?.('_ga') || null;
                      const hasConsent = window.analyzify.cart_attributes?.azfy_consent;
                      const fbpReady = isFacebookEnabled ? !!fbp : true;
                      const fbcReady = hasFbClidinUrl ? !!fbc : true;
                      const ttReady = isTikTokEnabled ? !!ttp : true;
                      const gaReady = isGAEnabled ? !!ga : true;
                      if ((fbpReady && fbcReady && ttReady && gaReady && hasConsent) || retries >= maxRetries) {
                        window.analyzify.log(`Cart upsert attributes ready: fbp=${!!fbp}(${isFacebookEnabled ? 'req' : 'opt'}), fbc=${!!fbc}(${hasFbClidinUrl ? 'req' : 'opt'}), ttp=${!!ttp}(${isTikTokEnabled ? 'req' : 'opt'}), ga=${!!ga}(${isGAEnabled ? 'req' : 'opt'}), consent=${!!hasConsent}, retries=${retries}`, 'an_analyzify', 'updateCartWithTimeoutAndTriggerCartUpsert');

                        if (cartData.azfy_cookies_atr && typeof cartData.azfy_cookies_atr === 'object') {
                          if (fbp) cartData.azfy_cookies_atr.fbp = fbp;
                          if (fbc) cartData.azfy_cookies_atr.fbc = fbc;
                          if (ttp) cartData.azfy_cookies_atr.tt = ttp;
                          if (ga) cartData.azfy_cookies_atr.ga = ga;
                        }
                        resolve();
                      } else {
                        retries++;
                        window.analyzify.log(`Cart upsert waiting retry ${retries}/${maxRetries}: fbp=${!!fbp}, fbc=${!!fbc}, ttp=${!!ttp}, ga=${!!ga}, consent=${!!hasConsent}`, 'an_analyzify', 'updateCartWithTimeoutAndTriggerCartUpsert');
                        setTimeout(checkAttributes, retryDelay);
                      }
                    };
                    checkAttributes();
                  });
                };
                await waitForAttributes();
              }
              setTimeout(async () => {
                try {
                  // this function only runs in attribution/dual mode thus atr keys are used

                  const currentConsent = !window.analyzify.consent_active ||
                    (window.analyzify.current_consent?.ad_storage === "granted" &&
                      window.analyzify.current_consent?.analytics_storage === "granted");

                  // IMPORTANT: cart_upsert must respect consent and filter cookies
                  // Only include defined values to prevent false change detection
                  const finalCartUpsertData = {
                    ...(cartData.azfy_utm_history_atr !== undefined && { azfy_utm_history: cartData.azfy_utm_history_atr }),
                    ...(cartData.azfy_clids_atr !== undefined && { azfy_clids: cartData.azfy_clids_atr }),
                    ...(cartData.azfy_cookies_atr !== undefined && { azfy_cookies: cartData.azfy_cookies_atr }),
                    azfy_consent: currentConsent,
                  };

                  window.analyzify.log(
                    `Attribution mode (${attributionMode}): Using attribution format (_atr) for cart_upsert`,
                    'an_analyzify',
                    'sendUpsertCart'
                  );

                  await window.analyzify.sendUpsertCart(finalCartUpsertData);
                } catch (error) {
                  console.error('Failed to update cart attributes:', error);
                }
              }, 1000);
            } else if (attempt <= 3) {
              await updateCartIdWithTimeout();
              window.analyzify.log(`Cart ID is null, retrying (attempt ${attempt}/3)...`, "an_analyzify", "updateCartWithTimeout");
              setTimeout(() => retryCartUpdate(attempt + 1), 1000);
            } else {
              window.analyzify.log("Cart ID is still null after 3 attempts, skipping cart timeout update.", "an_analyzify", "updateCartWithTimeout");
            }
          }
        };
        retryCartUpdate();
      };
       //main trigger for cart upsert
      if (isAttributionOrDualMode) {
        updateCartWithTimeoutAndTriggerCartUpsert(measurementId);
    }

      return cartData;
    }
    } catch (error) {
      window.analyzify.log(
        error,
        "an_analyzify",
        "analyzify_checksendcartdata"
      );
    }
  };

  window.analyzify.GetClickedProductPosition = function (elementHref, sku) {
    if (sku != "") {
      for (const collectionProductsSku in window.collection_sku_list) {
        if (sku == collectionProductsSku) {
          return window.collection_sku_list.indexOf(collectionProductsSku);
        }
      }
      return 0;
    } else {
      var elementIndex = -1;
      collectionProductsElements = document.querySelectorAll(
        'main a[href*="/products/"]'
      );
      let hrefValues = [];
      let uniqueCollectionProductsElements = [];
      collectionProductsElements.forEach((element) => {
        let href = element.getAttribute("href");
        if (!hrefValues.includes(href)) {
          uniqueCollectionProductsElements.push(element);
          hrefValues.push(href);
        }
      });
      uniqueCollectionProductsElements.forEach(function (element, index) {
        if (element.href.includes(elementHref)) {
          elementIndex = index + 1;
        }
      });
      return elementIndex;
    }
  };

  window.analyzify.getShopifyId = function (feed, itemId, variantId, sku) {
    try {
      // Validate inputs
      if (!feed || !itemId || !variantId) {
        if (sku) {
          return sku; // Return SKU if any parameter is missing
        } else {
          return null;
        }
      }

      // Construct and return the Shopify ID
      return `shopify_${feed}_${itemId}_${variantId}`;
    } catch (error) {
      console.error("Error in getShopifyId function:", error);
      return null; // Return null as a fallback in case of an error
    }
  };

    // Get latest UTM entry from azfy_utm_history
  window.analyzify.getLatestUtmFromHistory = function () {
    try {
      const utmHistory = window.analyzify.sessionStorage.get("azfy_utm_history");
      if (!utmHistory) {
        return null;
      }
      const parsedHistory = typeof utmHistory === 'string' ? JSON.parse(utmHistory) : utmHistory;
      if (!Array.isArray(parsedHistory) || parsedHistory.length === 0) {
        return null;
      }
      const latestEntry = parsedHistory.reduce((latest, current) => {
        return (current.timestamp > latest.timestamp) ? current : latest;
      });
      return latestEntry;
    } catch (error) {
      analyzify.log(`getLatestUtmFromHistory error: ${error}`, "an_analyzify", "getLatestUtmFromHistory");
      return null;
    }
  };

  window.analyzify.findElemInPath = function (pathArray, attributeObj) {
    let buttonFound = null;
    if (pathArray) {
      // Loop through the path array
      for (let i = 0; i < pathArray.length; i++) {
        // Loop through the attribute object
        for (const attribute in attributeObj) {
          if (attributeObj.hasOwnProperty(attribute)) {
            const attributeName = attribute;
            const attributeValues = attributeObj[attribute];
            if (
              pathArray[i].hasAttribute !== undefined &&
              pathArray[i].hasAttribute(attributeName) === true
            ) {
              // Loop through the attribute values
              attributeValues.forEach(function (selectedValue) {
                // Check if the current path element's attribute contains the selected value
                if (
                  pathArray[i]
                    .getAttribute(attributeName)
                    .indexOf(selectedValue) > -1 &&
                  !/(addon|addition|address)/i.test(
                    pathArray[i].getAttribute(attributeName)
                  )
                ) {
                  analyzify.log(
                    `'${selectedValue}' found in '${attributeName}' attribute list.`,
                    "an_analyzify",
                    "findElemInPath"
                  );
                  analyzify.log(pathArray[i], "an_analyzify", "findElemInPath");

                  buttonFound = pathArray[i];
                  analyzify.foundElements.push(pathArray[i]);
                  analyzify.foundAtcElementForms.push(
                    pathArray[i].closest("form[action='/cart/add']")
                  );
                  analyzify.foundBoostElements.push(
                    pathArray[i].closest(".boost-pfs-filter-product-item")
                  );
                }
              });
            }
          }
        }
      }
    }
    return buttonFound;
  };

  window.analyzify.getVariantDetails = (variants, variantId) => {
    try {
      if (!variants || !variantId) return null;

      if (!Array.isArray(variants)) {
        console.warn(
          "variants is not an array",
          "an_analyzify",
          "getVariantDetails"
        );
        return null;
      }

      // Convert variantId to string for safe comparison
      const variantIdStr = variantId?.toString();

      // Find the variant by id or default to the first variant
      const variant = variantIdStr
        ? variants.find((v) => v.id?.toString() === variantId?.toString())
        : variants[0];

      // Return the variant details with safe access and default values
      return {
        id: variant?.id?.toString() || null,
        sku: variant?.sku?.toString() || null,
        title: variant?.title?.trim() || null,
        price: (variant?.price || 0) / 100,
        compare_at_price: (variant?.compare_at_price || 0) / 100,
        barcode: variant?.barcode?.toString() || null,
      };
    } catch (error) {
      console.error("Error in getVariantDetails function:", error);
      return {
        id: null,
        sku: null,
        title: null,
        price: 0,
        compare_at_price: 0,
        barcode: null,
      }; // Return a default object in case of error
    }
  };

  // Add hashValue as a separate function
  window.analyzify.hashValue = async function (value) {
    try {
      if (!value) return null;

      // Check if crypto and subtle are available
      if (
        typeof window === "undefined" ||
        !window.crypto ||
        !window.crypto.subtle
      ) {
        console.error(
          "Crypto API is not available in this browser. Unable to hash value."
        );
        return null;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(value);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (error) {
      console.error("Error while hashing value:", error);
      return null;
    }
  };

  // Modify hashUserData to use the separated hashValue function
  window.analyzify.hashUserData = async function (userData) {
    try {
      const hashedData = {};
      for (const [key, value] of Object.entries(userData)) {
        hashedData[key] = await window.analyzify.hashValue(value);
      }
      return hashedData;
    } catch (error) {
      console.error("Error in hashUserData:", error);
      return {};
    }
  };

  if (sessionStorage.getItem('analyzify_current_page')) {
    sessionStorage.setItem('analyzify_previous_page', sessionStorage.getItem('analyzify_current_page'));
  }
  sessionStorage.setItem('analyzify_current_page', window.location.href);


  window.analyzify.getEffectiveReferrer = function() {
    try {
      let referrer = document.referrer;
      if (!referrer || referrer === '') {
        referrer = sessionStorage.getItem('analyzify_previous_page') || '';
      }
      return referrer;
    } catch (error) {
      console.error("Error in getEffectiveReferrer:", error);
      return '';
    }
  };

  window.analyzify.getCurrentVariant = () => {
    try {
      return (
        window.analyzify.getVariantDetails(
          window.analyzify?.getProductObj?.product?.variants,
          window.analyzify?.getQueryParam("variant")
        ) || null
      );
    } catch (error) {
      console.error("Error in getCurrentVariant:", error);
      return null;
    }
  };

  window.analyzify.getItemIds = function ({
    productObj,
    product_id_format,
    variantDetails,
    eventName,
    feedRegion,
  }) {
    try {
      // Return default structure if missing required params
      if (!productObj || !product_id_format) {
        analyzify.log(
          "Missing required parameters in getItemIds",
          "an_analyzify",
          "getItemIds"
        );
        return {
          selected: null,
          ids: {
            product_id: null,
            variant_id: null,
            sku: null,
            shopify_id: null,
            first_variant: null,
          },
        };
      }

      const isCartEvent = ["view_cart", "begin_checkout"].includes(eventName);

      const baseIds = {
        productId: isCartEvent ? productObj?.product_id : productObj?.id,
        variantId:
          productObj?.item_variant_id ||
          variantDetails?.id ||
          productObj?.variant_id ||
          productObj?.variants?.[0]?.id,
        sku:
          productObj?.item_sku ||
          variantDetails?.sku ||
          productObj?.sku ||
          productObj?.variants?.[0]?.sku,
      };

      const ids = {
        product_id: baseIds.productId ?? null,
        variant_id: baseIds.variantId ?? null,
        sku: baseIds.sku ?? null,
        shopify_id:
          typeof window.analyzify?.getShopifyId === "function"
            ? window.analyzify.getShopifyId(
                feedRegion || window.analyzify?.feed_region || null,
                baseIds.productId ?? null,
                baseIds.variantId ?? null,
                baseIds.sku ?? null
              )
            : null,
        first_variant: variantDetails ?? null,
      };

      const idMap = {
        product_sku: ids.sku,
        variant_id: ids.variant_id,
        shopify_item_id: ids.shopify_id,
        default: ids.product_id,
      };

      const selected =
        (
          idMap[product_id_format] ||
          idMap["default"] ||
          ids.sku ||
          ids.variant_id
        )?.toString() ?? null;

      analyzify.log("selected", "an_analyzify", "getItemIds");
      analyzify.log(selected, "an_analyzify", "getItemIds");

      return {
        selected,
        ids,
      };
    } catch (error) {
      analyzify.log(error, "an_analyzify", "getItemIds_error");
      // Return default structure on error
      return {
        selected: null,
        ids: {
          product_id: null,
          variant_id: null,
          sku: null,
          shopify_id: null,
          first_variant: null,
        },
      };
    }
  };

  try {
    // Ensure shopify_customer is initialized if not already present
    if (!window.analyzify.shopify_customer) {
      window.analyzify.shopify_customer = {};
    }
  } catch (error) {
    console.error("Error in shopify_customer:", error);
  }

  try {
    if (window.analyzify.shopify_customer?.type === "member") {
      window.analyzify
        ?.hashUserData({
          user_id: window.analyzify.shopify_customer?.user_id || null,
          id: window.analyzify.shopify_customer?.user_id || null,
          first_name: window.analyzify.shopify_customer?.first_name || null,
          last_name: window.analyzify.shopify_customer?.last_name || null,
          email_address:
            window.analyzify.shopify_customer?.email_address || null,
          phone_number: window.analyzify.shopify_customer?.phone_number || null,
        })
        .then((hashedData) => {
          // Store user_id, id, email_address hashed value in localStorage
          const keysToStore = ["user_id", "id", "email_address"];
          Object.entries(hashedData).forEach(([key, value]) => {
            if (value && keysToStore.includes(key)) {
              window.analyzify.saveToLocalStorage(`azfy_sha256_${key}`, value);
            }
          });

          // Append hashed data to the existing shopify_customer object
          window.analyzify.shopify_customer = {
            ...window.analyzify.shopify_customer,
            sha256_id:
              hashedData?.id ||
              window.analyzify.getFromLocalStorage("azfy_sha256_id"),
            sha256_user_id:
              hashedData?.user_id ||
              window.analyzify.getFromLocalStorage("azfy_sha256_user_id"),
            sha256_first_name: hashedData?.first_name || null,
            sha256_last_name: hashedData?.last_name || null,
            sha256_email_address:
              hashedData?.email_address ||
              window.analyzify.getFromLocalStorage("azfy_sha256_email_address"),
            sha256_phone_number: hashedData?.phone_number || null,
          };

          analyzify.log(
            window.analyzify.shopify_customer,
            "an_analyzify",
            "hashUserData"
          );

          // Dispatch event indicating user data is ready
          document.dispatchEvent(
            new CustomEvent("userDataReady", {
              detail: window.analyzify.shopify_customer,
            })
          );
        })
        .catch((error) => {
          // If hashing fails, try to load from localStorage
          window.analyzify.shopify_customer = {
            ...window.analyzify.shopify_customer,
            sha256_id: window.analyzify.getFromLocalStorage("azfy_sha256_id"),
            sha256_user_id: window.analyzify.getFromLocalStorage(
              "azfy_sha256_user_id"
            ),
            sha256_email_address: window.analyzify.getFromLocalStorage(
              "azfy_sha256_email_address"
            ),
          };
          console.error("Error hashing data:", error);
        });
    } else {
      // Clear hashed data from localStorage for non-members
      ["user_id", "id", "email_address"].forEach((key) => {
        window.analyzify.deleteFromLocalStorage(`azfy_sha256_${key}`);
      });

      window.analyzify.shopify_customer = {
        type: "visitor",
        ...(window.analyzify.shopify_customer?.email_address
          ? { email_address: window.analyzify.shopify_customer.email_address }
          : {}),
        ...(window.analyzify.shopify_customer?.phone_number
          ? { phone_number: window.analyzify.shopify_customer.phone_number }
          : {}),
      };

      analyzify.log(
        window.analyzify.shopify_customer,
        "an_analyzify",
        "hashUserData"
      );

      // Dispatch event for visitor as well
      document.dispatchEvent(
        new CustomEvent("userDataReady", {
          detail: window.analyzify.shopify_customer,
        })
      );
    }
  } catch (error) {
    console.error("Error in hashUserData:", error);
  }

  //@check
  window.analyzify.generateEventId = function (
    prefix = "sh",
    separator = "-",
    salt = ""
  ) {
    try {
      const generateHexSegment = (length) => {
        const randomValues = Array.from({ length }, () =>
          Math.floor(Math.random() * 16).toString(16)
        );
        const saltedValues = randomValues.map((val, index) => {
          const saltChar = salt.charCodeAt(index % salt.length) || 0;
          return ((parseInt(val, 16) + saltChar) % 16).toString(16);
        });
        return saltedValues.join("");
      };
      const segments = [8, 4, 4, 4, 12].map(generateHexSegment);
      const uuid = segments.join(separator);
      return `${prefix}${separator}${uuid}`.toLowerCase();
    } catch (error) {
      console.error("Error generating event ID:", error);
      return null;
    }
  };

  window.analyzify.ecommerceEventId = (function () {
    let currentEventId = null;
    let eventCounter = 0;

    return {
      // generates new id's
      startEvent: function () {
        eventCounter++;
        currentEventId = window.analyzify.generateEventId(
          "sh",
          "",
          `${Date.now()}${eventCounter}`
        );
        return currentEventId;
      },

      // this will be used in the event trigger method after the context is run to retrieve the id that
      // was created in the context run.
      getCurrentEventId: function () {
        return currentEventId || this.startEvent();
      },

      // clear current EventId
      endEvent: function () {
        currentEventId = null;
      },

      // Backward compatibility // unused method
      get: function () {
        return this.getCurrentEventId();
      },
    };
  })();

  // Event context wrapper for ecommerce events (add_to_cart, remove_from_cart, begin_checkout)
  window.analyzify.withEcommerceEventContext = function (eventType, callback) {
    const eventId = window.analyzify.ecommerceEventId.startEvent();
    try {
      return callback(eventId);
    } finally {
      window.analyzify.ecommerceEventId.endEvent();
    }
  };

  // Direct access to getCurrentEventId for platform integrations
  window.analyzify.getCurrentEcommerceEventId = function () {
    return window.analyzify.ecommerceEventId.getCurrentEventId();
  };

  // legacy eventId system for page-load events
  window.analyzify.eventId = (function (salt) {
    const eventIds = {};
    const defaultEventType = "default";

    return {
      get: function (eventType = defaultEventType) {
        if (!eventIds[eventType]) {
          eventIds[eventType] = window.analyzify.generateEventId(
            "sh",
            "",
            salt
          );
        }
        return eventIds[eventType];
      },
      reset: function (eventType = defaultEventType) {
        eventIds[eventType] = window.analyzify.generateEventId("sh", "", salt);
        return eventIds[eventType];
      },
      resetAll: function () {
        for (const key in eventIds) {
          delete eventIds[key];
        }
      },
    };
  })("z9y8x7w6v5u4t3s2");

  window.analyzify.formatPrice = (price, cents = false) => {
    try {
      // Check for null or undefined values and warn if necessary
      if (price == null) {
        // Handles both null and undefined
        // console.warn(
        //   "Invalid price provided (null or undefined):",
        //   price,
        //   "\nStack trace:\n",
        //   new Error().stack
        // );
        return 0; // Return 0 for null or undefined prices
      }

      // Use regex to extract numeric values, including decimal points
      const match = price.toString().match(/-?\d+(\.\d+)?/);

      // Convert matched value to a number, or return 0 if no match
      const numericPrice = match ? Number(match[0]) : NaN;

      if (isNaN(numericPrice)) {
        console.warn(
          "Invalid price provided (not numeric):",
          price,
          "\nStack trace:\n",
          new Error().stack
        );
        return 0; // Return 0 for invalid numeric prices
      }
      return Math.abs(Number(parseFloat((numericPrice / (cents ? 100 : 1)).toFixed(2))));
    } catch (error) {
      console.error("Error formatting price:", error);
      return 0; // Return 0 in case of an error
    }
  };

  window.analyzify.getFirstVariant = (prod) => {
    try {
      if (!prod) return null;
      return {
        id: prod?.variant_id || prod.variants?.[0]?.id || null,
        price: prod?.price || prod.variants?.[0]?.price || null,
        compare_at_price:
          prod?.compare_at_price ||
          prod.variants?.[0]?.compare_at_price ||
          null,
        barcode: null || prod.variants?.[0]?.barcode || null,
        title: prod?.variant_title || prod.variants?.[0]?.title || null,
        sku: prod?.sku || prod.variants?.[0]?.sku || null,
      }; // Return the first variant
    } catch (error) {
      console.error("Error in getFirstVariant function:", error);
      return null; // Return null in case of an error
    }
  };

  window.analyzify.getProductUrl = (handle, raw) => {
    if (!handle) return null;
    const domain = window.location.hostname || window.analyzify?.properties?.SERVERSIDE?.shop_domain;
    if (!domain) return null;
    const path = `${domain}/products/${handle}`;
    return raw ? `https://${path}` : path;
  };

  window.analyzify.normalizeImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('//') ? `https:${url}` : url;
  };

  window.analyzify.cart_id = window.analyzify.getCartId();

  window.analyzify.findClickedProduct = (element, colProds) => {
    try {
      analyzify.log("Element found", "an_analyzify", "findClickedProduct");
      analyzify.log(element, "an_analyzify", "findClickedProduct");
      analyzify.log(
        "Collection products",
        "an_analyzify",
        "findClickedProduct"
      );
      analyzify.log(colProds, "an_analyzify", "findClickedProduct");
      if (element.hasAttribute("href")) {
        const href = element.getAttribute("href");
        if (href.includes("/products/")) {
          const handle = href.split("/products/")[1]?.trim();

          if (!colProds) return analyzify.log("Collection products not found");

          let clickedProduct = colProds?.find(
            (product) => product.handle === handle
          );

          if (!clickedProduct) {
            analyzify.log(
              "Product not found by handle, checking element attributes"
            );

            // Extract potential product IDs from various attributes
            const extractIdFromAttribute = (attr) => {
              const matches = attr?.match(/[^-]*-(\d+)/);
              return matches?.[1];
            };

            const extractIdFromForm = (element) => {
              const form = element.closest("form");
              if (form) {
                // find the inputs name is or any attribute is id or data-id
                const inputs = form.querySelectorAll("input");
                for (const input of inputs) {
                  if (
                    input.name === "id" ||
                    input.getAttribute("id") === "id" ||
                    input.getAttribute("data-id") === "id"
                  ) {
                    return input.value;
                  }
                }
              }
              return null;
            };

            const potentialIds = [
              extractIdFromAttribute(element.id),
              extractIdFromAttribute(element.className),
              extractIdFromForm(element),
              ...Array.from(element.attributes).map((attr) =>
                extractIdFromAttribute(attr.value)
              ),
            ].filter(Boolean);

            if (potentialIds.length) {
              clickedProduct = colProds.find(
                (product) =>
                  potentialIds.includes(product.id.toString()) ||
                  product.variants.some((variant) =>
                    potentialIds.includes(variant.id.toString())
                  )
              );
            }
          }

          if (!clickedProduct) {
            return analyzify.log(
              "Product not found in collection product list"
            );
          }

          analyzify.log(
            "Clicked product",
            "an_analyzify",
            "findClickedProduct"
          );
          analyzify.log(clickedProduct, "an_analyzify", "findClickedProduct");
          return clickedProduct;
        } else {
          analyzify.log(
            "Found element's href does not include a product handle."
          );
        }
      } else if (element.hasAttribute("data-id")) {
        const prodId = element.getAttribute("data-id");
        const clickedProduct = colProds.find(
          (product) => product.id.toString() === prodId.toString()
        );
        if (!clickedProduct) {
          return analyzify.log(
            "Clicked product does not found in collection product list"
          );
        }
        return clickedProduct;
      } else if (element.hasAttribute("data-variant-id")) {
        const variantId = element.getAttribute("data-variant-id");
        const clickedProduct = colProds.find((product) =>
          product.variants?.some((variant) => variant.id.toString() === variantId.toString())
        );
        if (!clickedProduct) {
          return analyzify.log("Product not found by data-variant-id");
        }
        clickedProduct._clickedVariant = window.analyzify.getVariantDetails(
          clickedProduct.variants,
          variantId
        );
        return clickedProduct;
      } else {
        analyzify.log(
          "Found element does not have an href or data-id attribute."
        );
      }
    } catch (error) {
      console.error("Error processing findClickedProduct:", error);
    }
  };

  window.analyzify.findAddedProduct = (element, colProds) => {
    try {
      if (!element) {
        return analyzify.log(
          "Parent form element not found for quick view atc"
        );
      }
      if (!colProds) return analyzify.log("Collection products not found");

      const productId = element.querySelector(".pid")?.value;
      const possibleIDs = element
        .getAttributeNames()
        .flatMap((name) => element.getAttribute(name).match(/([0-9]+)/g))
        .filter(Boolean);

      let addedProduct = colProds.find((product) => {
        if (productId && product.id.toString() === productId.toString()) {
          return true;
        } else if (product.variants) {
          for (let i = 0; i < product.variants.length; i++) {
            if (possibleIDs.includes(product.variants[i].id.toString()))
              return true;
          }
        }
        return possibleIDs.includes(product.id.toString());
      });

      const extractIdFromForm = (element) => {
        const form = element.closest("form");
        if (form) {
          const inputs = form.querySelectorAll("input");
          for (const input of inputs) {
            if (
              input.name === "id" ||
              input.getAttribute("id") === "id" ||
              input.getAttribute("data-id") === "id"
            ) {
              return input.value;
            }
          }
        }
        return null;
      };

      const potentialIds = [extractIdFromForm(element)].filter(Boolean);

      if (potentialIds.length) {
        addedProduct = colProds.find(
          (product) =>
            potentialIds.includes(product.id.toString()) ||
            product.variants.some((variant) =>
              potentialIds.includes(variant.id.toString())
            )
        );
      }

      if (!addedProduct)
        return analyzify.log(
          "Parent form element found but product id did not match"
        );

      window.analyzify.addedProduct = addedProduct;
      return addedProduct;
    } catch (error) {
      console.error("Error processing findAddedProduct:", error);
    }
  };

  /**
   * Extracts product handle from a clicked element
   * @param {HTMLElement} element - The clicked element
   * @returns {string|null} - Product handle or null
   */
  window.analyzify.extractProductHandle = (element) => {
    try {
      if (!element) return null;

      // 1. Check href for /products/{handle}
      if (element.hasAttribute("href")) {
        const href = element.getAttribute("href");
        if (href.includes("/products/")) {
          const handle = href.split("/products/")[1]?.split(/[?#]/)[0]?.replace(/\/$/, '');
          if (handle) {
            analyzify.log(`Handle from href: ${handle}`, "an_analyzify", "extractProductHandle");
            return handle;
          }
        }
      }

      // 2. Check data-product-handle
      const dataHandle = element.getAttribute("data-product-handle");
      if (dataHandle) {
        analyzify.log(`Handle from data-product-handle: ${dataHandle}`, "an_analyzify", "extractProductHandle");
        return dataHandle;
      }

      // 3. Search within closest boundary (form, then li) for product link
      const boundaries = [element.closest("form"), element.closest("li")].filter(Boolean);
      for (const boundary of boundaries) {
        const anchorInBoundary = boundary.querySelector('a[href*="/products/"]');
        if (anchorInBoundary) {
          const href = anchorInBoundary.getAttribute("href");
          const handle = href.split("/products/")[1]?.split(/[?#]/)[0]?.replace(/\/$/, '');
          if (handle) {
            analyzify.log(`Handle from ${boundary.tagName.toLowerCase()} anchor: ${handle}`, "an_analyzify", "extractProductHandle");
            return handle;
          }
        }
      }

      analyzify.log("Could not extract handle", "an_analyzify", "extractProductHandle");
      return null;
    } catch (error) {
      console.error("Error in extractProductHandle:", error);
      return null;
    }
  };

  /**
   * Fetches product from Shopify API by handle
   * @param {string} handle - Product handle
   * @returns {Promise<Object|null>} - Raw product or null
   */
  window.analyzify.fetchProductByHandle = async (handle) => {
    try {
      if (!handle) return null;

      const response = await fetch(`/products/${handle}.json`);
      if (!response.ok) {
        analyzify.log(`Fetch failed: ${response.status}`, "an_analyzify", "fetchProductByHandle");
        return null;
      }

      const data = await response.json();
      analyzify.log("Product fetched", "an_analyzify", "fetchProductByHandle");
      return data.product;
    } catch (error) {
      console.error("Error in fetchProductByHandle:", error);
      return null;
    }
  };

  /**
   * Normalizes API product to match getCollectionObj shape
   * @param {Object} apiProduct - Raw product from API
   * @returns {Object|null} - Normalized product
   */
  window.analyzify.normalizeProductObj = (apiProduct) => {
    try {
      if (!apiProduct) return null;

      return {
        title: apiProduct.title || null,
        id: apiProduct.id || null,
        handle: apiProduct.handle || null,
        price: apiProduct.variants?.[0]?.price ? Math.round(parseFloat(apiProduct.variants[0].price) * 100) : null,
        compare_at_price: apiProduct.variants?.[0]?.compare_at_price ? Math.round(parseFloat(apiProduct.variants[0].compare_at_price) * 100) : null,
        type: apiProduct.product_type || null,
        vendor: apiProduct.vendor || null,
        available: apiProduct.available ?? apiProduct.variants?.some(v => v.available) ?? null,
        tags: apiProduct.tags ? apiProduct.tags.split(", ") : [],
        taxonomy: { id: null, name: null, ancestors: null },
        options: apiProduct.options?.map(opt => opt.name) || [],
        variants: apiProduct.variants?.map(variant => ({
          id: variant.id || null,
          title: variant.title || null,
          price: variant.price ? Math.round(parseFloat(variant.price) * 100) : null,
          available: variant.available ?? null,
          sku: variant.sku || null,
          barcode: variant.barcode || null,
          compare_at_price: variant.compare_at_price ? Math.round(parseFloat(variant.compare_at_price) * 100) : null,
        })) || [],
      };
    } catch (error) {
      console.error("Error in normalizeProductObj:", error);
      return null;
    }
  };

  /**
   * Gets product data from a clicked element (for index/pages)
   * @param {HTMLElement} element - The clicked element
   * @returns {Promise<Object|null>} - Product object or null
   */
  window.analyzify.getProductFromElement = async (element) => {
    try {
      const handle = window.analyzify.extractProductHandle(element);
      if (!handle) {
        analyzify.log("No handle found", "an_analyzify", "getProductFromElement");
        return null;
      }

      const apiProduct = await window.analyzify.fetchProductByHandle(handle);
      if (!apiProduct) {
        analyzify.log(`Could not fetch: ${handle}`, "an_analyzify", "getProductFromElement");
        return null;
      }

      const product = window.analyzify.normalizeProductObj(apiProduct);
      analyzify.log("Product ready", "an_analyzify", "getProductFromElement");
      analyzify.log(product, "an_analyzify", "getProductFromElement");
      return product;
    } catch (error) {
      console.error("Error in getProductFromElement:", error);
      return null;
    }
  };

  window.analyzify.getVariantInput = (formElement) => {
    try {
      let variantInput = window.analyzify.getCurrentVariant()?.id;
      if (formElement) {
        // Shopify variant ids are always numeric. Some themes render decorative
        // swatch radios with name="id" and no value attribute (browsers default
        // to "on"), which would mask the real hidden variant input if we used
        // the first match. Filter to numeric-valued inputs and prefer checked.
        const idInputs = Array.from(formElement.elements).filter(
          (el) => el.name === "id" && /^\d+$/.test(el.value)
        );
        const chosen = idInputs.find((el) => el.checked) || idInputs[0];
        if (chosen) variantInput = chosen.value;
      }
      return variantInput;
    } catch (error) {
      return analyzify.log("Error getting variant input", error);
    }
  };

  window.analyzify.getTypeFromTag = function (tagName) {
    const typeMap = {
      A: "link",
      BUTTON: "button",
      NAV: "layer",
    };
    return typeMap[tagName] || "text";
  };

  window.processProductIDFormat = function (
    userInput,
    product_id,
    variant_id,
    product_sku
  ) {
    try {
      let output = userInput;
      output = output.replace("[product_id]", product_id);
      output = output.replace("[variant_id]", variant_id);
      output = output.replace("[product_sku]", product_sku);
      return output;
    } catch (error) {
      console.error("Error in processProductIDFormat:", error);
      return null;
    }
  };
  console.log(`Analyzify ${window?.analyzify?.analyzify_version} is ready.`);

  window.analyzify.initial_load.an_analyzify = true;

  const consentHandler = (e) => {
    try {
      let retries = 0;
      const maxRetries = 5;
      const retryDelay = 800;

      const checkTtpAndExecute = () => {
        // Update cart_id from cookie
        window.analyzify.cart_id = window.analyzify.getCartId();

        // Check if _ttp cookie exists
        const ttpCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("_ttp="));
        const fbpCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("_fbp="));
        const fbcCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("_fbc="));

        if (ttpCookie && fbpCookie && fbcCookie && window.analyzify.cart_id) {
          if (typeof window.analyzify_checksendcartdata === "function") {
            window.analyzify_checksendcartdata();
          } else {
            window.analyzify.log(
              "analyzify_checksendcartdata function not found"
            );
          }
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(checkTtpAndExecute, retryDelay);
        } else {
          if (typeof window.analyzify_checksendcartdata === "function") {
            window.analyzify_checksendcartdata();
          } else {
            window.analyzify.log(
              "analyzify_checksendcartdata function not found"
            );
          }
        }
      };

      checkTtpAndExecute();
    } catch (error) {
      console.error("Error processing consent changes:", error);
    }
  };
  document.addEventListener("AnalyzifyConsent", consentHandler);

} catch (error) {
  console.error("Error in an_analyzify:", error);
}



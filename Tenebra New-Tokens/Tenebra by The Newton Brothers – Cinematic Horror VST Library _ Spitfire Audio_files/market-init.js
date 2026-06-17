;(function () {

  const NOSTO_MARKET_SCRIPT_PATH = "/script/shopify/market/nosto.js"
  const NOSTO_SCRIPT_PATH = "/script/shopify/nosto.js"
  const NOSTO_MARKETS_PREVIEW_PARAM = "nostomarketspreview"
  const nostoMarketScript = document.createElement("script")
  nostoMarketScript.type = "text/javascript"
  nostoMarketScript.async = true

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        const rawValue = c.substring(name.length, c.length);
        try {
          return decodeURIComponent(rawValue);
        } catch (err) {
          console.warn('Failed to decode cookie value', cname, err);
        }
      }
    }
    return "";
  }

  const storage = {
    getItem: (key) => sessionStorage?.getItem(key),
    setItem: (key, value) => sessionStorage?.setItem(key, value),
    removeItem: (key) => sessionStorage?.removeItem(key)
  }

  function isMarketsPreviewEnabled() {
    const urlParams = new URLSearchParams(window.location.search)
    const isPreviewEnabled = urlParams.get(NOSTO_MARKETS_PREVIEW_PARAM) === "true"
    const isPreviewEnabledFromStorage = storage.getItem(NOSTO_MARKETS_PREVIEW_PARAM) === "true"

    if (isPreviewEnabled || isPreviewEnabledFromStorage) {
      !isPreviewEnabledFromStorage && storage.setItem(NOSTO_MARKETS_PREVIEW_PARAM, "true")
      return true
    }

    if (getCookie(NOSTO_MARKETS_PREVIEW_PARAM) === "true") {
      storage.setItem(NOSTO_MARKETS_PREVIEW_PARAM, "true");
      return true;
    }

    storage.removeItem(NOSTO_MARKETS_PREVIEW_PARAM)
    return false
  }

  function buildNostoMarketsUrl(props, shopId) {
    const url = `/apps/proxy${props.path}`
    const nostoMerchant = `shopify-${shopId}`
    const baseParams = {
      merchant: nostoMerchant,
      ...(isMarketsPreviewEnabled() && {preview: true})
    }
    const params = new URLSearchParams({...baseParams, ...props.data})
    return `${url}?${params}`
  }

  function buildFromTagging() {
    const nostoMarketElement = document.querySelector(".nosto_market")
    const marketDataFromStorage = sessionStorage.getItem("nosto_market")
    if (nostoMarketElement) {
      //on iOS safari for some reason the nosto_market id element is a telephone anchor this will make sure
      //that we take the data from anchor in this case
      const nostoMarketIdElement = nostoMarketElement.querySelector(".id")
      let nostoMarketId = nostoMarketIdElement?.innerHTML
      if (nostoMarketIdElement?.firstElementChild) {
        nostoMarketId = nostoMarketIdElement.firstElementChild?.innerHTML
      }
      const nostoMarketLocale = nostoMarketElement.querySelector(".locale")?.innerHTML

      if (nostoMarketId && nostoMarketLocale) {
        return {data: {market: nostoMarketId, locale: nostoMarketLocale}, path: NOSTO_MARKET_SCRIPT_PATH}
      }
    } else if (marketDataFromStorage) {
      return {data: JSON.parse(marketDataFromStorage), path: NOSTO_MARKET_SCRIPT_PATH}
    }
    return null
  }

  function extractShopId() {
    const nostoShopifyShopElement = document.querySelector(".nosto_shopify_shop")
    const shopifyShopIdFromStorage = sessionStorage.getItem("nosto_shopify_shop")
    if (nostoShopifyShopElement) {
      const shopIdElement = nostoShopifyShopElement.querySelector(".id");
      //on iOS safari for some reason the nosto_market id element is a telephone anchor this will make sure
      //that we take the data from anchor in this case
      let shopId = shopIdElement?.innerHTML
      if (shopIdElement?.firstElementChild) {
        shopId = shopIdElement.firstElementChild?.innerHTML
      }
      return shopId
    } else if (shopifyShopIdFromStorage) {
      return shopifyShopIdFromStorage
    }
    return null
  }

  function extractRegionLanguage(customerLocale) {
    const regionRegEx = /(?<lang>[a-z]{2})-(?<region>[A-Z]{2})/
    const resultArray = regionRegEx.exec(customerLocale)
    if (resultArray?.groups?.lang && resultArray?.groups?.region) {
      return {locale: resultArray.groups.lang, region: resultArray.groups.region}
    }
    return null
  }

  function buildFromCheckoutObject() {
    if (window['Shopify']?.checkout?.customer_locale) {
      const customerLocale = window['Shopify'].checkout.customer_locale
      const result = extractRegionLanguage(customerLocale)

      if (result) {
        return {data: result, path: NOSTO_MARKET_SCRIPT_PATH}
      }
    }
    return null
  }

  const params = buildFromTagging() ?? buildFromCheckoutObject() ?? {data: {}, path: NOSTO_SCRIPT_PATH}
  const shopId = extractShopId()

  if (shopId) {
    nostoMarketScript.src = buildNostoMarketsUrl(params, shopId)

    const firstScriptTag = document.querySelector("script")
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(nostoMarketScript, firstScriptTag)
    }
  } else {
    console.error("Nosto not able to render script. Can't find Shop ID. ")
  }
})()

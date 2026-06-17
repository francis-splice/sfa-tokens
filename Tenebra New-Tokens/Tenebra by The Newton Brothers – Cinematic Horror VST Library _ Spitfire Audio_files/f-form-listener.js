(function () {
  const hasGenerateLead =
    window.analyzify?.properties?.GA4?.primary?.events?.generate_lead ||
    window.analyzify?.properties?.GA4?.secondary?.events?.generate_lead ||
    window.analyzify?.properties?.FACEBOOK?.primary?.events?.generate_lead ||
    window.analyzify?.properties?.FACEBOOK?.secondary?.events?.generate_lead ||
    window.analyzify?.properties?.TIKTOK?.events?.generate_lead ||
    window.analyzify?.properties?.GTM?.generate_lead ||
    window.analyzify?.properties?.SERVERSIDE?.events?.generate_lead;

  if (!hasGenerateLead) return;

  // HUBSPOT FORM LISTENER
  (function () {
    try {
      const FORM_MODE = 'both';
      const CHAT_ENABLED = false;
      const FORM_FIELDS = [
        "firstname",
        "lastname",
        "email",
        "phone",
        "company",
        "order_number",
        "message"
      ];

      function buildFormPayload(fullPayload) {
      /**
       * type:
       * {
       *   contact_firstname?: string | null,
       *   contact_lastname?: string | null,
       *   contact_email?: string | null,
       *   contact_phone?: string | null,
       *   contact_company?: string | null,
       *   contact_order_number?: string | null,
       *   contact_message?: string | null,
       *   formId?: string,
       *   embedAtTimestamp?: number,
       *   disableCookieSubmission?: boolean,
       *   isHubSpotCmsGeneratedPage?: boolean,
       *   formTarget?: string,
       *   locale?: string,
       *   source?: string,
       *   hs_context?: object,
       *   originalEmbedContextFormId?: string
       * }
       */
        try {
          const p = {};

          if (fullPayload?.formId) p.formId = fullPayload.formId;
          const ctx = fullPayload?.submission_values?.hs_context || fullPayload?.submission_values;

          if (ctx && typeof ctx === "object") {
            if (ctx.embedAtTimestamp) p.embedAtTimestamp = ctx.embedAtTimestamp;
            if (ctx.disableCookieSubmission) p.disableCookieSubmission = ctx.disableCookieSubmission;
            if (ctx.isHubSpotCmsGeneratedPage) p.isHubSpotCmsGeneratedPage = ctx.isHubSpotCmsGeneratedPage;
            if (ctx.formTarget) p.formTarget = ctx.formTarget;
            if (ctx.locale) p.locale = ctx.locale;
            if (ctx.source) p.source = ctx.source;
            if (ctx.hs_context) p.hs_context = ctx.hs_context;

            const orig = ctx.originalEmbedContext;
            if (orig?.formId) p.originalEmbedContextFormId = orig.formId;
          }

          const sv = fullPayload?.submission_values || {};
          
          // Convert array of {name, value} objects to plain object
          const svObj = {};
          if (Array.isArray(sv)) {
            sv.forEach(item => {
              if (item.name && item.value !== undefined) {
                svObj[item.name] = item.value;
              }
            });
          } else if (typeof sv === 'object') {
            Object.assign(svObj, sv);
          }
          
          FORM_FIELDS.forEach(field => {
            const matchingKey = Object.keys(svObj).find(key => 
              key.includes(field) || 
              key.includes(`/${field}`) || 
              key.includes(`${field}_`) ||
              key.endsWith(`/${field}`) ||
              key === field
            );
            if (matchingKey && svObj[matchingKey]) {
              p[`contact_${field}`] = svObj[matchingKey];
            }
          });
          analyzify.log(`p: ${JSON.stringify(p)}`, "f-form-listener.js", "buildFormPayload");
          return p;
        } catch (e) {
          console.error("Error in buildFormPayload", e);
        }
      }

      // HUBSPOT FORM LISTENERS (V4)
      if (FORM_MODE === "updated_form_editor" || FORM_MODE === "both") {
        try {
          window.addEventListener("hs-form-event:on-ready", e => {
            try {
              if (window.analyzify?.dispatchEvent) {
                window.analyzify.dispatchEvent("hubspot:form_ready", {
                  form_id: e.detail.formId,
                  instance_id: e.detail.instanceId,
                  cart_id: window.analyzify?.cart_id || null,
                });
              }
            } catch (e) {
              console.error("Error in hs-form-event:on-ready", e);
            }
          });
        } catch (e) {
          console.error("Error in hs-form-event:on-ready", e);
        }

        try {
          window.addEventListener("hs-form-event:on-submission:success", e => {
            try {
              if (typeof HubSpotFormsV4?.getFormFromEvent !== "function") return;
              const form = HubSpotFormsV4.getFormFromEvent(e);
              form.getFormFieldValues().then(fields => {
                let sv = fields;
                if (typeof sv.hs_context === "string") {
                  try {
                    sv.hs_context = JSON.parse(sv.hs_context);
                  } catch { }
                }
                const payload = buildFormPayload({
                  form_id: e.detail.formId,
                  instance_id: e.detail.instanceId,
                  conversion_id: form.getConversionId(),
                  redirect_erl: form.getRedirectUrl(),
                  submission_values: sv,
                  cart_id: window.analyzify?.cart_id || null,
                });
                window.analyzify.dispatchEvent("hubspot:form_submitted", payload);
                analyzify.log(sv, "f-form-listener.js", "hs-form-event:on-submission:success");
              });
            } catch (e) {
              console.error("Error in hs-form-event:on-submission:success", e);
            }
          });
        } catch (e) {
          console.error("Error in hs-form-event:on-submission:success", e);
        }

        try {
          window.addEventListener("hs-form-event:on-submission:failed", e => {
            try {
              if (typeof HubSpotFormsV4?.getFormFromEvent !== "function") return;
              const form = HubSpotFormsV4.getFormFromEvent(e);
              form.getFormFieldValues().then(fields => {
                let sv = fields;
                if (typeof sv.hs_context === "string") {
                  try {
                    sv.hs_context = JSON.parse(sv.hs_context);
                  } catch { }
                }
                window.analyzify.dispatchEvent("hubspot:form_submit_failed", buildFormPayload({
                  form_id: e.detail.formId,
                  instance_id: e.detail.instanceId,
                  submission_values: sv,
                  cart_id: window.analyzify?.cart_id || null,
                }));
                analyzify.log(`sv: ${JSON.stringify(sv)}`, "f-form-listener.js", "hs-form-event:on-submission:failed");
              });
            } catch (e) {
              console.error("Error in hs-form-event:on-submission:failed", e);
            }
          });
        } catch (e) {
          console.error("Error in hs-form-event:on-submission:failed", e);
        }
      }

      // HUBSPOT LEGACY FORM LISTENERS
      if (FORM_MODE === "legacy_form_editor" || FORM_MODE === "both") {
        try {
          window.addEventListener("message", e => {
            try {
              if (!e.data || e.data.type !== "hsFormCallback") return;
              const { eventName, id, data } = e.data;

              switch (eventName) {
                case "onBeforeFormInit":
                  window.analyzify.dispatchEvent("hubspot:form_before_init", { formId: id });
                  break;
                case "onFormReady":
                  window.analyzify.dispatchEvent("hubspot:form_ready", { formId: id });
                  break;
                case "onFormSubmitted":
                  let sv = data.submissionValues || {};
                  if (typeof sv.hs_context === "string") {
                    try {
                      sv.hs_context = JSON.parse(sv.hs_context);
                    } catch { }
                  }
                  window.analyzify.dispatchEvent("hubspot:form_submitted", buildFormPayload({
                    form_id: id,
                    redirect_url: data.redirectUrl,
                    submission_values: sv,
                    cart_id: window.analyzify?.cart_id || null,
                  }));
                  analyzify.log(`sv: ${JSON.stringify(sv)}`, "f-form-listener.js", "hs-form-event:on-submission:failed");
                  break;
              }
            } catch (e) {
              console.error("Error in hs-form-event:on-submission:failed", e);
            }
          });
        } catch (e) {
          console.error("Error in hs-form-event:on-submission:failed", e);
        }
      }

      // HUBSPOT CHAT LISTENERS
      if (CHAT_ENABLED) {
        try {
          analyzify.log("Waiting for HubSpotConversations...", "f-form-listener.js", "CHAT_ENABLED");
          let attempts = 0;

          (function waitForChat() {
            try {
              attempts++;
              if (window.HubSpotConversations?.on) {
                analyzify.log("HubSpotConversations available", "f-form-listener.js", "CHAT_ENABLED");
                [
                  "conversationStarted",
                  "conversationClosed",
                  "userSelectedThread",
                  "unreadConversationCountChanged",
                  "contactAssociated",
                  "userInteractedWithWidget",
                  "widgetLoaded",
                  "quickReplyButtonClick",
                  "widgetClosed"
                ].forEach(ev => {
                  window.HubSpotConversations.on(ev, payload => {
                    window.analyzify.dispatchEvent(`hubspot:chat:${ev}`, window.analyzify.flattenObject(payload));
                  });
                });
              } else if (attempts < 10) {
                setTimeout(waitForChat, 500);
              } else {
                analyzify.log("HubSpotConversations not found after max retries.", "f-form-listener.js", "CHAT_ENABLED");
              }
            } catch (e) {
              console.error("Error in waitForChat", e);
            }
          })();
        } catch (e) {
          console.error("Error in waitForChat", e);
        }
      }
    } catch (e) {
      console.error("Error in f-form-listener.js", e);
    }
  })();

  // KLAVIYO FORM LISTENER
  (function () {
    window.addEventListener("klaviyoForms", e => {
      try {
        if (e.detail.type == 'submit') {
          const formData = {
            form_id: e.detail.formId,
            form_title: e.detail.metaData.$source,
            cart_id: window.analyzify?.cart_id || null,
            contact_email: e.detail?.metaData?.$email || null,
            contact_phone: e.detail?.metaData?.$phone_number || null,
            form_source: e.detail?.metaData?.$source || null
          };
          window.analyzify.dispatchEvent("klaviyo:form_submitted", formData);
        
        }
      } catch (error) {
        console.error("Error processing klaviyoForms:", error);
      }
    });
  })();

  // JOTFORM FORM LISTENER (iframe postMessage)
  (function () {
    window.addEventListener('message', function (e) {
      if (!e.origin.includes('jotform.com')) return;
      if (!e.data || e.data.action !== 'submission-completed') return;
      try {
        const payload = {
          form_source: 'jotform',
          form_id: e.data.formID || null,
          cart_id: window.analyzify?.cart_id || null,
        };
        if (window.analyzify?.dispatchEvent) {
          window.analyzify.dispatchEvent('jotform:form_submitted', payload);
          analyzify.log('jotform payload', payload, 'f-form-listener.js', 'jotformFormSubmitted');
        }
      } catch (err) {
        console.error('jotform:form_submitted error:', err);
      }
    });
  })();

  // HULK FORM BUILDER LISTENER (iframe postMessage)
  (function () {
    window.addEventListener('message', function (e) {
      if (!e.origin.includes('hulkapps.com')) return;
      if (!e.data || e.data.type !== 'form_submitted') return;
      try {
        const payload = {
          form_source: 'hulkformbuilder',
          form_id: e.data.payload?.form_id || null,
          cart_id: window.analyzify?.cart_id || null,
        };
        if (window.analyzify?.dispatchEvent) {
          window.analyzify.dispatchEvent('hulkformbuilder:form_submitted', payload);
          analyzify.log('hulkformbuilder payload', payload, 'f-form-listener.js', 'hulkFormSubmitted');
        }
      } catch (err) {
        console.error('hulkformbuilder:form_submitted error:', err);
      }
    });
  })();

  // SHOPIFY FORM LISTENER
  (function () {
    const ALLOWED_ACCOUNT_FORM_TYPES = ["customer_login", "create_customer"];

    function collectAndSend(form, submitter) {
      // Dedup: skip if already dispatched for this submit cycle
      if (form._azfySending) return;
      form._azfySending = true;
      setTimeout(() => { form._azfySending = false; }, 1000);

      const action = form.getAttribute("action") || "";
      if (action.includes("/cart")) return;

      const fd = submitter ? new FormData(form, submitter) : new FormData(form);
      const pairs = {};
      for (const [k, v] of fd.entries()) pairs[k.replace(/\[|\]/g, "_").replace(/_+$/, "")] = v;

      // /account/* forms only pass through for login & signup
      if (action.includes("/account") && !ALLOWED_ACCOUNT_FORM_TYPES.includes(pairs.form_type)) return;

      if (window.analyzify?.dispatchEvent) {
        window.analyzify.dispatchEvent("shopify:form_submitted", pairs);
      }
    }

    function onSubmit(e) {
      const form = e.target && e.target.nodeName === "FORM" ? e.target : null;
      if (!form) return;

      try { collectAndSend(form, e.submitter); }
      catch (err) { console.error("shopify:form_submitted error:", err); }
    }

    // Catch user-triggered submits (button clicks, requestSubmit())
    document.addEventListener("submit", onSubmit, true);
    // Catch programmatic submits (form.submit()) which skip the submit event
    const nativeSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function (...args) {
      try { collectAndSend(this, null); } catch {}
      return nativeSubmit.apply(this, args);
    };

  })();

  // Master email cache — listen to all form_submitted events and stash any email captured.
  // Consumed by window.analyzify.getEmail() as a fallback when shopify_customer.email_address is absent.
  ['shopify', 'klaviyo', 'hubspot', 'jotform', 'hulkformbuilder'].forEach((source) => {
    window.addEventListener(`azfy:${source}:form_submitted`, (e) => {
      try {
        const p = e.detail?.payload || {};
        const email = p.contact_email
          || p.email
          || p.customer_email
          || p['contact[email]']
          || p['customer[email]']
          || null;
        if (email) window.analyzify.setEmail?.(email);
      } catch (err) {
        console.error('azfy:setEmail listener error:', err);
      }
    });
  });

})();
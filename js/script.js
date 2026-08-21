document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }

    // 2. Cookie Consent
    const cookieConsent = document.getElementById("cookie-consent");
    const cookieAccept = document.getElementById("cookie-accept");
    const cookieReject = document.getElementById("cookie-reject");
    const cookieConsentKey = "sgh-cookie-consent";

    if (cookieConsent && cookieAccept && cookieReject) {
        let consent = null;

        try {
            consent = localStorage.getItem(cookieConsentKey);
        } catch {
            consent = null;
        }

        if (!consent) {
            cookieConsent.classList.remove("hidden");
        }

        const saveCookieChoice = (choice) => {
            try {
                localStorage.setItem(cookieConsentKey, choice);
            } catch {
                // The banner still closes when storage is unavailable.
            }
            cookieConsent.classList.add("hidden");
        };

        cookieAccept.addEventListener("click", () => saveCookieChoice("accepted"));
        cookieReject.addEventListener("click", () => saveCookieChoice("rejected"));
    }

    // 3. Mobile Menu Toggle
    const menuButton = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            const isHidden = menu.classList.toggle("hidden");
            menuButton.setAttribute("aria-expanded", (!isHidden).toString());
        });

        // Close mobile menu when clicking any menu link
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.add("hidden");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 4. Lead Form Formatting & Submission Handling
    const leadForm = document.getElementById("lead-form");
    const formMessage = document.getElementById("form-message");
    const formMessageIcon = document.getElementById("form-message-icon");
    const formMessageText = document.getElementById("form-message-text");
    const submitButton = document.getElementById("form-submit");
    const submitLabel = document.getElementById("form-submit-label");
    const submitIcon = document.getElementById("form-submit-icon");
    const eventDateInput = document.getElementById("input-data");
    const whatsappInput = document.getElementById("input-whatsapp");

    // Mask for WhatsApp
    if (whatsappInput) {
        whatsappInput.addEventListener("input", () => {
            const digits = whatsappInput.value.replace(/\D/g, "").slice(0, 11);
            if (digits.length === 0) {
                whatsappInput.value = "";
            } else if (digits.length <= 2) {
                whatsappInput.value = `(${digits}`;
            } else if (digits.length <= 6) {
                whatsappInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
            } else if (digits.length <= 10) {
                whatsappInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
            } else {
                whatsappInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
            }
        });
    }

    // Mask for Event Date (DD/MM/YYYY)
    if (eventDateInput) {
        eventDateInput.addEventListener("input", () => {
            const digits = eventDateInput.value.replace(/\D/g, "").slice(0, 8);
            if (digits.length === 0) {
                eventDateInput.value = "";
                return;
            }
            const parts = [];
            if (digits.length > 0) {
                parts.push(digits.slice(0, 2));
            }
            if (digits.length > 2) {
                parts.push(digits.slice(2, 4));
            }
            if (digits.length > 4) {
                parts.push(digits.slice(4, 8));
            }
            eventDateInput.value = parts.join("/");
        });
    }

    // Submission Handler
    if (leadForm && formMessage && submitButton && submitLabel) {
        leadForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Set loading state
            submitButton.disabled = true;
            submitLabel.textContent = "Enviando solicitação...";
            if (submitIcon) {
                submitIcon.innerHTML = `<svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`;
            }
            formMessage.classList.add("hidden");

            try {
                const response = await fetch(leadForm.action, {
                    method: "POST",
                    body: new FormData(leadForm),
                    headers: { Accept: "application/json" },
                });

                const result = await response.json().catch(() => null);

                if (!response.ok || !result || !result.success) {
                    const errorMsg = (result && result.message)
                        ? result.message
                        : "Não foi possível enviar sua solicitação agora. Tente novamente ou escreva para contato@sghdispenser.com.";
                    throw new Error(errorMsg);
                }

                // Success Feedback
                formMessage.className = "mt-4 p-4 rounded-xl text-sm flex items-center gap-2.5 transition-all bg-emerald-500/10 border border-emerald-500/30 text-emerald-400";
                if (formMessageIcon) {
                    formMessageIcon.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i>`;
                }
                if (formMessageText) {
                    formMessageText.textContent = result.message || "Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.";
                }
                formMessage.classList.remove("hidden");
                leadForm.reset();
            } catch (error) {
                // Error Feedback
                formMessage.className = "mt-4 p-4 rounded-xl text-sm flex items-center gap-2.5 transition-all bg-amber-500/10 border border-amber-500/30 text-amber-300";
                if (formMessageIcon) {
                    formMessageIcon.innerHTML = `<i data-lucide="alert-circle" class="w-5 h-5 text-amber-300"></i>`;
                }
                if (formMessageText) {
                    formMessageText.textContent = error.message || "Não foi possível enviar agora. Tente novamente ou escreva para contato@sghdispenser.com.";
                }
                formMessage.classList.remove("hidden");
            } finally {
                // Reset submit button state
                submitButton.disabled = false;
                submitLabel.textContent = "Solicitar Demonstração";
                if (submitIcon) {
                    submitIcon.innerHTML = `<i data-lucide="send" class="w-5 h-5"></i>`;
                }
                if (typeof lucide !== "undefined" && lucide.createIcons) {
                    lucide.createIcons();
                }
            }

            formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
            formMessage.focus({ preventScroll: true });
        });
    }

    // 5. Navbar Scroll Elevation
    const navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 20) {
                navbar.classList.add("shadow-xl", "bg-slate-900/95");
                navbar.classList.remove("bg-slate-900/90");
            } else {
                navbar.classList.remove("shadow-xl", "bg-slate-900/95");
                navbar.classList.add("bg-slate-900/90");
            }
        });
    }
});

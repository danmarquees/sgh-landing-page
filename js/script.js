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

    // 4. Lead Form Submission Handling
    const leadForm = document.getElementById("lead-form");
    const formMessage = document.getElementById("form-message");
    const submitButton = document.getElementById("form-submit");
    const submitLabel = document.getElementById("form-submit-label");

    if (leadForm && formMessage && submitButton && submitLabel) {
        leadForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            submitButton.disabled = true;
            submitLabel.textContent = "Enviando solicitação...";
            formMessage.classList.add("hidden");

            try {
                const response = await fetch(leadForm.action, {
                    method: "POST",
                    body: new FormData(leadForm),
                    headers: { Accept: "application/json" },
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok || !result.success) {
                    throw new Error("Falha ao enviar o formulário");
                }

                formMessage.classList.remove("hidden", "bg-amber-500/10", "border-amber-500/30", "text-amber-300");
                formMessage.classList.add("bg-emerald-500/10", "border-emerald-500/30", "text-emerald-400");
                formMessage.querySelector("span").textContent = "Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.";
                leadForm.reset();
            } catch {
                formMessage.classList.remove("hidden", "bg-emerald-500/10", "border-emerald-500/30", "text-emerald-400");
                formMessage.classList.add("bg-amber-500/10", "border-amber-500/30", "text-amber-300");
                formMessage.querySelector("span").textContent = "Não foi possível enviar agora. Tente novamente ou escreva para contato@sghdispenser.com.";
            } finally {
                submitButton.disabled = false;
                submitLabel.textContent = "Solicitar demonstração gratuita";
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

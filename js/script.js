/**
 * SGH PRO - Interactive Landing Page Logic
 * Features: Scrollspy, Water Calculator, Dashboard Simulator, FAQ Search & Filters, Form Mask & Chips
 */

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------------------
    // 1. Initialize Lucide Icons
    // -------------------------------------------------------------------------
    function initIcons() {
        if (typeof lucide !== "undefined" && lucide.createIcons) {
            lucide.createIcons();
        }
    }
    initIcons();

    // -------------------------------------------------------------------------
    // 2. Scroll Progress Bar & Navbar Scrollspy
    // -------------------------------------------------------------------------
    const scrollProgress = document.getElementById("scroll-progress");
    const navbar = document.getElementById("navbar");
    const backToTopBtn = document.getElementById("btn-back-to-top");
    const navLinks = document.querySelectorAll("#navbar a[href^='#']");
    const sections = document.querySelectorAll("main > section, header#inicio");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        // Navbar appearance on scroll
        if (navbar) {
            if (scrollTop > 30) {
                navbar.classList.add("bg-slate-950/95", "shadow-2xl", "border-slate-800/80");
                navbar.classList.remove("bg-slate-950/80", "border-slate-800/40");
            } else {
                navbar.classList.remove("bg-slate-950/95", "shadow-2xl", "border-slate-800/80");
                navbar.classList.add("bg-slate-950/80", "border-slate-800/40");
            }
        }

        // Back to Top button
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }

        // Scrollspy
        let currentSectionId = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentSectionId}`) {
                link.classList.add("text-brand-400", "font-semibold");
                link.classList.remove("text-slate-300");
            } else if (href.startsWith("#") && href.length > 1) {
                link.classList.remove("text-brand-400", "font-semibold");
                link.classList.add("text-slate-300");
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // -------------------------------------------------------------------------
    // 3. Mobile Menu Toggle
    // -------------------------------------------------------------------------
    const menuButton = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            const isHidden = menu.classList.toggle("hidden");
            menuButton.setAttribute("aria-expanded", (!isHidden).toString());
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menu.classList.add("hidden");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // -------------------------------------------------------------------------
    // 4. Interactive Water Dimensioning Calculator
    // -------------------------------------------------------------------------
    const calcSlider = document.getElementById("calc-slider");
    const calcAudienceDisplay = document.getElementById("calc-audience-val");
    const calcWaterVal = document.getElementById("calc-water-val");
    const calcPointsVal = document.getElementById("calc-points-val");
    const calcPeakVal = document.getElementById("calc-peak-val");
    const calcApplyBtn = document.getElementById("calc-apply-btn");
    const calcPresets = document.querySelectorAll(".calc-preset-btn");

    function updateCalculator(audience) {
        const parsedAudience = parseInt(audience, 10) || 25000;

        // Formulations based on average event consumption standards
        const waterLiters = Math.round(parsedAudience * 0.95);
        const hydrationPoints = Math.max(2, Math.round(parsedAudience / 1400));
        const peakFlow = Math.round((waterLiters * 0.32) / 2);

        if (calcAudienceDisplay) {
            calcAudienceDisplay.textContent = parsedAudience.toLocaleString("pt-BR");
        }
        if (calcWaterVal) {
            calcWaterVal.textContent = `${waterLiters.toLocaleString("pt-BR")} L`;
        }
        if (calcPointsVal) {
            calcPointsVal.textContent = `${hydrationPoints} pontos`;
        }
        if (calcPeakVal) {
            calcPeakVal.textContent = `${peakFlow.toLocaleString("pt-BR")} L/h`;
        }

        // Highlight active preset button if match
        calcPresets.forEach((btn) => {
            const presetVal = parseInt(btn.getAttribute("data-value"), 10);
            if (presetVal === parsedAudience) {
                btn.classList.add("bg-brand-600", "text-white", "border-brand-400");
                btn.classList.remove("bg-slate-800", "text-slate-300", "border-slate-700");
            } else {
                btn.classList.remove("bg-brand-600", "text-white", "border-brand-400");
                btn.classList.add("bg-slate-800", "text-slate-300", "border-slate-700");
            }
        });
    }

    if (calcSlider) {
        calcSlider.addEventListener("input", (e) => {
            updateCalculator(e.target.value);
        });

        calcPresets.forEach((btn) => {
            btn.addEventListener("click", () => {
                const val = btn.getAttribute("data-value");
                if (val) {
                    calcSlider.value = val;
                    updateCalculator(val);
                }
            });
        });

        // Initialize default
        updateCalculator(calcSlider.value || 25000);
    }

    if (calcApplyBtn) {
        calcApplyBtn.addEventListener("click", () => {
            const audience = calcSlider ? calcSlider.value : "25000";
            const audienceFormatted = `${parseInt(audience, 10).toLocaleString("pt-BR")} pessoas`;

            const inputParticipantes = document.getElementById("input-participantes");
            if (inputParticipantes) {
                inputParticipantes.value = audienceFormatted;
            }

            // Sync with chips if available
            document.querySelectorAll(".chip-audience").forEach((chip) => {
                chip.classList.remove("active");
            });

            // Smooth scroll to lead form
            const formElement = document.getElementById("lead-form");
            if (formElement) {
                formElement.scrollIntoView({ behavior: "smooth", block: "center" });
                if (inputParticipantes) {
                    inputParticipantes.classList.add("ring-2", "ring-brand-400");
                    setTimeout(() => inputParticipantes.classList.remove("ring-2", "ring-brand-400"), 2000);
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // 5. Dashboard Simulator Tabs
    // -------------------------------------------------------------------------
    const simTabBtns = document.querySelectorAll(".sim-tab-btn");
    const simPanels = document.querySelectorAll(".sim-panel");

    simTabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            simTabBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            simPanels.forEach((panel) => {
                if (panel.getAttribute("data-panel") === targetTab) {
                    panel.classList.remove("hidden");
                    panel.classList.add("block");
                } else {
                    panel.classList.add("hidden");
                    panel.classList.remove("block");
                }
            });

            initIcons();
        });
    });

    // -------------------------------------------------------------------------
    // 6. FAQ 2.0 (Category Filters & Real-time Search)
    // -------------------------------------------------------------------------
    const faqFilterBtns = document.querySelectorAll(".faq-filter-btn");
    const faqItems = document.querySelectorAll(".faq-item");
    const faqSearchInput = document.getElementById("faq-search-input");
    const faqMatchCount = document.getElementById("faq-match-count");
    const faqEmptyState = document.getElementById("faq-empty-state");

    let currentCategory = "all";
    let searchQuery = "";

    function filterFAQ() {
        let visibleCount = 0;

        faqItems.forEach((item) => {
            const itemCategory = item.getAttribute("data-category") || "geral";
            const textContent = item.textContent.toLowerCase();

            const matchesCategory = currentCategory === "all" || itemCategory === currentCategory;
            const matchesSearch = !searchQuery || textContent.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                item.classList.remove("hidden");
                visibleCount++;
            } else {
                item.classList.add("hidden");
            }
        });

        if (faqMatchCount) {
            faqMatchCount.textContent = `${visibleCount} ${visibleCount === 1 ? "pergunta encontrada" : "perguntas encontradas"}`;
        }

        if (faqEmptyState) {
            if (visibleCount === 0) {
                faqEmptyState.classList.remove("hidden");
            } else {
                faqEmptyState.classList.add("hidden");
            }
        }
    }

    faqFilterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            faqFilterBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.getAttribute("data-category") || "all";
            filterFAQ();
        });
    });

    if (faqSearchInput) {
        faqSearchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterFAQ();
        });
    }

    // -------------------------------------------------------------------------
    // 7. Lead Form Quick Select Chips & Interactive Inputs
    // -------------------------------------------------------------------------
    // Event Type Chips
    const typeChips = document.querySelectorAll(".chip-event-type");
    const inputTipoEvento = document.getElementById("input-tipo-evento");

    typeChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            typeChips.forEach((c) => c.classList.remove("active"));
            chip.classList.add("active");
            if (inputTipoEvento) {
                inputTipoEvento.value = chip.getAttribute("data-value") || chip.textContent.trim();
            }
        });
    });

    // Audience Chips
    const audienceChips = document.querySelectorAll(".chip-audience");
    const inputParticipantes = document.getElementById("input-participantes");

    audienceChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            audienceChips.forEach((c) => c.classList.remove("active"));
            chip.classList.add("active");
            if (inputParticipantes) {
                inputParticipantes.value = chip.getAttribute("data-value") || chip.textContent.trim();
            }
        });
    });

    // Phone / WhatsApp Mask
    const inputWhatsapp = document.getElementById("input-whatsapp");
    if (inputWhatsapp) {
        inputWhatsapp.addEventListener("input", () => {
            let digits = inputWhatsapp.value.replace(/\D/g, "").slice(0, 11);
            if (digits.length <= 2) {
                inputWhatsapp.value = digits.length > 0 ? `(${digits}` : "";
            } else if (digits.length <= 6) {
                inputWhatsapp.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
            } else if (digits.length <= 10) {
                inputWhatsapp.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
            } else {
                inputWhatsapp.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
            }
        });
    }

    // Date Mask
    const inputData = document.getElementById("input-data");
    if (inputData) {
        inputData.addEventListener("input", () => {
            const digits = inputData.value.replace(/\D/g, "").slice(0, 8);
            const parts = [];
            if (digits.length > 0) parts.push(digits.slice(0, 2));
            if (digits.length > 2) parts.push(digits.slice(2, 4));
            if (digits.length > 4) parts.push(digits.slice(4, 8));
            inputData.value = parts.join("/");
        });
    }

    // -------------------------------------------------------------------------
    // 8. Lead Form AJAX Submission
    // -------------------------------------------------------------------------
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
                    throw new Error("Falha ao enviar");
                }

                formMessage.classList.remove("hidden", "bg-amber-500/10", "border-amber-500/30", "text-amber-300");
                formMessage.classList.add("bg-emerald-500/15", "border-emerald-500/40", "text-emerald-300");
                formMessage.querySelector("span").textContent =
                    "Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.";
                leadForm.reset();
                typeChips.forEach((c) => c.classList.remove("active"));
                audienceChips.forEach((c) => c.classList.remove("active"));
            } catch {
                formMessage.classList.remove("hidden", "bg-emerald-500/15", "border-emerald-500/40", "text-emerald-300");
                formMessage.classList.add("bg-amber-500/15", "border-amber-500/40", "text-amber-300");
                formMessage.querySelector("span").textContent =
                    "Não foi possível enviar agora. Tente novamente ou escreva para contato@sghdispenser.com.";
            } finally {
                submitButton.disabled = false;
                submitLabel.textContent = "Solicitar demonstração gratuita";
                initIcons();
            }

            formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
            formMessage.focus({ preventScroll: true });
        });
    }

    // -------------------------------------------------------------------------
    // 9. Cookie Consent Banner
    // -------------------------------------------------------------------------
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
                // Ignore storage error
            }
            cookieConsent.classList.add("hidden");
        };

        cookieAccept.addEventListener("click", () => saveCookieChoice("accepted"));
        cookieReject.addEventListener("click", () => saveCookieChoice("rejected"));
    }
});

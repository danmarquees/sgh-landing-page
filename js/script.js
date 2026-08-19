document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
    }

    // 2. Mobile Menu Toggle
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

    // 3. Lead Form Submission Handling
    const leadForm = document.getElementById("lead-form");
    const formMessage = document.getElementById("form-message");

    if (leadForm && formMessage) {
        leadForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Show success message
            formMessage.classList.remove("hidden");

            // Re-render icons inside success message if needed
            if (typeof lucide !== "undefined" && lucide.createIcons) {
                lucide.createIcons();
            }

            // Smooth scroll into message if needed
            formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

            // Reset the form fields
            leadForm.reset();
        });
    }

    // 4. Navbar Scroll Elevation
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

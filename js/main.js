document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".page-loader");
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const revealItems = document.querySelectorAll(".reveal");
    const contactForm = document.querySelector("#contactForm");
    const formSuccess = document.querySelector("#formSuccess");
    const phoneInput = document.querySelector('input[name="phone"]');

phoneInput?.addEventListener("input", () => {
    // Remove anything that is not a number
    phoneInput.value = phoneInput.value.replace(/\D/g, "");

    // Limit to 10 digits
    phoneInput.value = phoneInput.value.slice(0, 10);
});
    const year = document.querySelector("#year");

    window.addEventListener("load", () => {
        setTimeout(() => loader?.classList.add("hide"), 350);
    });

    const updateHeader = () => {
        header?.classList.toggle("scrolled", window.scrollY > 30);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    menuToggle?.addEventListener("click", () => {
        const open = menuToggle.classList.toggle("active");
        navMenu?.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("menu-open", open);
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle?.classList.remove("active");
            navMenu?.classList.remove("open");
            document.body.classList.remove("menu-open");
            menuToggle?.setAttribute("aria-expanded", "false");
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach(item => observer.observe(item));

    contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

        const phone = phoneInput?.value.trim();

    if (!/^\d{10}$/.test(phone)) {
        phoneInput?.focus();
        phoneInput?.setCustomValidity("Please enter exactly 10 digits.");
        phoneInput?.reportValidity();
        return;
    }

    phoneInput?.setCustomValidity("");

    const button = contactForm.querySelector(".submit-button");
    const original = button.innerHTML;

    button.innerHTML = "Sending...";
    button.disabled = true;

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {
            button.innerHTML = "Message Sent ✓";
            formSuccess.textContent =
                "Thanks! Your message has been sent successfully. We’ll get back to you soon.";
            formSuccess.classList.add("show");

            contactForm.reset();

            setTimeout(() => {
                button.innerHTML = original;
                button.disabled = false;
            }, 3500);
        } else {
            throw new Error("Form submission failed");
        }

    } catch (error) {
        button.innerHTML = "Try Again";
        button.disabled = false;

        formSuccess.textContent =
            "Something went wrong. Please try again or contact us directly.";
        formSuccess.classList.add("show");
    }
});

    if (year) year.textContent = new Date().getFullYear();
});

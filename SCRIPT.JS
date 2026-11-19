
/* =====================================
   BRAND CONFIGURATION
===================================== */

const BRAND = {
    name: "CLEANYA",
    whatsapp: "91XXXXXXXXXX" // Replace with your 10-digit Indian number + 91
};

/* =====================================
   EMAILJS CONFIGURATION
===================================== */

const EMAILJS_CONFIG = {
    publicKey: "T36FQxg6CzPAAgsXO", //YOUR_PUBLIC_KEY
    serviceID: "service_58k4krg", //YOUR_SERVICE_ID
    templateID: "template_dioeex2" //YOUR_TEMPLATE_ID
};

emailjs.init({
    publicKey: EMAILJS_CONFIG.publicKey
});

/* =====================================
   MOBILE NAVIGATION
===================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

/* =====================================
   SCROLL ANIMATIONS
===================================== */

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});

/* =====================================
   COPYRIGHT YEAR
===================================== */

document.getElementById("year").textContent =
    new Date().getFullYear();

/* =====================================
   WHATSAPP
===================================== */

function openWhatsApp(message) {
    if (!/^91\d{10}$/.test(BRAND.whatsapp)) {
        alert("Please configure your WhatsApp number in BRAND settings.");
        return;
    }

    const url =
        `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("whatsappButton").addEventListener("click", event => {
    event.preventDefault();

    openWhatsApp(
        `Hello ${BRAND.name}! I would like to know more about your cleaning products.`
    );
});

/* =====================================
   EMAIL CONTACT FORM
===================================== */

const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");
const submitIcon = document.getElementById("submitIcon");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    // Honeypot spam protection
    if (document.getElementById("website").value.trim()) {
        return;
    }

    // Check EmailJS configuration
    const configured = Object.values(EMAILJS_CONFIG).every(value =>
        value && !value.startsWith("YOUR_")
    );

    if (!configured) {
        formMessage.textContent =
            "Email service is not configured. Please try again later.";
        formMessage.style.color = "#c0392b";
        return;
    }

    // Collect form values
    const templateParams = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        customer_type: document.getElementById("customerType").value,
        product: document.getElementById("interest").value,
        quantity: document.getElementById("quantity").value.trim() || "Not specified",
        message: document.getElementById("message").value.trim()
    };

    // Validate required fields
    if (
        !templateParams.name ||
        !templateParams.email ||
        !templateParams.phone ||
        !templateParams.customer_type ||
        !templateParams.product ||
        !templateParams.message
    ) {
        formMessage.textContent = "Please complete all required fields.";
        formMessage.style.color = "#c0392b";
        return;
    }

    if (!/^[0-9+\-\s()]{7,15}$/.test(templateParams.phone)) {
        formMessage.textContent = "Please enter a valid phone number.";
        formMessage.style.color = "#c0392b";
        return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitText.textContent = "Sending...";
    submitIcon.className = "fa-solid fa-spinner fa-spin";

    formMessage.textContent = "Sending your enquiry...";
    formMessage.style.color = "#69776e";

    try {
        await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams
        );

        formMessage.textContent =
            "Thank you! Your enquiry has been sent successfully.";

        formMessage.style.color = "#16834b";

        contactForm.reset();

    } catch (error) {
        console.error("EmailJS error:", error);

        formMessage.textContent =
            "Unable to send your enquiry. Please try again later.";

        formMessage.style.color = "#c0392b";

    } finally {
        submitBtn.disabled = false;
        submitText.textContent = "Send Enquiry";
        submitIcon.className = "fa-solid fa-paper-plane";
    }
});

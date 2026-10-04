// ════════════════════════════════════════════
//  CLCC WORLDWIDE — script.js
// ════════════════════════════════════════════

// ── PAYSTACK CONFIG ──────────────────────────
// IMPORTANT: Replace with your real Paystack PUBLIC key from dashboard.paystack.com
const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const CHURCH_EMAIL = "giving@clccworldwide.org"; // Your church receiving email

// ── SELECTED AMOUNT ──────────────────────────
let selectedAmount = 1000; // default ₦1,000

// ── PRELOADER ────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("hide");
  }, 1800);
});

// ── NAVBAR SCROLL ────────────────────────────
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  const top = document.getElementById("back-top");
  if (window.scrollY > 60) {
    nav.classList.add("scrolled");
    top.classList.add("visible");
  } else {
    nav.classList.remove("scrolled");
    top.classList.remove("visible");
  }
});

// ── BACK TO TOP ──────────────────────────────
document.getElementById("back-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── MOBILE MENU ──────────────────────────────
function toggleMenu() {
  const h = document.getElementById("hamburger");
  const m = document.getElementById("mobileNav");
  h.classList.toggle("active");
  m.classList.toggle("open");
  document.body.style.overflow = m.classList.contains("open") ? "hidden" : "";
}
function closeMenu() {
  document.getElementById("hamburger").classList.remove("active");
  document.getElementById("mobileNav").classList.remove("open");
  document.body.style.overflow = "";
}

// ── PARTICLES ────────────────────────────────
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 4 + 2;
    p.style.cssText = `left:${Math.random() * 100}%; width:${size}px; height:${size}px; animation-duration:${Math.random() * 12 + 8}s; animation-delay:${Math.random() * 8}s; opacity:${Math.random() * 0.5 + 0.1}; background:${Math.random() > 0.6 ? "#C9A84C" : "rgba(255,255,255,0.4)"};`;
    container.appendChild(p);
  }
}
createParticles();

// ── FADE UP ON SCROLL ────────────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

// ── TABS ─────────────────────────────────────
function switchTab(panel, btn) {
  document
    .querySelectorAll(".pt-tab")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".pt-panel")
    .forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("panel-" + panel).classList.add("active");
}

// ── TESTIMONY FORM ────────────────────────────
function openTestimonyForm() {
  const f = document.getElementById("testimony-form-wrap");
  f.style.display = f.style.display === "none" ? "block" : "none";
  if (f.style.display === "block")
    f.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ── GIVING AMOUNT ─────────────────────────────
function selectAmount(el, value) {
  document
    .querySelectorAll(".amount-btn")
    .forEach((b) => b.classList.remove("selected"));
  el.classList.add("selected");

  const customWrap = document.getElementById("custom-amount-wrap");
  if (value === "") {
    customWrap.style.display = "block";
    selectedAmount = 0;
  } else {
    customWrap.style.display = "none";
    selectedAmount = parseInt(value);
    document.getElementById("give-custom").value = "";
  }
}

// ── TOAST ─────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3800);
}

// ── PAYSTACK PAYMENT ──────────────────────────
function payWithPaystack() {
  const name = document.getElementById("give-name").value.trim();
  const email = document.getElementById("give-email").value.trim();
  const fund = document.getElementById("give-fund").value;
  const custom = parseInt(document.getElementById("give-custom").value) || 0;
  const amount = custom > 0 ? custom : selectedAmount;

  // Validation
  if (!name) {
    showToast("⚠️ Please enter your full name.");
    return;
  }
  if (!email || !email.includes("@")) {
    showToast("⚠️ Please enter a valid email address.");
    return;
  }
  if (!amount || amount < 100) {
    showToast("⚠️ Minimum giving amount is ₦100.");
    return;
  }

  // Fund label map
  const fundLabels = {
    tithe: "Tithe",
    offering: "Offering",
    missions: "Missions Fund",
    building: "Building Fund",
    benevolence: "Benevolence Fund",
    youth: "Youth Ministry",
  };

  // Disable button while processing
  const btn = document.getElementById("pay-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…';

  // Paystack popup
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amount * 100, // Paystack uses kobo (amount × 100)
    currency: "NGN",
    ref: "CLCC-" + new Date().getTime(),
    metadata: {
      custom_fields: [
        {
          display_name: "Donor Name",
          variable_name: "donor_name",
          value: name,
        },
        {
          display_name: "Giving Type",
          variable_name: "giving_type",
          value: fundLabels[fund] || fund,
        },
        {
          display_name: "Church",
          variable_name: "church",
          value: "CLCC Worldwide",
        },
      ],
    },
    callback: function (response) {
      // Payment successful
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-lock"></i> Pay Securely with Paystack';
      showToast(
        "🙏 Thank you " +
          name +
          "! ₦" +
          amount.toLocaleString() +
          " given successfully. God bless you!",
      );

      ```
  // Clear form
  document.getElementById('give-name').value  = '';
  document.getElementById('give-email').value = '';
  document.getElementById('give-custom').value = '';
  console.log('Payment ref:', response.reference);
},
onClose: function() {
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-lock"></i> Pay Securely with Paystack';
  showToast('Payment window closed. Your giving was not processed.');
}
```;
    },
  });

  handler.openIframe();
}

// ── FORM SUBMISSIONS ──────────────────────────
function submitPrayer() {
  const name = document.getElementById("pr-fname").value.trim();
  const req = document.getElementById("pr-request").value.trim();
  if (!name || !req) {
    showToast("⚠️ Please fill in your name and prayer request.");
    return;
  }
  showToast("🙏 Prayer request submitted! Our team will intercede for you.");
  ["pr-fname", "pr-lname", "pr-email", "pr-request"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("pr-category").selectedIndex = 0;
}

function submitTestimony() {
  const name = document.getElementById("te-name").value.trim();
  const text = document.getElementById("te-text").value.trim();
  if (!name || !text) {
    showToast("⚠️ Please fill in your name and testimony.");
    return;
  }
  showToast("🌟 Testimony submitted! Thank you for sharing Gods goodness.");
  ["te-name", "te-duration", "te-text"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
}

function submitContact() {
  const email = document.getElementById("ct-email").value.trim();
  const msg = document.getElementById("ct-message").value.trim();
  if (!email || !msg) {
    showToast("⚠️ Please fill in your email and message.");
    return;
  }
  showToast("✉️ Message sent! We will respond within 24–48 hours.");
  ["ct-fname", "ct-lname", "ct-email", "ct-phone", "ct-message"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
}

function submitNewsletter() {
  const email = document.getElementById("nl-email").value.trim();
  if (!email || !email.includes("@")) {
    showToast("⚠️ Please enter a valid email address.");
    return;
  }
  showToast("📧 Subscribed! Welcome to the CLCC family.");
  document.getElementById("nl-email").value = "";
}

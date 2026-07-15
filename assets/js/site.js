(() => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#primary-nav");

  const closeNav = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    body.classList.remove("nav-open");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      body.classList.toggle("nav-open", !isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  const eligibilityForm = document.querySelector("#eligibility-form");
  const eligibilityError = document.querySelector("#eligibility-error");
  const eligibilityResult = document.querySelector("#eligibility-result");

  if (eligibilityForm && eligibilityError && eligibilityResult) {
    eligibilityForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(eligibilityForm);
      const degree = formData.get("stem_degree");
      const research = formData.get("research_role");
      const country = String(formData.get("filing_country") || "").trim();
      const goal = formData.get("china_goal");

      if (!degree || !research || !country || !goal) {
        eligibilityError.hidden = false;
        eligibilityResult.removeAttribute("data-state");
        eligibilityResult.innerHTML = `
          <p class="result-kicker">Your result</p>
          <h3>We need every answer for a useful pre-check.</h3>
          <p>Complete the highlighted questions, then try again.</p>
        `;
        return;
      }

      eligibilityError.hidden = true;

      const hasPublishedRoute = degree === "yes" || research === "yes";
      const uncertainRoute = degree === "unsure" && research === "no";
      const employmentNote = goal === "employment"
        ? "Confirm work permit and residence requirements before accepting salaried employment."
        : "Match your planned activity to the exact status permitted after entry.";

      if (hasPublishedRoute) {
        eligibilityResult.dataset.state = "potential";
        eligibilityResult.innerHTML = `
          <p class="result-kicker">Potential fit</p>
          <h3>You appear to match a published K Visa pathway.</h3>
          <p>This is not an approval prediction. Your next task is to confirm how the filing post serving ${escapeHtml(country)} applies the age, institution and evidence rules.</p>
          <ul class="result-list">
            <li>Ask for the current K-specific checklist</li>
            <li>Prepare proof that your institution is recognized</li>
            <li>Confirm translation and authentication rules</li>
            <li>${escapeHtml(employmentNote)}</li>
          </ul>
        `;
      } else if (uncertainRoute) {
        eligibilityResult.dataset.state = "review";
        eligibilityResult.innerHTML = `
          <p class="result-kicker">Evidence check needed</p>
          <h3>Your degree classification needs a closer look.</h3>
          <p>Review your degree title, transcript and institution status. Ask the filing post serving ${escapeHtml(country)} whether your field falls within its STEM interpretation.</p>
          <ul class="result-list">
            <li>Collect your degree and full transcript</li>
            <li>Document the institution's accreditation</li>
            <li>Describe the technical content of your field</li>
            <li>${escapeHtml(employmentNote)}</li>
          </ul>
        `;
      } else {
        eligibilityResult.dataset.state = "unlikely";
        eligibilityResult.innerHTML = `
          <p class="result-kicker">No clear published route</p>
          <h3>The K Visa may not be the strongest route for this profile.</h3>
          <p>The published pathways focus on STEM graduates and qualifying STEM teaching or research roles. Compare Z, R, F, M or X routes based on your real purpose.</p>
          <ul class="result-list">
            <li>Start with your intended activity in China</li>
            <li>Do not reshape facts to fit a visa category</li>
            <li>Check the official visa descriptions</li>
            <li>${escapeHtml(employmentNote)}</li>
          </ul>
        `;
      }

      eligibilityResult.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    });
  }

  const contactForm = document.querySelector("#contact-form");
  const contactError = document.querySelector("#contact-error");
  const contactStatus = document.querySelector("#contact-status");
  const serviceSelect = document.querySelector("#contact-service");

  document.querySelectorAll("[data-select-service]").forEach((link) => {
    link.addEventListener("click", () => {
      if (serviceSelect) serviceSelect.value = link.dataset.selectService || "";
    });
  });

  if (contactForm && contactError && contactStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactError.hidden = false;
        contactStatus.textContent = "";
        contactForm.reportValidity();
        return;
      }

      contactError.hidden = true;
      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const country = String(formData.get("country") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const serviceLabels = {
        "dossier-review": "US$79 dossier review pilot",
        "policy-updates": "Free policy updates",
        "filing-question": "Filing-post question",
        partner: "Professional partnership"
      };

      const subject = `China K Visa enquiry: ${serviceLabels[service] || service}`;
      const bodyText = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Filing country or city: ${country}`,
        `Request: ${serviceLabels[service] || service}`,
        "",
        message
      ].join("\n");

      contactStatus.textContent = "Your email app should open now. If it does not, email hello@chinakvisa.com directly.";
      window.location.href = `mailto:hello@chinakvisa.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[character]);
  }
})();

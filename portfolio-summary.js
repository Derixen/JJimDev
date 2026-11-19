/* Standalone printable portfolio summary. No changes to app.js required. */
(() => {
  const lang = () => {
    const selected = localStorage.getItem("siteLanguage") || "en";
    return ["en", "de", "hu"].includes(selected) ? selected : "en";
  };
  const profileText = {
    en: {
      kicker: "PROFESSIONAL PROFILE",
      job: "Enterprise Systems Architect",
      experience:
        "Over 15 years of experience in enterprise IT, specializing in software deployment, automation, and application development.",
      location: "Location",
      country: "Hungary",
      email: "Email",
      linkedin: "LinkedIn",
      website: "Website",
    },

    de: {
      kicker: "BERUFSPROFIL",
      job: "Enterprise-Systemarchitekt",
      experience:
        "Über 15 Jahre Erfahrung in der Enterprise-IT, mit Schwerpunkt auf Softwareverteilung, Automatisierung und Anwendungsentwicklung.",
      location: "Standort",
      country: "Ungarn",
      email: "E-Mail",
      linkedin: "LinkedIn",
      website: "Webseite",
    },

    hu: {
      kicker: "SZAKMAI PROFIL",
      job: "Nagyvállalati rendszerarchitekt",
      experience:
        "Több mint 15 éves tapasztalat a nagyvállalati informatikában, különös tekintettel a szoftverterítésre, az automatizálásra és az alkalmazásfejlesztésre.",
      location: "Lakóhely",
      country: "Magyarország",
      email: "E-mail",
      linkedin: "LinkedIn",
      website: "Weboldal",
    },
  };
  const labels = {
    en: {
      button: "Portfolio Summary",
      title: "Portfolio Summary",
      print: "Print",
      close: "Close",
      profile: "Professional Profile",
      career: "Complete Career Journey",
      tools: "Tools & Applications",
      scripts: "Scripts & Automation",
      companies: "Companies & Enterprise Accounts",
      certs: "Certifications",
      trainings: "Professional Training",
      delivered: "Delivered",
      completed: "Completed",
      languages: "Languages",
      technologies: "Technologies",
      years: "Experience",
      error: "Unable to load portfolio data.",
    },
    de: {
      button: "Portfolio-Übersicht",
      title: "Portfolio-Übersicht",
      print: "Drucken",
      close: "Schließen",
      profile: "Berufliches Profil",
      career: "Vollständiger beruflicher Werdegang",
      tools: "Tools & Anwendungen",
      scripts: "Skripte & Automatisierung",
      companies: "Unternehmen & Unternehmenskunden",
      certs: "Zertifizierungen",
      trainings: "Weiterbildungen",
      delivered: "Durchgeführt",
      completed: "Absolviert",
      languages: "Sprachen",
      technologies: "Technologien",
      years: "Berufserfahrung",
      error: "Portfolio-Daten konnten nicht geladen werden.",
    },
    hu: {
      button: "Portfólió összefoglaló",
      title: "Portfólió összefoglaló",
      print: "Nyomtatás",
      close: "Bezárás",
      profile: "Szakmai profil",
      career: "Teljes szakmai pályafutás",
      tools: "Eszközök és alkalmazások",
      scripts: "Szkriptek és automatizálás",
      companies: "Vállalatok és nagyvállalati ügyfelek",
      certs: "Tanúsítványok",
      trainings: "Szakmai képzések",
      delivered: "Megtartott képzések",
      completed: "Elvégzett képzések",
      languages: "Nyelvtudás",
      technologies: "Technológiák",
      years: "Szakmai tapasztalat",
      error: "Nem sikerült betölteni a portfólió adatait.",
    },
  };
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const plain = (html) => {
    const el = document.createElement("div");
    el.innerHTML = html || "";
    return (el.textContent || "").replace(/\s+/g, " ").trim();
  };
  const short = (html, max = 210) => {
    const s = plain(html);
    return esc(
      s.length > max ? s.slice(0, max).replace(/\s+\S*$/, "") + "…" : s,
    );
  };
  const find = (data, enText, url) =>
    (data.buttons || []).find((x) => x.url === url || x.text === enText);
  const section = (title, content) =>
    `<section class="ps-section"><h2>${esc(title)}</h2>${content}</section>`;
  const entry = (name, description) =>
    `<div class="ps-mini"><strong>${esc(name)}</strong>${description ? `<p>${description}</p>` : ""}</div>`;
  let oldFocus = null;
  let closingTimer = null;

  async function openSummary() {
    const l = lang(),
      t = labels[l],
      modal = document.getElementById("portfolio-summary");
    oldFocus = document.activeElement;
    clearTimeout(closingTimer);
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => modal.classList.add("ps-visible")),
    );
    const content = document.getElementById("ps-content");
    content.innerHTML = '<p class="ps-loading">Loading…</p>';
    try {
      const languageFiles = {
        en: "data.json",
        de: "data.de.json",
        hu: "data.hu.json",
      };

      const response = await fetch(languageFiles[l]);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (modal.getAttribute("aria-hidden") === "false")
        content.innerHTML = render(data, t);
    } catch (err) {
      content.textContent = t.error + " " + err.message;
    }
    document.getElementById("ps-close-top").focus();
  }
  function closeSummary() {
    const modal = document.getElementById("portfolio-summary");
    if (modal.getAttribute("aria-hidden") === "true") return;
    modal.classList.remove("ps-visible");
    modal.setAttribute("aria-hidden", "true");
    closingTimer = setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "";
      oldFocus?.focus?.();
    }, 350);
  }
  function render(data, t) {
    const p = data.profile || {};
    const pt = profileText[lang()] || profileText.en;
    const fullName =
      [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" ") ||
      data.siteheading ||
      "";
    const career = find(data, "Career Journey", "#General")?.description || [];
    const tools = find(data, "My Tools", "#Tools")?.dropdownItems || [];
    const scriptsButton = (data.buttons || []).find(
      (x) =>
        x.url?.toLowerCase() === "#scripts" ||
        /^(my scripts|meine skripte)$/i.test(x.text || ""),
    );

    const scripts = scriptsButton?.dropdownItems || [];
    const companies = find(data, "Companies", "#Companies");
    const certs =
      find(data, "Certifications", "#Certifications")?.description || [];
    const trainings =
      find(data, "Trainings", "#Trainings")?.dropdownItems || [];
    const languages = `
  <div class="ps-languages">
    ${(p.languages || [])
      .map(
        (x) => `
          <div class="ps-language">
            <strong>${esc(x.name)}</strong>
            <span>${esc(x.level)}</span>
          </div>
        `,
      )
      .join("")}
  </div>
`;
    const careerHtml = career
      .map(
        (x) =>
          `<article class="ps-career"><div class="ps-career-top"><div><h3>${esc(x.role)}</h3><strong>${esc(x.company)}</strong></div><span>${esc(x.date)}</span></div><p>${esc(plain(x.desc))}</p>${x.techStack?.length ? `<p class="ps-tech"><b>${t.technologies}:</b> ${x.techStack.map(esc).join(" · ")}</p>` : ""}</article>`,
      )
      .join("");
    const toolHtml = tools
      .map((x) => entry(x.title || x.text, short(x.description, 170)))
      .join("");
    const scriptHtml = scripts
      .map((x) => entry(x.title || x.text, short(x.description, 170)))
      .join("");
    const certHtml = certs
      .map(
        (x) =>
          `<div class="ps-row"><strong>${esc(x.title)}</strong><span>${esc([x.vendor || x.issuer, x.year].filter(Boolean).join(" · "))}</span></div>`,
      )
      .join("");
    const trainingHtml = trainings
      .map(
        (group) =>
          `<h3 class="ps-subhead">${esc(group.title || group.text)}</h3>${(Array.isArray(group.description) ? group.description : []).map((x) => `<div class="ps-row"><strong>${esc(x.title)}</strong><span>${esc([x.vendor, x.year].filter(Boolean).join(" · "))}</span></div>`).join("")}`,
      )
      .join("");
    // Company descriptions are HTML; take their plain-text introductory overview rather than reusing website styling.
    const companySummary = (() => {
      if (!companies?.description) return "";

      const container = document.createElement("div");
      container.innerHTML = companies.description;

      const groups = [];
      const headings = container.querySelectorAll("h3");

      headings.forEach((heading) => {
        const title = heading.textContent.trim();
        const grid = heading.nextElementSibling?.matches("div.grid")
          ? heading.nextElementSibling
          : heading.nextElementSibling?.nextElementSibling;

        if (!grid?.classList.contains("grid")) return;

        const names = [...grid.children]
          .map((item) => item.textContent.trim())
          .filter(Boolean);

        if (!names.length) return;

        groups.push(`
      <div class="ps-company-group">
        <h3>${esc(title)}</h3>
        <div class="ps-company-grid">
          ${names
            .map(
              (name) => `
                <div class="ps-company">${esc(name)}</div>
              `,
            )
            .join("")}
        </div>
      </div>
    `);
      });

      return groups.join("");
    })();
    return `
    

<div class="ps-profile-header">

  <!-- Photo + Professional Information -->
  <div class="ps-hero">
    <img src="images/profile.png" alt="Profile photograph">

    <div class="ps-hero-info">
      <div class="ps-kicker">${pt.kicker}</div>

      <h1>Janos Robert Friedrich</h1>
      <h3>${pt.job}</h3>

      <p>${pt.experience}</p>
    </div>
  </div>

  <!-- Full-width Contact Information -->
  <div class="ps-contact">
    <div class="ps-contact-item">
      <span class="ps-contact-label">${pt.location}</span>
      <span>Budaörs, ${pt.country}</span>
    </div>

    <div class="ps-contact-item">
      <span class="ps-contact-label">${pt.email}</span>
      <a href="mailto:janos.friedrich@gmail.com">
        janos.friedrich@gmail.com
      </a>
    </div>

    <div class="ps-contact-item">
      <span class="ps-contact-label">${pt.linkedin}</span>
      <a href="https://www.linkedin.com/in/janos-friedrich-415aa49b"
         target="_blank" rel="noopener noreferrer">
        linkedin.com/in/janos-friedrich-415aa49b
      </a>
    </div>

    <div class="ps-contact-item">
      <span class="ps-contact-label">${pt.website}</span>
      <a href="https://jjim.dev"
         target="_blank" rel="noopener noreferrer">
        jjim.dev
      </a>
    </div>
  </div>

</div>


    <div class="ps-intro">${p.description ? esc(plain(p.description)) : ""}</div>
     ${section(t.languages, languages)}
      ${section(t.career, careerHtml)}
      ${section(t.tools, toolHtml)}
      ${section(t.scripts, scriptHtml)}
      ${section(t.companies, companySummary)}
      ${section(t.certs, certHtml)}
      ${section(t.trainings, trainingHtml)}
      <div class="ps-url">jjim.dev</div>`;
  }
  function init() {
    const languageGroup = document.querySelector(
      '[role="group"][aria-label="Website language"]',
    );
    if (!languageGroup) return;
    const t = labels[lang()];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "portfolio-summary-open";
    btn.className = "ps-trigger";
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6v-7z"/></svg><span>' +
      t.button +
      "</span>";
    languageGroup.parentElement.classList.add("ps-language-row");
    languageGroup.insertAdjacentElement("afterend", btn);
    const modal = document.createElement("div");
    modal.id = "portfolio-summary";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "ps-title");
    modal.innerHTML = `<div class="ps-backdrop" id="ps-backdrop"></div><div class="ps-panel" role="document"><div class="ps-head"><h2 id="ps-title">${t.title}</h2><button id="ps-close-top" type="button" aria-label="${t.close}">×</button></div><div id="ps-content" class="ps-body"></div><div class="ps-footer"><button type="button" id="ps-print">▣ &nbsp;${t.print}</button><button type="button" id="ps-close-bottom">${t.close}</button></div></div>`;
    document.body.appendChild(modal);
    btn.addEventListener("click", openSummary);
    modal
      .querySelector("#ps-close-top")
      .addEventListener("click", closeSummary);
    modal
      .querySelector("#ps-close-bottom")
      .addEventListener("click", closeSummary);
    modal.querySelector("#ps-backdrop").addEventListener("click", closeSummary);
    modal
      .querySelector("#ps-print")
      .addEventListener("click", () => window.print());
    document.addEventListener(
      "keydown",
      (e) => {
        if (modal.getAttribute("aria-hidden") === "true") return;
        if (e.key === "Escape") {
          e.stopImmediatePropagation();
          closeSummary();
        }
        if (e.key === "Tab") {
          const buttons = [...modal.querySelectorAll("button")];
          const first = buttons[0],
            last = buttons[buttons.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      true,
    );
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/**
 * Dynamic UI Renderer
 * Loads website content from data.json.
 *
 * Features:
 * - Dynamic statistics cards
 * - Clickable cards with centered popup windows
 * - Blurred background
 * - JSON-driven popup sections
 * - Sidebar navigation and dropdown menus
 * - Career, training, certification and project rendering
 * - Image lightbox
 * - Escape key and outside-click closing
 */

// ==========================================
// 1. IMAGE LIGHTBOX
// ==========================================

let currentLanguage = localStorage.getItem("siteLanguage") || "en";

function initializeLanguageSwitcher() {
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll(".language-btn").forEach((button) => {
    const language = button.dataset.language;
    const isActive = language === currentLanguage;

    button.classList.toggle("bg-sky-600", isActive);
    button.classList.toggle("text-white", isActive);
    button.classList.toggle("shadow-sm", isActive);

    button.classList.toggle("text-slate-600", !isActive);
    button.classList.toggle("hover:bg-slate-200", !isActive);

    button.setAttribute("aria-pressed", String(isActive));

    button.addEventListener("click", () => {
      if (language === currentLanguage) return;

      localStorage.setItem("siteLanguage", language);
      window.location.reload();
    });
  });
}

function openModal(imageSrc) {
  const modal = document.getElementById("image-modal");
  const image = document.getElementById("modal-img");

  if (!modal || !image) return;

  image.src = imageSrc;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("image-modal");

  if (!modal) return;

  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

// ==========================================
// PROFILE POPUP
// ==========================================

let profileData = null;

function createProfileModal() {
  let modal = document.getElementById("profile-modal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "profile-modal";
  modal.className =
    "fixed inset-0 z-[110] items-center justify-center p-4 sm:p-6";

  modal.style.display = "none";
  modal.style.opacity = "1";

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "profile-modal-title");
  modal.setAttribute("aria-hidden", "true");

  const profile = profileData;
  if (!profile) return null;

  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  modal.innerHTML = `
    <div id="profile-modal-backdrop"
         class="absolute inset-0"></div>

    <div id="profile-modal-panel"
         class="relative z-10 w-full max-w-2xl max-h-[90vh]
                overflow-y-auto bg-white rounded-3xl
                border border-slate-200 shadow-2xl">

      <div class="flex items-center justify-between
                  px-6 py-4 border-b border-slate-200 bg-slate-50">

        <h2 id="profile-modal-title"
            class="text-xl font-extrabold text-slate-900">
          Personal Profile
        </h2>

        <button id="profile-modal-close"
                type="button"
                aria-label="Close profile"
                class="w-10 h-10 rounded-xl bg-white
                       border border-slate-200 text-slate-500
                       hover:text-sky-600 hover:bg-sky-50
                       transition-colors cursor-pointer text-xl">
          &times;
        </button>
      </div>

      <div class="p-6">
        <div class="flex flex-col sm:flex-row items-center
                    sm:items-start gap-6 mb-6">

          <img id="profile-modal-image"
               alt="Profile photograph"
               class="w-36 h-36 object-cover rounded-2xl
                      border border-slate-200 shadow-md shrink-0">

          <div class="text-center sm:text-left">
            <h3 class="text-2xl font-extrabold text-slate-900">
              ${fullName}
            </h3>
            <p class="text-sm text-sky-700 font-semibold mt-2">
              ${profile.job}
            </p>
            <p class="text-sm text-slate-500 mt-2">
              ${profile.experience}
            </p>
          </div>
        </div>

        <div class="border-t border-slate-200 pt-5">
          <h3 class="text-sm font-bold text-slate-800 mb-4">
            Personal Information
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            ${profileField("First name:", profile.firstName)}
            ${profileField("Middle name:", profile.middleName)}
            ${profileField("Last name:", profile.lastName)}
            ${profileField("Nationality:", profile.nationality)}
            ${profileField("Country of residence:", profile.country)}
            ${profileField("Experience:", profile.experience)}

          </div>
        </div>

        <div class="border-t border-slate-200 mt-6 pt-5">
          <h3 class="text-sm font-bold text-slate-800 mb-4">
            Languages
          </h3>

          <div class="flex flex-col gap-3">
            ${(profile.languages || [])
              .map((language) => profileLanguage(language.name, language.level))
              .join("")}
          </div>
        </div>

        <div class="border-t border-slate-200 mt-6 pt-5">
          <h3 class="text-sm font-bold text-slate-800 mb-2">
            Professional Background
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed text-justify ">
            ${profile.description || ""}
          </p>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-slate-200
                  bg-slate-50 flex justify-end">
        <button id="profile-modal-footer-close"
                type="button"
                class="px-5 py-2 rounded-xl bg-sky-600
                       text-white font-semibold text-sm
                       hover:bg-sky-700 transition-colors
                       cursor-pointer">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (
      event.target === modal ||
      event.target.id === "profile-modal-backdrop" ||
      event.target.closest("#profile-modal-close, #profile-modal-footer-close")
    ) {
      closeProfileModal();
    }
  });

  return modal;
}

function profileField(label, value) {
  return `
    <div class="rounded-xl bg-slate-50 border
                border-slate-100 p-3">
      <p class="text-xs text-slate-400 font-bold mb-1">${label}</p>
      <p class="text-sm font-normal text-slate-800">${value}</p>
    </div>
  `;
}

function profileLanguage(language, level) {
  return `
    <div class="flex items-center justify-between gap-3
                rounded-xl bg-slate-50 border border-slate-100
                px-4 py-3">
      <span class="text-sm font-semibold text-slate-800">
        ${language}
      </span>
      <span class="text-xs font-semibold text-sky-700
                   bg-sky-50 border border-sky-200
                   rounded-full px-3 py-1">
        ${level}
      </span>
    </div>
  `;
}

let profilePreviousFocus = null;

function openProfileModal() {
  const modal = createProfileModal();
  if (!modal) return;
  const panel = modal.querySelector("#profile-modal-panel");
  const image = modal.querySelector("#profile-modal-image");

  clearTimeout(modal._closeTimer);

  if (modal._openFrame) cancelAnimationFrame(modal._openFrame);
  if (modal._openFrame2) cancelAnimationFrame(modal._openFrame2);

  profilePreviousFocus = document.activeElement;
  image.src = profileData.image;

  modal.classList.remove("profile-visible");

  panel.style.transition =
    "opacity 350ms ease-in-out, transform 350ms ease-in-out";
  panel.style.opacity = "0";
  panel.style.transform = "scale(0.92) translateY(15px)";

  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "flex";

  document.body.style.overflow = "hidden";

  void modal.offsetHeight;

  modal._openFrame = requestAnimationFrame(() => {
    modal._openFrame2 = requestAnimationFrame(() => {
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("profile-visible");

      panel.style.opacity = "1";
      panel.style.transform = "scale(1) translateY(0)";

      modal.querySelector("#profile-modal-close").focus();

      modal._openFrame = null;
      modal._openFrame2 = null;
    });
  });
}

function closeProfileModal() {
  const modal = document.getElementById("profile-modal");
  if (!modal || modal.style.display === "none") return;

  const panel = modal.querySelector("#profile-modal-panel");

  if (modal._openFrame) cancelAnimationFrame(modal._openFrame);
  if (modal._openFrame2) cancelAnimationFrame(modal._openFrame2);

  modal.classList.remove("profile-visible");

  panel.style.opacity = "0";
  panel.style.transform = "scale(0.92) translateY(15px)";

  modal.setAttribute("aria-hidden", "true");

  clearTimeout(modal._closeTimer);

  modal._closeTimer = setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = "";

    if (profilePreviousFocus?.isConnected) {
      profilePreviousFocus.focus();
    }
  }, 350);
}

// ==========================================
// 2. STATISTICS CARD POPUP
// ==========================================

let activeStatModal = null;
let previousFocus = null;

function createStatModal() {
  let modal = document.getElementById("stat-modal");

  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "stat-modal";

  modal.className =
    "fixed inset-0 z-[100] items-center " + "justify-center p-4 sm:p-6";

  modal.style.setProperty("display", "none", "important");

  // Smooth popup entrance and exit
  modal.style.opacity = "0";
  modal.style.transition = "opacity 300ms ease-in-out";

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "stat-modal-title");
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div
      id="stat-modal-backdrop"
      class="absolute inset-0"
    ></div>

    <div
      id="stat-modal-panel"
      class="relative z-10 w-full max-w-3xl
             max-h-[90vh] overflow-hidden
             bg-white rounded-3xl
             border border-slate-200
             shadow-2xl flex flex-col"
      tabindex="-1"
    >

      <!-- Modal Header -->
      <div
        class="flex items-start justify-between gap-4
               px-6 py-5 border-b border-slate-200
               bg-slate-50"
      >
        <div class="flex items-center gap-4 min-w-0">

          <div
            id="stat-modal-icon"
            class="w-12 h-12 rounded-xl bg-sky-100
                   text-sky-600 flex items-center
                   justify-center shrink-0"
          ></div>

          <div class="min-w-0">
            <p
              id="stat-modal-category"
              class="text-xs uppercase font-bold
                     tracking-wider text-sky-600"
            ></p>

            <h2
              id="stat-modal-title"
              class="text-xl sm:text-2xl font-extrabold
                     text-slate-900 mt-1"
            ></h2>

            <p
              id="stat-modal-summary"
              class="text-sm text-slate-500 mt-1"
            ></p>
          </div>
        </div>

        <button
          id="stat-modal-close"
          type="button"
          aria-label="Close details"
          class="w-10 h-10 rounded-xl
                 bg-white border border-slate-200
                 text-slate-500 hover:text-sky-600
                 hover:bg-sky-50 transition-colors
                 flex items-center justify-center
                 shrink-0 text-xl"
        >
          &times;
        </button>
      </div>

      <!-- Dynamic JSON Content -->
      <div
        id="stat-modal-sections"
        class="overflow-y-auto p-6
               flex flex-col gap-4"
      ></div>

      <!-- Modal Footer -->
      <div
        class="px-6 py-4 border-t border-slate-200
               bg-slate-50 flex justify-end"
      >
        <button
          id="stat-modal-footer-close"
          type="button"
          class="px-5 py-2 rounded-xl
                 bg-sky-600 text-white
                 font-semibold text-sm
                 hover:bg-sky-700 transition-colors"
        >
          Close
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  const panel = modal.querySelector("#stat-modal-panel");

  panel.style.opacity = "0";
  panel.style.transform = "scale(0.95) translateY(12px)";
  panel.style.transition =
    "opacity 300ms ease-in-out, " +
    "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)";

  // Handle clicks at the document level during capture.
  // This also works if another element intercepts bubbling.

  document.addEventListener(
    "click",
    function (event) {
      const modal = document.getElementById("stat-modal");

      if (!modal || modal.getAttribute("aria-hidden") === "true") {
        return;
      }

      const closeButton = event.target.closest(
        "#stat-modal-close, #stat-modal-footer-close",
      );

      const backdrop = event.target.closest("#stat-modal-backdrop");

      // Also close if the click lands directly on the
      // modal container, outside the white popup panel.
      const outsidePanel =
        modal.contains(event.target) &&
        !event.target.closest("#stat-modal-panel");

      if (closeButton || backdrop || outsidePanel) {
        event.preventDefault();
        event.stopPropagation();
        closeStatModal();
      }
    },
    true,
  );

  return modal;
}

function openStatModal(stat) {
  const modal = createStatModal();

  previousFocus = document.activeElement;

  document.getElementById("stat-modal-category").textContent =
    stat.category || "";

  document.getElementById("stat-modal-title").textContent =
    stat.value || "Details";

  document.getElementById("stat-modal-summary").textContent = stat.label || "";

  document.getElementById("stat-modal-icon").innerHTML = stat.icon || "";

  const container = document.getElementById("stat-modal-sections");
  container.replaceChildren();

  const sections = Array.isArray(stat.sections) ? stat.sections : [];

  if (sections.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "text-sm text-slate-500 text-center py-8";

    emptyMessage.textContent = "More information will be available soon.";

    container.appendChild(emptyMessage);
  }

  sections.forEach((section) => {
    const article = document.createElement("article");

    article.className =
      "rounded-2xl border border-slate-200 " + "bg-slate-50 p-5 shadow-sm";

    const heading = document.createElement("h3");
    heading.className = "text-base font-bold text-slate-900 mb-3";
    heading.textContent = section.title || "";

    const content = document.createElement("div");
    content.className =
      "text-sm text-slate-600 leading-relaxed whitespace-pre-line";
    content.textContent = section.content || "";

    article.appendChild(heading);
    article.appendChild(content);
    container.appendChild(article);
  });

  // ------------------------------------------
  // Opening animation
  // ------------------------------------------

  const panel = modal.querySelector("#stat-modal-panel");

  // Cancel any pending closing animation.
  clearTimeout(modal._closeTimer);

  // Cancel any pending opening frames.
  if (modal._openFrame) {
    cancelAnimationFrame(modal._openFrame);
  }

  if (modal._openFrame2) {
    cancelAnimationFrame(modal._openFrame2);
  }

  // Reset to the initial animation state.
  modal.classList.remove("backdrop-visible");

  // Keep the parent fully visible.
  // The backdrop and popup animate independently.
  modal.style.transition = "none";
  modal.style.opacity = "1";

  panel.style.transition =
    "opacity 350ms ease-in-out, " + "transform 350ms ease-in-out";

  panel.style.opacity = "0";
  panel.style.transform = "scale(0.92) translateY(15px)";

  // Display the modal in its unblurred state.
  modal.setAttribute("aria-hidden", "true");
  modal.style.setProperty("display", "flex", "important");

  // Ensure initial CSS styles are calculated.
  void modal.offsetHeight;

  activeStatModal = modal;
  document.body.style.overflow = "hidden";

  // Allow the initial state to render before animating.
  modal._openFrame = requestAnimationFrame(() => {
    modal._openFrame2 = requestAnimationFrame(() => {
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("backdrop-visible");

      panel.style.opacity = "1";
      panel.style.transform = "scale(1) translateY(0)";

      modal._openFrame = null;
      modal._openFrame2 = null;

      document.getElementById("stat-modal-close").focus();
    });
  });
}

function closeStatModal() {
  const modal = document.getElementById("stat-modal");

  if (!modal) return;

  const panel = modal.querySelector("#stat-modal-panel");

  // Cancel pending opening animations.
  if (modal._openFrame) {
    cancelAnimationFrame(modal._openFrame);
    modal._openFrame = null;
  }

  if (modal._openFrame2) {
    cancelAnimationFrame(modal._openFrame2);
    modal._openFrame2 = null;
  }

  clearTimeout(modal._closeTimer);

  // Start the exit animation.
  modal.classList.remove("backdrop-visible");

  // Fade out the popup, not the entire modal.
  panel.style.opacity = "0";
  panel.style.transform = "scale(0.92) translateY(15px)";

  modal.setAttribute("aria-hidden", "true");
  activeStatModal = null;

  // Hide only after the animation finishes.
  modal._closeTimer = setTimeout(() => {
    modal.style.setProperty("display", "none", "important");
    document.body.style.overflow = "";

    if (previousFocus && previousFocus.isConnected) {
      previousFocus.focus();
    }

    modal._closeTimer = null;
  }, 350);
}

// ==========================================
// 3. KEYBOARD HANDLING
// ==========================================

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const profileModal = document.getElementById("profile-modal");

    if (profileModal?.getAttribute("aria-hidden") === "false") {
      closeProfileModal();
      return;
    }

    if (activeStatModal) {
      closeStatModal();
    } else {
      closeModal();
    }
  }

  // Keep keyboard focus inside the statistics modal.
  if (event.key === "Tab" && activeStatModal) {
    const focusable = Array.from(
      activeStatModal.querySelectorAll(
        "button:not([disabled]), a[href], " +
          "input:not([disabled]), " +
          '[tabindex]:not([tabindex="-1"])',
      ),
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// ==========================================
// 4. HELPER FUNCTIONS
// ==========================================

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function formatTextWithLinks(text) {
  if (!text) return "";

  // Existing descriptions contain trusted HTML markup.
  // Convert plain URLs into clickable links.
  return String(text).replace(/https?:\/\/[^\s<>"']+/g, (match) => {
    const url = match.replace(/[.,;!?]+$/, "");
    const trailing = match.slice(url.length);

    return (
      `<a href="${escapeHtml(url)}" ` +
      `target="_blank" rel="noopener noreferrer" ` +
      `class="text-sky-600 hover:underline ` +
      `font-semibold break-all">` +
      `${escapeHtml(url)}</a>${trailing}`
    );
  });
}

// ==========================================
// 5. RENDER STATISTICS GRID
// ==========================================

function renderStatsGrid(stats) {
  const container = document.getElementById("stats-grid-container");

  if (!container || !Array.isArray(stats)) return;

  container.innerHTML = "";

  const grid = document.createElement("div");

  grid.className =
    "grid grid-cols-1 sm:grid-cols-2 " + "lg:grid-cols-4 gap-3.5";

  stats.forEach((stat) => {
    const card = document.createElement("button");

    card.type = "button";

    card.className =
      "text-left w-full bg-white/90 backdrop-blur-md " +
      "border border-slate-200/90 rounded-2xl p-4 " +
      "shadow-sm transition-all duration-200 " +
      "cursor-pointer hover:bg-[#ebf5ff] " +
      "hover:border-[#b3d7f5] hover:-translate-y-0.5 " +
      "hover:shadow-[0_6px_20px_rgba(59,130,246,0.20)] " +
      "focus:outline-none " +
      "focus:ring-2 focus:ring-sky-500 " +
      "flex flex-col justify-between";

    card.setAttribute(
      "aria-label",
      `View details for ${stat.category || stat.value}`,
    );

    card.innerHTML = `
      <div
        class="flex items-center justify-between
               gap-2 mb-2"
      >
        <span
          class="text-[11px] font-mono font-bold
                 tracking-wider text-slate-400 uppercase"
        >
          ${escapeHtml(stat.category)}
        </span>

        <div
          class="p-1.5 rounded-lg bg-sky-50
                 border border-sky-100/80 shrink-0"
        >
          ${stat.icon || ""}
        </div>
      </div>

      <div>
        <div
          class="text-lg font-extrabold text-slate-900
                 tracking-tight leading-snug"
        >
          ${escapeHtml(stat.value)}
        </div>

        <div
          class="text-xs font-medium text-slate-500 mt-0.5"
        >
          ${escapeHtml(stat.label)}
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      openStatModal(stat);
    });

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// ==========================================
// 6. MAIN CONTENT RENDERER
// ==========================================

function renderContentToDisplay(
  titleText,
  descriptionData,
  imagePath = null,
  iconSvg = null,
) {
  const subtitle = document.getElementById("site-subtitle");

  const subdescription = document.getElementById("site-subdescription");

  if (!subtitle || !subdescription) return;

  const defaultIcon = `
    <svg
      class="w-6 h-6 text-sky-600 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0z
           M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  `;

  subtitle.innerHTML = `
    <div
      class="flex items-center gap-2.5
             text-slate-900 font-extrabold
             text-2xl tracking-tight"
    >
      <span class="text-sky-600 shrink-0 flex items-center">
        ${iconSvg || defaultIcon}
      </span>

      <span>${escapeHtml(titleText)}</span>
    </div>
  `;

  subdescription.replaceChildren();

  // ------------------------------------------
  // Optional project image
  // ------------------------------------------

  if (imagePath) {
    const image = document.createElement("img");

    image.src = imagePath;
    image.alt = titleText || "Project Screenshot";

    image.className =
      "w-full max-h-96 object-contain rounded-xl " +
      "border border-slate-200 shadow-sm mb-4 mt-2 " +
      "bg-white p-2 cursor-zoom-in " +
      "hover:opacity-95 transition-all duration-200";

    image.addEventListener("click", () => {
      openModal(imagePath);
    });

    subdescription.appendChild(image);
  }

  // ------------------------------------------
  // Array-based content
  // ------------------------------------------

  if (Array.isArray(descriptionData)) {
    const list = document.createElement("div");

    list.className = "flex flex-col gap-1 mt-4";

    descriptionData.forEach((item) => {
      if (item && typeof item === "object" && item.role) {
        list.appendChild(renderCareerCard(item));
      } else if (item && typeof item === "object" && item.title) {
        list.appendChild(renderTrainingCard(item));
      } else {
        const paragraph = document.createElement("div");

        paragraph.className = "mb-3 text-left text-slate-700";

        paragraph.innerHTML = formatTextWithLinks(
          typeof item === "string" ? item : JSON.stringify(item),
        );

        list.appendChild(paragraph);
      }
    });

    subdescription.appendChild(list);
  }

  // ------------------------------------------
  // HTML or text content
  // ------------------------------------------
  else if (typeof descriptionData === "string") {
    const content = document.createElement("div");

    content.className =
      "text-left text-slate-700 whitespace-pre-line " + "leading-relaxed mt-4";

    content.innerHTML = formatTextWithLinks(descriptionData);

    subdescription.appendChild(content);
  }
}

// ==========================================
// 7. CAREER EXPERIENCE CARDS
// ==========================================

function renderCareerCard(item) {
  const card = document.createElement("div");

  card.className =
    "bg-white/90 backdrop-blur-md " +
    "border border-slate-200/90 rounded-2xl " +
    "p-6 shadow-sm hover:shadow-md " +
    "transition-all duration-200 text-left mb-5";

  const tags = Array.isArray(item.techStack)
    ? item.techStack
        .map(
          (tech) => `
        <span
          class="px-2.5 py-1 text-xs font-mono
                 font-medium rounded-md bg-sky-50/80
                 text-sky-700 border border-sky-200/80"
        >
          ${escapeHtml(tech)}
        </span>
      `,
        )
        .join("")
    : "";

  const logo = item.imageUrl
    ? `
      <div
        class="w-14 h-12 rounded-xl bg-white
               border border-slate-200 p-1.5
               flex items-center justify-center shrink-0"
      >
        <img
          src="${escapeHtml(item.imageUrl)}"
          alt="${escapeHtml(item.company)}"
          class="block w-full h-auto object-contain"
        />
      </div>
    `
    : `
      <div
        class="w-14 h-12 rounded-xl bg-sky-50
               border border-sky-200 flex items-center
               justify-center font-bold text-sky-700
               text-sm shrink-0"
      >
        ${escapeHtml(item.logoText || "IT")}
      </div>
    `;

  card.innerHTML = `
    <div
      class="flex flex-wrap items-start
             justify-between gap-4 mb-3"
    >
      <div class="flex items-center gap-3.5">
        ${logo}

        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3
              class="text-xl font-bold text-slate-900
                     tracking-tight"
            >
              ${escapeHtml(item.role)}
            </h3>

            ${
              item.statusBadge
                ? `
                  <span
                    class="px-2.5 py-0.5 text-xs
                           font-mono font-medium
                           rounded-full bg-sky-50
                           text-sky-600 border border-sky-200"
                  >
                    ${escapeHtml(item.statusBadge)}
                  </span>
                `
                : ""
            }
          </div>

          <p
            class="text-sm font-medium
                   text-slate-500 mt-0.5"
          >
            ${escapeHtml(item.company)}
          </p>
        </div>
      </div>

      ${
        item.date
          ? `
            <div
              class="px-3 py-1 rounded-lg bg-slate-50
                     border border-slate-200 text-xs
                     font-mono text-slate-600 shrink-0"
            >
              ${escapeHtml(item.date)}
            </div>
          `
          : ""
      }
    </div>

    <div
      class="text-slate-600 text-sm
             leading-relaxed mb-4"
    >
      ${formatTextWithLinks(item.desc)}
    </div>

    ${
      tags
        ? `<div class="flex flex-wrap gap-2 pt-1">
             ${tags}
           </div>`
        : ""
    }
  `;

  return card;
}

// ==========================================
// 8. TRAINING & CERTIFICATION CARDS
// ==========================================

function renderTrainingCard(item) {
  const card = document.createElement("article");

  card.className =
    "bg-white/90 backdrop-blur-md " +
    "border border-slate-200/90 rounded-2xl " +
    "p-5 sm:p-6 shadow-sm hover:shadow-md " +
    "transition-all duration-200 text-left mb-4";

  // -----------------------------------------
  // Header: Logo, title, issuer, year
  // -----------------------------------------

  const header = document.createElement("div");
  header.className = "flex flex-wrap items-start justify-between gap-4";

  const identity = document.createElement("div");
  identity.className = "flex items-start gap-3.5 flex-1 min-w-0";

  if (item.logo) {
    const logoBox = document.createElement("div");

    logoBox.className =
      "w-12 h-12 rounded-xl bg-white " +
      "border border-slate-200 p-1.5 " +
      "flex items-center justify-center shrink-0";

    const logo = document.createElement("img");
    logo.src = item.logo;
    logo.alt = item.issuer || item.vendor || "Certification issuer";
    logo.className = "w-full h-full object-contain";

    logoBox.appendChild(logo);
    identity.appendChild(logoBox);
  }

  const heading = document.createElement("div");
  heading.className = "min-w-0";

  const title = document.createElement("h3");
  title.className =
    "text-lg sm:text-xl font-bold " + "text-slate-800 leading-snug";

  title.textContent = item.title || "Certification";

  const issuer = document.createElement("p");
  issuer.className = "text-sm font-medium text-slate-500 mt-1";

  issuer.textContent = item.issuer || item.vendor || "";

  heading.appendChild(title);
  heading.appendChild(issuer);
  identity.appendChild(heading);
  header.appendChild(identity);

  if (item.year) {
    const year = document.createElement("span");

    year.className =
      "px-3 py-1 rounded-lg bg-sky-50 " +
      "border border-sky-200 text-xs " +
      "font-mono font-semibold text-sky-700 shrink-0";

    year.textContent = item.year;

    header.appendChild(year);
  }

  card.appendChild(header);

  // -----------------------------------------
  // Credential details
  // -----------------------------------------

  if (item.exam || item.status || item.score) {
    const metadata = document.createElement("div");

    metadata.className = "flex flex-wrap items-center gap-2 mt-4";

    if (item.exam) {
      const exam = document.createElement("span");

      exam.className =
        "px-2.5 py-1 text-xs font-semibold " +
        "rounded-lg bg-slate-100 text-slate-600 " +
        "border border-slate-200";

      exam.textContent = `Exam ${item.exam}`;
      metadata.appendChild(exam);
    }

    if (item.status) {
      const status = document.createElement("span");

      status.className =
        "px-2.5 py-1 text-xs font-semibold " +
        "rounded-lg bg-sky-50 text-sky-700 " +
        "border border-sky-200";

      status.textContent = item.status;
      metadata.appendChild(status);
    }

    if (item.score) {
      const score = document.createElement("span");

      score.className =
        "px-2.5 py-1 text-xs font-semibold " +
        "rounded-lg bg-slate-100 text-slate-600 " +
        "border border-slate-200";

      score.textContent = `Score: ${item.score}`;
      metadata.appendChild(score);
    }

    card.appendChild(metadata);
  }

  // -----------------------------------------
  // Description
  // -----------------------------------------

  if (item.desc || item.description) {
    const description = document.createElement("div");

    description.className =
      "text-sm text-slate-600 leading-relaxed " +
      "mt-4 pt-4 border-t border-slate-100";

    description.innerHTML = formatTextWithLinks(item.desc || item.description);

    card.appendChild(description);
  }

  if (item.certificate) {
    const certificateButton = document.createElement("button");

    certificateButton.type = "button";
    certificateButton.className =
      "inline-flex items-center gap-2 mt-4 px-4 py-2 " +
      "rounded-lg bg-sky-50 border border-sky-200 " +
      "text-sky-700 text-sm font-semibold " +
      "hover:bg-sky-100 transition-colors cursor-pointer";

    certificateButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round"
         stroke-linejoin="round">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>
    </svg>
    View Certificate
  `;

    certificateButton.addEventListener("click", () => {
      openModal(item.certificate);
    });

    card.appendChild(certificateButton);
  }

  // -----------------------------------------
  // Optional certificate preview
  // -----------------------------------------

  if (item.certificateImage) {
    const footer = document.createElement("div");

    footer.className =
      "flex items-center justify-between flex-wrap " +
      "gap-3 mt-5 pt-4 border-t border-slate-100";

    const evidence = document.createElement("span");

    evidence.className = "text-xs text-slate-500 font-medium";

    evidence.textContent = "Certificate available for viewing";

    const button = document.createElement("button");
    button.type = "button";

    button.className =
      "inline-flex items-center gap-2 " +
      "px-4 py-2 rounded-lg " +
      "bg-sky-50 border border-sky-200 " +
      "text-sky-700 text-sm font-semibold " +
      "hover:bg-sky-100 transition-colors " +
      "focus:outline-none focus:ring-2 focus:ring-sky-500";

    button.textContent = "View Certificate ↗";

    button.addEventListener("click", () => {
      openModal(item.certificateImage);
    });

    footer.appendChild(evidence);
    footer.appendChild(button);
    card.appendChild(footer);
  }

  return card;
}

// ==========================================
// 9. SIDEBAR ACTIVE BUTTON
// ==========================================

function setActiveButton(targetAnchor) {
  document.querySelectorAll("#button-container a").forEach((anchor) => {
    if (anchor.classList.contains("btn-jim")) {
      anchor.classList.remove("btn-jim-active");
      anchor.classList.add("btn-jim-slate");
    }
  });

  if (targetAnchor) {
    targetAnchor.classList.remove("btn-jim-slate");
    targetAnchor.classList.add("btn-jim-active");
  }
}

// ==========================================
// 10. DYNAMIC SIDEBAR NAVIGATION
// ==========================================

function renderProjectOverview(items, sectionTitle, introText, iconSvg = null) {
  renderContentToDisplay(sectionTitle, "", null, iconSvg);

  const container = document.getElementById("site-subdescription");
  if (!container) return;

  const intro = document.createElement("p");
  intro.className = "text-sm text-slate-600 leading-relaxed mb-5";
  intro.textContent = introText;
  container.appendChild(intro);

  const projectList = document.createElement("div");
  projectList.className = "flex flex-col gap-4";
  container.appendChild(projectList);

  let activeCard = null;

  if (!Array.isArray(items)) return;

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className =
      "bg-white/90 border border-slate-200 " +
      "rounded-2xl shadow-sm overflow-hidden " +
      "transition-all duration-200 hover:border-sky-200";

    const header = document.createElement("button");
    header.type = "button";
    header.className =
      "w-full flex items-center justify-between gap-4 " +
      "p-5 text-left cursor-pointer hover:bg-sky-50/70 " +
      "transition-colors focus:outline-none " +
      "focus:ring-2 focus:ring-inset focus:ring-sky-500";

    header.setAttribute("aria-expanded", "false");

    const headerText = document.createElement("div");
    headerText.className = "flex-1 min-w-0";

    const title = document.createElement("h3");
    title.className = "text-lg font-bold text-slate-800 leading-snug";
    title.textContent = item.title || item.text || "Untitled Project";

    const subtitle = document.createElement("p");
    subtitle.className = "text-xs text-slate-500 mt-1";
    subtitle.textContent = "Click to view project details";

    headerText.appendChild(title);
    headerText.appendChild(subtitle);

    const arrow = document.createElement("span");
    arrow.className = "text-sky-600 text-xl font-bold shrink-0";
    arrow.textContent = "+";
    arrow.setAttribute("aria-hidden", "true");

    header.appendChild(headerText);
    header.appendChild(arrow);

    const details = document.createElement("div");
    details.id = `project-details-${index}`;
    details.className = "border-t border-slate-200 px-5 pb-6 pt-5";

    // Smooth accordion animation
    details.style.overflow = "hidden";
    details.style.maxHeight = "0px";
    details.style.opacity = "0";
    details.style.paddingTop = "0px";
    details.style.paddingBottom = "0px";
    details.style.borderTopWidth = "0px";

    details.style.transition =
      "max-height 450ms ease-in-out, " +
      "opacity 350ms ease-in-out, " +
      "padding 450ms ease-in-out, " +
      "border-width 450ms ease-in-out";

    header.setAttribute("aria-controls", details.id);

    // Optional project screenshot
    if (item.image) {
      const imageWrapper = document.createElement("div");
      imageWrapper.className =
        "rounded-xl border border-slate-200 bg-white " +
        "p-3 mb-5 text-center shadow-sm";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.title || item.text || "Project screenshot";
      image.loading = "lazy";
      image.className =
        "max-w-full max-h-96 mx-auto object-contain " +
        "rounded-lg cursor-zoom-in hover:opacity-90";

      image.addEventListener("click", () => {
        openModal(item.image);
      });

      imageWrapper.appendChild(image);
      details.appendChild(imageWrapper);
    }

    // Existing JSON description
    const description = document.createElement("div");
    description.className =
      "text-sm text-slate-600 leading-relaxed break-words";

    description.innerHTML = formatTextWithLinks(
      item.description || item.desc || "",
    );

    details.appendChild(description);

    // Optional external project link
    if (item.url && /^https?:\/\//i.test(item.url)) {
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className =
        "inline-block mt-4 px-4 py-2 rounded-lg " +
        "bg-sky-50 border border-sky-200 " +
        "text-sky-700 text-sm font-semibold hover:bg-sky-100";
      link.textContent = "View Project ↗";
      details.appendChild(link);
    }

    function collapseCard() {
      details.style.maxHeight = "0px";
      details.style.opacity = "0";
      details.style.paddingTop = "0px";
      details.style.paddingBottom = "0px";
      details.style.borderTopWidth = "0px";

      header.setAttribute("aria-expanded", "false");
      arrow.textContent = "+";
      subtitle.textContent = "Click to view project details";
      card.classList.remove("border-sky-300");
    }

    function expandCard() {
      details.style.paddingTop = "20px";
      details.style.paddingBottom = "24px";
      details.style.borderTopWidth = "1px";
      details.style.opacity = "1";

      // Animate to the content's actual height.
      details.style.maxHeight = details.scrollHeight + 100 + "px";

      header.setAttribute("aria-expanded", "true");
      arrow.textContent = "−";
      subtitle.textContent = "Click to collapse";
      card.classList.add("border-sky-300");
    }

    header.addEventListener("click", () => {
      const isExpanded = header.getAttribute("aria-expanded") === "true";

      if (activeCard && activeCard !== card) {
        activeCard.collapse();
      }

      if (isExpanded) {
        collapseCard();
        activeCard = null;
      } else {
        expandCard();
        activeCard = card;
      }
    });

    card.collapse = collapseCard;

    card.appendChild(header);
    card.appendChild(details);
    projectList.appendChild(card);
  });
}

function renderSidebarButtons(buttons) {
  const container = document.getElementById("button-container");

  if (!container || !Array.isArray(buttons)) return;

  container.replaceChildren();

  let firstButton = null;

  buttons.forEach((btn) => {
    // Skip the old landing-page Enter button.
    if (btn.url === "site.html" || (btn.text || "").toLowerCase() === "enter") {
      return;
    }

    const wrapper = document.createElement("div");

    wrapper.className = "relative w-full text-center";

    const anchor = document.createElement("a");

    anchor.className = btn.styleClass || "btn-jim btn-jim-slate";

    anchor.innerHTML = `
      ${
        btn.icon
          ? `
            <span class="shrink-0 flex items-center">
              ${btn.icon}
            </span>
          `
          : ""
      }

      <span class="truncate">
        ${escapeHtml(btn.text)}
      </span>
    `;

    if (!firstButton) {
      firstButton = anchor;
    }

    const isTools = btn.text === "My Tools";
    const isScripts = btn.text === "My Scripts";
    const isProjectSection = isTools || isScripts;

    const hasDropdown =
      !isProjectSection &&
      Array.isArray(btn.dropdownItems) &&
      btn.dropdownItems.length > 0;

    anchor.href = hasDropdown ? "#" : btn.url || "#";

    wrapper.appendChild(anchor);

    // ----------------------------------------
    // Buttons with dropdown items
    // ----------------------------------------

    if (hasDropdown) {
      const dropdown = document.createElement("div");

      dropdown.className =
        "hidden absolute left-0 z-50 mt-2 w-full " +
        "rounded-xl border border-slate-300/80 " +
        "bg-slate-200/95 backdrop-blur-md p-1.5 " +
        "shadow-xl shadow-slate-400/20 " +
        "flex flex-col gap-1";

      btn.dropdownItems.forEach((item) => {
        const menuLink = document.createElement("a");

        menuLink.href = "#";

        menuLink.textContent = item.text || "";

        menuLink.className =
          "block w-full rounded-lg px-3 py-2 " +
          "text-sm font-semibold text-slate-700 " +
          "hover:bg-sky-500 hover:text-white " +
          "transition-all duration-150 " +
          "text-center cursor-pointer";

        menuLink.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          setActiveButton(anchor);

          renderContentToDisplay(
            item.title,
            item.description,
            item.image,
            btn.icon,
          );

          dropdown.classList.add("hidden");
        });

        dropdown.appendChild(menuLink);
      });

      wrapper.appendChild(dropdown);

      anchor.addEventListener("click", (event) => {
        event.preventDefault();

        document
          .querySelectorAll("#button-container .relative > div")
          .forEach((menu) => {
            if (menu !== dropdown) {
              menu.classList.add("hidden");
            }
          });

        dropdown.classList.toggle("hidden");
      });

      document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
          dropdown.classList.add("hidden");
        }
      });
    }

    // ----------------------------------------
    // Buttons with direct content
    // ----------------------------------------
    else {
      anchor.addEventListener("click", (event) => {
        if (isProjectSection) {
          event.preventDefault();

          setActiveButton(anchor);

          const sectionTitle = isTools
            ? "My Tools & Applications"
            : "My Scripts & Automation";

          const introText = isTools
            ? "A collection of custom-developed tools and applications designed to simplify enterprise administration, diagnostics, and automation. Select a project to explore its functionality."
            : "A collection of scripts and automation solutions developed through hands-on enterprise infrastructure engineering. Select a script to explore its purpose and implementation.";

          renderProjectOverview(
            btn.dropdownItems,
            sectionTitle,
            introText,
            btn.icon,
          );

          return;
        }

        if (btn.url && btn.url !== "#" && !btn.url.startsWith("#")) {
          return;
        }

        if (btn.title || btn.description) {
          event.preventDefault();

          setActiveButton(anchor);

          renderContentToDisplay(
            btn.title,
            btn.description,
            btn.image,
            btn.icon,
          );
        }
      });
    }

    container.appendChild(wrapper);
  });

  if (firstButton) {
    setActiveButton(firstButton);
  }
}

/**
 * FIX: Statistics modal closing
 * Uses event delegation so it also works with
 * dynamically created modal elements.
 */

document.addEventListener(
  "click",
  function (event) {
    const modal = document.getElementById("stat-modal");

    if (!modal) return;

    const closeButton = event.target.closest(
      "#stat-modal-close, #stat-modal-footer-close",
    );

    const clickedOutside =
      event.target === modal || event.target.id === "stat-modal-backdrop";

    if (closeButton || clickedOutside) {
      event.preventDefault();
      event.stopPropagation();

      // Use animated closing instead of instantly hiding
      closeStatModal();
    }
  },
  true,
);

// ==========================================
// 11. INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  initializeLanguageSwitcher();

  try {
    const jsonFile = currentLanguage === "de" ? "data.de.json" : "data.json";

    const response = await fetch(jsonFile);

    if (!response.ok) {
      throw new Error(`Unable to load data.json: ${response.status}`);
    }

    const data = await response.json();

    profileData = data.profile || null;

    // ----------------------------------------
    // Website metadata
    // ----------------------------------------

    const siteHeading = document.getElementById("site-heading");

    if (siteHeading && data.siteheading) {
      siteHeading.textContent = data.siteheading;
    }

    const mainSubheading = document.getElementById("main-subheading");

    if (mainSubheading && data.mainsubheading) {
      mainSubheading.textContent = data.mainsubheading;
    }

    const subHeading = document.getElementById("sub-heading");

    if (subHeading && data.mainsubheading) {
      subHeading.textContent = data.mainsubheading;
    }

    const siteDescription = document.getElementById("site-description");

    if (siteDescription && data.sitedescription) {
      siteDescription.textContent = data.sitedescription;
    }

    // ----------------------------------------
    // Four interactive statistics cards
    // ----------------------------------------

    renderStatsGrid(data.statsGrid);

    // ----------------------------------------
    // Sidebar buttons and dropdown menus
    // ----------------------------------------

    renderSidebarButtons(data.buttons);

    // ----------------------------------------
    // Initial content on page load
    // ----------------------------------------

    if (Array.isArray(data.buttons)) {
      const defaultButton = data.buttons.find(
        (btn) => btn.url !== "site.html" && (btn.title || btn.description),
      );

      if (defaultButton) {
        renderContentToDisplay(
          defaultButton.title,
          defaultButton.description,
          defaultButton.image,
          defaultButton.icon,
        );
      }
    }
  } catch (error) {
    console.error("Critical failure during website initialization:", error);

    const description = document.getElementById("site-description");

    if (description) {
      description.textContent =
        "Unable to load website content. " +
        "Please check data.json and your web server.";
    }
  }
});

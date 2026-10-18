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

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "stat-modal-title");
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div
      id="stat-modal-backdrop"
      class="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
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

  // SVG icons come from the website's own JSON.
  document.getElementById("stat-modal-icon").innerHTML = stat.icon || "";

  const container = document.getElementById("stat-modal-sections");

  container.replaceChildren();

  // Generate content sections from data.json.
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
      "text-sm text-slate-600 leading-relaxed " + "whitespace-pre-line";

    content.textContent = section.content || "";

    article.appendChild(heading);
    article.appendChild(content);

    container.appendChild(article);
  });

  // Show the popup using one visibility mechanism
  modal.style.setProperty("display", "flex", "important");
  modal.setAttribute("aria-hidden", "false");

  activeStatModal = modal;
  document.body.style.overflow = "hidden";

  document.getElementById("stat-modal-close").focus();
}

function closeStatModal() {
  const modal = document.getElementById("stat-modal");

  if (!modal) return;

  // Hide popup regardless of Tailwind classes
  modal.style.setProperty("display", "none", "important");
  modal.setAttribute("aria-hidden", "true");

  activeStatModal = null;
  document.body.style.overflow = "";

  if (previousFocus && previousFocus.isConnected) {
    previousFocus.focus();
  }
}

// ==========================================
// 3. KEYBOARD HANDLING
// ==========================================

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
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
      "hover:shadow-md focus:outline-none " +
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
          class="w-full h-full object-contain"
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
  const card = document.createElement("div");

  card.className =
    "bg-white/90 backdrop-blur-md " +
    "border border-slate-200/90 rounded-2xl " +
    "p-5 shadow-sm hover:shadow-md " +
    "transition-all duration-200 text-left mb-4";

  const logo = item.logo
    ? `
      <div
        class="w-12 h-10 rounded-xl bg-white
               border border-slate-200 p-1
               flex items-center justify-center shrink-0"
      >
        <img
          src="${escapeHtml(item.logo)}"
          alt="${escapeHtml(item.vendor || "Vendor")}"
          class="w-full h-full object-contain"
        />
      </div>
    `
    : "";

  const year = item.year
    ? `
      <div
        class="px-3 py-1 rounded-lg bg-sky-50
               border border-sky-200 text-xs
               font-mono text-sky-700 shrink-0"
      >
        ${escapeHtml(item.year)}
      </div>
    `
    : "";

  card.innerHTML = `
    <div
      class="flex flex-wrap items-start
             justify-between gap-4"
    >
      <div class="flex items-center gap-3.5">
        ${logo}

        <div>
          <h3
            class="text-base font-bold text-slate-900
                   tracking-tight leading-snug"
          >
            ${escapeHtml(item.title)}
          </h3>

          ${
            item.vendor
              ? `
                <p
                  class="text-xs font-semibold
                         text-slate-400 mt-0.5"
                >
                  ${escapeHtml(item.vendor)}
                </p>
              `
              : ""
          }
        </div>
      </div>

      ${year}
    </div>

    ${
      item.desc
        ? `
          <div
            class="text-slate-600 text-sm leading-relaxed
                   mt-3 pt-3 border-t border-slate-100"
          >
            ${formatTextWithLinks(item.desc)}
          </div>
        `
        : ""
    }
  `;

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

    const hasDropdown =
      Array.isArray(btn.dropdownItems) && btn.dropdownItems.length > 0;

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

      // Close the popup directly
      modal.style.setProperty("display", "none", "important");
      modal.setAttribute("aria-hidden", "true");

      activeStatModal = null;
      document.body.style.overflow = "";

      if (previousFocus && previousFocus.isConnected) {
        previousFocus.focus();
      }
    }
  },
  true,
);

// ==========================================
// 11. INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`Unable to load data.json: ${response.status}`);
    }

    const data = await response.json();

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

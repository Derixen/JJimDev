/**
 * Dynamic UI Renderer (Tailwind v4 Setup)
 * Fetches profile data and links from a local JSON file and dynamically
 * generates components for index.html.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Fetch data collection from JSON configuration file
  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // 2. Inject Page Metadata
      const subHeading = document.getElementById("sub-heading");
      if (subHeading && data.mainsubheading) {
        subHeading.textContent = data.mainsubheading;
      }

      const siteHeading = document.getElementById("site-heading");
      if (siteHeading && data.siteheading) {
        siteHeading.textContent = data.siteheading;
      }

      const mainSubHeading = document.getElementById("main-subheading");
      if (mainSubHeading && data.mainsubheading) {
        mainSubHeading.textContent = data.mainsubheading;
      }

      const siteDescription = document.getElementById("site-description");
      if (siteDescription && data.sitedescription) {
        siteDescription.textContent = data.sitedescription;
      }

      // Inject Stats Grid under Subtitle
      const statsGridContainer = document.getElementById(
        "stats-grid-container",
      );
      if (
        statsGridContainer &&
        data.statsGrid &&
        Array.isArray(data.statsGrid)
      ) {
        const gridHtml = data.statsGrid
          .map(
            (stat) => `
      <div class="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">${stat.category}</span>
          <div class="p-1 rounded-lg bg-sky-50 border border-sky-100/80 shrink-0">
            ${stat.icon || ""}
          </div>
        </div>
        <div>
          <div class="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">${stat.value}</div>
          <div class="text-xs font-medium text-slate-500 mt-0.5">${stat.label}</div>
        </div>
      </div>
    `,
          )
          .join("");

        statsGridContainer.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">${gridHtml}</div>`;
      }

      // 3. Clear and secure the primary layout injection target
      const buttonContainer = document.getElementById("button-container");
      if (!buttonContainer) return;
      buttonContainer.innerHTML = "";

      // Helper function to turn plain URLs into clickable links
      const formatTextWithLinks = (text) => {
        if (!text) return "";
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(
          urlRegex,
          (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-sky-600 hover:underline font-semibold break-all">${url}</a>`,
        );
      };

      // Clean helper function: Handles strings, images, links, and array-based bullet lists
      const renderContentToDisplay = (
        titleText,
        descriptionData,
        imagePath = null,
      ) => {
        const subtitle = document.getElementById("site-subtitle");
        const subdescription = document.getElementById("site-subdescription");

        if (subtitle && titleText) {
          subtitle.textContent = titleText;
        }

        if (subdescription) {
          subdescription.innerHTML = ""; // Clear current display container

          // A. Render Image if present
          if (imagePath) {
            const imgElement = document.createElement("img");
            imgElement.src = imagePath;
            imgElement.alt = titleText || "Tool Screenshot";
            imgElement.className =
              "w-full max-h-72 object-contain rounded-xl border border-slate-200 shadow-sm mb-4 mt-2 bg-white p-2";
            subdescription.appendChild(imgElement);
          }

          // B. Render Array or String Content
          if (Array.isArray(descriptionData)) {
            const cardsHtml = descriptionData
              .map((item) => {
                if (typeof item === "object") {
                  // Render Tech Stack Badges
                  const tags = item.techStack
                    ? item.techStack
                        .map(
                          (tech) =>
                            `<span class="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-sky-50/80 text-sky-700 border border-sky-200/80 shadow-2xs">${tech}</span>`,
                        )
                        .join("")
                    : "";

                  // Dynamic Image or Text Logo Fallback
                  const logoContainer = item.imageUrl
                    ? `<div class="w-14 h-12 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                       <img src="${item.imageUrl}" alt="${item.company}" class="w-full h-full object-contain" />
                     </div>`
                    : `<div class="w-14 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-bold text-sky-700 text-sm shrink-0">
                       ${item.logoText || "IT"}
                     </div>`;

                  return `
              <div class="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 text-left mb-5">
                
                <!-- Header Row -->
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div class="flex items-center gap-3.5">
                    ${logoContainer}
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <h3 class="text-xl font-bold text-slate-900 tracking-tight">${item.role}</h3>
                        ${
                          item.statusBadge
                            ? `<span class="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-sky-50 text-sky-600 border border-sky-200/80">${item.statusBadge}</span>`
                            : ""
                        }
                      </div>
                      <p class="text-sm font-medium text-slate-500 mt-0.5">${item.company}</p>
                    </div>
                  </div>

                  <!-- Date Tag -->
                  <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-600 shrink-0">
                    <svg class="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>${item.date}</span>
                  </div>
                </div>

                <!-- Description Body -->
                <p class="text-slate-600 text-sm leading-relaxed mb-4">
                  ${formatTextWithLinks(item.desc)}
                </p>

                <!-- Tech Stack Pills -->
                <div class="flex flex-wrap gap-2 pt-1">
                  ${tags}
                </div>

              </div>`;
                }
                return `<div class="mb-3 text-left text-slate-700">${formatTextWithLinks(item)}</div>`;
              })
              .join("");

            const listContainer = document.createElement("div");
            listContainer.className = "flex flex-col gap-1 mt-4";
            listContainer.innerHTML = cardsHtml;
            subdescription.appendChild(listContainer);
          } else if (typeof descriptionData === "string") {
            const textContainer = document.createElement("div");
            textContainer.className =
              "text-left text-slate-700 whitespace-pre-line leading-relaxed mt-4";
            textContainer.innerHTML = formatTextWithLinks(descriptionData);
            subdescription.appendChild(textContainer);
          }
        }
      };

      // Helper function to update active button styles across the sidebar
      const setActiveButton = (targetAnchor) => {
        document.querySelectorAll("#button-container a").forEach((a) => {
          a.classList.remove("btn-jim-active");
          a.classList.add("btn-jim-slate");
        });
        if (targetAnchor) {
          targetAnchor.classList.remove("btn-jim-slate");
          targetAnchor.classList.add("btn-jim-active");
        }
      };

      // 4. Build components dynamically from dataset array
      data.buttons.forEach((btn, index) => {
        // Skip buttons that were specifically meant for navigation between index -> site
        if (btn.url === "site.html" || btn.text.toLowerCase() === "enter")
          return;

        const btnWrapper = document.createElement("div");
        btnWrapper.className = "relative w-full text-center";

        const anchor = document.createElement("a");
        anchor.className = btn.styleClass || "btn-jim btn-jim-slate";

        // Inject SVG icon + text inside the button
        anchor.innerHTML = `
          ${btn.icon ? `<span class="shrink-0 flex items-center">${btn.icon}</span>` : ""}
          <span class="truncate">${btn.text}</span>
        `;

        const hasDropdown = btn.dropdownItems && btn.dropdownItems.length > 0;

        if (hasDropdown) {
          anchor.href = "#";
          anchor.target = "_self";
        } else {
          anchor.href = btn.url || "#";

          // DIRECT BUTTON CONTENT CLICK HANDLER
          anchor.addEventListener("click", (e) => {
            if (btn.url && btn.url !== "#" && !btn.url.startsWith("#")) {
              return;
            }

            if (btn.title || btn.description) {
              e.preventDefault();
              setActiveButton(anchor);
              renderContentToDisplay(btn.title, btn.description, btn.image);
            }
          });
        }

        btnWrapper.appendChild(anchor);

        // 5. Generate dropdown content components if definitions exist
        if (hasDropdown) {
          const dropdownMenu = document.createElement("div");
          dropdownMenu.className =
            "hidden absolute left-0 z-50 mt-2 w-full rounded-xl border border-slate-300/80 bg-slate-200/95 backdrop-blur-md p-1.5 shadow-xl shadow-slate-400/20 flex flex-col gap-1";

          btn.dropdownItems.forEach((item) => {
            const menuLink = document.createElement("a");
            menuLink.href = "#";
            menuLink.innerText = item.text;
            menuLink.className =
              "block w-full rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-500 hover:text-white transition-all duration-150 text-center cursor-pointer";

            menuLink.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveButton(anchor);
              renderContentToDisplay(item.title, item.description, item.image);
            });
            dropdownMenu.appendChild(menuLink);
          });

          btnWrapper.appendChild(dropdownMenu);

          anchor.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle("hidden");
          });

          document.addEventListener("click", (e) => {
            if (!btnWrapper.contains(e.target)) {
              dropdownMenu.classList.add("hidden");
            }
          });
        }

        buttonContainer.appendChild(btnWrapper);

        // Set initial active state for the default button
        if (index === 0) {
          setActiveButton(anchor);
        }
      });

      // 6. AUTO-LOAD DEFAULT CONTENT ON INDEX.HTML
      const defaultButton = data.buttons.find(
        (btn) => btn.title || btn.description,
      );
      if (defaultButton) {
        renderContentToDisplay(
          defaultButton.title,
          defaultButton.description,
          defaultButton.image,
        );
      }
    })
    .catch((error) => {
      console.error(
        "Critical failure during UI engine execution pipeline:",
        error,
      );
    });
});

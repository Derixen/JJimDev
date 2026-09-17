/**
 * Dynamic UI Renderer (Tailwind v4 Setup)
 * Fetches profile data and links from a local JSON file and dynamically
 * generates components based on the current HTML file context.
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
      // 2. Identify routing environment context
      const currentPage = window.location.pathname.includes("site.html")
        ? "site"
        : "index";

      // 3. Inject Page Metadata
      const general = document.getElementById("general");
      if (general && window.location.pathname.includes("general")) {
        // Safe check fixed
      }

      const subHeading = document.getElementById("sub-heading");
      if (subHeading && data.mainsubheading) {
        subHeading.textContent = data.mainsubheading;
      }

      const siteHeading = document.getElementById("site-heading");
      if (siteHeading && data.siteheading) {
        siteHeading.textContent = data.siteheading;
      }

      const siteDescription = document.getElementById("site-description");
      if (siteDescription && data.sitedescription) {
        siteDescription.textContent = data.sitedescription;
      }

      // 4. Clear and secure the primary layout injection target
      const buttonContainer = document.getElementById("button-container");
      if (!buttonContainer) return;
      buttonContainer.innerHTML = "";

      // Clean helper function: Handles strings, images, links, and array-based bullet lists cleanly
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
              "w-full h-auto max-h-[600px] object-contain rounded-xl border border-slate-700 bg-slate-900/50 p-2 shadow-md mb-4 mt-2";
            subdescription.appendChild(imgElement);
          }

          // B. Helper to turn plain URLs into clickable links
          const formatTextWithLinks = (text) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(
              urlRegex,
              (url) =>
                `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:underline font-semibold break-all">${url}</a>`,
            );
          };

          // C. Render Array or String Content
          if (Array.isArray(descriptionData)) {
            const listItems = descriptionData
              .map((item) => {
                if (typeof item === "object") {
                  return `
              <div class="mb-5 text-left">
                <div class="font-bold text-slate-800 text-base">${item.role}</div>
                <div class="text-slate-600 text-sm italic mt-1 leading-relaxed">${formatTextWithLinks(item.desc)}</div>
              </div>`;
                }
                return `<div class="text-left text-slate-700">${formatTextWithLinks(item)}</div>`;
              })
              .join("");

            const listContainer = document.createElement("div");
            listContainer.className = "flex flex-col gap-2 mt-4";
            listContainer.innerHTML = listItems;
            subdescription.appendChild(listContainer);
          } else if (typeof descriptionData === "string") {
            const textContainer = document.createElement("div");
            textContainer.className =
              "text-left text-slate-700 whitespace-pre-line leading-relaxed";
            textContainer.innerHTML = formatTextWithLinks(descriptionData);
            subdescription.appendChild(textContainer);
          }
        }
      };

      // 5. Build components dynamically from dataset array
      data.buttons.forEach((btn) => {
        if (btn.page !== currentPage) return;

        const btnWrapper = document.createElement("div");
        btnWrapper.className = "relative w-full text-center";

        const anchor = document.createElement("a");
        anchor.innerText = btn.text;
        anchor.className = btn.styleClass;

        const hasDropdown = btn.dropdownItems && btn.dropdownItems.length > 0;

        if (hasDropdown) {
          anchor.href = "#";
          anchor.target = "_self";
        } else {
          anchor.href = btn.url || "#";

          // DIRECT BUTTON CONTENT CLICK HANDLER
          anchor.addEventListener("click", (e) => {
            // If it's navigating to a real HTML page (e.g., site.html), let it navigate
            if (btn.url && btn.url !== "#" && !btn.url.startsWith("#")) {
              return;
            }

            // Otherwise, update the static display elements with clean data
            if (btn.title || btn.description) {
              e.preventDefault();
              renderContentToDisplay(btn.title, btn.description, btn.image);
            }
          });
        }

        btnWrapper.appendChild(anchor);

        // 6. Generate dropdown content components if definitions exist
        if (hasDropdown) {
          const dropdownMenu = document.createElement("div");
          dropdownMenu.className =
            "hidden absolute left-0 z-50 mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-xl flex flex-col gap-1";

          btn.dropdownItems.forEach((item) => {
            const menuLink = document.createElement("a");
            menuLink.href = "#";
            menuLink.innerText = item.text;
            menuLink.className =
              "block w-full rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-center";

            menuLink.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
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
      });

      // 7. AUTO-LOAD DEFAULT CONTENT ON SITE.HTML
      if (currentPage === "site") {
        const defaultButton = data.buttons.find(
          (btn) => btn.page === "site" && (btn.title || btn.description),
        );
        if (defaultButton) {
          renderContentToDisplay(
            defaultButton.title,
            defaultButton.description,
            defaultButton.image,
          );
        }
      }
    })
    .catch((error) => {
      console.error(
        "Critical failure during UI engine execution pipeline:",
        error,
      );
    });
});

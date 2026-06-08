/**
 * Dynamic UI Renderer (Tailwind v4 Setup)
 * * Fetches profile data and links from a local JSON file and dynamically
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
      // 2. Inject Page Metadata (Safely guarded against missing elements)
      const mainHeading = document.getElementById("main-heading");
      if (mainHeading && data.heading) {
        mainHeading.textContent = data.heading;
      }

      const general = document.getElementById("general");
      if (general && indow.location.pathname.includes("general")) {
      }

      const subHeading = document.getElementById("sub-heading");
      if (subHeading && data.subheading) {
        subHeading.textContent = data.subheading;
      }

      // 3. Clear and secure the primary layout injection target
      const buttonContainer = document.getElementById("button-container");
      if (!buttonContainer) return; // Exit script if page does not feature button layout
      buttonContainer.innerHTML = "";

      // 4. Identify routing environment context
      const currentPage = window.location.pathname.includes("site.html")
        ? "site"
        : "index";

      // 5. Build components dynamically from dataset array
      data.buttons.forEach((btn) => {
        // Page Filter Guard Clause: Skip data entry if it belongs to an unviewed layout routing key
        if (btn.page !== currentPage) return;

        // Construct structural context element wrapper for absolute dropdown alignment rules
        const btnWrapper = document.createElement("div");
        btnWrapper.className = "relative w-full text-center";

        // Construct base trigger anchor link component
        const anchor = document.createElement("a");
        anchor.innerText = btn.text;
        anchor.className = btn.styleClass;

        // Setup component behavior properties based on structural contents definition
        const hasDropdown = btn.dropdownItems && btn.dropdownItems.length > 0;
        if (hasDropdown) {
          anchor.href = "#";
          anchor.target = "_self"; // Retain contextual window focus for execution
        } else {
          anchor.href = btn.url || "#";
          // anchor.target = "_blank"; // Open external resources in a fresh tab environment
        }

        btnWrapper.appendChild(anchor);

        // 6. Generate dropdown content components if definitions exist
        if (hasDropdown) {
          const dropdownMenu = document.createElement("div");
          dropdownMenu.className =
            "hidden absolute left-0 z-50 mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-xl flex flex-col gap-1";

          // Process and populate nested navigation node links
          btn.dropdownItems.forEach((item) => {
            const menuLink = document.createElement("a");
            menuLink.href = "#"; // Prevent default navigation away from page
            menuLink.innerText = item.text;
            menuLink.className =
              "block w-full rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-center";

            // 🌟 DYNAMIC CONTENT CLICK HANDLER 🌟
            menuLink.addEventListener("click", (e) => {
              e.preventDefault(); // Stop the page from jumping up to href="#"
              e.stopPropagation(); // Stop click from bubbling up and instantly closing the menu

              const displayZone = document.getElementById(
                "main-content-display",
              );
              if (displayZone && item.content) {
                // Inject the matching content from our data object into Box 3
                displayZone.innerHTML = item.content;

                // Clean up styling on content headings dynamically
                const heading = displayZone.querySelector("h3");
                if (heading)
                  heading.className =
                    "text-xl font-bold mb-2 text-white border-b border-slate-700 pb-2";

                const paragraph = displayZone.querySelector("p");
                if (paragraph)
                  paragraph.className = "text-slate-300 mt-2 leading-relaxed";
              }
            });
            dropdownMenu.appendChild(menuLink);
          });

          btnWrapper.appendChild(dropdownMenu);

          // Interactive Trigger: Toggle visibility on click boundaries
          anchor.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle("hidden");
          });

          // Accessibility Interaction: Dismiss active menu when capturing viewport clicks outward
          document.addEventListener("click", (e) => {
            if (!btnWrapper.contains(e.target)) {
              dropdownMenu.classList.add("hidden");
            }
          });
        }

        // Deploy fully assembled DOM node to structural document tree layout block
        buttonContainer.appendChild(btnWrapper);
      });
    })
    .catch((error) => {
      console.error(
        "Critical failure during UI engine execution pipeline:",
        error,
      );
    });
});

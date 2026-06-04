// Run this code as soon as the browser finishes loading the HTML structure
document.addEventListener("DOMContentLoaded", () => {
  // 1. Fetch the JSON file
  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load JSON data");
      }
      return response.json();
    })
    .then((data) => {
      // 2. Inject static string text directly into elements
      document.getElementById("main-heading").textContent = data.heading;
      document.getElementById("sub-heading").textContent = data.subheading;

      // 3. Loop through your array of buttons and generate HTML dynamically
      const buttonContainer = document.getElementById("button-container");

      data.buttons.forEach((btn) => {
        // Create an anchor tag element
        const anchor = document.createElement("a");
        anchor.href = btn.url;
        anchor.target = "_blank";
        anchor.innerText = btn.text;

        // Apply your newly optimized Tailwind v4 CSS input classes!
        anchor.className = btn.styleClass;

        // Append the button to the parent container
        buttonContainer.appendChild(anchor);
      });
    })
    .catch((error) => console.error("Error pulling JSON content:", error));
});

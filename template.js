// Audio UI frissítése
function updateAudioUI(isPlaying) {
  const btnText = document.getElementById("audio-btn-text");
  const btnIcon = document.getElementById("audio-btn-icon");

  if (btnText && btnIcon) {
    btnText.textContent = isPlaying ? "Leállítás" : "Meghallgatom";
    btnIcon.textContent = isPlaying ? "⏸" : "🔊";
  }
}

// Audio Ki/Be kapcsolása
function toggleAudio() {
  const audio = document.getElementById("bg-audio");
  if (!audio) return;

  if (audio.paused) {
    audio
      .play()
      .then(() => updateAudioUI(true))
      .catch((err) => console.error(err));
  } else {
    audio.pause();
    updateAudioUI(false);
  }
}

// Autoplay Kezelése
function initAutoplay() {
  const audio = document.getElementById("bg-audio");
  if (!audio) return;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => updateAudioUI(true))
      .catch(() => {
        const handleFirstInteraction = () => {
          audio.play().then(() => {
            updateAudioUI(true);
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
          });
        };
        document.addEventListener("click", handleFirstInteraction, {
          once: true,
        });
        document.addEventListener("touchstart", handleFirstInteraction, {
          once: true,
        });
      });
  }
}

// Elem tartalmának biztonságos beállítása
function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

// Hero és Fejléc adatok feltöltése DOM elemekbe
function populateHeaderAndHero(data) {
  setElementText("header-title", data.header?.title);
  setElementText("header-subtitle", data.header?.subtitle);

  setElementText("hero-tagline", data.hero?.tagline);
  setElementText("hero-title", data.hero?.title);
  setElementText("hero-desc", data.hero?.description);
  setElementText("hero-badge", "🌿 " + data.hero?.badge);
  setElementText("hero-overlay-tag", data.hero?.overlayTag);
  setElementText("hero-overlay-title", data.hero?.overlayTitle);

  const heroImg = document.getElementById("hero-img");
  if (heroImg && data.hero?.image) {
    heroImg.src = data.hero.image;
    heroImg.alt = data.hero.overlayTitle || "";
  }

  setElementText("audio-title", data.audio?.title);
  setElementText("audio-subtitle", data.audio?.subtitle);
  setElementText("audio-btn-text", data.audio?.buttonText);

  // Audio Gomb Eseménykezelő
  const audioBtn = document.getElementById("audio-btn");
  if (audioBtn) audioBtn.addEventListener("click", toggleAudio);
}

// Funkció kártyák kirajzolása HTML <template> alapján
function populateFeatures(featuresSection) {
  setElementText("features-category", featuresSection?.category);
  setElementText("features-title", featuresSection?.title);

  const container = document.getElementById("features-container");
  const template = document.getElementById("feature-card-template");
  if (!container || !template || !featuresSection?.items) return;

  container.innerHTML = ""; // Törlés

  featuresSection.items.forEach((item) => {
    const clone = template.content.cloneNode(true);

    if (item.image) {
      const imgBox = clone.querySelector(".feature-img-box");
      const img = clone.querySelector(".feature-img");
      img.src = item.image;
      img.alt = item.title;
      imgBox.classList.remove("hidden");
    } else {
      const iconBox = clone.querySelector(".feature-icon-box");
      const icon = clone.querySelector(".feature-icon");
      icon.textContent = item.icon || "✦";
      iconBox.classList.remove("hidden");
    }

    clone.querySelector(".feature-item-title").textContent = item.title;
    clone.querySelector(".feature-item-desc").textContent = item.description;

    const tagsContainer = clone.querySelector(".feature-tags");
    item.tags?.forEach((tagText) => {
      const tagSpan = document.createElement("span");
      tagSpan.className =
        "px-2.5 py-0.5 bg-stone-300/60 text-stone-700 text-[10px] font-medium rounded-md";
      tagSpan.textContent = tagText;
      tagsContainer.appendChild(tagSpan);
    });

    container.appendChild(clone);
  });
}

// Gyógyító kártyák kirajzolása
function populateHealers(healersSection) {
  setElementText("healers-category", healersSection?.category);
  setElementText("healers-title", healersSection?.title);
  setElementText("healers-subtitle", healersSection?.subtitle);

  const container = document.getElementById("healers-container");
  const template = document.getElementById("healer-card-template");
  if (!container || !template || !healersSection?.healers) return;

  container.innerHTML = "";

  healersSection.healers.forEach((healer) => {
    const clone = template.content.cloneNode(true);

    const avatar = clone.querySelector(".healer-avatar");
    avatar.src = healer.avatar;
    avatar.alt = healer.name;

    clone.querySelector(".healer-name").textContent = healer.name;
    clone.querySelector(".healer-role").textContent = healer.role;
    clone.querySelector(".healer-exp").textContent = healer.experience;
    clone.querySelector(".healer-rating").textContent = healer.rating;
    clone.querySelector(".healer-bio").textContent = healer.bio;

    container.appendChild(clone);
  });
}

// Alsó Navigáció feltöltése
function populateNavigation(navigationItems) {
  const container = document.getElementById("nav-container");
  if (!container || !navigationItems) return;

  container.innerHTML = "";

  navigationItems.forEach((nav) => {
    const btn = document.createElement("button");
    btn.className = `flex flex-col items-center gap-1 ${nav.active ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-600"}`;

    btn.innerHTML = nav.icon; // SVG felvétele

    const span = document.createElement("span");
    span.className = "text-[10px]";
    span.textContent = nav.label;

    btn.appendChild(span);
    container.appendChild(btn);
  });
}

// Fő adatbetöltő függvény
async function loadTemplateData() {
  try {
    const response = await fetch("template.json");
    const data = await response.json();

    populateHeaderAndHero(data);
    populateFeatures(data.featuresSection);
    populateHealers(data.healersSection);
    populateNavigation(data.navigation);

    initAutoplay();
  } catch (error) {
    console.error("Hiba a template.json betöltése közben:", error);
  }
}

// Indítás az oldal betöltődésekor
document.addEventListener("DOMContentLoaded", loadTemplateData);

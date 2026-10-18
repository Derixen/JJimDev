// Elem tartalmának biztonságos beállítása szövegként
function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}

// Elem tartalmának beállítása HTML-ként
function setElementHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html || "";
}

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

// Virágszirom hullás effekt
function initPetalEffect() {
  const container = document.getElementById("petal-container");
  if (!container) return;

  const petals = ["🌸", "🌺", "🍃", "🌸"];
  const totalPetals = 12;

  for (let i = 0; i < totalPetals; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";

    petal.textContent = petals[Math.floor(Math.random() * petals.length)];

    const size = Math.random() * 12 + 12;
    const leftPos = Math.random() * 100;
    const fallDuration = Math.random() * 8 + 7;
    const swayDuration = Math.random() * 4 + 3;
    const delay = Math.random() * 10;

    petal.style.fontSize = `${size}px`;
    petal.style.left = `${leftPos}%`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    petal.style.animationDelay = `${delay}s, ${delay}s`;

    container.appendChild(petal);
  }
}

// Hero Carousel Beállítása (Ellenőrizd a .jpg / .png kiterjesztést!)
const heroImages = [
  "Template/background01.jif",
  "Template/background02.jif",
  "Template/background03.jif",
  "Template/background04.jif",
  "Template/background05.jif",
  "Template/background06.jif",
  "Template/background07.jif",
];

let currentImageIndex = 0;
let carouselTimer = null;

function initHeroCarousel() {
  const container = document.getElementById("hero-carousel-container");
  const dotsContainer = document.getElementById("hero-dots-container");

  if (!container || !dotsContainer) return;

  container.innerHTML = "";
  dotsContainer.innerHTML = "";

  heroImages.forEach((imgSrc, index) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = `Background ${index + 1}`;
    img.className = `carousel-img ${index === 0 ? "active" : ""}`;
    container.appendChild(img);

    const dot = document.createElement("button");
    dot.className = `carousel-dot ${index === 0 ? "active" : ""}`;
    dot.setAttribute("aria-label", `Ugrás a(z) ${index + 1}. képre`);

    dot.addEventListener("click", () => {
      goToImage(index);
      resetCarouselTimer();
    });

    dotsContainer.appendChild(dot);
  });

  startCarouselTimer();
}

function goToImage(index) {
  const images = document.querySelectorAll(".carousel-img");
  const dots = document.querySelectorAll(".carousel-dot");

  if (images.length === 0 || dots.length === 0) return;

  images[currentImageIndex]?.classList.remove("active");
  dots[currentImageIndex]?.classList.remove("active");

  currentImageIndex = index;

  images[currentImageIndex]?.classList.add("active");
  dots[currentImageIndex]?.classList.add("active");
}

function nextImage() {
  const nextIdx = (currentImageIndex + 1) % heroImages.length;
  goToImage(nextIdx);
}

function startCarouselTimer() {
  carouselTimer = setInterval(nextImage, 4000);
}

function resetCarouselTimer() {
  clearInterval(carouselTimer);
  startCarouselTimer();
}

// Fejléc és Hero feltöltése (Támogatja mind a sima leírást, mind a struktúrált lista JSON-t)
function populateHeaderAndHero(data) {
  setElementText("header-title", data.header?.title);
  setElementText("header-subtitle", data.header?.subtitle);

  setElementText("hero-tagline", data.hero?.tagline);
  setElementText("hero-title", data.hero?.title);

  // Leírás dinamikus generálása
  const heroDescEl = document.getElementById("hero-desc");
  if (heroDescEl && data.hero) {
    if (data.hero.intro || data.hero.bullets) {
      let htmlContent = `<p class="mb-3">${data.hero.intro || ""}</p>`;

      if (data.hero.bulletTitle) {
        htmlContent += `<p class="font-semibold text-stone-800 mb-1.5">${data.hero.bulletTitle}</p>`;
      }

      if (data.hero.bullets && Array.isArray(data.hero.bullets)) {
        htmlContent += `<ul class="list-disc list-inside space-y-1 text-stone-600 pl-1">`;
        data.hero.bullets.forEach((bullet) => {
          htmlContent += `<li>${bullet}</li>`;
        });
        htmlContent += `</ul>`;
      }
      heroDescEl.innerHTML = htmlContent;
    } else if (data.hero.description) {
      heroDescEl.innerHTML = data.hero.description;
    }
  }

  setElementText("hero-badge", "🌿 " + data.hero?.badge);
  setElementText("hero-overlay-tag", data.hero?.overlayTag);
  setElementText("hero-overlay-title", data.hero?.overlayTitle);

  setElementText("audio-title", data.audio?.title);
  setElementText("audio-subtitle", data.audio?.subtitle);
  setElementText("audio-btn-text", data.audio?.buttonText);

  const audioBtn = document.getElementById("audio-btn");
  if (audioBtn) audioBtn.addEventListener("click", toggleAudio);

  initHeroCarousel();
}

// Funkció kártyák kirajzolása és lenyíló animációja
function populateFeatures(featuresSection) {
  setElementText("features-category", featuresSection?.category);
  setElementText("features-title", featuresSection?.title);

  const container = document.getElementById("features-container");
  const template = document.getElementById("feature-card-template");
  if (!container || !template || !featuresSection?.items) return;

  container.innerHTML = "";

  featuresSection.items.forEach((item) => {
    const clone = template.content.cloneNode(true);
    const cardElement = clone.querySelector(".card-soft");

    // Kép vagy Ikon kezelése
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

    // Cím és fő leírás (HTML formázás támogatásával)
    clone.querySelector(".feature-item-title").textContent = item.title;
    const descEl = clone.querySelector(".feature-item-desc");
    descEl.innerHTML = item.description || "";

    // --- ITT VAN A 3. RÉSZ: Animált lenyitás kezelése ---
    const extendedEl = clone.querySelector(".feature-item-extended");
    const arrowEl = clone.querySelector(".feature-toggle-arrow");

    if (item.extendedDescription && extendedEl) {
      extendedEl.innerHTML = item.extendedDescription;
      arrowEl?.classList.remove("hidden");

      cardElement.addEventListener("click", () => {
        const isExpanded = extendedEl.classList.contains("expanded");

        if (isExpanded) {
          extendedEl.classList.remove("expanded");
          arrowEl?.classList.remove("rotated");
        } else {
          extendedEl.classList.add("expanded");
          arrowEl?.classList.add("rotated");
        }
      });
    }

    // Címkék (Tags) feltöltése
    const tagsContainer = clone.querySelector(".feature-tags");
    item.tags?.forEach((tagText) => {
      const tagSpan = document.createElement("span");
      tagSpan.className =
        "px-2.5 py-0.5 bg-black/5 text-[10px] font-medium rounded-md";
      tagSpan.textContent = tagText;
      tagsContainer.appendChild(tagSpan);
    });

    container.appendChild(clone);
  });
}

// Gyógyító kártyák
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

// Modal kezelés
function setupBookingModal() {
  const modal = document.getElementById("booking-modal");
  const closeBtn = document.getElementById("close-booking-modal");

  if (!modal) return;

  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

// Navigáció
function populateNavigation(navigationItems) {
  const container = document.getElementById("nav-container");
  if (!container || !navigationItems) return;

  container.innerHTML = "";

  navigationItems.forEach((nav) => {
    const btn = document.createElement("button");
    btn.className = `flex flex-col items-center gap-1 ${
      nav.active
        ? "text-stone-900 font-bold"
        : "text-stone-400 hover:text-stone-600"
    }`;

    btn.innerHTML = nav.icon;

    const span = document.createElement("span");
    span.className = "text-[10px]";
    span.textContent = nav.label;

    btn.appendChild(span);

    if (nav.label === "Foglalás") {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const modal = document.getElementById("booking-modal");
        if (modal) modal.classList.remove("hidden");
      });
    }

    container.appendChild(btn);
  });

  setupBookingModal();
}

// Profile Bio Modal Setup
function setupProfileModal() {
  const avatar = document.querySelector(".header-avatar");
  const modal = document.getElementById("profile-modal");
  const closeBtn = document.getElementById("close-profile-modal");

  if (!avatar || !modal) return;

  // Open modal on avatar click
  avatar.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Close modal on 'X' click
  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal when clicking on the backdrop
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}

function populateProfile(profileSection) {
  if (!profileSection) return;

  const avatarEl = document.getElementById("profile-avatar");
  const nameEl = document.getElementById("profile-name");
  const roleEl = document.getElementById("profile-role");
  const ageEl = document.getElementById("profile-age");
  const aboutTitleEl = document.getElementById("profile-about-title");
  const aboutQuoteEl = document.getElementById("profile-about-quote");

  if (avatarEl) {
    avatarEl.src = profileSection.avatar || "";
    avatarEl.alt = profileSection.name || "";
  }

  setElementText("profile-name", profileSection.name);
  setElementText("profile-role", profileSection.role);
  setElementText("profile-age", profileSection.age);
  setElementText("profile-about-title", profileSection.aboutTitle);
  setElementText("profile-about-quote", `"${profileSection.aboutQuote}"`);
}

// Fő indító függvény
async function loadTemplateData() {
  try {
    const response = await fetch("template.json");
    const data = await response.json();

    populateHeaderAndHero(data);
    populateFeatures(data.featuresSection);
    populateHealers(data.healersSection);
    populateNavigation(data.navigation);
    populateProfile(data.profileSection); // ← add this line

    initAutoplay();
  } catch (error) {
    console.error("Hiba a template.json betöltése közben:", error);
  }

  initPetalEffect();
  setupProfileModal();
}

document.addEventListener("DOMContentLoaded", loadTemplateData);


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const gameCards = document.querySelectorAll(".game-card");
  const emptyMessage = document.getElementById("emptyMessage");
  const favoriteCount = document.getElementById("favoriteCount");

  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const gameDialog = document.getElementById("gameDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogText = document.getElementById("dialogText");
  const dialogClose = document.getElementById("dialogClose");
  const dialogDone = document.getElementById("dialogDone");

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  let activeCategory = "all";

  const gameDescriptions = {
    "Shadow Strike": "A fictional action game concept featuring fast-paced combat, competitive challenges, and skill-based missions.",
    "Lost Worlds": "A fictional adventure game concept where players explore mysterious locations, solve puzzles, and uncover hidden secrets.",
    "Turbo Rush": "A fictional racing game concept featuring high-speed tracks, challenging turns, and competitive time trials.",
    "Kingdom Tactics": "A fictional strategy game concept focused on planning, resource management, and tactical decisions.",
    "Cyber Arena": "A fictional futuristic action game concept with advanced arenas, survival challenges, and team-based competition.",
    "Mystic Quest": "A fictional fantasy adventure game concept featuring enchanted landscapes, exploration, and mysterious quests."
  };

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // The website still works if browser storage is unavailable.
    }
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("gameStat").textContent =
    String(gameCards.length).padStart(2, "0");

  // Theme toggle
  if (readStorage("pixelPlayTheme", "dark") === "light") {
    document.body.classList.add("light");
  }

  function updateThemeButton() {
    themeToggle.textContent =
      document.body.classList.contains("light") ? "🌙" : "☀️";
  }

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    saveStorage(
      "pixelPlayTheme",
      document.body.classList.contains("light") ? "light" : "dark"
    );

    updateThemeButton();
  });

  // Mobile menu
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // Search and category filters
  function filterGames() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    gameCards.forEach((card) => {
      const matchesCategory =
        activeCategory === "all" ||
        card.dataset.category === activeCategory;

      const matchesSearch =
        card.dataset.name.toLowerCase().includes(query) ||
        card.textContent.toLowerCase().includes(query);

      const visible = matchesCategory && matchesSearch;
      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;
  }

  searchInput.addEventListener("input", filterGames);

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );

    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      filterGames();
    });
  });

  // Favorites saved in localStorage
  let favorites = [];

  try {
    const saved = JSON.parse(readStorage("pixelPlayFavorites", "[]"));

    if (Array.isArray(saved)) {
      favorites = saved.filter((name) =>
        Object.prototype.hasOwnProperty.call(gameDescriptions, name)
      );
    }
  } catch (error) {
    favorites = [];
  }

  function updateFavorites() {
    gameCards.forEach((card) => {
      const name = card.dataset.name;
      const button = card.querySelector(".favorite-btn");
      const selected = favorites.includes(name);

      button.classList.toggle("selected", selected);
      button.textContent = selected ? "♥" : "♡";
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute(
        "aria-label",
        (selected ? "Remove " : "Add ") + name + " " +
        (selected ? "from" : "to") + " favorites"
      );
    });

    favoriteCount.textContent = favorites.length;
    saveStorage("pixelPlayFavorites", JSON.stringify(favorites));
  }

  document.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.closest(".game-card").dataset.name;

      if (favorites.includes(name)) {
        favorites = favorites.filter((item) => item !== name);
      } else {
        favorites.push(name);
      }

      updateFavorites();
    });
  });

  updateFavorites();

  // Game details popup
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.game;
      dialogTitle.textContent = name;
      dialogText.textContent = gameDescriptions[name] || "Explore this game concept.";
      gameDialog.showModal();
    });
  });

  function closeGameDialog() {
    gameDialog.close();
  }

  dialogClose.addEventListener("click", closeGameDialog);
  dialogDone.addEventListener("click", closeGameDialog);

  gameDialog.addEventListener("click", (event) => {
    if (event.target === gameDialog) {
      closeGameDialog();
    }
  });

  // Contact form demo
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const name = document.getElementById("name").value.trim();

    formStatus.textContent =
      "Thanks, " + name + "! Your demo message was submitted successfully.";

    contactForm.reset();
  });
});

/* =========================================================
   Premium Multi-Page Gratitude Website
   Shared JavaScript
   ========================================================= */

let currentPage = 1;
const totalPages = 11;

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initPageTransitions();
  initParticles();
  initMusic();
  initThemeToggle();
});

/* Loading screen */
function initLoader() {
  const loader = document.querySelector(".loader-screen");
  if (!loader) return;

  const hasVisited = sessionStorage.getItem("gratitudeSiteVisited");

  if (hasVisited) {
    loader.classList.add("hidden");
    return;
  }

  setTimeout(() => {
    loader.classList.add("hidden");
    sessionStorage.setItem("gratitudeSiteVisited", "true");
  }, 2200);
}

function showPage(pageIndex, pushState = true) {
  if (pageIndex < 1 || pageIndex > totalPages) return;
  
  const currentActive = document.querySelector(".book-page.active");
  const targetPage = document.getElementById(`page-${pageIndex}`);
  if (!targetPage) return;

  if (currentActive) {
    currentActive.classList.remove("active");
  }
  
  targetPage.classList.add("active");
  currentPage = pageIndex;

  // Update Title
  const title = targetPage.getAttribute("data-title");
  if (title) {
    document.title = title;
  }

  // Update Footer note
  const footerNote = document.getElementById("footerNote") || document.querySelector(".footer-note");
  const footerText = targetPage.getAttribute("data-footer");
  if (footerNote) {
    footerNote.textContent = footerText || "";
  }

  // Update Navigation display
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");
  const navGroup = document.querySelector(".nav-group");
  
  if (navGroup) {
    if (pageIndex === 11) {
      navGroup.style.display = "none";
    } else {
      navGroup.style.display = "";
    }
  }

  if (prevBtn) {
    prevBtn.style.visibility = (pageIndex === 1) ? "hidden" : "visible";
  }
  if (nextBtn) {
    nextBtn.style.visibility = (pageIndex >= 10) ? "hidden" : "visible";
  }

  // Push state to browser history
  if (pushState) {
    history.pushState({ pageIndex }, "", `?page=${pageIndex}`);
  }

  // Trigger page-specific animations
  if (pageIndex === 3) {
    initCodeTyping();
  } else if (pageIndex === 7) {
    initTypewriterSequence();
  } else if (pageIndex === 10) {
    initFinalSurprise();
  }
}

/* Smooth page transitions (SPA / AJAX) */
function initPageTransitions() {
  // Bind click listener for all data-transition="true" links/buttons via delegation
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-transition='true'], button[data-transition='true']");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    event.preventDefault();

    document.body.classList.add("fade-out");

    setTimeout(() => {
      let targetIndex = 1;
      if (href.includes("page2")) targetIndex = 2;
      else if (href.includes("page3")) targetIndex = 3;
      else if (href.includes("page4")) targetIndex = 4;
      else if (href.includes("page5")) targetIndex = 5;
      else if (href.includes("page6")) targetIndex = 6;
      else if (href.includes("page7")) targetIndex = 7;
      else if (href.includes("page8")) targetIndex = 8;
      else if (href.includes("page9")) targetIndex = 9;
      else if (href.includes("page10")) targetIndex = 10;
      else if (href.includes("page11")) targetIndex = 11;
      else if (href.includes("index")) targetIndex = 1;

      showPage(targetIndex);
      
      setTimeout(() => {
        document.body.classList.remove("fade-out");
      }, 100);
    }, 420);
  });

  // Bind controls nav buttons
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        document.body.classList.add("fade-out");
        setTimeout(() => {
          showPage(currentPage - 1);
          setTimeout(() => {
            document.body.classList.remove("fade-out");
          }, 100);
        }, 420);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        document.body.classList.add("fade-out");
        setTimeout(() => {
          showPage(currentPage + 1);
          setTimeout(() => {
            document.body.classList.remove("fade-out");
          }, 100);
        }, 420);
      }
    });
  }

  // Listen to back/forward browser navigation
  window.addEventListener("popstate", (event) => {
    const pageIndex = event.state?.pageIndex || 1;
    showPage(pageIndex, false);
  });

  // Handle URL parameter on load
  const urlParams = new URLSearchParams(window.location.search);
  const startPage = parseInt(urlParams.get("page")) || 1;
  showPage(startPage, false);
}

/* Floating particles */
function initParticles() {
  const container = document.querySelector(".particles");
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";

    const size = Math.random() * 10 + 6;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.opacity = `${Math.random() * 0.4 + 0.15}`;

    container.appendChild(particle);
  }
}

/* Background music */
function initMusic() {
  const audio = document.getElementById("bgMusic");
  const toggleBtn = document.getElementById("musicToggle");
  if (!audio || !toggleBtn) return;

  // Make sure source points to Reze.mp3 (as a safe fallback)
  const source = audio.querySelector("source");
  if (source && !source.src.endsWith("Reze.mp3")) {
    source.src = "Reze.mp3";
    audio.load();
  }

  // Restore volume setting (default 0.35)
  let volume = 0.35;
  const storedVolume = localStorage.getItem("gratitudeMusicVolume");
  if (storedVolume !== null) {
    volume = parseFloat(storedVolume);
  } else {
    localStorage.setItem("gratitudeMusicVolume", String(volume));
  }
  audio.volume = volume;

  // Restore mute state
  const storedMuted = localStorage.getItem("gratitudeMusicMuted");
  if (storedMuted === "true") {
    audio.muted = true;
    toggleBtn.textContent = "Unmute Music";
  } else {
    audio.muted = false;
    toggleBtn.textContent = "Mute Music";
  }

  // Restore playback position
  const savedTime = sessionStorage.getItem("musicPlaybackTime");
  if (savedTime) {
    audio.currentTime = parseFloat(savedTime);
  }

  // Save current time dynamically
  audio.addEventListener("timeupdate", () => {
    sessionStorage.setItem("musicPlaybackTime", String(audio.currentTime));
  });

  // Track if music should be playing
  const wasPlaying = sessionStorage.getItem("musicPlayingState") === "true";
  const isFirstLoad = sessionStorage.getItem("musicPlaybackTime") === null;

  if ((wasPlaying || isFirstLoad) && !audio.muted) {
    setTimeout(() => {
      audio.play().then(() => {
        sessionStorage.setItem("musicPlayingState", "true");
      }).catch((err) => {
        console.log("Autoplay blocked by browser, waiting for user interaction:", err);
      });
    }, 1000);
  }

  audio.addEventListener("play", () => {
    sessionStorage.setItem("musicPlayingState", "true");
  });

  audio.addEventListener("pause", () => {
    // Only set to false if not unloading
    sessionStorage.setItem("musicPlayingState", "false");
  });

  // Helper to save state before unload
  const saveState = () => {
    sessionStorage.setItem("musicPlaybackTime", String(audio.currentTime));
    sessionStorage.setItem("musicPlayingState", String(!audio.paused && !audio.muted));
  };
  window.addEventListener("beforeunload", saveState);

  // Interaction trigger to start/resume audio if autoplay was blocked
  const startAudioOnInteraction = () => {
    if (!audio.muted && audio.paused) {
      audio.play().catch(() => {});
    }
  };
  document.addEventListener("click", startAudioOnInteraction, { once: true });
  document.addEventListener("keydown", startAudioOnInteraction, { once: true });

  // Mute/Unmute Toggle
  toggleBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    localStorage.setItem("gratitudeMusicMuted", String(audio.muted));
    toggleBtn.textContent = audio.muted ? "Unmute Music" : "Mute Music";

    if (!audio.muted) {
      audio.play().then(() => {
        sessionStorage.setItem("musicPlayingState", "true");
      }).catch(() => {});
    } else {
      audio.pause();
      sessionStorage.setItem("musicPlayingState", "false");
    }
  });

  // Volume controls
  const volDownBtn = document.getElementById("volumeDownBtn");
  const volUpBtn = document.getElementById("volumeUpBtn");

  if (volDownBtn) {
    volDownBtn.addEventListener("click", () => {
      let currentVol = audio.volume;
      currentVol = Math.max(0, currentVol - 0.1);
      audio.volume = currentVol;
      localStorage.setItem("gratitudeMusicVolume", String(currentVol));
      
      if (audio.muted && currentVol > 0) {
        audio.muted = false;
        localStorage.setItem("gratitudeMusicMuted", "false");
        toggleBtn.textContent = "Mute Music";
      }
      showVolumeToast(Math.round(currentVol * 100) + "%");
    });
  }

  if (volUpBtn) {
    volUpBtn.addEventListener("click", () => {
      let currentVol = audio.volume;
      currentVol = Math.min(1, currentVol + 0.1);
      audio.volume = currentVol;
      localStorage.setItem("gratitudeMusicVolume", String(currentVol));
      
      if (audio.muted && currentVol > 0) {
        audio.muted = false;
        localStorage.setItem("gratitudeMusicMuted", "false");
        toggleBtn.textContent = "Mute Music";
      }
      if (audio.paused && !audio.muted) {
        audio.play().then(() => {
          sessionStorage.setItem("musicPlayingState", "true");
        }).catch(() => {});
      }
      showVolumeToast(Math.round(currentVol * 100) + "%");
    });
  }
}

// Simple toast notification for volume feedback
function showVolumeToast(text) {
  let toast = document.getElementById("volume-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "volume-toast";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "var(--white-glass)";
    toast.style.color = "var(--text)";
    toast.style.padding = "10px 16px";
    toast.style.borderRadius = "999px";
    toast.style.backdropFilter = "blur(14px)";
    toast.style.border = "1px solid var(--border-glass)";
    toast.style.boxShadow = "var(--shadow-soft)";
    toast.style.zIndex = "9999";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.pointerEvents = "none";
    document.body.appendChild(toast);
  }
  toast.textContent = "Volume: " + text;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  
  clearTimeout(window.volumeToastTimeout);
  window.volumeToastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 1500);
}

/* Theme toggle */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const savedTheme = localStorage.getItem("gratitudeTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggle.textContent = "Light Mode";
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("gratitudeTheme", isDark ? "dark" : "light");
    toggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  });
}

/* Thank you page typewriter sequence */
function initTypewriterSequence() {
  const lines = document.querySelectorAll(".type-line");
  if (!lines.length) return;

  let delay = 300;

  lines.forEach((line) => {
    line.classList.remove("show"); // Reset it first
    setTimeout(() => {
      // Only show if we are still on the Thank You page
      if (currentPage === 7) {
        line.classList.add("show");
      }
    }, delay);

    delay += 2200;
  });
}

/* Background code typing animation */
function initCodeTyping() {
  const codeTarget = document.getElementById("codeTyping");
  if (!codeTarget) return;

  const codeText = [
    "#include <iostream>",
    "using namespace std;",
    "",
    "int main() {",
    '    cout << "Hello, World!";',
    "    return 0;",
    "}"
  ].join("\n");

  let index = 0;
  codeTarget.textContent = "";

  function typeCode() {
    if (currentPage !== 3) return; // Stop typing if moved to another page
    
    if (index <= codeText.length) {
      codeTarget.textContent = codeText.slice(0, index);
      index++;
      setTimeout(typeCode, 50);
    } else {
      setTimeout(() => {
        if (currentPage !== 3) return;
        index = 0;
        codeTarget.textContent = "";
        typeCode();
      }, 1500);
    }
  }

  typeCode();
}

/* Final surprise animation */
function initFinalSurprise() {
  const giftButton = document.getElementById("openGiftBtn");
  const finalSurprise = document.getElementById("finalSurprise");
  const flowersContainer = document.getElementById("fallingFlowers");

  if (!giftButton || !finalSurprise || !flowersContainer) return;

  // Reset the surprise state on page navigation
  finalSurprise.classList.remove("show");
  giftButton.style.display = "inline-flex";

  // De-duplicate listener by cloning the button
  const newGiftBtn = giftButton.cloneNode(true);
  giftButton.parentNode.replaceChild(newGiftBtn, giftButton);

  newGiftBtn.addEventListener("click", () => {
    finalSurprise.classList.add("show");
    createFlowers(flowersContainer, 28);
    newGiftBtn.style.display = "none";
  });
}

function createFlowers(container, count) {
  for (let i = 0; i < count; i++) {
    const flower = document.createElement("span");
    flower.className = "flower";
    flower.style.left = `${Math.random() * 100}%`;
    flower.style.animationDuration = `${Math.random() * 4 + 5}s`;
    flower.style.animationDelay = `${Math.random() * 2}s`;
    flower.style.transform = `scale(${Math.random() * 0.8 + 0.7})`;

    container.appendChild(flower);

    setTimeout(() => {
      flower.remove();
    }, 9000);
  }
}

function openTerminal() {
  const term = document.getElementById("terminal");
  if (!term) return;
  term.classList.remove("hidden");
  
  const text = "System initialization...\nLoading memories...\nFound 1000+ lines of guidance.\nStatus: Infinite Gratitude.\n\nThank you, Nilesh Jadhao Sir, for being the best mentor!";
  let i = 0;
  term.textContent = "";
  
  function type() {
    if (i < text.length) {
      term.textContent += text.charAt(i);
      i++;
      setTimeout(type, 30);
    }
  }
  type();
}
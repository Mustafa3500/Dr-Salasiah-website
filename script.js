// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a:not(.dropdown-toggle)").forEach((a) =>
  a.addEventListener("click", () => links.classList.remove("open"))
);

// Advisory dropdown: hover opens it on desktop (a click goes to the Advisory page);
// on phones a tap opens the sub-menu instead
const dropdown = document.querySelector(".nav-dropdown");
if (dropdown) {
  const ddToggle = dropdown.querySelector(".dropdown-toggle");
  const isPhoneMenu = () => getComputedStyle(toggle).display !== "none";
  const setOpen = (open) => {
    dropdown.classList.toggle("open", open);
    ddToggle.setAttribute("aria-expanded", open);
  };
  ddToggle.addEventListener("click", (e) => {
    if (!isPhoneMenu()) return;
    e.preventDefault();
    setOpen(!dropdown.classList.contains("open"));
  });
  dropdown.querySelectorAll(".dropdown-item").forEach((item) =>
    item.addEventListener("click", () => {
      setOpen(false);
      links.classList.remove("open");
    })
  );
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

// Contact form: submit to Netlify Forms without leaving the page
const form = document.getElementById("contact-form");
const formStatus = form && form.querySelector(".form-status");
if (form) form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  formStatus.textContent = "Sending…";
  try {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    formStatus.textContent = "Thank you. Your enquiry has been sent, and Dr. Salasiah's team will be in touch.";
  } catch {
    formStatus.textContent = "Sorry, the form could not be sent. Please email drsalasiah@sovaintell.com instead.";
  } finally {
    button.disabled = false;
  }
});

// Start the featured video when it enters view, and pause it when scrolled away.
const autoplayFrame = document.querySelector("[data-autoplay-on-view]");
if (autoplayFrame) {
  let isVisible = false;
  let isLoaded = false;
  const sendVideoCommand = (func) => {
    autoplayFrame.contentWindow.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  };
  autoplayFrame.addEventListener("load", () => {
    if (!autoplayFrame.dataset.started) return;
    isLoaded = true;
    sendVideoCommand(isVisible ? "playVideo" : "pauseVideo");
  });
  const startOrResumeVideo = () => {
    if (!autoplayFrame.dataset.started) {
      autoplayFrame.dataset.started = "true";
      autoplayFrame.src = autoplayFrame.dataset.videoSrc;
    } else if (isLoaded) {
      sendVideoCommand("playVideo");
    }
  };
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) startOrResumeVideo();
      else if (isLoaded) sendVideoCommand("pauseVideo");
    }, { threshold: 0.25 });
    videoObserver.observe(autoplayFrame.parentElement);
  } else {
    isVisible = true;
    startOrResumeVideo();
  }
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

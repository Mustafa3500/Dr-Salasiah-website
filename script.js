// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => links.classList.remove("open"))
);

// Contact form: submit to Netlify Forms without leaving the page
const form = document.getElementById("contact-form");
const status = form.querySelector(".form-status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  status.textContent = "Sending…";
  try {
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    status.textContent = "Thank you. Your enquiry has been sent, and Dr. Salasiah's team will be in touch.";
  } catch {
    status.textContent = "Sorry, the form could not be sent. Please email drsalasiah@sovaintell.com instead.";
  } finally {
    button.disabled = false;
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

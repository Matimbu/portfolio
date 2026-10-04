// Portfolio interactions. Plain JavaScript, no libraries.
// Each numbered block does one job and can be read on its own.

const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");


/* 1. Theme ---------------------------------------------------------------- */
// The inline script in <head> already picked the starting theme.
// This block keeps the toggle in sync and handles switching.

const toggle = document.getElementById("themeToggle");
const toggleIcon = toggle.querySelector("i");
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const sheen = document.querySelector(".sheen");

function savedTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  const next = theme === "dark" ? "light" : "dark";
  toggle.setAttribute("aria-label", `Switch to ${next} theme`);
  toggleIcon.className = theme === "dark" ? "ph ph-sun" : "ph ph-moon";
  themeColor.content = theme === "dark" ? "#09090b" : "#fafafa";
}

applyTheme(root.dataset.theme || "light");

// Follow the system setting until the visitor picks a theme themselves
systemDark.addEventListener("change", (event) => {
  if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
});

toggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", next); } catch {}

  if (reduceMotion.matches) {
    applyTheme(next);
    return;
  }

  // Expressive moment 3: a band of light sweeps across the page, and the
  // colours fade to the new theme while it passes.
  sheen.classList.remove("run");
  void sheen.offsetWidth; // restart the animation if clicked twice quickly
  sheen.classList.add("run");
  root.classList.add("theme-anim");
  setTimeout(() => applyTheme(next), 180);
  setTimeout(() => root.classList.remove("theme-anim"), 720);
});


/* 2. The opening ----------------------------------------------------------- */
// Expressive moment 1. Split the name into letters so each one can rise in.
// Screen readers still get the whole name from aria-label.

const heroName = document.getElementById("heroName");
const fullName = heroName.textContent.trim();
heroName.setAttribute("aria-label", fullName);
heroName.textContent = "";

let letterIndex = 0;
fullName.split(" ").forEach((word, wordIndex) => {
  if (wordIndex > 0) heroName.append(" ");
  const wordSpan = document.createElement("span");
  wordSpan.className = "word";
  wordSpan.setAttribute("aria-hidden", "true");
  for (const letter of word) {
    const charSpan = document.createElement("span");
    charSpan.className = "char";
    charSpan.textContent = letter;
    charSpan.style.setProperty("--i", letterIndex++);
    wordSpan.append(charSpan);
  }
  heroName.append(wordSpan);
});

if (root.classList.contains("intro")) {
  // Wait for the fonts (at most 900ms) so letters don't jump mid-animation
  const fontsReady = Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 900)),
  ]);
  // requestAnimationFrame waits until the tab is actually on screen, so a
  // visitor who opens the link in a background tab still sees the opening.
  fontsReady.then(() => {
    requestAnimationFrame(() => {
      root.classList.add("intro-play");
      try { sessionStorage.setItem("introSeen", "1"); } catch {}
      setTimeout(() => root.classList.remove("intro", "intro-play"), 2400);
    });
  });
}


/* 3. Sections rise into place ----------------------------------------------- */
// Expressive moment 4. IntersectionObserver tells us when something scrolls
// into view, without listening to every scroll event.

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  root.classList.add("reveal-ready");
  let observerReported = false;

  const revealObserver = new IntersectionObserver((entries) => {
    observerReported = true;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));

  // Safety net: the observer normally reports within a frame of the page
  // being shown. If it still hasn't 3 seconds later, show everything rather
  // than risk leaving sections invisible.
  const showAllIfSilent = () => setTimeout(() => {
    if (!observerReported) revealItems.forEach((item) => item.classList.add("is-in"));
  }, 3000);
  if (document.visibilityState === "visible") showAllIfSilent();
  else document.addEventListener("visibilitychange", showAllIfSilent, { once: true });
}


/* 4. Highlight the current section in the nav -------------------------------- */
// Watches a thin band across the middle of the screen. Whichever section
// is in that band gets its nav link marked as current.

const navLinks = [...document.querySelectorAll(".nav-links a")];
const linkFor = new Map(navLinks.map((link) => [link.getAttribute("href").slice(1), link]));

const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
    linkFor.get(entry.target.id)?.setAttribute("aria-current", "true");
  }
}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));


/* 5. Project cards: the aurora follows the cursor ----------------------------- */
// Expressive moment 2. Only on devices with a mouse, and only when motion
// is allowed. CSS draws the glow at --mx / --my.

if (finePointer.matches && !reduceMotion.matches) {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
    });
  });
}


/* 6. Case studies ------------------------------------------------------------- */
// Each card opens a native <dialog>. The browser handles focus, and the
// Escape key, and returns focus to the card when it closes.

function closeCase(dialog) {
  if (!dialog.open) return;
  if (reduceMotion.matches) {
    dialog.close();
    return;
  }
  // Play the quick exit animation, then actually close
  dialog.classList.add("closing");
  setTimeout(() => {
    dialog.classList.remove("closing");
    dialog.close();
  }, 160);
}

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.open);
    dialog.showModal();
    // Some browsers (Safari) don't focus a button when it's clicked, so hand
    // focus back to this card ourselves when the dialog closes.
    dialog.addEventListener("close", () => button.focus({ preventScroll: true }), { once: true });
  });
});

document.querySelectorAll("dialog.case").forEach((dialog) => {
  // A click that lands on the dialog itself (not its content) is the backdrop
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeCase(dialog);
  });
  dialog.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => closeCase(dialog));
  });
  // Escape: use our closing animation instead of the instant default
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCase(dialog);
  });
});


/* 7. Contact form --------------------------------------------------------------- */
// Paste your Formspree form ID here: the code after formspree.io/f/ in the
// form's endpoint. It isn't a secret; it's meant to be in the page.
// Until it's set, the form opens the visitor's email app instead.
const FORMSPREE_ID = "xrpezjyl";
const MY_EMAIL = "raywelfrancismartin@gmail.com";

const form = document.getElementById("contactForm");
const formStatus = form.querySelector(".form-status");
const submitButton = form.querySelector('button[type="submit"]');
const fields = [form.elements.name, form.elements.email, form.elements.message];

// Show or hide the error under one field. Returns true when the field is fine.
function checkField(field) {
  const ok = field.value.trim() !== "" && field.checkValidity();
  document.getElementById(`${field.id}-err`).hidden = ok;
  field.setAttribute("aria-invalid", String(!ok));
  return ok;
}

// Once a field has shown an error, clear it as soon as the visitor fixes it
fields.forEach((field) => {
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") checkField(field);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const results = fields.map(checkField);
  if (results.includes(false)) {
    fields[results.indexOf(false)].focus();
    return;
  }
  if (form.elements._gotcha.value) return; // a bot filled in the spam trap

  const [name, email, message] = fields.map((field) => field.value.trim());

  if (!FORMSPREE_ID) {
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
    formStatus.textContent = "Your email app should open with the message filled in.";
    return;
  }

  submitButton.disabled = true;
  formStatus.textContent = "Sending...";
  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Formspree answered ${response.status}`);
    form.reset();
    formStatus.textContent = "Thanks, your message is on its way. I'll reply by email.";
  } catch {
    formStatus.textContent = `That didn't send. Try again, or email me at ${MY_EMAIL}.`;
  } finally {
    submitButton.disabled = false;
  }
});


/* 8. Footer year ----------------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

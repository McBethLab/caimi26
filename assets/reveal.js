// The blinded reveal: show Plan A, Plan B or both, then reveal which is AI.
(() => {
  const root = document.querySelector("[data-reveal]");
  if (!root) return;

  const images = root.querySelectorAll(".frame img");
  const radios = [...root.querySelectorAll('[role="radio"]')];
  const button = root.querySelector(".reveal-btn");
  const who = { a: root.querySelector('[data-who="a"]'), b: root.querySelector('[data-who="b"]') };
  const dice = root.querySelector(".dice");

  function show(view) {
    images.forEach((img) => img.classList.toggle("on", img.dataset.view === view));
    radios.forEach((r) => {
      const on = r.dataset.view === view;
      r.setAttribute("aria-checked", String(on));
      r.tabIndex = on ? 0 : -1;
    });
  }

  radios.forEach((r, i) => {
    r.addEventListener("click", () => show(r.dataset.view));
    r.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = radios[(i + step + radios.length) % radios.length];
      show(next.dataset.view);
      next.focus();
    });
  });

  button.addEventListener("click", () => {
    const revealed = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(revealed));
    button.textContent = revealed ? "Hide the answer" : "Reveal which one is AI";
    for (const side of ["a", "b"]) {
      who[side].textContent = revealed ? who[side].dataset.answer : "Hidden from the reviewer";
      who[side].classList.toggle("revealed", revealed);
    }
    dice.hidden = !revealed;
  });

  show("both");
})();

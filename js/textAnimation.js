class TextAnimator {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.factor = options.factor || 5;
    this.delay = options.delay || 0;
    this.maxMilsec = options.maxMilsec || 120;
    this.minMilsec = options.minMilsec || 20;
    this.maxCharsToAnimate = options.maxCharsToAnimate || 25;
    this.accelerationFactor = options.accelerationFactor || 0.95;
    this.randomString = "______!<>-\\/[]{}—=+*^?#";
    this.counter = -1;
    this.originalText = this.text;
    this.currentDelay = this.maxMilsec;
  }

  getRandomChar() {
    return this.randomString.charAt(
      Math.floor(Math.random() * this.randomString.length)
    );
  }

  glitch() {
    setTimeout(() => {
      this.counter++;
      if (this.counter < this.text.length) {
        const cipherChars = [...this.element.textContent];
        const charsToAnimate = Math.min(
          this.maxCharsToAnimate,
          this.text.length - this.counter
        );

        for (let i = this.counter; i < this.counter + charsToAnimate; i++) {
          if (i < cipherChars.length) {
            cipherChars[i] = this.getRandomChar();
          }
        }

        if (this.counter + 1 === this.text.length) {
          cipherChars.splice(this.text.length);
        }

        cipherChars[this.counter] = this.text[this.counter];
        this.element.textContent = cipherChars.join("");

        this.currentDelay *= this.accelerationFactor;
        if (this.currentDelay < this.minMilsec) {
          this.currentDelay = this.minMilsec;
        }

        this.glitch();
      }
    }, Math.floor(Math.random() * (this.currentDelay - this.minMilsec) + this.minMilsec));
  }

  start() {
    this.element.textContent = Array(this.text.length)
      .fill()
      .map(() => this.getRandomChar())
      .join("");

    setTimeout(() => this.glitch(), this.delay);
  }
}

function animateTextElements() {
  const elementsToAnimate = document.querySelectorAll(
    ".project-title, h1, p, span"
  );

  elementsToAnimate.forEach((element, index) => {
    const animator = new TextAnimator(element, {
      delay: index * 200,
      maxCharsToAnimate: 15,
      accelerationFactor: 0.95,
    });
    animator.start();
  });
}

const originalLoadContent = window.loadContent;
window.loadContent = async (hash) => {
  await originalLoadContent(hash);
  const elementsToAnimate = document.querySelectorAll(
    ".project-title, h1, p, span"
  );
  for (const element of elementsToAnimate) {
    if (element.textContent) {
      element.textContent = element.textContent.trim();
    }
  }
  animateTextElements();
};

document.addEventListener("DOMContentLoaded", () => {
  animateTextElements();
});

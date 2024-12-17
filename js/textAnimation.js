class TextAnimator {
  static RANDOM_CHARS = "______!<>-\\/[]{}—=+*^?#";

  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.originalText = this.text;

    const {
      factor = 5,
      delay = 0,
      maxMilsec = 80,
      minMilsec = 10,
      maxCharsToAnimate = 25,
      accelerationFactor = 0.75,
    } = options;

    this.factor = factor;
    this.delay = delay;
    this.maxMilsec = maxMilsec;
    this.minMilsec = minMilsec;
    this.maxCharsToAnimate = maxCharsToAnimate;
    this.accelerationFactor = accelerationFactor;

    this.counter = -1;
    this.currentDelay = this.maxMilsec;
  }

  getRandomChar() {
    return TextAnimator.RANDOM_CHARS.charAt(
      Math.floor(Math.random() * TextAnimator.RANDOM_CHARS.length)
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

        cipherChars[this.counter] = this.text[this.counter];

        if (this.counter + 1 === this.text.length) {
          cipherChars.length = this.text.length;
        }

        this.element.textContent = cipherChars.join("");

        this.currentDelay = Math.max(
          this.currentDelay * this.accelerationFactor,
          this.minMilsec
        );

        this.glitch();
      }
    }, Math.floor(Math.random() * (this.currentDelay - this.minMilsec) + this.minMilsec));
  }

  start() {
    this.element.textContent = this.text
      .split("")
      .map(() => this.getRandomChar())
      .join("");

    setTimeout(() => this.glitch(), this.delay);
  }
}

const visitedPages = new Set();

function animateTextElements() {
  const elementsToAnimate = document.querySelectorAll(
    ".project-title, h1, p, span"
  );

  elementsToAnimate.forEach((element, index) => {
    const animator = new TextAnimator(element, {
      delay: index * 200,
      maxCharsToAnimate: 15,
      accelerationFactor: 0.75,
    });
    animator.start();
  });
}

function wrapLoadContent(originalLoadContent) {
  return async (hash) => {
    await originalLoadContent(hash);

    if (!visitedPages.has(hash)) {
      visitedPages.add(hash);

      const elementsToAnimate = document.querySelectorAll(
        ".project-title, h1, p, span"
      );

      for (const element of elementsToAnimate) {
        if (element.textContent) {
          element.textContent = element.textContent.trim();
        }
      }

      animateTextElements();
    }
  };
}

if (window.loadContent) {
  window.loadContent = wrapLoadContent(window.loadContent);
}

document.addEventListener("DOMContentLoaded", animateTextElements);

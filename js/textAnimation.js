class TextAnimator {
  static RANDOM_CHARS =
    "______!<>-\\/[]{}—=+*^?#︎▓▒░█▄▌▐◙◘■□●○¤¦•◊αβγδσω≡≈≠≤≥×¶§▂▃▅▆▇▉▊░▒▓├┤┴┬┼┌┐└┘│";

  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.originalText = this.text;

    const {
      factor = 3,
      delay = 0,
      maxMilsec = 70,
      minMilsec = 15,
      maxCharsToAnimate = 2,
      accelerationFactor = 0.15,
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
  const elementsToAnimate = document.querySelectorAll("h1");

  elementsToAnimate.forEach((element, index) => {
    const animator = new TextAnimator(element, {
      delay: index * 250,
      maxCharsToAnimate: 4,
      accelerationFactor: 0.45,
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

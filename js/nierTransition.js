// NieR Automata-inspired screen transition
const svgNS = "http://www.w3.org/2000/svg";
const triangleCount = 5; // Increased from 3 to 5 for more triangles
let transitionActive = false;
let transitionCallback = null;

// Generate triangles for transition
function setTriangles() {
  const trianglesElement = document.getElementById("triangles");
  trianglesElement.innerHTML = "";

  // Generate denser triangle grid - basic pattern triangles
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      // Triangles pointing up
      if ((row + col) % 2 === 0) {
        const triangle = document.createElementNS(svgNS, "polygon");
        const x1 = col * 7;
        const y1 = row * 7;
        const x2 = x1 + 7;
        const y2 = y1;
        const x3 = x1 + 3.5;
        const y3 = y1 + 7;
        triangle.setAttributeNS(null, "points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
        trianglesElement.appendChild(triangle);
      } 
      // Triangles pointing down
      else {
        const triangle = document.createElementNS(svgNS, "polygon");
        const x1 = col * 7;
        const y1 = row * 7 + 7;
        const x2 = x1 + 7;
        const y2 = y1;
        const x3 = x1 + 3.5;
        const y3 = y1 - 7;
        triangle.setAttributeNS(null, "points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
        trianglesElement.appendChild(triangle);
      }
    }
  }

  // Add line intersection triangles
  for (let i = 0; i < triangleCount; i++) {
    const modoff = (100 / (triangleCount * 2) * i) + 15 * i;
    const t = 15 + ((15 * 2) * i);

    for (let j = 0; j < triangleCount * 2; j++) {
      const newpath = document.createElementNS(svgNS, "polygon");
      const m = 15 * j;
      const l = 15 + (15 * j);
      const f = 7.5 + (15 * j);
      newpath.setAttributeNS(null, "points", `${f},${t} ${m},${modoff} ${l},${modoff}`);
      trianglesElement.appendChild(newpath);
    }
  }
  
  // Add border triangles for edges
  const cornerTriangles = [
    { points: "0,0 0,15 10,15" },
    { points: "0,30 0,15 10,15" },
    { points: "0,45 0,30 10,45" },
    { points: "0,60 0,30 10,45" },
    { points: "0,60 0,75 10,75" },
    { points: "0,90 0,75 10,75" },
    { points: "0,90 10,75 20,90" },
    { points: "0,60 10,45 20,60" },
    { points: "0,30 10,15 20,30" },
    { points: "100,0 100,15 90,15" },
    { points: "100,30 100,15 90,15" },
    { points: "100,45 100,30 90,45" },
    { points: "100,60 100,30 90,45" },
    { points: "100,60 100,75 90,75" },
    { points: "100,90 100,75 90,75" },
    { points: "100,90 90,75 80,90" },
    { points: "100,60 90,45 80,60" },
    { points: "100,30 90,15 80,30" }
  ];
  
  for (const triangle of cornerTriangles) {
    const newpath = document.createElementNS(svgNS, "polygon");
    newpath.setAttributeNS(null, "points", triangle.points);
    trianglesElement.appendChild(newpath);
  }
  
  // Randomize triangle order
  $(() => {
    const parent = $("#triangles");
    const divs = parent.children();
    while (divs.length) {
      parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    }
  });
}

// Generate lines for transition
function setLines(id, isLeft) {
  const linesElement = document.getElementById(id);
  
  if (isLeft) {
    // Left side horizontal lines
    for (let i = 1; i <= 3; i++) {
      const horizontalLine = document.createElementNS(svgNS, "path");
      const t = 100 / (i + 2);
      horizontalLine.setAttributeNS(null, "d", `M100,${t} L0,${t}`);
      linesElement.appendChild(horizontalLine);
    }

    // Left side diagonal lines
    for (let i = 0; i < triangleCount; i++) {
      const diagonalLine = document.createElementNS(svgNS, "path");
      const start = (15 * i);
      const end = (15 * triangleCount) + (15 * i);
      diagonalLine.setAttributeNS(null, "d", `M${start},0 L${end},100`);
      linesElement.appendChild(diagonalLine);
    }
  } else {
    // Right side diagonal lines
    for (let i = 0; i < triangleCount; i++) {
      const diagonalLine = document.createElementNS(svgNS, "path");
      const end = (15 * i);
      const start = (15 * triangleCount) + (15 * i);
      diagonalLine.setAttributeNS(null, "d", `M${start},0 L${end},100`);
      linesElement.appendChild(diagonalLine);
    }
    
    // Right side horizontal lines
    for (let i = 1; i <= 3; i++) {
      const horizontalLine = document.createElementNS(svgNS, "path");
      const t = 100 / (i + 2);
      horizontalLine.setAttributeNS(null, "d", `M0,${t} L100,${t}`);
      linesElement.appendChild(horizontalLine);
    }

    // Reverse children for animation sequence
    $.fn.reverseChildren = function() {
      return this.each(function() {
        const $this = $(this);
        $this.children().each(function() {
          $this.prepend(this);
        });
      });
    };
    $('#lines-right').reverseChildren();
  }
}

// Begin transition animation
function startTransition(callback) {
  if (transitionActive) return;
  
  transitionActive = true;
  transitionCallback = callback;
  
  const transitionElement = document.getElementById('nier-transition');
  transitionElement.style.display = 'block';
  
  for (const line of document.querySelectorAll('.transition-lines')) {
    line.style.display = "block";
  }

  // Animate right lines - faster animation
  anime({
    targets: '#lines-right path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 400, // Reduced from 750
    delay: (el, i) => {
      return i * 40; // Reduced from 75
    },
    direction: 'alternate',
    loop: false
  });

  // Animate left lines - faster animation
  anime({
    targets: '#lines-left path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'linear',
    duration: 300, // Reduced from 500
    delay: (el, i) => {
      return i * 40; // Reduced from 75
    },
    direction: 'alternate',
    loop: false,
    complete: () => {
      // Animate triangles appearing
      anime({
        targets: '#triangles > polygon',
        opacity: 1,
        duration: 200, // Much faster appearance
        delay: anime.stagger(3, {from: 'random'}), // Random stagger for more NieR-like effect
        easing: 'easeInQuad',
        complete: () => {
          // Short pause before disappearing
          setTimeout(() => {
            // Triangles disappearing
            anime({
              targets: '#triangles > polygon',
              opacity: 0,
              duration: 200, // Fast disappearance
              delay: anime.stagger(3, {from: 'random'}), // Random stagger for disappearance
              easing: 'easeOutQuad',
              complete: () => {
                // Hide transition and execute callback
                setTimeout(() => {
                  transitionElement.style.display = 'none';
                  transitionActive = false;
                  
                  if (transitionCallback) {
                    transitionCallback();
                    transitionCallback = null;
                  }
                }, 100);
              }
            });
          }, 200); // Short pause before disappearing
        }
      });
    }
  });
}

// Initialize SVG elements on page load
document.addEventListener('DOMContentLoaded', () => {
  setLines('lines-left', true);
  setLines('lines-right', false);
  setTriangles();
});

// Export for use in router.js
window.nierTransition = {
  startTransition: startTransition
};

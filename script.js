// Helper functions
const getOrigin = () => {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
};

const getAnimationOptions = (idx) => ({
  duration: (idx + 1) * 200,
  easing: "ease-in-out",
  fill: "forwards",
});

let lastAnimationFrameId = null,
  lastAnimationTime = 0;
const moveToPoint = (point, delay = 60) => {
  try {
    const currentTime = performance.now();
    if (currentTime - lastAnimationTime < delay) return; // Throttle
    lastAnimationTime = currentTime;

    if (lastAnimationFrameId) return;

    lastAnimationFrameId = requestAnimationFrame(() => {
      nodes.forEach((node, idx) => {
        const x = point.x - node.offsetWidth / 2;
        const y = point.y - node.offsetHeight / 2;
        node.style.display = "block";
        const keyframes = {
          // transform: `translate(${x}px, ${y}px)`,
          top: `${y}px`,
          left: `${x}px`,
          // top:
        };
        node.animate(keyframes, getAnimationOptions(idx));
      });

      lastAnimationFrameId = null;
    });
  } catch (e) {
    console.error(e.message);
  }
};

const generateLemniscatePoints = ({ origin, size, noOfPoints }) => {
  const { a, b } = size;

  // Generate values of t
  const tValues = Array.from(
    { length: noOfPoints },
    (_, i) => -Math.PI / 2 + (Math.PI / noOfPoints) * i
  );

  // Calculate x and y coordinates for each value of t
  const xValues = tValues.map((t) => (a * Math.cos(t)) / (1 + Math.sin(t) ** 2));
  const yValues = tValues.map((t) => (b * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2));

  const lenmniscatePoints = Array.from({ length: noOfPoints * 2 }, (_, i) => {
    if (i < noOfPoints) {
      return {
        x: xValues[i] + origin.x,
        y: yValues[i] + origin.y,
      };
    }

    return {
      x: -xValues.at(noOfPoints - i) + origin.x,
      y: -yValues.at(noOfPoints - i) + origin.y,
    };
  });

  return lenmniscatePoints;
};

const isMobileDevice = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  return isMobile;
};

// Main code

const slug = document.getElementById("slug");
const noOfNodes = 5;
const origin = getOrigin();
const isMobile = isMobileDevice();

const nodes = Array.from({ length: noOfNodes }, (_, idx) => {
  const node = document.createElement("div");
  node.classList.add("node");
  node.style.position = "fixed";

  const size = (noOfNodes - idx) * 5;
  const x = origin.x - size / 2;
  const y = origin.y - size / 2;
  node.style.cssText = `
    position: fixed;
    --size: ${size}px;
    top: ${y}px;
    left: ${x}px;
  `;

  slug.appendChild(node);

  return node;
});

let interval;
const constant = isMobile ? 175 : 200;
const main = () => {
  clearInterval(interval);

  const lemniscatePoints = generateLemniscatePoints({
    origin: getOrigin(),
    size: {
      a: constant,
      b: constant,
    },
    noOfPoints: 20,
  });

  let index = 0;
  const delay = 60;

  interval = setInterval(() => {
    if (index >= lemniscatePoints.length) {
      index = 0;
    }

    moveToPoint(lemniscatePoints[index], delay);
    index++;
  }, delay);
};

main();

window.onresize = main;

// const followTheMouse = (e) => {
//   const x = e.clientX;
//   const y = e.clientY;

//   moveToPoint({ x, y });
// };

// document.onmousemove = followTheMouse;
// document.ontouchmove = (e) => followTheMouse(e.target[0]);

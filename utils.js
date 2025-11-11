function generateIntInRange(max) {
  return Math.floor(Math.random() * max);
}

function coinFlip() {
  return generateIntInRange(2) === 0;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export { generateIntInRange, coinFlip, delay };

export function choose(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

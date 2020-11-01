import {
    CIRCLE_COLOR_NUMBERS,
    PALETTE_NUMBERS,
} from './colors';

function choose(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

export default class GameState {
    constructor(colorCount, circleCount) {
        this.colorCount = colorCount;
        this.circleCount = circleCount;
        this.colors = CIRCLE_COLOR_NUMBERS.slice(0, this.colorCount);
        this.solution = [...Array(this.circleCount).keys()].map(
            () => choose(this.colors),
        );
        this.lines = [];
    }

    getCurrentRow() {
        return this.lines.length;
    }

    submitRow(colors) {
        if (colors.indexOf(PALETTE_NUMBERS.emptyCircle) !== -1
        || colors.length !== this.circleCount) {
            return false;
        }
        this.lines.push(colors);
        return true;
    }

    calculateNextMove() {
        // Random
        this.lines.push(
            [...Array(this.circleCount).keys()].map(
                () => choose(this.colors),
            ),
        );
    }
}

import {
    CIRCLE_COLORS,
    CIRCLE_COLOR_NUMBERS,
    PALETTE
} from "./colors";

export default class GameState {
    constructor(colorCount, circleCount) {
        this.currentRow = 0;
        this.colorCount = colorCount;
        this.circleCount = circleCount;
        this.colors = CIRCLE_COLOR_NUMBERS.slice(0, this.colorCount);
        this.solution = [];

    }
}
import {
    CIRCLE_COLOR_NUMBERS,
    PALETTE_NUMBERS,
} from './colors';

export default class GameState {
    constructor(colorCount, circleCount) {
        this.currentRow = 0;
        this.colorCount = colorCount;
        this.circleCount = circleCount;
        this.colors = CIRCLE_COLOR_NUMBERS.slice(0, this.colorCount);
        this.solution = [];
        this.lines = [];
    }

    submitRow(colors) {
        if (colors.indexOf(PALETTE_NUMBERS.emptyCircle) !== -1) {
            return false;
        }
        this.currentRow += 1;
        this.lines.push(colors);
        return true;
    }
}

import {
    CIRCLE_COLOR_NUMBERS,
    PALETTE_NUMBERS,
} from './colors';

export const result = {
    FULL_MATCH: 'full_match',
    COLOR_MATCH: 'color_match',
    NO_MATCH: 'no_match',
};

function choose(choices) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function getLineResults(line, solution) {
    return [];
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

    getResults() {
        const results = [];
        for (let lineIndex = 0; lineIndex < this.lines.length; lineIndex += 1) {
            const matchIndexes = new Set();
            const line = this.lines[lineIndex];
            // Check for full matches
            for (let i = 0; i < this.circleCount; i += 1) {
                if (line[i] === this.solution[i]) {
                    matchIndexes.add(i);
                    results.push(result.FULL_MATCH);
                }
            }
            // Check for color matches
            for (let i = 0; i < this.circleCount; i += 1) {
                if (line[i] === this.solution[i]) {
                    matchIndexes.add(i);
                    results.push(result.FULL_MATCH);
                }
            }
        }
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

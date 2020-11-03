import {
    CIRCLE_COLOR_NUMBERS,
    PALETTE_NUMBERS,
} from './colors';

import {
    choose,
} from './utils';

export const result = {
    FULL_MATCH: 'full_match',
    COLOR_MATCH: 'color_match',
    NO_MATCH: 'no_match',
};

export function getLineResults(line, solution) {
    if (line.length !== solution.length) {
        throw new Error("The line and solution don't have the same length");
    }
    const results = [];
    const lineIndexesHandled = new Set();
    const solutionIndexesHandled = new Set();

    // Check matches
    for (let solutionIndex = 0; solutionIndex < solution.length; solutionIndex += 1) {
        if (!solutionIndexesHandled.has(solutionIndex)) {
            for (let lineIndex = 0; lineIndex < line.length; lineIndex += 1) {
                // Start at the same index to test full matches first
                const testIndex = (lineIndex + solutionIndex) % line.length;
                if (!lineIndexesHandled.has(testIndex)) {
                    if (line[testIndex] === solution[solutionIndex]) {
                        lineIndexesHandled.add(testIndex);
                        solutionIndexesHandled.add(solutionIndex);
                        results.push(solutionIndex === testIndex
                            ? result.FULL_MATCH : result.COLOR_MATCH);
                        break;
                    }
                }
            }
        }
    }

    // Add missing no matches
    while (results.length < solution.length) {
        results.push(result.NO_MATCH);
    }
    return results.sort((a, b) => {
        if (a === result.FULL_MATCH || b === result.NO_MATCH) {
            return -1;
        } if (a === result.NO_MATCH || b === result.FULL_MATCH) {
            return 1;
        }
        return 0;
    });
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

    calculateResults() {
        this.results = [];
        // Calculate only missing results. Previous lines won't change
        for (let lineIndex = this.results.length; lineIndex < this.lines.length; lineIndex += 1) {
            this.results[lineIndex] = getLineResults(this.lines[lineIndex], this.solution);
        }
        return this.results;
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

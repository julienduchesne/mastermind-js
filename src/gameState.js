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
    constructor(colors, circleCount) {
        this.circleCount = circleCount;
        this.colors = colors;
        this.solution = [...Array(this.circleCount).keys()].map(
            () => choose(this.colors),
        );
        this.lines = [];
        this.validColors = colors;
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
        if (colors.length !== this.circleCount) {
            return false;
        }
        for (let i = 0; i < colors.length; i += 1) {
            if (this.colors.indexOf(colors[i]) === -1) {
                return false;
            }
        }
        this.lines.push(colors);

        // Remove invalid colors
        if (this.calculateResults()[this.results.length - 1].every((v) => v === result.NO_MATCH)) {
            colors.forEach((invalid) => {
                this.validColors = this.validColors.filter((c) => c !== invalid);
            });
        }
        return true;
    }

    solutionFound() {
        if (this.lines.length < 1) {
            return false;
        }
        return this.lines[this.lines.length - 1].toString() === this.solution.toString();
    }

    calculateNextMove() {
        if (this.lines.length === 0) {
            this.submitRow(
                [...Array(this.circleCount).keys()].map(
                    (i) => (i < this.circleCount / 2 ? this.colors[0] : this.colors[1]),
                ),
            );
            return;
        }

        const triedPermutations = [];
        for (let lineIndex = 0; lineIndex < this.lines.length; lineIndex += 1) {
            if (this.results[lineIndex].every((v) => v !== result.NO_MATCH)) {
                triedPermutations.push([...this.lines[lineIndex]]);
            }
        }

        if (triedPermutations.length > 0) {
            let permutation;
            while (permutation === undefined) {
                const newPermutation = [...triedPermutations[0]].sort(() => Math.random() - 0.5);
                if (triedPermutations.every((v) => v.toString() !== newPermutation.toString())
                ) {
                    permutation = newPermutation;
                }
            }
            this.submitRow(permutation);
            return;
        }

        this.submitRow(
            [...Array(this.circleCount).keys()].map(
                () => choose(this.validColors),
            ),
        );
    }
}

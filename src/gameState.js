/* eslint-disable no-continue */
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

    // Find full matches
    solution.forEach((solValue, solIndex) => {
        if (line[solIndex] === solValue) {
            lineIndexesHandled.add(solIndex);
            solutionIndexesHandled.add(solIndex);
            results.push(result.FULL_MATCH);
        }
    });

    // Find partial matches
    solution.forEach((solValue, solIndex) => {
        line.forEach((lineValue, lineIndex) => {
            if (solutionIndexesHandled.has(solIndex) || lineIndexesHandled.has(lineIndex)) return;
            if (solValue === lineValue) {
                lineIndexesHandled.add(lineIndex);
                solutionIndexesHandled.add(solIndex);
                results.push(result.COLOR_MATCH);
            }
        });
    });

    // Add missing no matches
    while (results.length < solution.length) {
        results.push(result.NO_MATCH);
    }
    return results;
}

function arraysEqual(v1, v2) {
    return v1.every((v, i) => v2[i] === v);
}

export default class GameState {
    constructor(colors, circleCount, solution) {
        this.circleCount = circleCount;
        this.colors = colors;
        this.solution = solution === undefined ? [...Array(this.circleCount).keys()].map(
            () => choose(this.colors),
        ) : solution;
        this.lines = [];
        this.results = [];
        this.validColors = colors;
    }

    getCurrentRow() {
        return this.lines.length;
    }

    calculateResults() {
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
        const results = this.calculateResults();
        if (results[results.length - 1].every((v) => v === result.NO_MATCH)) {
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
        const gameState = this;
        // First line
        if (this.lines.length === 0) {
            this.submitRow(
                [...Array(this.circleCount).keys()].map(
                    (i) => (i < this.circleCount / 2 ? this.colors[0] : this.colors[1]),
                ),
            );
            return;
        }

        const results = this.calculateResults();
        const colors = [...gameState.colors];
        const colorCount = colors.length;
        let start = 0;
        if (this.lastRowSubmitted !== undefined) {
            this.lastRowSubmitted.forEach((v, i) => {
                const colorIndex = colors.findIndex((color) => color === v);
                start += colorIndex * (colorCount ** i);
            });
            start += 1;
        }
        for (let i = start; i < colorCount ** this.circleCount; i += 1) {
            // Get the row from the index. Simply a base conversion
            const potentialRow = [...Array(gameState.circleCount).keys()]
                .map((rowIndex) => {
                    let colorIndex = i;
                    if (rowIndex < this.circleCount) {
                        colorIndex %= (colorCount ** (rowIndex + 1));
                    }
                    return colors[Math.floor(colorIndex / (colorCount ** rowIndex))];
                });

            // Check valid colors
            if (potentialRow.some((v) => !gameState.validColors.includes(v))) {
                continue;
            }

            // Check that the new potential row matches will all past results
            if (this.lines.some((line, lineIndex) => !arraysEqual(
                getLineResults(line, potentialRow), results[lineIndex],
            ))) {
                continue;
            }

            // Keeping the last submitted row to not loop the whole thing again
            this.lastRowSubmitted = [...potentialRow];
            this.submitRow(potentialRow);
            return;
        }
    }
}

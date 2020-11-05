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
        return true;
    }

    solutionFound() {
        if (this.lines.length < 1) {
            return false;
        }
        return this.lines[this.lines.length - 1].toString() === this.solution.toString();
    }

    calculateNextMove(strategy) {
        if (this.strategies === undefined) {
            this.strategies = new Map();

            // Random
            this.strategies.set('random', () => {
                this.submitRow(
                    [...Array(this.circleCount).keys()].map(
                        () => choose(this.colors),
                    ),
                );
            });

            // Others
        }

        this.strategies.get(strategy === undefined ? 'random' : strategy)();
    }
}

// npx babel-node -e "require('./src/gameState.js').calculateBestStrategy()"
export function calculateBestStrategy() {
    const results = {};
    for (let circleCount = 3; circleCount <= 6; circleCount += 1) {
        for (let colorCount = 3; colorCount <= 5; colorCount += 1) {
            const gameState = new GameState(
                [...Array(colorCount).keys()], circleCount,
            );
            while (!gameState.solutionFound()) {
                gameState.calculateNextMove();
            }
            results[`Circles: ${circleCount}, Colors: ${colorCount}`] = gameState.lines.length;
        }
    }
    console.log(results);
}

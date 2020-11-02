import { describe, expect, test } from '@jest/globals';
import { getLineResults, result } from './gameState';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

describe('getLineResults', () => {
    test('An empty line and solution => an empty result', () => {
        expect(getLineResults([], [])).toStrictEqual([]);
    });

    test('Line and solution without same length => error', () => {
        expect(() => getLineResults([1], [])).toThrowError("The line and solution don't have the same length");
        expect(() => getLineResults([], [1])).toThrowError("The line and solution don't have the same length");
    });

    describe('No match', () => {
    // Generate some random cases
        const cases = [];
        for (let i = 1; i < 10; i += 1) {
            const line = Array.from({ length: i }, () => getRandomInt(100));
            const solution = Array.from({ length: i }, () => getRandomInt(100) + 100);
            const expected = Array.from({ length: i }, () => result.NO_MATCH);
            cases.push([i, line, solution, expected]);
        }

        test.each(cases)('with length %i', (_length, line, solution, expected) => {
            expect(getLineResults(line, solution)).toStrictEqual(expected);
        });
    });

    describe('Full match', () => {
    // Generate some random cases
        const cases = [];
        for (let i = 1; i < 10; i += 1) {
            const line = Array.from({ length: i }, () => getRandomInt(1000));
            const expected = Array.from({ length: i }, () => result.FULL_MATCH);
            cases.push([i, line, expected]);
        }

        test.each(cases)('with length %i', (_length, line, expected) => {
            expect(getLineResults(line, line)).toStrictEqual(expected);
        });
    });

    describe('Full match one element', () => {
        test.each([
            [[1, 2, 3], [1, 4, 5]],
            [[1, 2, 3], [4, 2, 5]],
            [[1, 2, 3], [4, 5, 3]],
        ])('with line %s and solution %s', (line, solution) => {
            expect(getLineResults(line, solution))
                .toStrictEqual([result.FULL_MATCH, result.NO_MATCH, result.NO_MATCH]);
        });
    });
});

import { describe, expect, test } from '@jest/globals';
import { getLineResults, result } from './gameState';
import { getRandomInt } from './utils';

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
        for (let i = 1; i < 20; i += 1) {
            const line = Array.from({ length: i }, () => getRandomInt(100));
            const solution = Array.from({ length: i }, () => getRandomInt(100) + 100);
            const expected = Array.from({ length: i }, () => result.NO_MATCH);
            cases.push([i, line, solution, expected]);
        }

        test.each(cases)('with length %i (%s)', (_length, line, solution, expected) => {
            expect(getLineResults(line, solution)).toStrictEqual(expected);
        });
    });

    describe('Full match', () => {
    // Generate some random cases
        const cases = [];
        for (let i = 1; i < 20; i += 1) {
            const line = Array.from({ length: i }, () => getRandomInt(1000));
            const expected = Array.from({ length: i }, () => result.FULL_MATCH);
            cases.push([i, line, expected]);
        }

        test.each(cases)('with length %i (%s)', (_length, line, expected) => {
            expect(getLineResults(line, line)).toStrictEqual(expected);
        });
    });

    test('Full match with duplicates', () => {
        const line = [
            960, 206, 418, 998, 418,
            974, 218, 127, 110, 212,
            696, 960, 206, 12, 419,
            798,
        ];
        expect(getLineResults(line, line))
            .toStrictEqual(Array.from({ length: line.length }, () => result.FULL_MATCH));
    });

    describe('Full match one element', () => {
        test.each([
            [[1, 2, 3], [1, 0, 0]],
            [[1, 2, 3], [0, 2, 0]],
            [[1, 2, 3], [0, 0, 3]],
            [[3, 3, 3], [0, 0, 3]],
        ])('with line %s and solution %s', (line, solution) => {
            expect(getLineResults(line, solution))
                .toStrictEqual([result.FULL_MATCH, result.NO_MATCH, result.NO_MATCH]);
        });
    });

    describe('Only partial matches', () => {
        test.each([
            [[1, 2, 3], [3, 4, 5], [result.COLOR_MATCH, result.NO_MATCH, result.NO_MATCH]],
            [
                [1, 2, 3, 4], [3, 4, 5, 6],
                [result.COLOR_MATCH, result.COLOR_MATCH, result.NO_MATCH, result.NO_MATCH],
            ],
            [[1, 3, 2], [3, 2, 1], [result.COLOR_MATCH, result.COLOR_MATCH, result.COLOR_MATCH]],
            [[1, 1, 3], [0, 0, 1], [result.COLOR_MATCH, result.NO_MATCH, result.NO_MATCH]],
        ])('with line %s and solution %s', (line, solution, expected) => {
            expect(getLineResults(line, solution)).toStrictEqual(expected);
        });
    });

    describe('Full and partial matches', () => {
        test.each([
            [[1, 2, 3], [1, 3, 0], [result.FULL_MATCH, result.COLOR_MATCH, result.NO_MATCH]],
            [
                [4, 1, 5, 6], [0, 4, 5, 6],
                [result.FULL_MATCH, result.FULL_MATCH, result.COLOR_MATCH, result.NO_MATCH],
            ],
            [
                [1, 2, 1, 2], [1, 2, 2, 1],
                [result.FULL_MATCH, result.FULL_MATCH, result.COLOR_MATCH, result.COLOR_MATCH],
            ],
        ])('with line %s and solution %s', (line, solution, expected) => {
            expect(getLineResults(line, solution)).toStrictEqual(expected);
        });
    });
});

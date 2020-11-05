import Phaser from 'phaser';

export const PALETTE = {
    background: '#e8ded2',
    light: '#a3d2ca',
    medium: '#5eaaa8',
    dark: '#056676',
    emptyCircle: '#d3d3d3',
    fullMatchCircle: '#33cc33',
    colorMatchCircle: '#ffcc00',
};

export const PALETTE_NUMBERS = Object.fromEntries(
    Object.entries(PALETTE)
        .map(([key, val]) => [key, Phaser.Display.Color.HexStringToColor(val).color]),
);

export const CIRCLE_COLORS = [
    '#fe5e5e',
    '#fead5e',
    '#f2ed5d',
    '#b3ff5f',
    '#5fff80',
    '#5fffe1',
    '#5fcfff',
    '#5f79ff',
    '#975fff',
    '#e65fff',
    '#aaaaaa',
    '#e9e9cb',
];

export const CIRCLE_COLOR_NUMBERS = CIRCLE_COLORS.map(
    (color) => Phaser.Display.Color.HexStringToColor(color).color,
);

import toHex from 'colornames';
import Phaser from 'phaser';
import {
    CIRCLE_COLOR_NUMBERS,
    PALETTE,
} from '../colors';

export default class ConfigScene extends Phaser.Scene {
    constructor() {
        super('ConfigScene');
    }

    configText(x, y, text) {
        return this.add.text(x, y, text, {
            color: PALETTE.medium,
            fontSize: 30,
            fontFamily: 'Bangers',
        }).setPadding(5, 5).setOrigin(0, 0.5);
    }

    drawCircles(count, x, y, width, colors = true) {
        const group = this.add.group();
        for (let i = 0; i < count; i += 1) {
            const color = colors ? CIRCLE_COLOR_NUMBERS[i] : 0xffffff;
            group.add(this.add.circle(x + i * 20, y, 20, color).setStrokeStyle(2, toHex('black')).setAlpha(1));
        }
        x += (width / count) / 2;
        const halfWidth = width / 2;
        const line = new Phaser.Geom.Line(x - halfWidth, y, x + halfWidth, y);
        Phaser.Actions.PlaceOnLine(group.getChildren(), line);
        return group;
    }

    addCountConfig(y, text, defaultValue, min, max, coloredCircled) {
        const scene = this;

        // Number of colors
        this.configText(150, y, text);
        const countText = this.configText(650, y, (defaultValue - 1).toString());
        let circles = null;
        const getChangeColorCount = (change) => () => {
            const newCount = Math.max(min, Math.min(parseInt(countText.text, 10) + change, max));
            countText.setText(newCount);
            if (circles) {
                circles.destroy(true);
            }
            circles = scene.drawCircles(newCount, scene.cameras.main.width / 2, y + 75, newCount * 50, coloredCircled);
        };
        this.configText(600, y, '◀').setInteractive().on('pointerdown', getChangeColorCount(-1));
        this.configText(700, y, '▶').setInteractive().on('pointerdown', getChangeColorCount(+1)).emit('pointerdown');

        return countText;
    }

    create() {
        const halfWidth = this.cameras.main.width / 2;
        this.add.text(halfWidth, 100, 'Configuration').setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5)
            .setFontFamily('Bangers')
            .setPadding(10, 10);

        const colorCountText = this.addCountConfig(200, 'Number of Possible Colors:', 6, 2, 12, true);
        const circleCountText = this.addCountConfig(400, 'Number of Circles to Guess:', 4, 3, 6, false);

        this.add.text(halfWidth, 800, 'START').setFontSize(60).setPadding(10, 10).setFontFamily('Bangers')
            .setColor(PALETTE.dark)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', function () {
                this.scene.scene.start('GameScene', { colorCount: parseInt(colorCountText.text, 10), circleCount: parseInt(circleCountText.text, 10) });
            });
    }
}

import Phaser from 'phaser';
import {
    CIRCLE_COLOR_NUMBERS,
    PALETTE,
} from '../colors';

export default class SplashScene extends Phaser.Scene {
    constructor() {
        super('SplashScene');
    }

    preload() {
        // Loaded for all future pages
        this.load.rexWebFont({
            google: {
                families: ['Bangers'],
            },
        });
    }

    create() {
        const scene = this;

        // Create circle of balls
        this.ballGroup = this.add.group();
        this.circleRadius = 350;
        this.halfWidth = this.cameras.main.width / 2;
        this.centerPoint = new Phaser.Geom.Point(this.halfWidth);
        for (let i = 0; i < 40; i += 1) {
            const color = CIRCLE_COLOR_NUMBERS[i % CIRCLE_COLOR_NUMBERS.length];
            this.ballGroup.add(this.add.circle(0, 0, 20, color)
                .setStrokeStyle(2, 0x000000).setAlpha(1));
        }
        const circle = new Phaser.Geom.Circle(this.halfWidth, this.halfWidth, this.circleRadius);
        Phaser.Actions.PlaceOnCircle(this.ballGroup.getChildren(), circle);

        // Create title
        this.add.text(this.halfWidth, 350, 'Mastermind Phaser').setFontSize(75).setStroke(PALETTE.dark, 6).setPadding(10, 10)
            .setFontFamily('Bangers')
            .setColor(PALETTE.light)
            .setOrigin(0.5);
        const startText = this.add.text(this.halfWidth, 500, 'Click to start!').setFontSize(60).setPadding(10, 10).setFontFamily('Bangers')
            .setColor(PALETTE.dark)
            .setOrigin(0.5);
        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 500,
            repeat: 250,
            yoyo: true,
        });

        this.input.on('pointerdown', () => {
            scene.scene.start('ConfigScene', {});
        });
    }

    update() {
        Phaser.Actions.RotateAroundDistance(
            this.ballGroup.getChildren(), this.centerPoint, 0.005, this.circleRadius,
        );
    }
}

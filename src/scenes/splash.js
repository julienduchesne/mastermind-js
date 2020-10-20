import toHex from "colornames";
import {
    CIRCLE_COLORS,
    PALETTE
} from "../colors";

export default class SplashScene extends Phaser.Scene {

    constructor() {
        super('SplashScene');
    }

    preload() {
        // Loaded for all future pages
        this.load.rexWebFont({
            google: {
                families: ['Bangers']
            }
        });
    }

    create() {
        // Create circle of balls
        this.ballGroup = this.add.group();
        this.circleRadius = 350;
        this.halfWidth = this.cameras.main.width / 2;
        this.centerPoint = new Phaser.Geom.Point(this.halfWidth);
        for (var i = 0; i < 40; i++) {
            var color = Phaser.Display.Color.HexStringToColor(CIRCLE_COLORS[i % CIRCLE_COLORS.length]).color;
            this.ballGroup.add(this.add.circle(0, 0, 20, color).setStrokeStyle(2, toHex("black")).setAlpha(1));
        }
        var circle = new Phaser.Geom.Circle(this.halfWidth, this.halfWidth, this.circleRadius);
        Phaser.Actions.PlaceOnCircle(this.ballGroup.getChildren(), circle);

        // Create title
        this.add.text(this.halfWidth, 350, 'Mastermind Phaser').setFontSize(75).setStroke(PALETTE.dark, 6).setPadding(10, 10).setFontFamily("Bangers").setColor(PALETTE.light).setOrigin(0.5);
        var startText = this.add.text(this.halfWidth, 500, 'Click to start!').setFontSize(60).setPadding(10, 10).setFontFamily("Bangers").setColor(PALETTE.dark).setOrigin(0.5);
        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 500,
            repeat: 250,
            yoyo: true
        });

        this.input.on('pointerdown', function () {
            this.scene.scene.start("ConfigScene", {})
        });
    }

    update() {
        Phaser.Actions.RotateAroundDistance(this.ballGroup.getChildren(), this.centerPoint, 0.005, this.circleRadius);
    }
}
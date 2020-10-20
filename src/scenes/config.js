import toHex from "colornames";
import {
    CIRCLE_COLORS,
    PALETTE
} from "../colors";

export default class ConfigScene extends Phaser.Scene {

    constructor() {
        super('ConfigScene');
    }



    configText(x, y, text) {
        return this.add.text(x, y, text).setColor(PALETTE.medium).setFontSize(30).setFontFamily("Bangers").setPadding(5, 5).setOrigin(0, 0.5);
    }

    drawCircles(count, x, y, width) {
        var group = this.add.group();
        for (var i = 0; i < count; i++) {
            var color = Phaser.Display.Color.HexStringToColor(CIRCLE_COLORS[i]).color;
            group.add(this.add.circle(x + i * 20, y, 20, color).setStrokeStyle(2, toHex("black")).setAlpha(1));
        }
        x += (width / count) / 2;
        var halfWidth = width / 2;
        var line = new Phaser.Geom.Line(x - halfWidth, y, x + halfWidth, y);
        Phaser.Actions.PlaceOnLine(group.getChildren(), line);
        return group;
    }

    preload() {
        this.load.rexWebFont({
            google: {
                families: ['Bangers']
            }
        });
    }


    create() {
        this.cameras.main.setBackgroundColor(PALETTE.background);
        var halfWidth = this.cameras.main.width / 2;
        this.add.text(halfWidth, 100, 'Configuration').setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10);

        // Number of colors
        this.configText(150, 200, 'Number of Colors:');
        var colorCountText = this.configText(650, 200, '4');
        var circles = null;
        var getChangeColorCount = function (change) {
            return function () {
                var newCount = Math.max(2, Math.min(parseInt(colorCountText.text) + change, 12));
                colorCountText.setText(newCount);
                if (circles) {
                    circles.destroy(true);
                }
                circles = this.scene.drawCircles(newCount, this.scene.cameras.main.width / 2, 275, newCount * 25);
            }
        }
        this.configText(600, 200, '◀').setInteractive().on("pointerdown", getChangeColorCount(-1));
        this.configText(700, 200, '▶').setInteractive().on("pointerdown", getChangeColorCount(+1)).emit("pointerdown");


        this.add.text(halfWidth, 800, 'START').setFontSize(60).setPadding(10, 10).setFontFamily("Bangers").setColor(PALETTE.dark).setOrigin(0.5).setInteractive().on('pointerdown', function () {
            this.scene.scene.start("GameScene", {})
        });
    }


}
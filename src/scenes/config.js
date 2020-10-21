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

    drawCircles(count, x, y, width, colors = true) {
        var group = this.add.group();
        for (var i = 0; i < count; i++) {
            var color = Phaser.Display.Color.HexStringToColor(colors ? CIRCLE_COLORS[i] : toHex("white")).color;
            group.add(this.add.circle(x + i * 20, y, 20, color).setStrokeStyle(2, toHex("black")).setAlpha(1));
        }
        x += (width / count) / 2;
        var halfWidth = width / 2;
        var line = new Phaser.Geom.Line(x - halfWidth, y, x + halfWidth, y);
        Phaser.Actions.PlaceOnLine(group.getChildren(), line);
        return group;
    }

    addCountConfig(y, text, defaultValue, min, max, coloredCircled) {
        // Number of colors
        this.configText(150, y, text);
        var countText = this.configText(650, y, (defaultValue - 1).toString());
        var circles = null;
        var getChangeColorCount = function (change) {
            return function () {
                var newCount = Math.max(min, Math.min(parseInt(countText.text) + change, max));
                countText.setText(newCount);
                if (circles) {
                    circles.destroy(true);
                }
                circles = this.scene.drawCircles(newCount, this.scene.cameras.main.width / 2, y + 75, newCount * 50, coloredCircled);
            }
        }
        this.configText(600, y, '◀').setInteractive().on("pointerdown", getChangeColorCount(-1));
        this.configText(700, y, '▶').setInteractive().on("pointerdown", getChangeColorCount(+1)).emit("pointerdown");

        return countText
    }

    preload() { }
    create() {
        var halfWidth = this.cameras.main.width / 2;
        this.add.text(halfWidth, 100, 'Configuration').setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10);

        var colorCountText = this.addCountConfig(200, 'Number of Possible Colors:', 6, 2, 12, true)
        var circleCountText = this.addCountConfig(400, 'Number of Circles to Guess:', 4, 3, 6, false)

        this.add.text(halfWidth, 800, 'START').setFontSize(60).setPadding(10, 10).setFontFamily("Bangers").setColor(PALETTE.dark).setOrigin(0.5).setInteractive().on('pointerdown', function () {
            this.scene.scene.start("GameScene", { colorCount: parseInt(colorCountText.text), circleCount: parseInt(circleCountText.text) })
        });
    }


}
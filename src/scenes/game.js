import {
    CIRCLE_COLORS,
    PALETTE
} from "../colors";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() { }
    create() {
        var colorCount = this.scene.settings.data["colorCount"];
        var circleCount = this.scene.settings.data["circleCount"];
        new Anchor(
            this.add.text(0, 0, "Restart").setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10)
                .setInteractive().on('pointerdown', function () { this.scene.scene.start("ConfigScene", {}) }),
            { left: "left+50", top: "top+10" }
        );
        new Anchor(
            this.add.text(0, 0, "Guess for me").setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10)
                .setInteractive().on('pointerdown', function () { alert("Not implemented") }),
            { right: "right-50", top: "top+10" }
        );

        var spaceBetweenCircles = 20;
        var spaceBetweenLines = 40;
        var circleRadius = 20;
        var rowHeight = 2 * spaceBetweenCircles + 2 * circleRadius;
        var numberOfInitialRows = Math.floor(((this.cameras.main.height - 100) / rowHeight));

        function CreateGrid(scene, colCount, rowCount) {
            var sizer = scene.rexUI.add.fixWidthSizer({
                width: (2 * circleRadius + spaceBetweenCircles) * circleCount + 120,
                orientation: 0,
                space: {
                    left: 0, right: 0, top: 0, bottom: 0,
                    item: spaceBetweenCircles, line: spaceBetweenLines
                },
            });

            for (var i = 0; i < rowCount; i++) {
                for (var j = 0; j < colCount; j++) {
                    sizer.add(
                        scene.add.circle(0, 0, circleRadius, Phaser.Display.Color.HexStringToColor(PALETTE.emptyCirle).color).setStrokeStyle(1, PALETTE.dark)
                    );
                }
                sizer.add(
                    scene.rexUI.add.roundRectangle(0, 0, 100, circleRadius * 2, 10, Phaser.Display.Color.HexStringToColor(PALETTE.light).color)
                );
            }
            return sizer
        }

        var scrollablePanel = this.rexUI.add.scrollablePanel({
            anchor: {
                centerX: "center",
                bottom: "bottom+0"
            },
            height: this.cameras.main.height - 100,

            scrollMode: 0,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, Phaser.Display.Color.HexStringToColor(PALETTE.background).color),

            panel: {
                child: CreateGrid(this, circleCount, numberOfInitialRows),

                mask: {
                    mask: true,
                    padding: 1
                },
            },

            // We'll create the slider when we don't have enough space anymore
            // {
            //     track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, Phaser.Display.Color.HexStringToColor(PALETTE.dark).color),
            //     thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, Phaser.Display.Color.HexStringToColor(PALETTE.light).color),
            // }
            slider: false,
            scroller: false,

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
            },

        }).layout();
    }
}
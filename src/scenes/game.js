import {
    CIRCLE_COLORS,
    PALETTE
} from "../colors";
import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';

var spaceBetweenItems = 20;
var spaceBetweenLines = 40;
var itemWidth = 40;
var circleRadius = itemWidth / 2;
var rowHeight = 2 * spaceBetweenItems + 2 * circleRadius;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.currentRow = 0;
    }

    preload() {
        this.colorCount = this.scene.settings.data["colorCount"];
        this.colors = CIRCLE_COLORS.slice(0, this.colorCount);
        this.circleCount = this.scene.settings.data["circleCount"];
    }

    create() {
        new Anchor(
            this.add.text(0, 0, "Restart").setColor(PALETTE.dark).setFontSize(52).setFontFamily("Bangers").setPadding(10, 10)
                .setInteractive().on('pointerdown', function () { this.scene.scene.start("ConfigScene", {}) }),
            { left: "left+50", top: "top+10" }
        );
        new Anchor(
            this.add.text(0, 0, "Guess for me").setColor(PALETTE.dark).setFontSize(52).setFontFamily("Bangers").setPadding(10, 10)
                .setInteractive().on('pointerdown', function () { alert("Not implemented") }),
            { right: "right-50", top: "top+10" }
        );


        var numberOfInitialRows = Math.floor(((this.cameras.main.height - 100) / rowHeight));
        var scrollablePanel = this.rexUI.add.scrollablePanel({
            anchor: {
                centerX: "center",
                bottom: "bottom+0"
            },
            height: this.cameras.main.height - 100,
            scrollMode: 0,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, Phaser.Display.Color.HexStringToColor(PALETTE.background).color),
            panel: {
                child: this.createGrid(numberOfInitialRows),
                mask: { mask: true, padding: 1 },
            },
            space: { left: 10, right: 10, top: 10, bottom: 10, panel: 10 },

            // We'll create the slider when we don't have enough space anymore
            // {
            //     track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, Phaser.Display.Color.HexStringToColor(PALETTE.dark).color),
            //     thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, Phaser.Display.Color.HexStringToColor(PALETTE.light).color),
            // }
            slider: false,
            scroller: false,

        }).layout();
    }


    createGrid(rowCount) {
        var scene = this;

        // Creates a text label with no background. It's bounded by a circle so the text is well centered
        function createTextLabel(text, fontSize) {
            return scene.rexUI.add.label({
                width: itemWidth,
                height: itemWidth,
                background: scene.add.circle(0, 0, circleRadius, Phaser.Display.Color.HexStringToColor(PALETTE.background).color),
                text: scene.add.text(0, 0, text, {
                    color: PALETTE.medium,
                    fontSize: fontSize,
                    fontFamily: "Bangers",
                    padding: { left: 5, right: 5, top: 5, bottom: 5, },
                }),
                align: "center"
            })
        }

        var sizer = this.rexUI.add.fixWidthSizer({
            // Space for circle + Space for result sheet + Space for line number + Space for submit button
            width: (itemWidth + spaceBetweenItems) * this.circleCount + 120 + (itemWidth + 20) * 2,
            orientation: 0,
            space: {
                left: 0, right: 0, top: 0, bottom: 0,
                item: spaceBetweenItems, line: spaceBetweenLines
            },
        });

        for (var i = rowCount - 1; i >= 0; i--) {
            // Line number
            sizer.add(createTextLabel(`${i + 1}`, circleRadius * 1.5));

            // Game circles
            for (var j = 0; j < this.circleCount; j++) {
                sizer.add(
                    this.add.circle(0, 0, circleRadius, Phaser.Display.Color.HexStringToColor(PALETTE.emptyCirle).color).setStrokeStyle(1, PALETTE.dark)
                );
            }

            // Submit button
            sizer.add(
                this.currentRow == i ?
                    createTextLabel("✔️", circleRadius) :
                    createTextLabel("", circleRadius)
            );

            // Result sheet
            sizer.add(
                this.rexUI.add.roundRectangle(0, 0, 100, itemWidth, 10, Phaser.Display.Color.HexStringToColor(PALETTE.light).color)
            );
        }
        return sizer
    }
}


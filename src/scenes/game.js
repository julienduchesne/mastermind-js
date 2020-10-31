import {
    CIRCLE_COLORS,
    PALETTE,
    PALETTE_NUMBERS
} from "../colors";
import GameState from '../gameState'

import Anchor from 'phaser3-rex-plugins/plugins/anchor.js';
import FadeOutDestroy from 'phaser3-rex-plugins/plugins/fade-out-destroy.js';

var SPACE_BETWEEN_ITEMS = 20;
var SPACE_BETWEEN_LINES = 40;
var ITEM_WIDTH = 40;
var CIRCLE_RADIUS = ITEM_WIDTH / 2;
var ROW_HEIGHT = 2 * SPACE_BETWEEN_ITEMS + 2 * CIRCLE_RADIUS;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.gameState = new GameState(this.scene.settings.data["colorCount"], this.scene.settings.data["circleCount"]);
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

        this.drawPanel(null);
    }

    drawPanel(rowCount) {
        if (this.scrollablePanel !== undefined) {
            this.scrollablePanel.destroy();
        }

        var numberOfInitialRows = Math.floor(((this.cameras.main.height - 100) / ROW_HEIGHT));
        if (rowCount == null) {
            rowCount = numberOfInitialRows;
        }
        var shouldScroll = rowCount > numberOfInitialRows;

        this.scrollablePanel = this.rexUI.add.scrollablePanel({
            anchor: {
                centerX: "center",
                bottom: "bottom+0"
            },
            height: this.cameras.main.height - 100,
            scrollMode: 0,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, PALETTE_NUMBERS.background),
            panel: {
                child: this.createGrid(rowCount),
                mask: { mask: true, padding: 1 },
            },
            space: { left: 10, right: 10, top: 10, bottom: 10, panel: 10 },

            slider: shouldScroll ? {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, PALETTE_NUMBERS.dark),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, PALETTE_NUMBERS.light),
            } : false,
            scroller: false,

        }).layout();
    }


    createGrid(rowCount) {
        var scene = this;

        // Creates a text label with no background. It's bounded by a circle so the text is well centered
        function createTextLabel(text, fontSize) {
            return scene.rexUI.add.label({
                width: ITEM_WIDTH,
                height: ITEM_WIDTH,
                background: scene.add.circle(0, 0, CIRCLE_RADIUS, PALETTE_NUMBERS.background),
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
            width: (ITEM_WIDTH + SPACE_BETWEEN_ITEMS) * this.gameState.circleCount + 120 + (ITEM_WIDTH + 20) * 2,
            orientation: 0,
            space: {
                left: 0, right: 0, top: 0, bottom: 0,
                item: SPACE_BETWEEN_ITEMS, line: SPACE_BETWEEN_LINES
            },
        });

        var currentRowCircles = [];

        for (var i = rowCount - 1; i >= 0; i--) {
            var isCurrentRow = this.gameState.currentRow == i;
            // Line number
            sizer.add(createTextLabel(`${i + 1}`, CIRCLE_RADIUS * 1.5));

            // Game circles
            for (var j = 0; j < this.gameState.circleCount; j++) {
                var circle = this.add.circle(0, 0, CIRCLE_RADIUS, PALETTE_NUMBERS.emptyCirle).setStrokeStyle(1, PALETTE.dark);
                if (isCurrentRow) {
                    currentRowCircles.push(circle);
                    circle.setInteractive().on("pointerdown", (function (parent) {
                        return function () {
                            if (scene.currentDialog !== undefined) {
                                return;
                            }

                            function destroyCurrentDialog() {
                                FadeOutDestroy(scene.currentDialogBackground, 100);
                                scene.currentDialog.scaleDownDestroy(100);
                                scene.currentDialog = undefined;
                            }

                            // Darken the screen. When clicking that background, kill the dialog
                            scene.currentDialogBackground = scene.add.rectangle(scene.cameras.main.width / 2, scene.cameras.main.height / 2, scene.cameras.main.width, scene.cameras.main.height, 0x000000, 0.75)
                                .setInteractive().on("pointerdown", function (pointer) {
                                    if (!scene.currentDialog.isInTouching(pointer)) {
                                        destroyCurrentDialog();
                                    }
                                });
                            scene.currentDialog = scene.createColorSelectionDialog(this.x, this.y, function (color) {
                                parent.setFillStyle(color);
                                destroyCurrentDialog();
                            });
                        }
                    })(circle));
                }
                sizer.add(circle);
            }

            // Submit button
            sizer.add(
                this.gameState.currentRow == i ?
                    createTextLabel("✔️", CIRCLE_RADIUS).setInteractive().on("pointerdown", function () {
                        scene.gameState.currentRow += 1;
                        // This is in no way efficient. The whole board is being redrawn every time. ¯\_(ツ)_/¯
                        scene.drawPanel(Math.max(rowCount, scene.gameState.currentRow + 2));
                    }) :
                    createTextLabel("", CIRCLE_RADIUS)
            );

            // Result sheet
            sizer.add(
                this.rexUI.add.roundRectangle(0, 0, 100, ITEM_WIDTH, 10, PALETTE_NUMBERS.light)
            );
        }
        return sizer
    }


    createColorSelectionDialog(x, y, onClick) {
        var scene = this;
        var dialog = this.rexUI.add.dialog({
            x: x,
            y: y,

            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, PALETTE_NUMBERS.background),

            title: this.rexUI.add.label({
                text: this.add.text(0, 0, "Pick a color ", {
                    fontSize: 30,
                    fontFamily: "Bangers",
                    color: PALETTE.dark,
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 5,
                    bottom: 5
                }
            }),

            actions: function (colors) {
                var colorCircles = [];
                for (var i = 0; i < colors.length; i++) {
                    colorCircles.push(scene.add.circle(0, 0, 20, colors[i]));
                }
                return colorCircles
            }(this.gameState.colors),

            actionsAlign: 'left',

            space: {
                title: 10,
                action: 5,

                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        })
            .layout()
            .pushIntoBounds()
            .popUp(500);

        dialog
            .on('button.click', function (button, groupName, index) {
                onClick(button.fillColor);
            })
            .on('button.over', function (button, groupName, index) {
                button.setStrokeStyle(2, 0xffffff);
            })
            .on('button.out', function (button, groupName, index) {
                button.setStrokeStyle();
            });

        return dialog;
    }
}


import Phaser from 'phaser';
import FadeOutDestroy from 'phaser3-rex-plugins/plugins/fade-out-destroy';
import {
    CIRCLE_COLOR_NUMBERS,
    PALETTE,
    PALETTE_NUMBERS,
} from '../colors';
import GameState, { result } from '../gameState';

const SPACE_BETWEEN_ITEMS = 20;
const SPACE_BETWEEN_LINES = 40;
const ITEM_WIDTH = 40;
const CIRCLE_RADIUS = ITEM_WIDTH / 2;
const ROW_HEIGHT = 2 * SPACE_BETWEEN_ITEMS + 2 * CIRCLE_RADIUS;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.gameState = new GameState(this.scene.settings.data.colorCount,
            this.scene.settings.data.circleCount);
    }

    create() {
        this.textMetrics = {};
        this.plugins.get('rexAnchor').add(
            this.add.text(0, 0, 'Restart').setColor(PALETTE.dark).setFontSize(52).setFontFamily('Bangers')
                .setPadding(10, 10)
                .setInteractive()
                .on('pointerdown', () => { this.scene.start('ConfigScene', {}); }),
            { left: 'left+50', top: 'top+10' },
        );
        this.plugins.get('rexAnchor').add(
            this.add.text(0, 0, 'Guess for me').setColor(PALETTE.dark).setFontSize(52).setFontFamily('Bangers')
                .setPadding(10, 10)
                .setInteractive()
                .on('pointerdown', () => {
                    if (this.gameState.solutionFound()) { return; }
                    this.gameState.calculateNextMove();
                    this.drawPanel();
                }),
            { right: 'right-50', top: 'top+10' },
        );

        this.drawPanel();
    }

    drawPanel() {
        if (this.scrollablePanel !== undefined) {
            this.scrollablePanel.destroy();
        }

        const numberOfInitialRows = Math.floor(((this.cameras.main.height - 100) / ROW_HEIGHT));
        const rowCount = Math.max(numberOfInitialRows, this.gameState.getCurrentRow() + 2);
        const shouldScroll = rowCount > numberOfInitialRows;

        this.scrollablePanel = this.rexUI.add.scrollablePanel({
            anchor: {
                centerX: 'center',
                bottom: 'bottom+0',
            },
            height: this.cameras.main.height - 100,
            scrollMode: 0,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, PALETTE_NUMBERS.background),
            panel: {
                child: this.createGrid(rowCount),
                mask: { mask: true, padding: 1 },
            },
            space: {
                left: 10, right: 10, top: 10, bottom: 10, panel: 10,
            },

            slider: shouldScroll ? {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, PALETTE_NUMBERS.dark),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, PALETTE_NUMBERS.light),
            } : false,
            scroller: false,

        }).layout();

        // Game won text
        if (this.gameState.solutionFound()) {
            const winTextGroup = this.add.group();
            winTextGroup.add(this.add.rectangle(
                this.cameras.main.width / 2, this.cameras.main.height / 2,
                this.cameras.main.width, this.cameras.main.height, 0x000000, 0.75,
            ).setInteractive().on('pointerdown', () => { winTextGroup.destroy(true); }));
            const winText = this.add.text(0, 0, 'You have won! Click to continue!').setColor(PALETTE.light)
                .setFontSize(52).setFontFamily('Bangers')
                .setPadding(10, 10);
            winTextGroup.add(winText);
            this.plugins.get('rexAnchor').add(winText, { centerX: 'center', centerY: 'center' });
        }
    }

    createGrid(rowCount) {
        const scene = this;
        const sizer = this.rexUI.add.fixWidthSizer({
            // Space for circle + result sheet + line number + submit button
            width: (ITEM_WIDTH + SPACE_BETWEEN_ITEMS) * this.gameState.circleCount
            + 120 + (ITEM_WIDTH + 20) * 2,
            orientation: 0,
            space: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                item: SPACE_BETWEEN_ITEMS,
                line: SPACE_BETWEEN_LINES,
            },
        });

        const currentRowCircles = [];

        for (let i = rowCount - 1; i >= 0; i -= 1) {
            const isPastRow = i < this.gameState.getCurrentRow();
            const isCurrentRow = this.gameState.getCurrentRow() === i;
            // Line number
            sizer.add(scene.createTextLabel(`${i + 1}`, CIRCLE_RADIUS * 1.5));

            // Game circles
            for (let j = 0; j < this.gameState.circleCount; j += 1) {
                const circleColor = isPastRow
                    ? this.gameState.lines[i][j]
                    : PALETTE_NUMBERS.emptyCircle;

                const circle = this.add.circle(0, 0, CIRCLE_RADIUS, circleColor)
                    .setStrokeStyle(1, PALETTE.dark);
                if (isCurrentRow) {
                    currentRowCircles.push(circle);
                    circle.setInteractive().on('pointerdown', ((parent) => () => {
                        if (scene.gameState.solutionFound()) {
                            return;
                        }

                        if (scene.currentDialog !== undefined) {
                            return;
                        }

                        function destroyCurrentDialog() {
                            FadeOutDestroy(scene.currentDialogBackground, 100);
                            scene.currentDialog.scaleDownDestroy(100);
                            scene.currentDialog = undefined;
                        }

                        // Darken the screen with a background rectangle
                        // When clicking that background, kill the dialog
                        scene.currentDialogBackground = scene.add.rectangle(
                            scene.cameras.main.width / 2, scene.cameras.main.height / 2,
                            scene.cameras.main.width, scene.cameras.main.height, 0x000000, 0.75,
                        )
                            .setInteractive().on('pointerdown', (pointer) => {
                                if (!scene.currentDialog.isInTouching(pointer)) {
                                    destroyCurrentDialog();
                                }
                            });
                        scene.currentDialog = scene.createColorSelectionDialog(
                            parent.x, parent.y, (color) => {
                                parent.setFillStyle(color);
                                destroyCurrentDialog();
                            },
                        );
                    })(circle));
                }
                sizer.add(circle);
            }

            // Submit button
            sizer.add(
                this.gameState.getCurrentRow() === i && !this.gameState.solutionFound()
                    ? scene.createTextLabel('✔️', CIRCLE_RADIUS).setInteractive().on('pointerdown', () => {
                        const circleColors = currentRowCircles.map((circle) => circle.fillColor);
                        if (scene.gameState.submitRow(circleColors)) {
                            // This is in no way efficient
                            // The whole board is being redrawn every time. ¯\_(ツ)_/¯
                            scene.drawPanel();
                        }
                    })
                    : scene.add.circle(0, 0, CIRCLE_RADIUS, CIRCLE_COLOR_NUMBERS.background),
            );

            // Result sheet
            if (isPastRow) {
                const results = this.gameState.calculateResults()[i];
                const ok = results.filter((x) => x === result.FULL_MATCH).length;
                const colorOk = results.filter((x) => x === result.COLOR_MATCH).length;
                sizer.add(
                    this.rexUI.add.label({
                        width: 100,
                        height: ITEM_WIDTH,
                        background: this.rexUI.add.roundRectangle(0, 0, 100, ITEM_WIDTH, 10,
                            PALETTE_NUMBERS.light),
                        text: scene.add.text(0, 0, `${ok}-${colorOk}`, {
                            color: PALETTE.medium,
                            fontSize: 30,
                            fontFamily: 'Bangers',
                            padding: {
                                left: 5, right: 5, top: 5, bottom: 5,
                            },
                            metrics: scene.textMetrics[30],
                        }),
                        align: 'center',
                    }),
                );
            } else {
                sizer.add(this.rexUI.add.roundRectangle(0, 0, 100, ITEM_WIDTH, 10,
                    PALETTE_NUMBERS.background));
            }
        }
        return sizer;
    }

    // Creates a text label with no background. It's bounded by a circle so the text is centered
    createTextLabel(text, fontSize) {
        const label = this.rexUI.add.label({
            width: ITEM_WIDTH,
            height: ITEM_WIDTH,
            background: this.add.circle(0, 0, CIRCLE_RADIUS, PALETTE_NUMBERS.background),
            text: this.add.text(0, 0, text, {
                color: PALETTE.medium,
                fontSize,
                fontFamily: 'Bangers',
                padding: {
                    left: 5, right: 5, top: 5, bottom: 5,
                },
                metrics: this.textMetrics[fontSize],
            }),
            align: 'center',
        });
        if (this.textMetrics[fontSize] === undefined) {
            this.textMetrics[fontSize] = label.childrenMap.text.getTextMetrics();
        }
        return label;
    }

    createColorSelectionDialog(x, y, onClick) {
        const scene = this;
        const dialog = this.rexUI.add.dialog({
            x,
            y,

            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20,
                PALETTE_NUMBERS.background),

            title: this.rexUI.add.label({
                text: this.add.text(0, 0, 'Pick a color ', {
                    fontSize: 30,
                    fontFamily: 'Bangers',
                    color: PALETTE.dark,
                    metrics: this.textMetrics[30],
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 5,
                    bottom: 5,
                },
            }),

            actions: ((colors) => {
                const colorCircles = [];
                for (let i = 0; i < colors.length; i += 1) {
                    colorCircles.push(scene.add.circle(0, 0, 20, colors[i]));
                }
                return colorCircles;
            })(this.gameState.colors),

            actionsAlign: 'left',

            space: {
                title: 10,
                action: 5,

                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        })
            .layout()
            .pushIntoBounds()
            .popUp(500);

        dialog
            .on('button.click', (button) => {
                onClick(button.fillColor);
            })
            .on('button.over', (button) => {
                button.setStrokeStyle(2, 0xffffff);
            })
            .on('button.out', (button) => {
                button.setStrokeStyle();
            });

        return dialog;
    }
}

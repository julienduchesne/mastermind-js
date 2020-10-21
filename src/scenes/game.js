import {
    CIRCLE_COLORS,
    PALETTE
} from "../colors";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() { }
    create() {
        console.log(this)
        var halfWidth = this.cameras.main.width / 2;
        this.add.text(halfWidth, 100, 'The Game [WIP]').setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10);
        this.add.text(halfWidth, 200, 'Color count: ' + this.scene.settings.data["colorCount"]).setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10);
        this.add.text(halfWidth, 300, 'Circle count: ' + this.scene.settings.data["circleCount"]).setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10);
    }
}
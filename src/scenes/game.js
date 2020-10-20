import {
    CIRCLE_COLORS,
    PALETTE
} from "../colors";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {

    }
    create() {
        this.cameras.main.setBackgroundColor(PALETTE.background);
        var halfWidth = this.cameras.main.width / 2;
        this.add.text(halfWidth, 100, 'The Game').setColor(PALETTE.dark).setFontSize(52).setOrigin(0.5).setFontFamily("Bangers").setPadding(10, 10);
    }
}
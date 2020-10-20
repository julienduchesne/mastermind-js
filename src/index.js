import Phaser, { Game } from "phaser";
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';
import ConfigScene from "./scenes/config";
import GameScene from "./scenes/game";
import SplashScene from "./scenes/splash";

const config = {
  type: Phaser.AUTO,
  scale: {
    parent: "mastermind",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 900,
    height: 900
  },
  dom: {
    createContainer: true
  },
  plugins: {
    global: [
      {
        key: 'rexInputTextPlugin',
        plugin: InputTextPlugin,
        start: true
      },
      {
        key: 'rexWebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true
      }
    ]
  },
  scene: [SplashScene, ConfigScene, GameScene]
};

const game = new Phaser.Game(config);
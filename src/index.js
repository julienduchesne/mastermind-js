import Phaser, { Game } from "phaser";
import ConfigScene from "./scenes/config";
import GameScene from "./scenes/game";
import SplashScene from "./scenes/splash";
import {
  CIRCLE_COLORS,
  PALETTE
} from "./colors";

import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';

const config = {
  title: "Mastermind Phaser",
  url: "https://julienduchesne.github.io/mastermind-phaser/",

  type: Phaser.AUTO,
  backgroundColor: Phaser.Display.Color.HexStringToColor(PALETTE.background),
  disableContextMenu: true,
  dom: {
    createContainer: false
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
    ],
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
      },
    ]
  },
  scale: {
    parent: "mastermind",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 900,
    height: 900
  },
  scene: [SplashScene, ConfigScene, GameScene]
};

const game = new Phaser.Game(config);
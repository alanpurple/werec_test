const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
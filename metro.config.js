const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Adiciona extensão .riv para arquivos de animação Rive
config.resolver.assetExts.push('riv');

module.exports = config;

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'crypto': './lib/FullCrypto',
            //'stream': 'stream-browserify',
            //'buffer': '@craftzdog/react-native-buffer',
          }
        }
      ],
      'react-native-reanimated/plugin',
    ],
  };
};

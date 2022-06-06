// prettier-ignore
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      'moduleName': '@bluecentury/env',
    }],
    ['react-native-reanimated/plugin'],
  ],
};

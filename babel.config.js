// prettier-ignore
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@bluecentury/utils': ['./src/utils']
      }
    }],
    ['module:react-native-dotenv', {
      'moduleName': '@bluecentury/env',
    }],
    ['react-native-reanimated/plugin'],
  ],
};

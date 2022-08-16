// prettier-ignore
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./'],
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      alias: {
        '@bluecentury': './src',
      }
    }],
    ['module:react-native-dotenv', {
      'moduleName': '@bluecentury/env',
    }],
    ['react-native-reanimated/plugin'],
  ],
};

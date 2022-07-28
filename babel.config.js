// prettier-ignore
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@bluecentury/api': ['./src/api'],
        '@bluecentury/assets': ['./src/assets'],
        '@bluecentury/components': ['./src/components'],
        '@bluecentury/constants': ['./src/constants'],
        '@bluecentury/hooks': ['./src/hooks'],
        '@bluecentury/navigation': ['./src/navigation'],
        '@bluecentury/screens': ['./src/screens'],
        '@bluecentury/stores': ['./src/stores'],
        '@bluecentury/styles': ['./src/styles'],
        '@bluecentury/types': ['./src/types'],
        '@bluecentury/utils': ['./src/utils']
      }
    }],
    ['module:react-native-dotenv', {
      'moduleName': '@bluecentury/env',
    }],
    ['react-native-reanimated/plugin'],
  ],
};

module.exports = api => {
  api.cache(true);

  const modules = [
    'api',
    'assets',
    'components',
    'config',
    'constants',
    'hooks',
    'fixtures',
    'navigation',
    'screens',
    'stores',
    'helpers',
  ];

  const alias = modules.reduce((aliasAcc, moduleName) => {
    aliasAcc[`${moduleName}`] = `./src/${moduleName}`;
    return aliasAcc;
  });

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: '.',
          alias,
        },
      ],
    ],
  };
};

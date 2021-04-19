const path = require('path');

const glob = require('glob');

const genConfig = require('../../../../config/rollup/genConfig');
const {
  packageDist,
  packageNames,
  packagePath,
  filePaths,
} = require('../../../../util');

const config = glob
  .sync('./*.ts', {
    cwd: packagePath(packageNames.ANYONE, filePaths.DIR_NAME_SRC),
    absolute: true,
  })
  .reduce(
    (configs, file) => {
      return configs.concat(
        genConfig({
          distPath: packageDist(packageNames.ANYONE),
          input: path.basename(file),
          libraryName: path.basename(file, '.ts'),
          packageName: packageNames.ANYONE,
        })
      );
    },
    [
      ...genConfig({
        distPath: packageDist(packageNames.ANYONE),
        input: 'anyone.ts',
        libraryName: 'anyone',
        packageName: packageNames.ANYONE,
      }),
    ]
  );

export default config;

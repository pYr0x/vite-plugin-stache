// function readPackage(pkg, context) {
//   // Override the manifest of foo@1.x after downloading it from the registry
//   if (pkg.name === 'can-view-import') {
//     pkg.dependencies = {
//       ...pkg.dependencies,
//       "can-import-module": 'git://github.com/canjs/can-import-module.git#hook-system'
//     }
//     context.log('rewrite can-import-module to the hook-system version. This is only for testing!')
//   }
//   return pkg
// }
//
// module.exports = {
//   hooks: {
//     readPackage
//   }
// }

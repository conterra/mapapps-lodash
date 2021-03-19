# mapapps-lodash

> NOTE: This is only a sample how a library can be integrated into map.apps by a custom build.

This project shows a custom build of the [lodash](https://lodash.com/) library using a build setup very related to [mapapps-4-developers](https://github.com/conterra/mapapps-4-developers).

The result of the build is a file `mapapps-lodash-<version>.jar` which can be uploaded into a map.apps instance or references by a [mapapps-4-developers](https://github.com/conterra/mapapps-4-developers) based project.

The setup uses an experimental feature of [ct-mapapps-gulp-js](https://www.npmjs.com/package/ct-mapapps-gulp-js) to support [rollup](https://rollupjs.org/) builds.

## How to build

Pre-requisite is maven because at the end a Java `jar` file is created.

```sh
# install node + all required npm modules
mvn initialize

# compiles the project in development mode, it opens a browser, which can be used to execute the sample unit tests.
mvn compile -Denv=dev

# compiles the project and executes the tests using puppeteer
mvn test -P run-js-tests

# compiles + compress + create dependencies.json
mvn install -P compress

# clean target directory
mvn clean
```

## Usage

After successful build and integration into an map.apps instance a bundle can use the new created bundle `dn_lodash` by using following imports:

```js
import { join } from "dn_lodash"

const str = join(['a', 'b', 'c'], '~');
// assert.equal(str, "a~b~c");
```

Or the bundle contains also a sample how to provide only a subset of methods of `lodash`:

```js
import { join } from "dn_lodash/reduced"

const str = join(['a', 'b', 'c'], '~');
// assert.equal(str, "a~b~c");
```

## Hints

The build configuration of the bundle is controlled in the file [build.config.js](./src/main/js/bundles/dn_lodash/build.config.js). The keyword `npmDependencies` allows the usage of imports from specific npm modules during build time.
Rollup bundles the contents of the npm imports into the files which declares the imports.

For example the file [index.js](./src/main/js/bundles/dn_lodash/index.js) simple declares:

```js
export * from "lodash";
```

which means every export of `lodash` is re-exported by this file.

In contrast to this the file [reduced.js](./src/main/js/bundles/dn_lodash/reduced.js) declares:

```js
export { default as join } from "lodash/join";
```

which means only the helper `join` from `lodash` is re-exported. This approach is useful if you need only a subset of functions provided by `lodash`.

A client can use the import `dn_lodash` instead of `dn_lodash/index` because the [manifest.json](./src/main/js/bundles/dn_lodash/manifest.json) declares a `main` field.

## Background

This is not the only way to integrate a third party library into map.apps.
At the end you need to provide a `map.apps bundle` and a `map.apps bundle archive` for the third party library.

A `map.apps bundle` consists of:

- A `manifest.json` (package.json is valid, too)
- A `dependencies.json` this is an index file describing the dependencies of the bundles .js files
  - Can be skipped if the bundle has only one file and no imports
  - The dependencies.json is created by the `ct-jsregistry-maven-plugin`
- *.js files in AMD format for production

A bundle needs to be packaged inside a `map.apps bundle archive`.

A `map.apps bundle archive`:

- This is `.jar` file (java zip).
- Multiple bundles can be packaged into one zip file
- The helper file `META-INF\js-registry-packs.properties`:
  - Lists all available bundles inside the zip.
  - The file contents is something like `packages=bundles/dn_lodash`
  - The file is created by the `ct-jsregistry-maven-plugin`

Other ways:

- Use [webpack](https://webpack.js.org/) or [rollup](https://rollupjs.org/) directly to build the library.
- If the library has an AMD build then this can be used directly.
- At the end the `maven` part is required to produce the `map.apps bundle archive`.

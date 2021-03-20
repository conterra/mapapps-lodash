import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: [
        'src/main/js/bundles/dn_lodash/index.js',
        'src/main/js/bundles/dn_lodash/reduced.js'
    ],
    output: {
        dir: 'target/js/bundles/dn_lodash',
        format: 'amd'
    },
    plugins: [
        resolve(),
        commonjs()
    ]
}

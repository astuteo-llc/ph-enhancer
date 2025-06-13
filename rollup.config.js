import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default [
  // UMD build (for browsers)
  {
    input: 'src/index.js',
    output: {
      name: 'PhEnhancer',
      file: 'dist/index.umd.js',
      format: 'umd',
      globals: {
        'posthog-js': 'posthog'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ],
    external: ['posthog-js']
  },
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(),
      commonjs()
    ],
    external: ['posthog-js']
  }
];

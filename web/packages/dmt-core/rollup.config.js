import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import svg from 'rollup-plugin-svg'
import alias from '@rollup/plugin-alias'
import svgr from '@svgr/rollup'
import * as path from 'path'

const packageJson = require('./package.json')

// https://dev.to/siddharthvenkatesh/component-library-setup-with-react-typescript-and-rollup-onj

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      json(),
      alias({
        entries: {
          '@src': path.resolve(__dirname, './src'),
        },
      }),
      svg(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
      svgr(),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'dist/esm/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
]

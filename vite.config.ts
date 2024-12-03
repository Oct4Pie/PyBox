import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import compression from 'vite-plugin-compression'
import svgr from 'vite-plugin-svgr'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    preact(),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: /\.(js|mjs|css|html|wasm)$/i
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(js|mjs|css|html|wasm)$/i,
      compressionOptions: { level: 9 }
    }),
    svgr(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@wasmer/sdk/dist/index.mjs',
          dest: 'sdk'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    fs: {
      allow: ['../..', 'node_modules/@wasmer/sdk/dist']
    }
  },
  base: '/pybox',

  build: {
    cssMinify: 'esbuild',
    cssCodeSplit: true,
    assetsInlineLimit: 1024,
    cssTarget: 'es2020',
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        reduce_vars: true,
        unused: true,
        module: true,
        toplevel: true
      },
      ecma: 2020,
      module: true,
      output: {
        comments: false,
        beautify: false
      },
      mangle: {
        toplevel: true
      }
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('ace-builds/src-noconflict/ace')) {
            return 'ace'
          }
          if (id.includes('xterm')) {
            return 'xterm'
          }
        },
        chunkFileNames (_) {
          return '[name]-[hash].js'
        },
        assetFileNames: '[name]-[hash][extname]'
      },
      plugins: []
    }
  },
})

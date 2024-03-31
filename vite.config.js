import { resolve } from 'path';
import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
// import { minify as minifyJs } from 'terser'; //Enable when needed to use 'custom-plugin-copy-file-for-cdn'
import handlebars from 'vite-plugin-handlebars';
import eslint from 'vite-plugin-eslint';
import fs from 'fs';

function generateInputObject() {
  const srcDir = resolve(__dirname, 'src');
  const files = fs.readdirSync(srcDir);
  const input = {};

  files.forEach((file) => {
    if (file.endsWith('.html')) {
      const name = file.split('.')[0];
      input[name] = resolve(srcDir, file);
    }
  });

  return input;
}

export default defineConfig({
  define: {
    'import.meta.env.VITE_PROJECT_VERSION': JSON.stringify(
      require('./package.json').version,
    ),
  },
  publicDir: '../public',
  root: resolve(__dirname, 'src'),
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: generateInputObject(),
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 8080,
  },
  plugins: [
    eslint({
      cache: false,
      fix: true,
    }),
    ViteMinifyPlugin({}),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }),
    // Plugin to copy desired file to dist without appending hash to the file name
    // Use case: when hosting it on a CDN like jsdelivr.
    // {
    //   name: 'custom-plugin-copy-file-for-cdn',
    //   async generateBundle(_, bundle) {
    //     const srcPath = resolve(__dirname, 'src/js/for-cdn-example.js');
    //     const destPath = resolve(__dirname, 'public/cdn-example.js');
    //     if (fs.existsSync(srcPath)) {
    //       const content = fs.readFileSync(srcPath, 'utf-8');
    //       const minifiedContent = await minifyJs(content, {
    //         compress: {
    //           drop_console: true,
    //         },
    //       });
    //       fs.writeFileSync(destPath, minifiedContent.code);
    //       const fileName = destPath.split('/').pop();
    //       console.log(
    //         `\n\n✅ File "${fileName}" minified and written to the public folder.\n`,
    //       );
    //     }
    //   },
    // },
    // End of custom plugin
  ],
});

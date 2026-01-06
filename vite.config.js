import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const sha = env.TRANSPILE_SHA || 'f957085aeab09f8d18000e98508c85b95655da84';
    const entry = env.TRANSPILE_ENTRY || 'src/components/Applikation.vue';
    const dest = env.TRANSPILE_DEST || `build/${sha}/transpiled`;
    return {
        server: {
            hmr: true,
            port: 8080
        },
        plugins: [
            vue(),
            checker({ vueTsc: true }),
            // Sørger for CSS og JS samles i en fil, da der ikke var native vite funktionalitet
            cssInjectedByJsPlugin()
        ],
        define: {
            //https://github.com/vitejs/vite/issues/1973
            'process.env': process.env
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
                '~': resolve(__dirname, './tests')
            }
        },
        build: {
            outDir: dest,
            minify: true,
            lib: {
                formats: ['umd'],
                entry: entry,
                name: sha,
                fileName: sha
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    globals: {
                        vue: 'Vue'
                    }
                }
            }
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: ['./tests/setup.ts', './tests/helpers.js', './tests/test-silence-console.js'],
            sequence: {
                // Forhindrer random test fails. https://github.com/vitest-dev/vitest/issues/1293
                setupFiles: 'list'
            },
            coverage: {
                provider: 'v8',
                reportsDirectory: 'build/reports/test/html/vitest/',
                include: ['src/**/*.ts', 'src/**/*.vue'],
                exclude: ['vite.config.ts', 'src/main.ts', 'src/App.vue', 'src/models/**/*', 'src/types/**/*'],
                extension: ['.vue', '.ts'],
                reporter: ['lcov', 'html', 'text', 'json'],
                all: true
            }
        }
    };
});
//# sourceMappingURL=vite.config.js.map
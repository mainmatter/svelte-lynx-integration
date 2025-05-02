import {
	LynxEncodePlugin,
	LynxTemplatePlugin,
} from '@lynx-js/template-webpack-plugin';
import { defineConfig } from '@rspack/cli';
import path from 'node:path';
import { createRequire } from 'node:module';
import { parse } from 'acorn';
import { walk } from 'zimmerframe';
import { print } from 'esrap';

const require = createRequire(import.meta.url);

const operators_map = new Map(
	Object.entries({
		'??=': '||',
		'&&=': '&&',
		'||=': '||',
	})
);

class NullishCoalescingPlugin {
	constructor(options = {}) {
		this.options = options;
	}

	apply(compiler) {
		// Hook into the compilation process
		compiler.hooks.compilation.tap(
			'NullishCoalescingPlugin',
			(compilation) => {
				// Add a hook for the JavaScript parsing process
				compilation.hooks.processAssets.tap(
					{
						name: 'NullishCoalescingPlugin',
						stage: compiler.webpack.Compilation
							.PROCESS_ASSETS_STAGE_OPTIMIZE,
					},
					(assets) => {
						// Process each asset
						Object.entries(assets).forEach(([name, asset]) => {
							// Only process JavaScript files
							if (name.endsWith('.js')) {
								let source = asset.source();
								// Transform nullish coalescing assignment operator
								const transformedSource =
									this.transformNullishCoalescing(source);

								// Update the asset with the transformed code
								compilation.updateAsset(
									name,
									new compiler.webpack.sources.RawSource(
										transformedSource
									)
								);
							}
						});
					}
				);
			}
		);
	}

	// Transform nullish coalescing assignment (a ??= b) to equivalent (a = a ?? b)
	transformNullishCoalescing(source) {
		const ast = parse(source, {
			ecmaVersion: 'latest',
			sourceType: 'module',
		});
		const fixed_ast = walk(
			ast,
			{},
			{
				AssignmentExpression(node, context) {
					if (operators_map.has(node.operator)) {
						const left = context.visit(node.left);
						const right = context.visit(node.right);
						return {
							...node,
							operator: '=',
							left,
							right: {
								type: 'ConditionalExpression',
								test: {
									type: 'BinaryExpression',
									operator: '!=',
									left: left,
									right: {
										type: 'Identifier',
										name: 'null',
									},
								},
								consequent: left,
								alternate: right,
							},
						};
					}
					context.next();
				},
			}
		);
		// First pattern: Handle `(x.prop ??= value)` cases
		let transformedSource = print(fixed_ast, {
			ecmaVersion: 'latest',
			sourceType: 'module',
		}).code;

		return transformedSource;
	}
}

export default defineConfig({
	entry: {
		main: './src/index.js',
	},
	devServer: {
		hot: false,
	},
	resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte')),
		},
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: [
					{
						loader: 'svelte-loader',
						options: {
							compilerOptions: {
								dev: false,
							},
							emitCss: true,
						},
					},
				],
			},
		],
	},
	output: {
		publicPath: '/',
	},
	cache: false,
	// mode: 'development',
	plugins: [
		new NullishCoalescingPlugin(),
		new LynxEncodePlugin(),
		new LynxTemplatePlugin({
			filename: 'main.lynx.bundle',
			intermediate: 'main',
		}),
		/**
		 * @param {import("@rspack/core").Compiler} compiler
		 */
		(compiler) => {
			compiler.hooks.thisCompilation.tap(
				'MarkMainThreadWebpackPlugin',
				/**
				 * @param {import("@rspack/core").Compilation} compilation
				 */
				(compilation) => {
					compilation.hooks.processAssets.tap(
						'MarkMainThreadWebpackPlugin',
						() => {
							const asset = compilation.getAsset(`main.js`);
							compilation.updateAsset(asset.name, asset.source, {
								...asset.info,
								'lynx:main-thread': true,
							});
						}
					);
				}
			);
		},
	],
	experiments: {
		css: true,
	},
});

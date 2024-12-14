import eslintPluginSvelte from 'eslint-plugin-svelte';
import * as svelteParser from 'svelte-eslint-parser';
import * as typescriptParser from '@typescript-eslint/parser';
import svelteConfig from './svelte.config.js';
import js from '@eslint/js';

export default [
	{
		ignores: ['.svelte-kit/', 'build/']
	},
	js.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	...eslintPluginSvelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: typescriptParser,
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte'],
				svelteConfig
			}
		}
	}
];

import neostandard from 'neostandard';
import tsParser from '@typescript-eslint/parser';
import typescript from '@typescript-eslint/eslint-plugin';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

export default [
	...neostandard({ noStyle: true, noJsx: true }),
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': typescript,
		},
	},
	...tseslint.configs.recommended,
	{
		files: ['**/*.spec.ts', '**/*.test.ts'],
		...jest.configs['flat/recommended'],
	},
	{
		ignores: ['.github', 'dist', 'node_modules'],
	},
	prettier,
];

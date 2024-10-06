import { describe, expect, test } from 'vitest';
import { scanImportDeclarations } from '../src/index.js';

describe('scanImportDeclarations', () => {
	test('general props', () => {
		const actual = scanImportDeclarations(
			'test/__fixtures__/default-import.ts',
		);
		expect(
			actual.map(({ details, ...generalProps }) => generalProps),
		).toStrictEqual([
			{
				filePath: 'test/__fixtures__/default-import.ts',
				position: {
					end: 42,
					start: 15,
				},
				line: {
					end: 2,
					start: 2,
				},
				statement: "import m1 from 'my-module';",
				moduleSpecifierValue: 'my-module',
			},
			{
				filePath: 'test/__fixtures__/default-import.ts',
				position: {
					end: 75,
					start: 43,
				},
				line: {
					end: 3,
					start: 3,
				},
				statement: "import type m2 from 'my-module';",
				moduleSpecifierValue: 'my-module',
			},
		]);
	});

	test('default import', () => {
		const actual = scanImportDeclarations(
			'test/__fixtures__/default-import.ts',
		);
		expect(actual.map(({ details }) => ({ details }))).toStrictEqual([
			{
				details: {
					type: 'default_import',
					isTypeOnly: false,
					importedBinding: 'm1',
				},
			},
			{
				details: {
					type: 'default_import',
					isTypeOnly: true,
					importedBinding: 'm2',
				},
			},
		]);
	});

	test('namespace import', () => {
		const actual = scanImportDeclarations(
			'test/__fixtures__/namespace-import.ts',
		);
		expect(actual.map(({ details }) => ({ details }))).toStrictEqual([
			{
				details: {
					type: 'namespace_import',
					isTypeOnly: false,
					importedBinding: 'm1',
				},
			},
			{
				details: {
					type: 'namespace_import',
					isTypeOnly: true,
					importedBinding: 'm2',
				},
			},
		]);
	});

	test('named imports', () => {
		const actual = scanImportDeclarations('test/__fixtures__/named-imports.ts');
		expect(actual.map(({ details }) => ({ details }))).toStrictEqual([
			{
				details: {
					type: 'named_imports',
					elements: [
						{
							isTypeOnly: false,
							importedBinding: 'm1',
							moduleExportName: 'm1',
						},
						{
							isTypeOnly: false,
							importedBinding: 'm2',
							moduleExportName: 'm2',
						},
					],
				},
			},
			{
				details: {
					type: 'named_imports',
					elements: [
						{
							isTypeOnly: false,
							importedBinding: 'm3',
							moduleExportName: 'm3',
						},
					],
				},
			},
		]);
	});

	test('side effect import', () => {
		const actual = scanImportDeclarations(
			'test/__fixtures__/side-effect-import.ts',
		);
		expect(actual.map(({ details }) => ({ details }))).toStrictEqual([
			{
				details: {
					type: 'side_effect_import',
				},
			},
		]);
	});
});

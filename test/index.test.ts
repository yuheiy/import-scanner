import { describe, expect, test } from 'vitest';
import { scanImportDeclarations } from '../src/index.js';

describe('scanImportDeclarations', () => {
	test('default import', () => {
		const actual = scanImportDeclarations(
			'test/__fixtures__/default-import.ts',
		);
		expect(actual).toMatchInlineSnapshot(`
			[
			  {
			    "details": {
			      "importedBinding": "m1",
			      "isTypeOnly": false,
			      "type": "default_import",
			    },
			    "filePath": "test/__fixtures__/default-import.ts",
			    "line": {
			      "end": 2,
			      "start": 2,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 42,
			      "start": 15,
			    },
			    "statement": "import m1 from 'my-module';",
			  },
			  {
			    "details": {
			      "importedBinding": "m2",
			      "isTypeOnly": true,
			      "type": "default_import",
			    },
			    "filePath": "test/__fixtures__/default-import.ts",
			    "line": {
			      "end": 3,
			      "start": 3,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 75,
			      "start": 43,
			    },
			    "statement": "import type m2 from 'my-module';",
			  },
			]
		`);
	});

	test('namespace import', () => {
		const actual = scanImportDeclarations(
			'test/__fixtures__/namespace-import.ts',
		);
		expect(actual).toMatchInlineSnapshot(`
			[
			  {
			    "details": {
			      "importedBinding": "",
			      "isTypeOnly": false,
			      "type": "namespace_import",
			    },
			    "filePath": "test/__fixtures__/namespace-import.ts",
			    "line": {
			      "end": 2,
			      "start": 2,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 47,
			      "start": 15,
			    },
			    "statement": "import * as m1 from 'my-module';",
			  },
			  {
			    "details": {
			      "importedBinding": "",
			      "isTypeOnly": true,
			      "type": "namespace_import",
			    },
			    "filePath": "test/__fixtures__/namespace-import.ts",
			    "line": {
			      "end": 3,
			      "start": 3,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 85,
			      "start": 48,
			    },
			    "statement": "import type * as m2 from 'my-module';",
			  },
			]
		`);
	});

	test('named imports', () => {
		const actual = scanImportDeclarations('test/__fixtures__/named-imports.ts');
		expect(actual).toMatchInlineSnapshot(`
			[
			  {
			    "details": {
			      "elements": [
			        {
			          "importedBinding": "m1",
			          "isTypeOnly": false,
			          "moduleExportName": "m1",
			        },
			        {
			          "importedBinding": "m2",
			          "isTypeOnly": false,
			          "moduleExportName": "m2",
			        },
			      ],
			      "type": "named_imports",
			    },
			    "filePath": "test/__fixtures__/named-imports.ts",
			    "line": {
			      "end": 2,
			      "start": 2,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 50,
			      "start": 15,
			    },
			    "statement": "import { m1, m2 } from 'my-module';",
			  },
			  {
			    "details": {
			      "elements": [
			        {
			          "importedBinding": "m3",
			          "isTypeOnly": false,
			          "moduleExportName": "m3",
			        },
			      ],
			      "type": "named_imports",
			    },
			    "filePath": "test/__fixtures__/named-imports.ts",
			    "line": {
			      "end": 3,
			      "start": 3,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 87,
			      "start": 51,
			    },
			    "statement": "import type { m3 } from 'my-module';",
			  },
			]
		`);
	});

	test('side effect import', () => {
		const actual = scanImportDeclarations(
			'test/__fixtures__/side-effect-import.ts',
		);
		expect(actual).toMatchInlineSnapshot(`
			[
			  {
			    "details": {
			      "type": "side_effect_import",
			    },
			    "filePath": "test/__fixtures__/side-effect-import.ts",
			    "line": {
			      "end": 2,
			      "start": 2,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 34,
			      "start": 15,
			    },
			    "statement": "import 'my-module';",
			  },
			]
		`);
	});
});

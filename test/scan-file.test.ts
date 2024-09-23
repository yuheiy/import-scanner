import { describe, expect, test } from 'vitest';
import { scanFile } from '../src/scan-file.js';

describe('scanFile', () => {
	test('default import', () => {
		const actual = scanFile(
			['my-module'],
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
		const actual = scanFile(
			['my-module'],
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
		const actual = scanFile(
			['my-module'],
			'test/__fixtures__/named-imports.ts',
		);
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
			      "end": 46,
			      "start": 15,
			    },
			    "statement": "import { m1 } from 'my-module';",
			  },
			  {
			    "details": {
			      "elements": [
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
			      "end": 3,
			      "start": 3,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 83,
			      "start": 47,
			    },
			    "statement": "import type { m2 } from 'my-module';",
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
			      "end": 4,
			      "start": 4,
			    },
			    "moduleSpecifierValue": "my-module",
			    "position": {
			      "end": 120,
			      "start": 84,
			    },
			    "statement": "import type { m3 } from 'my-module';",
			  },
			]
		`);
	});

	test('side effect import', () => {
		const actual = scanFile(
			['my-module'],
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

	test('use RegExp in module patterns', () => {
		const actual = scanFile(
			[/^my-module(\/.+)?$/],
			'test/__fixtures__/regexp-module-patterns.ts',
		);
		expect(actual).toMatchInlineSnapshot(`
			[
			  {
			    "details": {
			      "importedBinding": "m1",
			      "isTypeOnly": false,
			      "type": "default_import",
			    },
			    "filePath": "test/__fixtures__/regexp-module-patterns.ts",
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
			      "importedBinding": "m3",
			      "isTypeOnly": false,
			      "type": "default_import",
			    },
			    "filePath": "test/__fixtures__/regexp-module-patterns.ts",
			    "line": {
			      "end": 4,
			      "start": 4,
			    },
			    "moduleSpecifierValue": "my-module/sub",
			    "position": {
			      "end": 106,
			      "start": 75,
			    },
			    "statement": "import m3 from 'my-module/sub';",
			  },
			]
		`);
	});
});

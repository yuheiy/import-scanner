# @yuheiy/import-scanner

Scan files for import declarations based on specified module patterns.

Using the TypeScript Compiler API, it scans files for import declarations and retrieves their information.

## Install

```sh
npm install @yuheiy/import-scanner
```

## Usage

```ts
// src/index.ts
import MyModule from 'my-module';
import { a as A, b as B } from 'my-module/sub';
```

```ts
import { scanImportDeclarations } from '@yuheiy/import-scanner';
import fg from 'fast-glob';

const importDeclarations = await scanImportDeclarations(
  ['my-module', /^my-module\//],
	await fg('src/**/*.{js,ts,jsx,tsx}'),
);

console.log(importDeclarations);
/*
[
  {
    "filePath": "src/index.ts",
    "position": {
      "start": 16,
      "end": 49
    },
    "line": {
      "start": 2,
      "end": 2
    },
    "statement": "import MyModule from 'my-module';",
    "moduleSpecifierValue": "my-module",
    "details": {
      "type": "default_import",
      "isTypeOnly": false,
      "importedBinding": "MyModule"
    }
  },
  {
    "filePath": "src/index.ts",
    "position": {
      "start": 50,
      "end": 97
    },
    "line": {
      "start": 3,
      "end": 3
    },
    "statement": "import { a as A, b as B } from 'my-module/sub';",
    "moduleSpecifierValue": "my-module/sub",
    "details": {
      "type": "named_imports",
      "elements": [
        {
          "isTypeOnly": false,
          "importedBinding": "A",
          "moduleExportName": "a"
        },
        {
          "isTypeOnly": false,
          "importedBinding": "B",
          "moduleExportName": "b"
        }
      ]
    }
  }
]
*/
```

## API

### scanImportDeclarations(modulePatterns, filePaths)

Return a `Promise<ScannedImportDeclaration[]>`.

```ts
export type ScannedImportDeclaration = {
  filePath: string;
  position: {
    start: number;
    end: number;
  };
  line: {
    start: number;
    end: number;
  };
  statement: string;
  moduleSpecifierValue: string;
  details:
    | {
        type: 'default_import';
        isTypeOnly: boolean;
        importedBinding: string;
      }
    | {
        type: 'namespace_import';
        isTypeOnly: boolean;
        importedBinding: string;
      }
    | {
        type: 'named_imports';
        elements: {
          isTypeOnly: boolean;
          importedBinding: string;
          moduleExportName: string;
        }[];
      }
    | {
        type: 'side_effect_import';
      };
};
```

#### modulePatterns

Type: `string | RegExp | (string | RegExp)[]`

The patterns of modules for which to retrieve import declarations. If it’s a string, an exact match is required; if it’s a regular expression, any matching items will be targeted.

#### filePaths

Type: `string[]`

The file paths to be scanned.

## Related

- [@yuheiy/import-scanner-cli](https://github.com/yuheiy/import-scanner-cli) - CLI for this module

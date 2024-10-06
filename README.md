# @yuheiy/import-scanner

Scan files for import declarations.

Using the TypeScript Compiler API, it scans files for import declarations and retrieves their information.

## Install

```sh
npm install @yuheiy/import-scanner
```

## Usage

```ts
// src/index.ts
import MyModule from 'my-module';
import { a as A, b as B } from 'another-module';
```

```ts
import { scanImportDeclarations } from '@yuheiy/import-scanner';

const importDeclarations = scanImportDeclarations('src/index.ts');

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
      "end": 98
    },
    "line": {
      "start": 3,
      "end": 3
    },
    "statement": "import { a as A, b as B } from 'another-module';",
    "moduleSpecifierValue": "another-module",
    "details": {
      "type": "named_imports",
      "isTypeOnly": false,
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

### scanImportDeclarations(filePath)

Return a `ScannedImportDeclaration[]`.

```ts
interface ScannedImportDeclarationBase<T> {
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
  details: T;
}
type ScannedDefaultImportDeclaration = ScannedImportDeclarationBase<{
  type: "default_import";
  isTypeOnly: boolean;
  importedBinding: string;
}>;
type ScannedNamespaceImportDeclaration = ScannedImportDeclarationBase<{
  type: "namespace_import";
  isTypeOnly: boolean;
  importedBinding: string;
}>;
type ScannedNamedImportDeclaration = ScannedImportDeclarationBase<{
  type: "named_imports";
	isTypeOnly: boolean;
  elements: {
    isTypeOnly: boolean;
    importedBinding: string;
    moduleExportName: string;
  }[];
}>;
type ScannedSideEffectImportDeclaration = ScannedImportDeclarationBase<{
  type: "side_effect_import";
}>;
type ScannedImportDeclaration =
  | ScannedDefaultImportDeclaration
  | ScannedNamespaceImportDeclaration
  | ScannedNamedImportDeclaration
  | ScannedSideEffectImportDeclaration;
```

#### filePath

Type: `string`

The file path to be scanned.

## Related

- [@yuheiy/import-scanner-cli](https://github.com/yuheiy/import-scanner-cli) - CLI for this module

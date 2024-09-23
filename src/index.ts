import { Project } from 'ts-morph';

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

export type ScannedDefaultImportDeclaration = ScannedImportDeclarationBase<{
	type: 'default_import';
	isTypeOnly: boolean;
	importedBinding: string;
}>;

export type ScannedNamespaceImportDeclaration = ScannedImportDeclarationBase<{
	type: 'namespace_import';
	isTypeOnly: boolean;
	importedBinding: string;
}>;

export type ScannedNamedImportDeclaration = ScannedImportDeclarationBase<{
	type: 'named_imports';
	elements: {
		isTypeOnly: boolean;
		importedBinding: string;
		moduleExportName: string;
	}[];
}>;

export type ScannedSideEffectImportDeclaration = ScannedImportDeclarationBase<{
	type: 'side_effect_import';
}>;

export type ScannedImportDeclaration =
	| ScannedDefaultImportDeclaration
	| ScannedNamespaceImportDeclaration
	| ScannedNamedImportDeclaration
	| ScannedSideEffectImportDeclaration;

let project: Project;

export function scanImportDeclarations(
	filePath: string,
): ScannedImportDeclaration[] {
	if (project === undefined) {
		project = new Project({ skipAddingFilesFromTsConfig: true });
	}

	const sourceFile = project.addSourceFileAtPath(filePath);
	const importDeclarations = sourceFile.getImportDeclarations();
	const result: ScannedImportDeclaration[] = [];

	for (const importDeclaration of importDeclarations) {
		const defaultImport = importDeclaration.getDefaultImport();
		const namespaceImport = importDeclaration.getNamespaceImport();
		const namedImports = importDeclaration.getNamedImports();

		const sharedProps = {
			filePath,
			position: {
				start: importDeclaration.getStart(),
				end: importDeclaration.getEnd(),
			},
			line: {
				start: importDeclaration.getStartLineNumber(),
				end: importDeclaration.getEndLineNumber(),
			},
			statement: importDeclaration.getText(),
			moduleSpecifierValue: importDeclaration.getModuleSpecifierValue(),
		};

		switch (true) {
			case defaultImport !== undefined: {
				const importClause = importDeclaration.getImportClause();
				result.push({
					...sharedProps,
					details: {
						type: 'default_import',
						isTypeOnly: importClause?.isTypeOnly() ?? false,
						importedBinding: importClause?.getSymbol()?.getName() ?? '',
					},
				});
				break;
			}

			case namespaceImport !== undefined: {
				const importClause = importDeclaration.getImportClause();
				result.push({
					...sharedProps,
					details: {
						type: 'namespace_import',
						isTypeOnly: importClause?.isTypeOnly() ?? false,
						importedBinding: importClause?.getSymbol()?.getName() ?? '',
					},
				});
				break;
			}

			case namedImports.length > 0: {
				result.push({
					...sharedProps,
					details: {
						type: 'named_imports',
						elements: namedImports.map((namedImport) => ({
							isTypeOnly: namedImport.isTypeOnly(),
							importedBinding: namedImport.getSymbol()?.getName() ?? '',
							moduleExportName: namedImport.getName(),
						})),
					},
				});
				break;
			}

			default: {
				result.push({
					...sharedProps,
					details: {
						type: 'side_effect_import',
					},
				});
				break;
			}
		}
	}

	project.removeSourceFile(sourceFile);

	return result;
}

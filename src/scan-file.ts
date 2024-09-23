import { Project } from 'ts-morph';

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

let project: Project;

export function scanFile(
	modulePatterns: (string | RegExp)[],
	filePath: string,
): ScannedImportDeclaration[] {
	if (project === undefined) {
		project = new Project({ skipAddingFilesFromTsConfig: true });
	}

	const sourceFile = project.addSourceFileAtPath(filePath);
	const importDeclarations = sourceFile.getImportDeclarations();
	const result: ScannedImportDeclaration[] = [];

	for (const importDeclaration of importDeclarations) {
		const moduleSpecifierValue = importDeclaration.getModuleSpecifierValue();
		const isMatchedModule = modulePatterns.some((pattern) =>
			pattern instanceof RegExp
				? pattern.test(moduleSpecifierValue)
				: pattern === moduleSpecifierValue,
		);

		if (isMatchedModule) {
			const defaultImport = importDeclaration.getDefaultImport();
			const namespaceImport = importDeclaration.getNamespaceImport();
			const namedImports = importDeclaration.getNamedImports();

			let details: ScannedImportDeclaration['details'];

			switch (true) {
				case defaultImport !== undefined: {
					const importClause = importDeclaration.getImportClause();
					details = {
						type: 'default_import',
						isTypeOnly: importClause?.isTypeOnly() ?? false,
						importedBinding: importClause?.getSymbol()?.getName() ?? '',
					};
					break;
				}

				case namespaceImport !== undefined: {
					const importClause = importDeclaration.getImportClause();
					details = {
						type: 'namespace_import',
						isTypeOnly: importClause?.isTypeOnly() ?? false,
						importedBinding: importClause?.getSymbol()?.getName() ?? '',
					};
					break;
				}

				case namedImports.length > 0: {
					details = {
						type: 'named_imports',
						elements: namedImports.map((namedImport) => ({
							isTypeOnly: namedImport.isTypeOnly(),
							importedBinding: namedImport.getSymbol()?.getName() ?? '',
							moduleExportName: namedImport.getName(),
						})),
					};
					break;
				}

				default: {
					details = {
						type: 'side_effect_import',
					};
					break;
				}
			}

			result.push({
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
				moduleSpecifierValue,
				details,
			});
		}
	}

	project.removeSourceFile(sourceFile);

	return result;
}

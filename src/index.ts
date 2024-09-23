import { type ScannedImportDeclaration, scanFile } from './scan-file.js';

export async function scanImportDeclarations(
	modulePatterns: string | RegExp | (string | RegExp)[],
	filePaths: string[],
): Promise<ScannedImportDeclaration[]> {
	const modulePatterns_ = Array.isArray(modulePatterns)
		? modulePatterns
		: [modulePatterns];

	const result = filePaths.map((filePath) =>
		scanFile(modulePatterns_, filePath),
	);

	return result.flat();
}

export type { ScannedImportDeclaration };

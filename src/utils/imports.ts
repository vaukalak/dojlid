import { SourceFile } from "ts-morph";

export const addReact = (sourceFile: SourceFile) => {
    sourceFile.addImportDeclaration({
        moduleSpecifier: "react",
        defaultImport: "React",
        namedImports: [],
    });
};

export const addNamedImport = (sourceFile: SourceFile, file: string, importName: string) => {
    const importDecl = sourceFile.getImportDeclaration(file);
    if (importDecl) {
        if (!importDecl.getNamedImports().find((a) => a.getName() === importName)) {
            importDecl.addNamedImport(importName)
        }
    } else {
        sourceFile.addImportDeclaration({
            moduleSpecifier: file,
            namedImports: [importName],
        });
    };
};

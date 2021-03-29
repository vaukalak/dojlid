import { SourceFile } from "ts-morph";

export const addReact = (sourceFile: SourceFile) => {
    sourceFile.addImportDeclaration({
        moduleSpecifier: "react",
        defaultImport: "React",
        namedImports: [],
    });
};

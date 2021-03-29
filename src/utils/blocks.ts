import { SourceFile, VariableDeclarationKind } from "ts-morph";

export const addComponent = (sourceFile: SourceFile, name: string) => {
    return sourceFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [{
            name,
            initializer: "() => { }"
        }]
    });
};

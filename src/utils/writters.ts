import { CodeBlockWriter, JsxElementStructure } from "ts-morph";

export const jsxWritter = (structure: JsxElementStructure) => {
    return (writer: CodeBlockWriter) => {
        writer.write(`<${structure.name}`);
        if (!structure.children || structure.children.length === 0) {
            writer.write("/>");
            return;
        }
        writer.write(">");
        if (structure.children) {
            structure.children.forEach(child => {
                jsxWritter(child as JsxElementStructure)(writer);
            });
        }
        writer.write(`</${structure.name}>`);
    }
}

export const subscribe = (event: any, handler: GeneratorFunction) => {
    return { effectType: "SUBSCRIBE", event, handler };
}
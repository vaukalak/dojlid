export const subscribe = (event: any, handler: (payload: any) => Generator<any, any, any>) => {
    return { effectType: "SUBSCRIBE", event, handler };
}
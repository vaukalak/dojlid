export const dispatch = (event: any, payload?: any) => {
    return { effectType: "DISPATCH", event, payload };
};

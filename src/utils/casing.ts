export const capitalize = (string: string) => {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
};

export const unCapitalize = (string: string) => {
    if (string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
    return string;
};


export const dotCasing = (body: string, postfix: string) => {
    return `${body}.${postfix}`;
};

export const kebabCasing = (body: string, postfix: string) => {
    return `${body}-${postfix}`;
};

export const camelCasing = (body: string, postfix: string) => {
    return `${unCapitalize(body)}${capitalize(postfix)}`;
};

export const pascalCasing = (body: string, postfix: string) => {
    return `${capitalize(body)}${capitalize(postfix)}`;
};

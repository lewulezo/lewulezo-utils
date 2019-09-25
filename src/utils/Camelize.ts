"use strict";

export function decamelize(name: string, separator = "_") {
    return name
        .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
        .toLowerCase();
}

export function camelize(input: string | string[], options?) {
    options = Object.assign({ pascalCase: false }, options);

    const postProcess = x =>
        options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;

    if (Array.isArray(input)) {
        input = (input as string[])
            .map(x => x.trim())
            .filter(x => x.length)
            .join("-");
    } else {
        input = input.trim();
    }

    if (input.length === 0) {
        return "";
    }

    if (input.length === 1) {
        return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
    }

    if (/^[a-z\d]+$/.test(input)) {
        return postProcess(input);
    }

    const hasUpperCase = input !== input.toLowerCase();

    if (hasUpperCase) {
        input = preserveCamelCase(input);
    }

    input = (input as string)
        .replace(/^[_.\- ]+/, "")
        .toLowerCase()
        .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());

    return postProcess(input);
}

const preserveCamelCase = string => {
    let isLastCharLower = false;
    let isLastCharUpper = false;
    let isLastLastCharUpper = false;

    for (let i = 0; i < string.length; i++) {
        const character = string[i];

        if (
            isLastCharLower &&
            /[a-zA-Z]/.test(character) &&
            character.toUpperCase() === character
        ) {
            string = string.slice(0, i) + "-" + string.slice(i);
            isLastCharLower = false;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = true;
            i++;
        } else if (
            isLastCharUpper &&
            isLastLastCharUpper &&
            /[a-zA-Z]/.test(character) &&
            character.toLowerCase() === character
        ) {
            string = string.slice(0, i - 1) + "-" + string.slice(i - 1);
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = false;
            isLastCharLower = true;
        } else {
            isLastCharLower = character.toLowerCase() === character;
            isLastLastCharUpper = isLastCharUpper;
            isLastCharUpper = character.toUpperCase() === character;
        }
    }

    return string;
};

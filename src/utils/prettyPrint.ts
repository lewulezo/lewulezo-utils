class Grid {
    rows: Row[];
    colDefs: Function[] | string[];
    titles: string[];

    constructor(
        array: any[],
        colDefs: Function[] | string[],
        titles: string[]
    ) {
        const self = this;
        self.rows = [];
        self.colDefs = colDefs;
        self.titles = titles;
        array.forEach(item => self.rows.push(new Row(self, item)));
    }

    getMaxLength(c: number): number {
        const self = this;
        let maxLen = this.titles && this.titles[c] ? this.titles[c].length : 0;
        self.rows.forEach(row => {
            const cell = row.getCell(c);
            let len = cell ? cell.toString().length : 0;
            maxLen = Math.max(len, maxLen);
        });
        return maxLen;
    }

    getPrettyString(separator = " "): string {
        const self = this;
        const colMaxLens: number[] = [];
        for (let c = 0; c < self.colDefs.length; c++) {
            colMaxLens[c] = self.getMaxLength(c);
        }
        const output = new StringBuffer();
        if (self.titles) {
            for (let c = 0; c < colMaxLens.length; c++) {
                const title = self.titles[c];
                output.append(stringRightPad(title, colMaxLens[c]));
                output.append(separator);
            }
            output.append("\n");
        }
        self.rows.forEach(row => {
            output.append(row.getPrettyString(separator, colMaxLens));
            output.append("\n");
        });
        return output.toString();
    }

    getMarkdownString(): string {
        const self = this;
        if (!this.titles) {
            throw new Error("Markdown mode need titles defined");
        }
        const separator = " | ";
        const output = new StringBuffer();

        const colMaxLens: number[] = [];
        for (let c = 0; c < self.colDefs.length; c++) {
            colMaxLens[c] = self.getMaxLength(c);
        }
        //output titles
        for (let c = 0; c < colMaxLens.length; c++) {
            const title = self.titles[c];
            output.append(stringRightPad(title, colMaxLens[c]));
            output.append(separator);
        }
        output.append("\n");
        //output head separate
        for (let char of colMaxLens) {
            output.append(stringRightPad("", char, "-"));
            output.append(separator);
        }
        output.append("\n");
        self.rows.forEach(row => {
            output.append(row.getPrettyString(separator, colMaxLens));
            output.append("\n");
        });

        return output.toString();
    }
}

class Row {
    grid: Grid;
    colDefs: Function[] | string[];
    item: any;

    constructor(grid: Grid, item: any) {
        this.grid = grid;
        this.colDefs = grid.colDefs;
        this.item = item;
    }

    getCell(columnIndex: number): string {
        const self = this;
        const colDef = self.colDefs[columnIndex];
        if (colDef === undefined) {
            return "";
        }
        if (colDef instanceof Function) {
            return colDef(self.item);
        } else {
            const value = self.item[colDef];
            if (value instanceof Function) {
                return value.apply(self.item);
            } else if (value === null || value === undefined) {
                return "";
            } else {
                return value;
            }
        }
    }

    getCells(): string[] {
        const cells: string[] = [];
        for (let c = 0; c < this.colDefs.length; c++) {
            cells[c] = this.getCell(c);
        }
        return cells;
    }

    getPrettyString(separator = " ", colMaxLens: number[]): string {
        const row = this;
        const cells = row.getCells();
        const output = new StringBuffer();
        for (let c = 0; c < cells.length; c++) {
            let cell = cells[c];
            let colMaxLen = colMaxLens[c];
            output.append(stringRightPad(cell, colMaxLen));
            output.append(separator);
        }
        return output.toString();
    }
}

function stringRightPad(str: string, len: number, padChar = " "): string {
    if (str === null || str === undefined) {
        str = "";
    }
    str = str.toString();
    const output = new StringBuffer(str);
    for (let i = 0; i < len - str.length; i++) {
        output.append(padChar);
    }
    return output.toString();
}

class StringBuffer {
    content: string[];

    constructor(str = "") {
        if (str === null || str === undefined) {
            str = "";
        }
        this.content = [str.toString()];
    }

    append(str: string) {
        if (str === null || str === undefined) {
            str = "";
        }
        this.content.push(str.toString());
        return this;
    }

    toString(): string {
        return this.content.join("");
    }

    substring(start: number, pos: number): string {
        const str = this.toString();
        this.content = [str.substring(start, pos)];
        return this.toString();
    }
}

export function getPrettyString(
    array: any[],
    colDefs: Function[] | string[],
    titles?: string[],
    separator = " "
) {
    titles = titles || (colDefs as string[]);
    const grid = new Grid(array, colDefs, titles);
    return grid.getPrettyString(separator);
}

export function getMarkdownString(
    array: any[],
    colDefs: Function[] | string[],
    titles?: string[]
) {
    titles = titles || (colDefs as string[]);
    const grid = new Grid(array, colDefs, titles);
    return grid.getMarkdownString();
}

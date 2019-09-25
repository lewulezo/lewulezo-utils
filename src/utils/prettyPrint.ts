import { StringBuffer } from "./StringBuffer";

export class ArrayPrint{
    constructor(public titles:string[], public colDefs:C[]){
    }

    getPettyString<T>(array:T[], separator:string):string{
        const grid = new Grid<T>(array, this.colDefs, this.titles);
        return grid.getPrettyString(separator);
    }

    getMarkdownString<T>(array:T[]):string{
        const grid = new Grid<T>(array, this.colDefs, this.titles);
        return grid.getMarkdownString();
    }
}


type C = string|((T)=>string);


class Grid<T> {
    rows: Row<T>[];
    colDefs: C[];
    titles: string[];

    constructor(array:T[], colDefs:C[], titles:string[]){
        const self = this;
        self.rows = [];
        self.colDefs = colDefs;
        self.titles = titles;
        array.forEach(item => self.rows.push(new Row(self, item)));
    }

    getMaxLength(c:number):number{
        const self = this;
        let maxLen = (this.titles && this.titles[c]) ? this.titles[c].length : 0;
        self.rows.forEach(row => {
            const cell = row.getCell(c);
            let len = cell ? cell.toString().length : 0;
            maxLen = Math.max(len, maxLen);
        })
        return maxLen;
    }

    getPrettyString(separator= ' '):string{
        const self = this;
        const colMaxLens = [];
        for (let c = 0; c < self.colDefs.length; c++){
            colMaxLens[c] = self.getMaxLength(c);
        }
        const output = new StringBuffer();
        if (self.titles){
            for (let c = 0; c < colMaxLens.length; c++){
                const title = self.titles[c];
                output.append(stringRightPad(title, colMaxLens[c]));
                output.append(separator);
            }
            output.append('\n');
        }
        self.rows.forEach(row => {
            output.append(row.getPrettyString(separator, colMaxLens));
            output.append('\n');
        });
        return output.toString();
    }

    getMarkdownString():string{
        const self = this;
        if (!this.titles){
            throw new Error('Markdown mode need titles defined');
        }
        const separator = ' | ';
        const output = new StringBuffer();

        const colMaxLens = [];
        for (let c = 0; c < self.colDefs.length; c++){
            colMaxLens[c] = self.getMaxLength(c);
        }
        //output titles
        for (let c = 0; c < colMaxLens.length; c++){
            const title = self.titles[c];
            output.append(stringRightPad(title, colMaxLens[c]));
            output.append(separator);
        }
        output.append('\n');
        //output head separate 
        for (let c = 0; c < colMaxLens.length; c++){
            output.append(stringRightPad('', colMaxLens[c], '-'))
            output.append(separator);
        }
        output.append('\n');
        self.rows.forEach(row => {
            output.append(row.getPrettyString(separator, colMaxLens));
            output.append('\n');
        });

        return output.toString();
    }
}

class Row<T> {
    colDefs: C[];

    constructor(public grid:Grid<T>, public item:T){
        this.colDefs = grid.colDefs;
    }

    getCell(columnIndex:number):string{
        const self = this;
        const colDef = self.colDefs[columnIndex];
        if (colDef === undefined){
            return;
        }
        if (colDef instanceof Function){
            return colDef(self.item);
        } 
        else {
            const value = self.item[colDef];
            if (value instanceof Function){
                return value.apply(self.item);
            } else if (value === null || value === undefined) {
                return '';
            } else {
                return value;
            }
        }
    }

    getCells():string[]{
        const cells = [];
        for (let c = 0; c < this.colDefs.length; c++){
            cells[c] = this.getCell(c);
        }
        return cells;
    }

    getPrettyString(separator = ' ', colMaxLens:number[]):string{
        const row = this;
        const cells = row.getCells();
        const output = new StringBuffer();
        for (let c = 0; c < cells.length; c++){
            let cell = cells[c];
            let colMaxLen = colMaxLens[c];
            output.append(stringRightPad(cell, colMaxLen));
            output.append(separator);
        }
        return output.toString();
    }
}

function stringRightPad(str:string, len:number, padChar = ' '):string{
    if (str === null || str === undefined){
        str = '';
    }
    str = str.toString();
    const output = new StringBuffer(str);
    for (let i = 0; i < len - str.length; i++){
        output.append(padChar);
    }
    return output.toString();
}

export function getPrettyString(array:any[], colDefs:C[], titles:string[], separator=' '){
    const grid = new Grid(array, colDefs, titles);
    return grid.getPrettyString(separator);
}

export function getMarkdownString(array:any[], colDefs:C[], titles:string[]){
    const grid = new Grid(array, colDefs, titles);
    return grid.getMarkdownString();
}

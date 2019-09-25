export class StringBuffer{
    content:string[];

    constructor(str=''){
        if (str === null || str === undefined){
            str = '';
        }
        this.content = [str.toString()];
    }


    append(str:string){
        if (str === null || str === undefined){
            str = '';
        }
        this.content.push(str.toString());
        return this;
    }


    toString():string{
        return this.content.join('');
    }

    substring(start:number, pos:number):string{
        const str = this.toString();
        this.content = [str.substring(start, pos)];
        return this.toString();
    }
}

export default StringBuffer;
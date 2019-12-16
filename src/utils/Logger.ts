import * as fs from "fs";

export class Logger {
    constructor(public outputFile) {
    }

    async logSql(sql) {
        console.log(sql);
        await this.outputFile.writeFile(sql + '\n');
    }
    
    async log(msg) {
        console.log(`---- ${msg}`);
        await this.outputFile.writeFile(`---- ${msg}\n`);
    }

    async close() {
        await this.outputFile.close();
    }
}


const allLoggers:{[fileName: string]: Logger} = {};

export async function getLogger(fileName: string): Promise<Logger> {
    let logger = allLoggers[fileName];
    if (logger) {
        return logger;
    }
    let outputFile = await fs.promises.open(fileName, "w");
    logger = new Logger(outputFile);
    allLoggers[fileName] = logger;
    return logger;
}

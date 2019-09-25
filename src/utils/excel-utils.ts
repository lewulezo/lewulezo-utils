import * as Excel from "exceljs";
import { Workbook, Worksheet, Cell, ValueType } from "exceljs";
import {
    getColumnDefByColumnName,
    ColumnDef,
    getColumnDefs,
    getColumnDefByPropertyName
} from "./Column";
import moment from "moment";

const DATE_FORMAT = "YYYY-MM-DD";
const SOURCE_FILE_PATH = "data";

export async function readWorkbook(fileName: string): Promise<Workbook> {
    const workbook = new Workbook();
    let path = SOURCE_FILE_PATH + "/" + fileName;
    await workbook.xlsx.readFile(path);
    return workbook;
}

export function createWorkbook(): Workbook {
    return new Excel.Workbook();
}

export function importRecords<T>(
    sheet: Worksheet,
    recordFactory: () => T
): T[] {
    let titleRecord = recordFactory();
    const records: T[] = [];
    let properties: ColumnDef[] = [];

    //map title to col index
    for (let c = 1; c <= sheet.columnCount; c++) {
        let titleCell = sheet.getCell(1, c);
        if (!titleCell) continue;
        let titleValue = getValueFromCell(titleCell);
        if (titleValue === null) {
            continue;
        }
        let columnName = String(titleValue);
        let columnDef = getColumnDefByColumnName(titleRecord, columnName);
        if (!columnDef) {
            // console.warn(`${columnName} not found!!!`);
            continue;
        }
        properties[c] = columnDef;
    }
    //read line
    for (let r = 2; r <= sheet.rowCount; r++) {
        let record = recordFactory();
        let emptyLine = true;
        for (let c = 1; c <= properties.length; c++) {
            let columnDef = properties[c];
            if (!columnDef) {
                continue;
            }
            let value = getValueFromCell(sheet.getCell(r, c));
            if (value == null) {
                continue;
            }
            emptyLine = false;
            setModelValue(record, columnDef, value);
        }
        if (!emptyLine) {
            records.push(record);
        }
    }
    return records;
}

function getValueFromCell(cell: Cell): string | number | boolean | null {
    let value = cell.value;
    switch (cell.type) {
        case ValueType.Boolean:
            return value as boolean;
        case ValueType.Number:
            return value as number;
        case ValueType.Hyperlink:
            return (cell.value as Excel.CellHyperlinkValue).text;
        case ValueType.Date:
            return moment(cell.value as Date).format(DATE_FORMAT);
        case ValueType.Formula:
            let result = (cell.value as Excel.CellFormulaValue).result;
            if (typeof result == "number") {
                return String(result as number);
            } else if (result instanceof Date) {
                return moment(result as Date).format(DATE_FORMAT);
            } else {
                return result as string;
            }
            break;
        case ValueType.RichText:
            let richText = (cell.value as Excel.CellRichTextValue).richText;
            return richText.map(t => t.text).join("");
        case ValueType.Null:
        case ValueType.Error:
        case ValueType.Merge:
            return null;
        case ValueType.String:
        default:
            return cell.value as string;
    }
}

function setModelValue(
    record: any,
    columnDef: ColumnDef,
    v: string | number | boolean
) {
    const converter = columnDef.readConverter;
    if (converter && typeof converter === "function") {
        v = converter(v);
    }
    record[columnDef.propName] = v;
}

function getModelValue(record: any, columnDef: ColumnDef) {
    const converter = columnDef.writeConverter;
    let v = record[columnDef.propName];
    if (converter && typeof converter === "function") {
        return converter(v);
    }
    return v;
}

export function exportRecords<T>(
    sheet: Worksheet,
    records: T[],
    columns?: string[]
) {
    let sample = records[0];
    if (!sample) {
        console.warn(`no record to write in sheet ${sheet.name}`);
        return;
    }
    let columeDefs = columns
        ? columns.map(columnName =>
              getColumnDefByPropertyName(sample, columnName)
          )
        : getColumnDefs(sample);

    sheet.addRow(
        columeDefs.map(columnDef => (columnDef ? columnDef.columnName : ""))
    );

    records.forEach(record =>
        sheet.addRow(
            columeDefs.map(columnDef =>
                columnDef ? getModelValue(record, columnDef) : ""
            )
        )
    );
}

function toCsv(records: any[]): string {
    let sample = records[0];
    if (!sample) {
        return "";
    }
    let columnDefs = getColumnDefs(sample);
    let output: string[] = [
        columnDefs.map(columnDef => columnDef.columnName).join(",")
    ];
    output.concat(
        records.map(record =>
            columnDefs
                .map(columnDef => getModelValue(record, columnDef))
                .join(",")
        )
    );

    return output.join("\n");
}

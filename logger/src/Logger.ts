import * as fsp from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

/**
 * Logging categories depending on the
 * message 
 * 
 * @author Ismael Trentin
 * @version 2021.05.13
 */
export enum LoggingCategory {
    SUCCESS = 'SUC',
    INFO = 'INF',
    WARNING = 'WAR',
    ERROR = 'ERR'
}

/**
 * Simple logger. Gets a directory path as argument
 * and then creates the log file if it does not exists.
 * The default file name is `yyyy_MM_dd_hh_mm_ss.log`.
 * To create a new file simply create a new instance
 * of the class.
 * 
 * @author Ismael Trentin
 * @version 2021.05.13
 */
export class Logger {

    /**
     * The log file path where the logger will write all the logs.
     */
    public readonly filePath: string;

    /**
     * Creates a new instance of Logger and the log file.
     * 
     * @param dirPath the directory where the log file will be created
     */
    constructor(dirPath: string) {
        if (!existsSync(dirPath)) {
            throw `Path ${dirPath} does not exists`;
        }
        this.filePath = path.normalize((path.join(dirPath, `${Logger.getDateTimeFormatted('_', '_', '_')}.log`)));
    }

    /**
     * By default it returns `yyyy-MM-dd`. The separator
     * can be changed using the `separator` parameter.
     * 
     * @param separator used to separate the dates
     * @returns `yyyy-MM-dd`
     */
    public static getDateFormatted(separator?: string) {
        let date = new Date();
        let sep = separator ? separator : '-';
        let y = date.getFullYear();
        let m = date.getMonth().toString().padStart(2, '0');
        let d = date.getDate().toString().padStart(2, '0');
        return `${y}${sep}${m}${sep}${d}`;
    }

    /**
     * By default it returns `hh:mm:ss`. The separator
     * can be changed using the `separator` parameter.
     * 
     * @param separator used to separate the dates
     * @returns `hh:mm:ss`
     */
    public static getTimeFormatted(separator?: string) {
        let date = new Date();
        let sep = separator ? separator : ':';
        let h = date.getHours().toString().padStart(2, '0');
        let m = date.getMinutes().toString().padStart(2, '0');
        let s = date.getSeconds().toString().padStart(2, '0');
        return `${h}${sep}${m}${sep}${s}`;
    }

    /**
     * By default it returns `yyyy-MM-dd hh:mm:ss`. All 
     * the separators can be changed using the correct
     * parameters.
     * 
     * @param separator separates the date and the time
     * @param dateSeparator the date separator
     * @param timeSeparator the time separator
     * @returns `yyyy-MM-dd hh:mm:ss`
     */
    public static getDateTimeFormatted(separator?: string, dateSeparator?: string, timeSeparator?: string) {
        let sep = separator ? separator : ' ';
        return `${this.getDateFormatted(dateSeparator)}${sep}${this.getTimeFormatted(timeSeparator)}`;
    }

    /**
     * Logs `msg` without writing to the log file.
     * 
     * @param msg the log message
     * @param category the log message category
     * @returns what will be printed in the `stdout`
     */
    public logNoWrite(msg: string, category?: LoggingCategory) {
        let cat = category ? category : LoggingCategory.INFO;
        let prefix = `[${Logger.getDateFormatted()}][${Logger.getTimeFormatted()}][${cat}] `;
        let str = prefix + msg;
        console.log(str);
        return str;
    }

    /**
     * Logs `msg` and writes the log to the log file.
     * 
     * @param msg the log message
     * @param category the log message category
     */
    public async log(msg: string, category?: LoggingCategory) {
        let str = this.logNoWrite(msg, category) + '\n';
        try {
            await fsp.writeFile(this.filePath, str, { encoding: 'utf8', flag: 'a' });
        } catch (error) {
            console.error(`Could not write log file at ${Logger.getDateTimeFormatted('@')}. Error:\n${error}`);
        }
    }
}
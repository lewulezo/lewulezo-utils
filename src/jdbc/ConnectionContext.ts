import { Connection } from './Connection';

export interface ConnectionContext {
    uuid: string;
    conn: Connection;
    reserved: boolean;
    lastIdle?: number;
    keepAliveId?: number;
    

}
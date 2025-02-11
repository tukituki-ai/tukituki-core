import { ProtocolData } from '../types/protocol';

export interface Connector {
    fetch(): Promise<ProtocolData[]>;
}
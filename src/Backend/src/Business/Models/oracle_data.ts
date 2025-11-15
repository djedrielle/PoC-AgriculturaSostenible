class OracleData {
    data_id: string;
    data_type: string;
    data: any;
    timestamp: string;
    data_source: string;
    verified: boolean;

    constructor(data_id: string, data_type: string, data: any, timestamp: string, data_source: string, verified: boolean) {
        this.data_id = data_id;
        this.data_type = data_type;
        this.data = data;
        this.timestamp = timestamp;
        this.data_source = data_source;
        this.verified = verified;
    }
}
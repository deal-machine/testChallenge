import { Connection, createConnection, getConnectionOptions } from 'typeorm';

const connection = async (): Promise<Connection> => {
    const name = process.env.NODE_ENV === 'test' ? 'test' : 'default';
    const connectionOptions = await getConnectionOptions(name);
    
    return createConnection(connectionOptions);
}

export default connection;
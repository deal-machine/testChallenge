import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';

const connection = async (): Promise<Connection> => {
  let connectionOptions: ConnectionOptions;

  if(process.env.NODE_ENV === 'test')
    connectionOptions = await getConnectionOptions('test');
  else
    connectionOptions = await getConnectionOptions();

    return createConnection({...connectionOptions, name: 'default'});
}

export default connection;

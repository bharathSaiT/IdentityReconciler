import postgres from 'pg';

const { Client } = postgres;

//update user , host, database, password ,port ; details as per the DB that we are connecting to
const client = new Client({
    user: 'bitespeed', 
    host: 'localhost',
    database: 'Contact',
    password: 'fast',
    port: 5432,
});

let isConnected = false;

//add database Connection
const connectToDataBase = async (): Promise<void> => {
    try {
        if (!isConnected) {
        await client.connect();
        isConnected = true;
        console.log('Connected to PostgreSQL');
        // You can execute queries or perform other database operations here
     }
    } catch (error) {
      console.error('Error connecting to PostgreSQL', error);
    }
};

export {client , connectToDataBase};

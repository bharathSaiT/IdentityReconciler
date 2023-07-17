import postgres from 'pg';

const { Client } = postgres;

//update user , host, database, password ,port ; details as per the DB that we are connecting to
const client = new Client({
    connectionString: 'postgres://bitespeed:ToMWU7SmIrQ7eqhG9QxCWcOD30WUkDLt@dpg-ciqlsblgkuvrtobnqt70-a.frankfurt-postgres.render.com/contact_p7vz',
    ssl: {
        rejectUnauthorized: false,
      }
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

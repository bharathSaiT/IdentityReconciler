import { connectToDataBase } from './db/db_client';
import express from 'express';
import {identityReconcilation} from './identity_reconcilation';
import { requestType } from './model/input';
import { responseType } from './model/response';

const app = express();
app.use(express.json());

app.post('/identify', async (req, res) => {
  try {
    await connectToDataBase();  // Connect to DataBase

    const { email, phoneNumber } = req.body;
    const request :requestType = req.body;

    // Ensuring either one of the input paramaters is available
    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Email or phoneNumber is required' });
    }

    // Find the details of primaryContact
    const response :responseType  = await identityReconcilation(request);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

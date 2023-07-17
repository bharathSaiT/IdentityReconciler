import express from 'express';
import { requestType } from './model/input';
import { responseType } from './model/response';

const app = express();
app.use(express.json());

app.post('/identify', async (req, res) => {
  try {

    const { email, phoneNumber } = req.body;
    const request :requestType = req.body;

    // Ensuring either one of the input paramaters is available
    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Email or phoneNumber is required' });
    }

    res.status(200).send("hello world");
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

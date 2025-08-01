import express from 'express';
import dotenv from 'dotenv';
import { fetchBusinesses, readFiletoTransform, writeToJson, transformGoogleDataWithChatGPT } from './utils';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/businesses', async (req, res) => {
  const { businessQueries, location } = req.body;
  console.log({ businessQueries, location });
  if (!businessQueries || !Array.isArray(businessQueries) || !location) {
    return res.status(400).json({ error: 'Invalid input format' });
  }
  console.log(process.env.GOOGLE_API_KEY);

  try {
    const results = await Promise.all(businessQueries.map(query => fetchBusinesses(query, location)));
    res.status(200).json({
      message: 'Businesses fetched successfully',
      records: results.length,
      results
    });
  } catch (error) {
    console.error("Error fetching business details:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

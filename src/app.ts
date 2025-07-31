import express from 'express';
import dotenv from 'dotenv';
import fetchBusinesses from './utils/fetchBusinessDetails';
import { readFile } from 'fs';
import readFiletoTransform from './utils/readFileToTransform';
import writeToJson from './utils/writeToJson';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/businesses', async (req, res) => {
  const { businessQueries, location } = req.body;
  if (!businessQueries || !Array.isArray(businessQueries) || !location) {
    return res.status(400).json({ error: 'Invalid input format' });
  }

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

app.post('/transform', async (req, res) => {
  const { filePath } = req.body;   

    if (!filePath || typeof filePath !== 'string') {    
        return res.status(400).json({ error: 'Invalid input format' });
    }
    const googleData = await readFiletoTransform(filePath);
  try {
    const transformedData = await transformGoogleDataWithChatGPT(googleData);
    writeToJson(transformedData, `transformed_${Date.now()}.json`);
    res.status(200).json({
      message: 'Business data transformed successfully',
      count: transformedData.length,
    });
  } catch (error) {
      console.error("Error transforming business data:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

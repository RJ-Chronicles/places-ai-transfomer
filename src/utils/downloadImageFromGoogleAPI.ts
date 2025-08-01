import axios from 'axios';


const downloadImageFromGoogleAPI = async (imageUrl: string): Promise<{ buffer: Buffer; mimeType: string }> => {
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
  });

  const mimeType = response.headers['content-type'];
  return { buffer: Buffer.from(response.data), mimeType };
};

export default downloadImageFromGoogleAPI;


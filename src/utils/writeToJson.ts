import fs from 'fs/promises';


const writeToJson = async <T,>(data: T[], filePath: string) => {
  try {
    console.log(`Found ${data.length} businesses in total.`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Saved ${data.length} businesses to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

export default writeToJson;
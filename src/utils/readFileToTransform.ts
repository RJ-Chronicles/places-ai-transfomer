import fs from 'fs/promises';

const readFiletoTransform = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');

    if (!data) {
      throw new Error("File is empty");
    }
    const parsedData = JSON.parse(data);
    if (!Array.isArray(parsedData)) {
      throw new Error("Invalid data format");
    }
    return parsedData;
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error("File read error");
  }
};

export default readFiletoTransform;
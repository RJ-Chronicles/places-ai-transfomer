const OpenAI = require("openai");

const { OPEN_AI_API_KEY, GOOGLE_API_KEY } = process.env;
const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

async function transformGoogleDataWithChatGPT<T>(googleData: T) {

// Use this prompt in your transformGoogleDataWithChatGPT function
const prompt = `
You are an AI agent. Transform the following Google API response data into a JSON object matching the schema below.
For each field, follow the instructions in the comments to extract or generate the value from the provided data.
This prompt is generic and should work for Google API data from any location.

Schema:
{
  owner_name: string, // Extract first and last name from name field of input data if available, otherwise leave blank or use a relevant name
  business_name: string, // Use the 'name' field from data
  business_categories: array, // Use a relevant category from data or default to ["General store"]
  business_subcategories: array, // Use relevant subcategories from data or default to ["Grocery", "Supermarket"]
  monday: string, // Extract Monday hours from opening_hours
  tuesday: string, // Extract Tuesday hours from opening_hours
  wednesday: string, // Extract Wednesday hours from opening_hours
  thursday: string, // Extract Thursday hours from opening_hours
  friday: string, // Extract Friday hours from opening_hours
  saturday: string, // Extract Saturday hours from opening_hours
  sunday: string, // Extract Sunday hours from opening_hours
  business_start_time: string, // Extract opening time from opening_hours (e.g. "9:00 AM")
  business_end_time: string, // Extract closing time from opening_hours (e.g. "9:00 PM")
  business_desc: string, // Use description from data or generate a relevant description
  mobile: string, // Extract 10-digit mobile from data, remove spaces and non-numeric characters
  email: string, // Use email from data or generate one like mobileabc@example.com
  whatsapp_number: string, // Same as mobile
  social_link: string, // Use google_maps_url from data
  business_type: string, // Use "Offline" unless data indicates "Online"
  is_area: number, // Use 1 for offline businesses, 0 for online
  address: string, // Use 'address' or 'formatted_address' field from data
  city: string, // Extract city from address
  landmark: string, // Use from data or generate like "Near [local landmark]"
  pincode: string, // Extract from address
  area_lat: number, // Use 'latitude' from data
  area_lng: number, // Use 'longitude' from data
  a_to_b_startlat: number, // null
  a_to_b_startlng: number, // null
  a_to_b_endlat: number, // null
  a_to_b_endlng: number, // null
  start_address: string, // null
  end_address: string, // null
  images: array // For each photo_reference, generate: https://maps.googleapis.com/maps/api/place/photo?photoreference={photo_reference}&key=${GOOGLE_API_KEY}
}

Google API Data:
${JSON.stringify(googleData)}

Return only the transformed object in JSON format, matching the schema and comments above.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-3.5-turbo"
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  const resultText = response.choices[0].message.content;
  try {
    return JSON.parse(resultText);
  } catch (e) {
    const match = resultText.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

module.exports = transformGoogleDataWithChatGPT;
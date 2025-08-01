import axios from "axios";
import { BussinessDetails, GoogleData, TransformSchema } from "../type/index.dt";


import dotenv from 'dotenv';
import fetchPlaceDetails from "./fetchPlaceDetails";
import writeToJson from "./writeToJson";
import transformGoogleDataWithChatGPT from './transformGoogleDataWithChatGPT'
dotenv.config();
const { GOOGLE_API_KEY } = process.env;

async function fetchBusinesses(query: string, location: string) {
  // Log the input query and location with green color 
  console.log(`✅ Fetching businesses for query: ${query} in location: ${location} google api key: ${GOOGLE_API_KEY}`);
  const encodedQuery = encodeURIComponent(`${query} in ${location}`);
  let url: string = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${GOOGLE_API_KEY}`;
  let results: BussinessDetails[] = [];

  // I want to break loop after first 20 results
  let flag = false;
  // Loop to break aafter 5 records
  let MAX_RESULTS = 1;
  while (!flag) {
    const response = await axios.get(url);
    const data = response.data;
    console.log(`📊 Fetched ${data.results.length} results from Google API`);
    for (const place of data.results) {
      console.log(`🔍 Processing place: ${place.name}`);
      const details = await fetchPlaceDetails(place.place_id) as GoogleData;


      // console.log(`📍 Place details: ${JSON.stringify(details)}`);
      results.push({
        name: details.name,
        address: details.formatted_address,
        rating: details.rating,
        user_ratings_total: details.user_ratings_total,
        phone: details.formatted_phone_number || null,
        international_phone: details.international_phone_number || null,
        website: details.website || null,
        opening_hours: details.opening_hours?.weekday_text || null,
        place_id: place.place_id,
        google_maps_url: details.url || null,
        business_status: details.business_status || null,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        types: details.types || null,
        photos: details.photos || null
      });
      if (results.length >= MAX_RESULTS) {
        flag = true; // Set flag to true to break the loop
        break; // Stop after collecting 2 results
      }

    }

    if (data.next_page_token && results.length % 20 === 0) {
      await new Promise(r => setTimeout(r, 2000)); // wait 2s for next page
      url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_API_KEY}`;
    }
  }
  console.log(`✅ Fetched ${JSON.stringify(results.length)} businesses for query: ${query} in location: ${location}`);
  const fileName = `${location.split(' ').join('_')} ${Math.random().toString()}.json`;
  const transformedResults: TransformSchema[] = [];
  for (const result of results) {
    
    const transformedResult = await transformGoogleDataWithChatGPT(result) as TransformSchema;
    transformedResults.push(transformedResult);
  }

  await writeToJson(transformedResults, fileName);
  return { fileName, resultsCount: results.length, transformedResults };
}

export default fetchBusinesses;
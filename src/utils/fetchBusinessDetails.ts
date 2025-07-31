import axios from "axios";
import fetchPlaceDetails from "./fetchPlaceDetails";
import writeToJson from "./writeToJson";
const { GOOGLE_API_KEY } = process.env;

async function fetchBusinesses(query: string, location: string) {
  const encodedQuery = encodeURIComponent(`${query} in ${location}`);
  let url: string = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${GOOGLE_API_KEY}`;
  let results = [];

  while (url) {
    const response = await axios.get(url);
    const data = response.data;

    for (const place of data.results) {
      const details = await fetchPlaceDetails(place.place_id);
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
    }

    if (data.next_page_token && results.length % 20 === 0) {
      await new Promise(r => setTimeout(r, 2000)); // wait 2s for next page
      url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_API_KEY}`;
    } else {
       return results;
    }
  }
  const fileName = `${location} ${new Date().toString()}.json`;
  writeToJson(results, fileName);
  return { fileName, resultsCount: results.length };
}

export default fetchBusinesses;
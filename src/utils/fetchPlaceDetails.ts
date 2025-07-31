import axios from "axios";
const { GOOGLE_API_KEY } = process.env;
async function fetchPlaceDetails(placeId: string) {
  const fields = [
    'name',
    'formatted_address',
    'formatted_phone_number',
    'international_phone_number',
    'website',
    'opening_hours',
    'geometry',
    'photos',
    'types',
    'rating',
    'user_ratings_total',
    'business_status',
    'url'
  ].join(',');

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`;
  const res = await axios.get(url);
  return res.data.result;
}

export default fetchPlaceDetails;
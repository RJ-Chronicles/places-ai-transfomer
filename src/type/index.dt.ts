interface BussinessDetails {
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
  phone: string | null;
  international_phone: string | null;
  website: string | null;
  opening_hours: string[] | null;
  place_id: string;
  google_maps_url: string | null;
  business_status: string | null;
  latitude: number;
  longitude: number;
  types: string[] | null;
  photos: string[] | null;
}

interface GoogleData {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours?: {
    weekday_text: string[];
  };
  photos?: string[];
  place_id: string;
  url?: string;
  business_status?: string;
  rating: number;
  user_ratings_total: number;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  types?: string[];
}

interface TransformSchema {
  owner_name: string;
    business_name: string;
    business_categories: string[];
    business_subcategories: string[];
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    business_start_time: string;
    business_end_time: string;
    business_desc: string;
    mobile: string;
    email: string;
    whatsapp_number: string;
    social_link: string;
    business_type: string;
    is_area: number;
    address: string;
    city: string;
    landmark: string;
    pincode: string;
    area_lat: number;
    area_lng: number;
    a_to_b_startlat: number | null;
    a_to_b_startlng: number | null;
    a_to_b_endlat: number | null;
    a_to_b_endlng: number | null;
    start_address: string | null;
    end_address: string | null;
    images: string[];

}
export type { BussinessDetails, GoogleData, TransformSchema };
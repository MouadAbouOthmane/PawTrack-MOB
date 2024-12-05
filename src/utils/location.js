import axios from 'axios';

export async function getLocationDetails(latitude, longitude) {
  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        headers: {
          'User-Agent': 'YourAppName/1.0 (your-email@example.com)',
        },
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json',
          addressdetails: 1,
          'accept-language': 'en',
        },
      },
    );

    const address = response.data.address;
    const location = [
      address.road || '',
      address.road ? ', ' : '',
      address.suburb || address.city || '',
    ]
      .join('')
      .trim();

    return location;
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}

export const LOCATION_DATA = {
  countries: [
    {id: 'TR', name: 'Turkey', code: 'TR'},
    {id: 'US', name: 'United States', code: 'US'},
    {id: 'UK', name: 'United Kingdom', code: 'UK'},
    {id: 'DE', name: 'Germany', code: 'DE'},
    {id: 'FR', name: 'France', code: 'FR'},
  ],
  provinces: {
    TR: [
      {id: 'ankara', name: 'Ankara'},
      {id: 'istanbul', name: 'Istanbul'},
      {id: 'izmir', name: 'Izmir'},
      {id: 'antalya', name: 'Antalya'},
    ],
    US: [
      {id: 'california', name: 'California'},
      {id: 'texas', name: 'Texas'},
      {id: 'florida', name: 'Florida'},
      {id: 'new_york', name: 'New York'},
    ],
  },
  cities: {
    ankara: [
      {id: 'cankaya', name: 'Çankaya'},
      {id: 'kecioren', name: 'Keçiören'},
      {id: 'yenimahalle', name: 'Yenimahalle'},
      {id: 'mamak', name: 'Mamak'},
    ],
    california: [
      {id: 'los_angeles', name: 'Los Angeles'},
      {id: 'san_francisco', name: 'San Francisco'},
      {id: 'san_diego', name: 'San Diego'},
    ],
  },
  neighborhoods: {
    cankaya: [
      {
        id: 'kizilay',
        name: 'Kızılay',
        coordinates: [
          {latitude: 39.9208, longitude: 32.8541},
          {latitude: 39.9208, longitude: 32.8641},
          {latitude: 39.9108, longitude: 32.8641},
          {latitude: 39.9108, longitude: 32.8541},
        ],
        center: {latitude: 39.9158, longitude: 32.8591},
      },
      {
        id: 'tunali',
        name: 'Tunalı Hilmi',
        coordinates: [
          {latitude: 39.9058, longitude: 32.8491},
          {latitude: 39.9058, longitude: 32.8591},
          {latitude: 39.8958, longitude: 32.8591},
          {latitude: 39.8958, longitude: 32.8491},
        ],
        center: {latitude: 39.9008, longitude: 32.8541},
      },
    ],
  },
};
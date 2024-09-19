interface AirQualityParams {
  pm10: number;
  pm25: number;
  so2: number;
  o3: number;
  no2: number;
}

export function checkAirQuality(params: AirQualityParams): string {
  const thresholds = [
    { param: 'pm10', sedang: 50, tidakSehat: 100 },
    { param: 'pm25', sedang: 35, tidakSehat: 75 },
    { param: 'so2', sedang: 20, tidakSehat: 50 },
    { param: 'o3', sedang: 60, tidakSehat: 120 },
    { param: 'no2', sedang: 50, tidakSehat: 100 }
  ];

  let kategori = 'BAIK';

  for (const { param, sedang, tidakSehat } of thresholds) {
    if (params[param as keyof AirQualityParams] > tidakSehat) {
      return 'TIDAK SEHAT';
    } else if (params[param as keyof AirQualityParams] > sedang) {
      kategori = 'SEDANG';
    }
  }

  return kategori;
}

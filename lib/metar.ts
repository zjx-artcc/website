export type MetarObject = {
  raw_text: string;
  raw_parts: string[];
  icao?: string;
  observed?: string;
  wind?: {
    degrees: number;
    degrees_from?: number;
    degrees_to?: number;
    speed_kts: number;
    speed_mps: number;
    gust_kts: number;
    gust_mps: number;
  };
  visibility?: {
    miles: string;
    miles_float: number;
    meters: string;
    meters_float: number;
  };
  conditions?: { code: string }[];
  clouds?: {
    code: string;
    base_feet_agl: number;
    base_meters_agl: number;
  }[];
  ceiling?: {
    code: string;
    feet_agl: number;
    meters_agl: number;
  };
  temperature?: {
    celsius: number;
    fahrenheit: number;
  };
  dewpoint?: {
    celsius: number;
    fahrenheit: number;
  };
  humidity_percent?: number;
  barometer?: {
    hg: number;
    kpa: number;
    mb: number;
  };
  flight_category: 'VFR' | 'MVFR' | 'IFR' | 'LIFR' | '';
};

type CloudType = 'FEW' | 'SCT' | 'BKN' | 'OVC';

const celsiusToFahrenheit = (celsius: number): number => celsius * 1.8 + 32;
const feetToMeters = (feet: number): number => feet * 0.3048;
const milesToMeters = (miles: number): number => miles * 1609.344;
const metersToMiles = (meters: number): number => meters / 1609.344;
const inhgToKpa = (inHg: number): number => inHg * 3.386389;
const kpaToInhg = (kpa: number): number => kpa / 3.386389;
const kphToMps = (kph: number): number => kph / 3.6;
const mpsToKts = (mps: number): number => mps * 1.9438445;
const ktsToMps = (kts: number): number => kts / 1.9438445;

const metarParser = (metarString: string): MetarObject => {
  const metarArray = metarString
    .trim()
    .replace(/^METAR\S*?\s/, '')
    .replace(
      /(\s)(\d)\s(\d)\/(\d)(SM)/,
      (all, a, b, c, d, e) =>
        a + (Number(b) * Number(d) + Number(c)) + '/' + d + e,
    )
    .split(' ');

  if (metarArray.length < 3) {
    throw new Error('Not enough METAR information found');
  }

  const metarObject: MetarObject = {
    raw_text: metarString,
    raw_parts: metarArray,
    flight_category: '',
  };

  const calcHumidity = (temp: number, dew: number): number => {
    return (
      Math.exp((17.625 * dew) / (243.04 + dew)) /
      Math.exp((17.625 * temp) / (243.04 + temp))
    );
  };

  const round = (value: number, toNext: number = 500): number => {
    return Math.round(value / toNext) * toNext;
  };

  let mode = 0;
  metarArray.forEach((metarPart) => {
    let match;
    if (mode < 3 && /^(\d+)(?:\/(\d+))?(SM)?$/.test(metarPart)) {
      mode = 3; // no wind reported
    }
    if (mode < 5 && /^(FEW|SCT|BKN|OVC)(\d+)?$/.test(metarPart)) {
      mode = 5; // no visibility / conditions reported
    }
    if (
      mode < 6 &&
      (/^M?\d+\/M?\d+$/.test(metarPart) || /^\/\/\/\/\/$/.test(metarPart))
    ) {
      mode = 6; // end of clouds
    }
    switch (mode) {
      case 0:
        metarObject.icao = metarPart;
        mode = 1;
        break;
      case 1:
        match = metarPart.match(/^(\d\d)(\d\d)(\d\d)Z$/);
        if (match) {
          const observed = new Date();
          observed.setUTCDate(Number(match[1]));
          observed.setUTCHours(Number(match[2]));
          observed.setUTCMinutes(Number(match[3]));
          metarObject.observed = observed.toISOString();
          mode = 2;
        }
        break;
      case 2:
        match = metarPart.match(/^(\d\d\d|VRB)P?(\d+)(?:G(\d+))?(KT|MPS|KPH)/);
        if (match) {
          const windSpeed = Number(match[2]);
          const windGust = match[3] ? Number(match[3]) : windSpeed;
          const windUnit = match[4];
          const speedMps =
            windUnit === 'KPH'
              ? kphToMps(windSpeed)
              : windUnit === 'MPS'
                ? windSpeed
                : ktsToMps(windSpeed);
          const gustMps =
            windUnit === 'KPH'
              ? kphToMps(windGust)
              : windUnit === 'MPS'
                ? windGust
                : ktsToMps(windGust);

          metarObject.wind = {
            degrees: match[1] === 'VRB' ? 180 : Number(match[1]),
            speed_kts: windUnit === 'MPS' ? mpsToKts(speedMps) : windSpeed,
            speed_mps: speedMps,
            gust_kts: windUnit === 'MPS' ? mpsToKts(gustMps) : windGust,
            gust_mps: gustMps,
          };
          if (match[1] === 'VRB') {
            metarObject.wind.degrees_from = 0;
            metarObject.wind.degrees_to = 359;
          }
          mode = 3;
        }
        break;
      case 3:
        match = metarPart.match(/^(\d+)(?:\/(\d+))?(SM)?$/);
        if (match) {
          const visibilityValue = match[2]
            ? Number(match[1]) / Number(match[2])
            : Number(match[1]);
          const isMiles = match[3] === 'SM';
          metarObject.visibility = {
            miles: isMiles
              ? String(visibilityValue)
              : metersToMiles(visibilityValue).toFixed(1),
            miles_float: isMiles
              ? visibilityValue
              : metersToMiles(visibilityValue),
            meters: isMiles
              ? String(milesToMeters(visibilityValue))
              : String(visibilityValue),
            meters_float: isMiles
              ? milesToMeters(visibilityValue)
              : visibilityValue,
          };
          mode = 4;
        } else if (metarPart === 'CAVOK' || metarPart === 'CLR') {
          metarObject.visibility = {
            miles: '10',
            miles_float: 10,
            meters: String(milesToMeters(10)),
            meters_float: milesToMeters(10),
          };
          mode = 5; // no clouds & conditions reported
        } else if (metarObject.wind) {
          // Variable wind direction
          match = metarPart.match(/^(\d+)V(\d+)$/);
          if (match) {
            metarObject.wind.degrees_from = Number(match[1]);
            metarObject.wind.degrees_to = Number(match[2]);
          }
        }
        break;
      case 4:
        // Conditions
        match = metarPart.match(
          /^(\+|-|VC|RE)?([A-Z][A-Z])([A-Z][A-Z])?([A-Z][A-Z])?$/,
        );
        if (match) {
          if (!metarObject.conditions) {
            metarObject.conditions = [];
          }
          match
            .filter((m, index) => index !== 0 && m)
            .forEach((m) => {
              metarObject.conditions?.push({ code: m });
            });
          // may occur multiple times
        }
        break;
      case 5:
        // Clouds
        match = metarPart.match(/^(FEW|SCT|BKN|OVC)(\d+)/);
        if (match) {
          if (!metarObject.clouds) {
            metarObject.clouds = [];
          }
          const cloudBaseFeet = Number(match[2]) * 100;
          const cloud = {
            code: match[1] as CloudType,
            base_feet_agl: cloudBaseFeet,
            base_meters_agl: feetToMeters(cloudBaseFeet),
          };
          metarObject.clouds.push(cloud);
        }
        break;
      case 6:
        // Temperature
        match = metarPart.match(/^(M?\d+)\/(M?\d+)$/);
        if (match === null && /^\/\/\/\/\/$/.test(metarPart)) {
          mode = 7;
          break;
        }
        if (match) {
          const temperatureCelsius = Number(match[1].replace('M', '-'));
          const dewpointCelsius = Number(match[2].replace('M', '-'));
          metarObject.temperature = {
            celsius: temperatureCelsius,
            fahrenheit: celsiusToFahrenheit(temperatureCelsius),
          };
          metarObject.dewpoint = {
            celsius: dewpointCelsius,
            fahrenheit: celsiusToFahrenheit(dewpointCelsius),
          };
          metarObject.humidity_percent =
            calcHumidity(temperatureCelsius, dewpointCelsius) * 100;
          mode = 7;
        }
        break;
      case 7:
        // Pressure
        match = metarPart.match(/^(Q|A)(\d+)/);
        if (match) {
          const pressureValue = Number(match[2]);
          const pressure =
            match[1] === 'Q' ? pressureValue / 10 : pressureValue / 100;
          metarObject.barometer = {
            hg: match[1] === 'Q' ? kpaToInhg(pressure) : pressure,
            kpa: match[1] === 'Q' ? pressure : inhgToKpa(pressure),
            mb: match[1] === 'Q' ? pressure * 10 : inhgToKpa(pressure * 10),
          };
          mode = 8;
        }
        break;
    }
  });

  if (!metarObject.visibility) {
    metarObject.visibility = {
      miles: '10',
      miles_float: 10,
      meters: String(milesToMeters(10)),
      meters_float: milesToMeters(10),
    };
  }

  // Finishing touches

  metarObject.visibility.miles = String(
    round(Number(metarObject.visibility.miles), 0.5),
  );
  metarObject.visibility.meters = String(
    round(Number(metarObject.visibility.meters)),
  );

  if (metarObject.clouds) {
    const highestCloud = metarObject.clouds[metarObject.clouds.length - 1];
    metarObject.ceiling = {
      code: highestCloud.code,
      feet_agl: highestCloud.base_feet_agl,
      meters_agl: highestCloud.base_meters_agl,
    };
  }

  metarObject.flight_category = '';
  if (
    metarObject.visibility.miles_float > 5 &&
    (!metarObject.ceiling || metarObject.ceiling.feet_agl > 3000)
  ) {
    metarObject.flight_category = 'VFR';
  } else if (
    metarObject.visibility.miles_float >= 3 &&
    (!metarObject.ceiling || metarObject.ceiling.feet_agl >= 1000)
  ) {
    metarObject.flight_category = 'MVFR';
  } else if (
    metarObject.visibility.miles_float >= 1 &&
    (!metarObject.ceiling || metarObject.ceiling.feet_agl >= 500)
  ) {
    metarObject.flight_category = 'IFR';
  } else {
    metarObject.flight_category = 'LIFR';
  }

  return metarObject;
};

export default metarParser;
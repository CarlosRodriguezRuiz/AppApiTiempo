// Servicio que consulta el tiempo de una ciudad.
// Si hay OPENWEATHER_API_KEY en .env usa OpenWeather; si no, Open-Meteo (no necesita clave).

const getWeatherOpenWeather = async (city, apiKey) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ciudad no encontrada');
  return {
    city: `${data.name}, ${data.sys.country}`,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed * 3.6),
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    source: 'OpenWeather'
  };
};

// Códigos de tiempo WMO usados por Open-Meteo
const WMO = {
  0: 'despejado', 1: 'mayormente despejado', 2: 'parcialmente nublado', 3: 'nublado',
  45: 'niebla', 48: 'niebla con escarcha', 51: 'llovizna ligera', 53: 'llovizna', 55: 'llovizna intensa',
  61: 'lluvia ligera', 63: 'lluvia', 65: 'lluvia intensa', 71: 'nieve ligera', 73: 'nieve', 75: 'nieve intensa',
  80: 'chubascos', 81: 'chubascos fuertes', 82: 'chubascos violentos', 95: 'tormenta', 96: 'tormenta con granizo', 99: 'tormenta con granizo'
};
const wmoIcon = (c) =>
  c === 0 ? '01d' : c <= 2 ? '02d' : c === 3 ? '04d' : c <= 48 ? '50d' : c <= 65 ? '10d' : c <= 75 ? '13d' : c <= 82 ? '09d' : '11d';

const getWeatherOpenMeteo = async (city) => {
  const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es`);
  const geo = await geoRes.json();
  if (!geo.results || geo.results.length === 0) throw new Error('Ciudad no encontrada');
  const { latitude, longitude, name, country_code } = geo.results[0];
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`);
  const { current } = await res.json();
  return {
    city: `${name}, ${country_code}`,
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    wind: Math.round(current.wind_speed_10m),
    description: WMO[current.weather_code] || 'desconocido',
    icon: `https://openweathermap.org/img/wn/${wmoIcon(current.weather_code)}@2x.png`,
    source: 'Open-Meteo'
  };
};

const getWeather = (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  return apiKey ? getWeatherOpenWeather(city, apiKey) : getWeatherOpenMeteo(city);
};

module.exports = { getWeather };

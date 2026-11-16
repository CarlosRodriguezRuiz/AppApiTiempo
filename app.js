require('dotenv').config(); // Leer fichero .env
const express = require('express');
const path = require('path');
const { getWeather } = require('./services/weather.service');

const app = express();
const port = process.env.PORT || 3000;

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Para leer el body del formulario

// GET / -> formulario vacío
app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null, city: '' });
});

// POST / -> consulta el tiempo de la ciudad enviada
app.post('/', async (req, res) => {
  const city = (req.body.city || '').trim();
  if (!city) return res.render('index', { weather: null, error: 'Escribe una ciudad', city });
  try {
    const weather = await getWeather(city);
    res.render('index', { weather, error: null, city });
  } catch (error) {
    res.render('index', { weather: null, error: `Error: ${error.message}`, city });
  }
});

// 404
app.use((req, res) => {
  res.status(404).render('404', { url: req.url });
});

if (require.main === module) {
  app.listen(port, () => console.log(`Weather App escuchando en http://localhost:${port}`));
}

module.exports = app; // Necesario para Vercel

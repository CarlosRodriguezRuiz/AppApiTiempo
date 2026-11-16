# Weather App · Express + EJS

App del tiempo con **Node.js + Express + EJS** que consulta la API de OpenWeather (o Open-Meteo si no hay clave configurada).

## Instalación

```bash
npm install
cp .env.example .env   # añade tu OPENWEATHER_API_KEY
npm run dev
```

Abre http://localhost:3000, escribe una ciudad y pulsa **Ver tiempo**.

## Estructura

- `app.js`: servidor Express, motor EJS, rutas `GET /` y `POST /`, página 404
- `services/weather.service.js`: llamada a la API del tiempo
- `views/`: plantillas EJS (`index`, `404`, `partials/head`, `partials/footer`)
- `public/css`: estilos
- `.env`: claves privadas (ignorado en `.gitignore`)

## Despliegue

Desplegado en Vercel (`vercel.json`). La variable `OPENWEATHER_API_KEY` se configura en el panel de Vercel (Settings → Environment Variables).
# AppApiTiempo

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;
const API_KEY = 'a3275386e76dbb1d61f1fec533fc49e4';
const BASE_URL = 'http://api.weatherstack.com/current';

app.use(express.json());

// Route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Weather Service! Use- /weather?city=CityName');
});

// Weather route
app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).send('City is required');
    }

    try {
        const response = await axios.get(`${BASE_URL}?access_key=${API_KEY}&query=${encodeURIComponent(city)}`);
        const data = response.data;

        if (data.error) {
            return res.status(404).send(data.error.info);
        }

        const weather = {
            location: data.location.name,
            temperature: data.current.temperature,
            description: data.current.weather_descriptions[0],
            feels_like: data.current.feelslike,
            humidity: data.current.humidity,
            wind_speed: data.current.wind_speed
        };

        res.json(weather);
    } catch (error) {
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Weather service running at http://localhost:${port}`);
});

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Check WeatherAPI.com connectivity
        await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=Dhaka`);
        
        res.status(200).json({
            status: "healthy",
            server: process.env.SERVER_NAME || "server1",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            external_api: "reachable"
        });
    } catch (error) {
        res.status(503).json({
            status: "unhealthy",
            error: "Weather API unreachable",
            details: error.message
        });
    }
});

// Hello Endpoint (Returns server info + Dhaka weather)
app.get('/api/hello', async (req, res) => {
    try {
        // Fetch Dhaka weather
        const weatherResponse = await axios.get(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=Dhaka&aqi=no`
        );

        // Format datetime as YYMMDDHHmm
        const now = new Date();
        const datetime = now.toISOString().replace(/[-:T.Z]/g, '').substring(2, 12);

        // Construct response
        res.json({
            hostname: process.env.SERVER_NAME || "server1",
            datetime: datetime,
            version: process.env.VERSION || "1.0.0",
            weather: {
                dhaka: {
                    temperature: weatherResponse.data.current.temp_c.toString(),
                    temp_unit: "c",
                    condition: weatherResponse.data.current.condition.text,
                    humidity: weatherResponse.data.current.humidity
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch weather data",
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

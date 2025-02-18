import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import geoJson from "/public/geo.json";
import cityData from "/public/city_mapping.json";

const RJMap = ({ onSelect }) => {
    const cityMappings = cityData;

    const [cityColors, setCityColors] = useState({});
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedGeocode, setSelectedGeocode] = useState(null);

    useEffect(() => {
        // Generate unique random color values for each city
        const colors = {};
        geoJson.features.forEach((feature) => {
            const cityName = feature.properties.NOME; // Extract city name from properties
            colors[cityName] = Math.random(); // Assign a unique value
        });

        setCityColors(colors);
    }, []);

    const handleCityClick = (event) => {
        if (event.points.length > 0) {
            const cityName = event.points[0].location;
            setSelectedCity(cityName);

            // Find geocode in cityMappings (case-insensitive)
            const geocode = Object.keys(cityMappings).find(
                (key) => key.toLowerCase() === cityName.toLowerCase()
            );

            // Pass both city name and geocode to onSelect
            onSelect(cityName, geocode ? cityMappings[geocode] : "Unknown");
        }
    };

    return (
        <div>
            <Plot
                data={[
                    {
                        type: "choroplethmapbox",
                        geojson: geoJson,
                        locations: Object.keys(cityColors), // City names from GeoJSON
                        z: Object.values(cityColors), // Assign unique colors
                        featureidkey: "properties.NOME", // Match city names
                        colorscale: "Viridis",
                        marker: { line: { width: 1, color: "#000" } },
                        showscale: true,
                    },
                ]}
                layout={{
                    mapbox: {
                        style: "carto-positron",
                        center: { lat: -22.1, lon: -42.7 },
                        zoom: 7,
                    },
                    margin: { t: 0, b: 0, l: 0, r: 0 },
                    width: 1200,
                    height: 550,
                }}
                config={{ responsive: true }}
                onClick={handleCityClick} // Handle click event
            />
        </div>
    );
};

export default RJMap;

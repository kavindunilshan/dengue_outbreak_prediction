import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import geoJson from "/public/geo.json";
import cityData from "/public/city_mapping.json";
import normalizedData from "/public/total_cases_by_geocode.json";

const RJMap = ({ onSelect }) => {
    const cityMappings = cityData;

    const [cityColors, setCityColors] = useState({});
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        const colors = {};

        geoJson.features.forEach((feature) => {
            const cityName = feature.properties.NOME; // Extract city name from properties

            // Find geocode in cityMappings
            const geocode = feature.properties.GEOCODIGO;

            console.log(normalizedData[3300100], normalizedData[geocode])

            // Get the normalized value (default to 0 if not found)
            const normalizedValue = geocode ? normalizedData[geocode] : 0;

            console.log("val", normalizedValue)

            // Generate a red color based on the normalized value (0 -> light red, 1 -> dark red)
            const colorIntensity = Math.floor(normalizedValue * 255);
            colors[cityName] = Math.random();
            // colors[cityName] = `rgb(255, ${255 - colorIntensity}, ${255 - colorIntensity})`;
        });

        console.log(colors)
        setCityColors(colors);
    }, []);

    const handleCityClick = (event) => {
        if (event.points.length > 0) {
            const cityName = event.points[0].location;
            setSelectedCity(cityName);

            // Find geocode in cityMappings
            const geocode = Object.keys(cityMappings).find(
                (key) => key.toLowerCase() === cityName.toLowerCase()
            );

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
                        z: Object.values(cityColors), // Assign colors based on normalized data
                        featureidkey: "properties.NOME",
                        colorscale: [
                            [0, "rgb(255, 230, 230)"], // Light red for low cases
                            [1, "rgb(255, 0, 0)"], // Dark red for high cases
                        ],
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
                onClick={handleCityClick}
            />
        </div>
    );
};

export default RJMap;

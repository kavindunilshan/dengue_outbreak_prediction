import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import geoJson from "/public/geo.json";

const RJMap = () => {
    const [cityColors, setCityColors] = useState({});

    useEffect(() => {
        // Generate unique random color values for each city
        const colors = {};
        geoJson.features.forEach((feature) => {
            const cityName = feature.properties.NOME; // Extract city name from properties
            colors[cityName] = Math.random(); // Assign a unique value
        });

        setCityColors(colors);
    }, []);

    return (
        <Plot
            data={[
                {
                    type: "choroplethmapbox",
                    geojson: geoJson,
                    locations: Object.keys(cityColors), // City names from GeoJSON
                    z: Object.values(cityColors), // Assign unique colors
                    featureidkey: "properties.NOME", // Match city names
                    colorscale: "Viridis", // Change color theme: "Blues", "Reds", "Cividis"
                    marker: { line: { width: 1, color: "#000" } }, // Black borders
                    showscale: true, // Show color legend
                },
            ]}
            layout={{
                mapbox: {
                    style: "carto-positron",
                    center: { lat: -22.2, lon: -43.2 }, // Center on Rio de Janeiro
                    zoom: 7,
                },
                margin: { t: 0, b: 0, l: 0, r: 0 },
                width: 1100,
                height: 600,
            }}
            config={{ responsive: true }}
        />
    );
};

export default RJMap;

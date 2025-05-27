import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import geoJson from "/public/geo.json";
import cityData from "/public/city_mapping.json";
import normalizedData from "/public/outbreak.json";

const RJMap = ({ onSelect }) => {
    const cityMappings = cityData;

    const [cityValues, setCityValues] = useState({});
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        const values = {};

        geoJson.features.forEach((feature) => {
            const cityName = feature.properties.NOME;
            const geocode = feature.properties.GEOCODIGO;
            const value = normalizedData[geocode] ?? 0;

            // Bucket values to discrete levels:
            let bucket = 0; // default: no cases
            if (value < 1) bucket = 1;
            else if (value < 10) bucket = 2;
            else if (value < 30) bucket = 3;
            else if (value < 50) bucket = 4;
            else if (value < 100) bucket = 5;
            else bucket = 6;

            values[cityName] = bucket;
        });

        setCityValues(values);
    }, []);

    const handleCityClick = (event) => {
        if (event.points.length > 0) {
            const cityName = event.points[0].location;
            setSelectedCity(cityName);

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
                        locations: Object.keys(cityValues),
                        z: Object.values(cityValues),
                        featureidkey: "properties.NOME",
                        colorscale: [
                            [0, "#f0f0f0"], // no data / 0
                            [0.17, "#ffebee"], // <1 (very light red)
                            [0.34, "#ffcdd2"], // 1–10
                            [0.51, "#ef9a9a"], // 10–30
                            [0.68, "#e57373"], // 30–50
                            [0.85, "#ef5350"], // 50–100
                            [1, "#b71c1c"],   // >100 (dark red)
                        ],
                        colorbar: {
                            title: "Dengue Cases",
                            tickvals: [1, 2, 3, 4, 5, 6],
                            ticktext: [
                                "<1",
                                "1–10",
                                "10–30",
                                "30–50",
                                "50–100",
                                "100+"
                            ],
                        },
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
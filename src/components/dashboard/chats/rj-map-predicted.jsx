import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import geoJson from "/public/geo.json";
import cityData from "/public/city_mapping.json";

const RJMapPredicted = ({ predictions, onSelect }) => {
    const cityMappings = cityData;
    const [cityValues, setCityValues] = useState({});

    useEffect(() => {
        if (!predictions || predictions.length === 0) {
            setCityValues({});
            return;
        }

        const valueMap = {};

        geoJson.features.forEach((feature) => {
            const cityName = feature.properties.NOME;
            const geocode = feature.properties.GEOCODIGO.toString();

            const predictionObj = predictions.find((p) => p.geocode.toString() === geocode);
            const value = predictionObj ? predictionObj.prediction : 0;

            // Bucket values to discrete levels:
            let bucket = 0;
            if (value < 1) bucket = 1;
            else if (value < 10) bucket = 2;
            else if (value < 30) bucket = 3;
            else if (value < 50) bucket = 4;
            else if (value < 100) bucket = 5;
            else bucket = 6;

            valueMap[cityName] = bucket;
        });

        setCityValues(valueMap);
    }, [predictions]);

    const handleCityClick = (event) => {
        if (event.points.length > 0) {
            const cityName = event.points[0].location;
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
                            [0, "#f0f0f0"],
                            [0.17, "#ffebee"],
                            [0.34, "#ffcdd2"],
                            [0.51, "#ef9a9a"],
                            [0.68, "#e57373"],
                            [0.85, "#ef5350"],
                            [1, "#b71c1c"],
                        ],
                        colorbar: {
                            title: "Predicted Cases",
                            tickvals: [1, 2, 3, 4, 5, 6],
                            ticktext: ["<1", "1–10", "10–30", "30–50", "50–100", "100+"],
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

export default RJMapPredicted;
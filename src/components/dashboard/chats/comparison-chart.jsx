import React from "react";
import Plot from "react-plotly.js";

export const WeatherComparisonChart = ({ actualData, weatherData, geocode, year, weatherParam }) => {
    const weeks = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

    if (!geocode || !actualData[geocode] || !weatherData[geocode]) {
        return null;
    }

    const actualTrace = {
        x: weeks,
        y: weeks.map((week, index) => actualData[geocode][year]?.[`Week ${index + 1}`] || 0),
        mode: "lines",
        name: `Cases - ${year}`,
    };

    const weatherTrace = {
        x: weeks,
        y: weeks.map((week, index) => weatherData[geocode][year]?.[`Week ${index + 1}`]?.[weatherParam] || 0),
        mode: "lines",
        name: `${weatherParam} - ${year}`,
        yaxis: "y2",
    };

    return (
        <Plot
            data={[actualTrace, weatherTrace]}
            layout={{
                title: "Actual Dengue Cases vs Weather Data",
                xaxis: { title: "Weeks", tickangle: -45 },
                yaxis: { title: "Number of Cases" },
                yaxis2: {
                    title: weatherParam,
                    overlaying: "y",
                    side: "right",
                },
                legend: {
                    orientation: "h",
                    yanchor: "top",
                    y: 20,
                    xanchor: "left",
                    x: 0.01,
                },
            }}
        />
    );
};

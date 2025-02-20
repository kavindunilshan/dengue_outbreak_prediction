import React from "react";
import Plot from "react-plotly.js";

export const PredictionsChart = ({ actualData, predictedData, geocode, year }) => {
    const weeks = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

    if (!geocode || !actualData[geocode] || !predictedData[geocode]) {
        return null;
    }

    const actualTraces = [year].map((year) => ({
        x: weeks,
        y: weeks.map((week, index) => actualData[geocode][year]?.[`Week ${index + 1}`] || 0),
        mode: "lines",
        name: `Actual - ${year}`,
    }));

    const predictedTraces = [year].map((year) => ({
        x: weeks,
        y: weeks.map((week, index) => {
            const weekKey = `${year}${(index - 1).toString().padStart(2, "0")}`;
            return predictedData[geocode][weekKey] || 0;
        }),
        mode: "lines",
        name: `Predicted - ${year}`,
    }));

    return (
        <Plot
            data={[...actualTraces, ...predictedTraces]}
            layout={{
                title: "Actual vs Predicted Dengue Cases",
                xaxis: { title: "Weeks", tickangle: -45 },
                yaxis: { title: "Number of Cases" },
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
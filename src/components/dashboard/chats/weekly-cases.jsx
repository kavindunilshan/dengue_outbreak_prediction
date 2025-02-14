import React, { useState } from "react";
import Plot from "react-plotly.js";

export const LineChart = ({ data }) => {
    const [selectedYears, setSelectedYears] = useState(new Set(Object.keys(data)));
    const weeks = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

    const toggleYear = (year) => {
        setSelectedYears((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(year)) {
                newSelection.delete(year);
            } else {
                newSelection.add(year);
            }
            return newSelection;
        });
    };

    const traces = Object.keys(data)
        .filter((year) => selectedYears.has(year))
        .map((year) => ({
            x: weeks,
            y: weeks.map((week) => data[year][week] || 0),
            mode: "lines",
            name: year,
        }));

    return (
        <>
            <Plot
                data={traces}
                layout={{
                    title: "Yearly Dengue Cases Distribution",
                    xaxis: { title: "Weeks", tickangle: -45 },
                    yaxis: { title: "Number of Cases" },
                    legend: {
                        orientation: "h",
                        yanchor:"top",
                        y:20,
                        xanchor:"left",
                        x:0.01
                    },
                }}
            />
        </>
    );
};
import React, { useState } from 'react';
import WidgetContainer from "../components/dashboard/widget-container.jsx";
import { LineChart } from "../components/dashboard/chats/weekly-cases.jsx";
import data from "/public/dengue-cases.json";

function Dashboard() {
    const dummyData = data;

    const [selectedYears, setSelectedYears] = useState(Object.keys(dummyData));

    const toggleYear = (year) => {
        setSelectedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    const filteredData = Object.fromEntries(
        Object.entries(dummyData).filter(([year]) => selectedYears.includes(year))
    );

    return (
        <div className="dashboard">
            <div className="widget-grid">
                <WidgetContainer title="Weekly Cases">
                    <div className="year-selection">
                        {Object.keys(dummyData).map(year => (
                            <label key={year}>
                                <input
                                    type="checkbox"
                                    checked={selectedYears.includes(year)}
                                    onChange={() => toggleYear(year)}
                                />
                                {year}
                            </label>
                        ))}
                    </div>
                    <LineChart data={filteredData}/>
                </WidgetContainer>
            </div>
        </div>
    );
}

export default Dashboard;

import React, { useState } from 'react';
import WidgetContainer from "../components/dashboard/widget-container.jsx";
import { LineChart } from "../components/dashboard/chats/weekly-cases.jsx";
import data from "/public/dengue-cases.json";
import RJMap from "../components/dashboard/chats/rj-map.jsx";
import weeklyCases from "/public/weekly_cases.json";

function Dashboard() {
    const dummyData = data;
    const weeklyCasesData = weeklyCases;

    const [selectedYears, setSelectedYears] = useState(Object.keys(dummyData));
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedGeocode, setSelectedGeocode] = useState("3300100");

    const toggleYear = (year) => {
        setSelectedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    const filteredData = Object.fromEntries(
        Object.entries(dummyData).filter(([year]) => selectedYears.includes(year))
    );

    const handleCitySelect = (city, geocode) => {
        setSelectedCity(city)
        setSelectedGeocode(geocode)
    }

    return (
        <div className="dashboard">
            <div className="widget-grid">
                <WidgetContainer title="Cases per epidemilogical weeks">
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

                <WidgetContainer title="Rio de Janeiro state map">
                    <RJMap onSelect={handleCitySelect}/>
                </WidgetContainer>

                <WidgetContainer title={`Cases per epidemilogical weeks for ${selectedCity}`}>
                    <LineChart data={weeklyCasesData[selectedGeocode]}/>
                </WidgetContainer>


            </div>
        </div>
    );
}

export default Dashboard;

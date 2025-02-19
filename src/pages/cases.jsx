import React, {useRef, useState} from 'react';
import WidgetContainer from "../components/dashboard/widget-container.jsx";
import {LineChart} from "../components/dashboard/chats/weekly-cases.jsx";
import RJMap from "../components/dashboard/chats/rj-map.jsx";
import {PredictionsChart} from "../components/dashboard/chats/Predictions.jsx";
import weeklyPredictions from "../../public/weekly_predictions.json";
import data from "../../public/dengue-cases.json";
import weeklyCases from "../../public/actual-weekly_cases.json";

function Cases(props) {
    const dummyData = data;
    const weeklyCasesData = weeklyCases;
    const weeklyPredictionsData = weeklyPredictions;

    const [selectedYears, setSelectedYears] = useState(Object.keys(dummyData));
    const [selectedCity, setSelectedCity] = useState("Angra Dos Reis");
    const [selectedGeocode, setSelectedGeocode] = useState("3300100");

    const targetRef = useRef(null);

    const toggleYear = (year) => {
        setSelectedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    const filteredData = Object.fromEntries(
        Object.entries(dummyData).filter(([year]) => selectedYears.includes(year))
    );

    const scrollToTarget = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleCitySelect = (city, geocode) => {
        setSelectedCity(city)
        setSelectedGeocode(geocode)

        scrollToTarget();
    }

    return (
        <>
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

            <div ref={targetRef}></div>

            <WidgetContainer title={`Cases per epidemiological weeks for ${selectedCity}`}>
                <LineChart data={weeklyCasesData[selectedGeocode]}/>
            </WidgetContainer>

            <WidgetContainer title={`Actual vs Predicted cases for city ${selectedCity}: Year 2022`}>
                <PredictionsChart geocode={selectedGeocode}
                                  actualData={weeklyCasesData}
                                  predictedData={weeklyPredictions}
                                  year={2022}
                />
            </WidgetContainer>

            <WidgetContainer title={`Actual vs Predicted cases for city ${selectedCity}: Year 2021`}>
                <PredictionsChart geocode={selectedGeocode}
                                  actualData={weeklyCasesData}
                                  predictedData={weeklyPredictionsData}
                                  year={2021}
                />
            </WidgetContainer></>
    );
}

export default Cases;
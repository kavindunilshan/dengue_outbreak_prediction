import React, {useRef, useState} from 'react';
import WidgetContainer from "../components/dashboard/widget-container.jsx";
import weeklyCases from "../../public/actual-weekly_cases.json";
import weeklyWeather from "../../public/weather_data.json";
import RJMap from "../components/dashboard/chats/rj-map.jsx";
import {WeatherComparisonChart} from "../components/dashboard/chats/comparison-chart.jsx";

function Weather(props) {
    const weeklyCasesData = weeklyCases;
    const weatherData = weeklyWeather;

    const [selectedCity, setSelectedCity] = useState("Angra Dos Reis");
    const [selectedGeocode, setSelectedGeocode] = useState("3300100");
    const [selectedYear, setSelectedYear] = useState(2022);
    const years = Array.from({ length: 11 }, (_, i) => 2012 + i);

    const targetRef = useRef(null);

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
            <WidgetContainer title="Rio de Janeiro state map">
                <RJMap onSelect={handleCitySelect}/>
            </WidgetContainer>

            <div ref={targetRef}></div>

            <WidgetContainer title={`Cases vs Average Precipitation for city ${selectedCity}: Year ${selectedYear}`}>
                <div>
                    {years.map((year) => (
                        <label key={year}>
                            <input
                                type="radio"
                                value={year}
                                checked={selectedYear === year}
                                onChange={() => setSelectedYear(year)}
                            />
                            {year}
                        </label>
                    ))}
                </div>
                <WeatherComparisonChart
                    geocode={selectedGeocode}
                    actualData={weeklyCasesData}
                    weatherData={weatherData}
                    weatherParam={"Average Precipitation"}
                    year={selectedYear}
                />
            </WidgetContainer>

            <WidgetContainer title={`Cases vs Minimum Temperature for city ${selectedCity}: Year ${selectedYear}`}>
                <div>
                    {years.map((year) => (
                        <label key={year}>
                            <input
                                type="radio"
                                value={year}
                                checked={selectedYear === year}
                                onChange={() => setSelectedYear(year)}
                            />
                            {year}
                        </label>
                    ))}
                </div>
                <WeatherComparisonChart
                    geocode={selectedGeocode}
                    actualData={weeklyCasesData}
                    weatherData={weatherData}
                    weatherParam={"Minimum Temperature"}
                    year={selectedYear}
                />
            </WidgetContainer>

            <WidgetContainer title={`Cases vs Maximum Humidity for city ${selectedCity}: Year ${selectedYear}`}>
                <div>
                    {years.map((year) => (
                        <label key={year}>
                            <input
                                type="radio"
                                value={year}
                                checked={selectedYear === year}
                                onChange={() => setSelectedYear(year)}
                            />
                            {year}
                        </label>
                    ))}
                </div>
                <WeatherComparisonChart
                    geocode={selectedGeocode}
                    actualData={weeklyCasesData}
                    weatherData={weatherData}
                    weatherParam={"Maximum Humidity"}
                    year={selectedYear}
                />
            </WidgetContainer>
        </>
    );
}

export default Weather;
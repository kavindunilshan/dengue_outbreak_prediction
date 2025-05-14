import React, {useState} from 'react';
import Cases from "./cases.jsx";
import Weather from "./weather.jsx";
import {Box, Tab, Tabs} from "@mui/material";
import PredictionForm from "./predictions.jsx";
import BulkPredictionForm from "./bulk-predictions.jsx";

function Dashboard() {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div className="dashboard">

            <Box sx={{ width: "100%" }}>
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
                    <Tab label="Cases" />
                    <Tab label="Weather Comparison" />
                    <Tab label="Predictions" />
                    <Tab label="Bulk Predictions" />
                </Tabs>
            </Box>

            <div className="widget-grid">
                { tabIndex === 0 && <Cases />}
                { tabIndex === 1 && <Weather />}
                { tabIndex === 2 && <PredictionForm /> }
                { tabIndex === 3 && <BulkPredictionForm /> }
            </div>
        </div>
    );
}

export default Dashboard;

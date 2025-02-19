import React, {useState} from 'react';
import Cases from "./cases.jsx";
import Weather from "./weather.jsx";
import {Box, Tab, Tabs, Typography} from "@mui/material";

function Dashboard() {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div className="dashboard">

            <Box sx={{ width: "100%" }}>
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
                    <Tab label="Cases" />
                    <Tab label="Weather Comparison" />
                </Tabs>
            </Box>

            <div className="widget-grid">
                { tabIndex === 0 && <Cases />}
                { tabIndex === 1 && <Weather />}
            </div>
        </div>
    );
}

export default Dashboard;

import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Box,
    Grid,
    Tabs,
    Tab,
    MenuItem
} from '@mui/material';
import cityMappings from "/public/city_mapping.json";
import '../styles/dashboard/predictions.css';

const PredictionForm = () => {
    const [tab, setTab] = useState(0);
    const [formData, setFormData] = useState({
        casesLag0: '',
        vim: '',
        casesLag1: '',
        week: '',
        tempAvg: '',
        humidityAvg: '',
        precipitationLag3: '',
        precipitationLag4: '',
        population: '',
        geocode: ''
    });
    const [errors, setErrors] = useState({});
    const [prediction, setPrediction] = useState({ nextWeek: null, weekAfter: null });

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setPrediction({ nextWeek: null, weekAfter: null });
    };

    const validate = () => {
        const newErrors = {};
        if (!/^\d{6}$/.test(formData.week)) {
            newErrors.week = 'Week must be in format like 202152';
        }

        const fields = ['casesLag0', 'casesLag1', 'vim', 'tempAvg', 'humidityAvg', 'population', 'precipitationLag3', 'precipitationLag4'];
        fields.forEach((field) => {
            if (isNaN(formData[field]) || formData[field] === '') {
                newErrors[field] = 'Enter a valid number';
            }
        });

        console.log(formData.geocode);

        if (tab === 1 && !formData.geocode ) {
            newErrors.geocode = 'Geocode is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async () => {
        if (!validate()) return;

        const payload = {
            week: parseInt(formData.week),
            temp_avg: parseFloat(formData.tempAvg),
            humidity_avg: parseFloat(formData.humidityAvg),
            vim: parseFloat(formData.vim),
            cases_lag0: parseFloat(formData.casesLag0),
            cases_lag1: parseFloat(formData.casesLag1),
            precipitation_avg_ordinary_kriging_lag3: parseFloat(formData.precipitationLag3),
            precipitation_avg_ordinary_kriging_lag4: parseFloat(formData.precipitationLag4),
            population: parseFloat(formData.population)
        };

        try {
            if (tab === 0) {
                const [week1Res, week2Res] = await Promise.all([
                    axios.post('http://127.0.0.1:8000/predict-week1', payload),
                    axios.post('http://127.0.0.1:8000/predict-week2', payload)
                ]);
                setPrediction({
                    nextWeek: week1Res.data.prediction,
                    weekAfter: week2Res.data.prediction
                });
            } else {
                const rioPayload = { ...payload, geocode: formData.geocode };
                const res = await axios.post('http://127.0.0.1:8000/predict-rio-week2', rioPayload);
                setPrediction({
                    nextWeek: null,
                    weekAfter: res.data.prediction
                });
            }
        } catch (error) {
            console.error('Prediction API error:', error);
            alert('Prediction failed. Please check the backend or input values.');
        }
    };

    return (
        <Box className="form-wrapper">
            <Card className="form-card" sx={{ boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h5" className="form-title">
                        Dengue Outbreak Predictor
                    </Typography>
                    <Tabs value={tab} onChange={handleTabChange} sx={{ marginTop: 2 }}>
                        <Tab label="🌍 General Prediction" />
                        <Tab label="📍 Rio State Specific" />
                    </Tabs>
                    <Typography className="form-subtitle" sx={{ mt: 2 }}>
                        Enter current data to predict dengue cases for the next two weeks
                    </Typography>

                    <Grid container spacing={2} sx={{ marginTop: '10px' }} className="form-grid">
                        {tab === 1 && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Select Rio City"
                                    name="geocode"
                                    value={formData.geocode}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.geocode}
                                    helperText={errors.geocode}
                                >
                                    {Object.entries(cityMappings).map(([name, code]) => (
                                        <MenuItem key={code} value={code}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="This Week's Dengue Cases"
                                name="casesLag0"
                                value={formData.casesLag0}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 120"
                                error={!!errors.casesLag0}
                                helperText={errors.casesLag0}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Vegetation Index (VIM)"
                                name="vim"
                                value={formData.vim}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 0.67"
                                error={!!errors.vim}
                                helperText={errors.vim}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Week's Dengue Cases"
                                name="casesLag1"
                                value={formData.casesLag1}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 98"
                                error={!!errors.casesLag1}
                                helperText={errors.casesLag1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Week Number (e.g., 202152)"
                                name="week"
                                value={formData.week}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 202152"
                                error={!!errors.week}
                                helperText={errors.week}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Average Temperature (°C)"
                                name="tempAvg"
                                value={formData.tempAvg}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 29.5"
                                error={!!errors.tempAvg}
                                helperText={errors.tempAvg}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Average Humidity (%)"
                                name="humidityAvg"
                                value={formData.humidityAvg}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 84.3"
                                error={!!errors.humidityAvg}
                                helperText={errors.humidityAvg}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Population"
                                name="population"
                                value={formData.population}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 6740000"
                                error={!!errors.population}
                                helperText={errors.population}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Precipitation (Avg 3 weeks ago)"
                                name="precipitationLag3"
                                value={formData.precipitationLag3}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 150"
                                error={!!errors.precipitationLag3}
                                helperText={errors.precipitationLag3}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Precipitation (Avg 4 weeks ago)"
                                name="precipitationLag4"
                                value={formData.precipitationLag4}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Example: 130"
                                error={!!errors.precipitationLag4}
                                helperText={errors.precipitationLag4}
                            />
                        </Grid>
                        <Grid item xs={12} className="button-container">
                            <Button className="predict-btn" onClick={handlePredict}>
                                Predict
                            </Button>
                        </Grid>
                    </Grid>

                    {prediction.weekAfter !== null && (
                        <Box className="result-box">
                            <Typography className="result-title">Prediction Results</Typography>
                            {tab === 0 && (
                                <Typography>🟠 Next Week: {prediction.nextWeek} cases</Typography>
                            )}
                            <Typography>🔴 Week After: {prediction.weekAfter} cases</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PredictionForm;

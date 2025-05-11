import React, { useState } from 'react';
import { TextField, Button, Typography, Card, CardContent, Box, Grid } from '@mui/material';
import '../styles/dashboard/predictions.css';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        casesLag0: '',
        vim: '',
        casesLag1: '',
        week: '',
        tempAvg: '',
        humidityAvg: '',
        precipitationLag3: '',
        precipitationLag4: '',
    });

    const [errors, setErrors] = useState({});
    const [prediction, setPrediction] = useState({ nextWeek: null, weekAfter: null });

    const validate = () => {
        const newErrors = {};
        if (!/^\d{6}$/.test(formData.week)) {
            newErrors.week = 'Week must be in format like 202152';
        }
        ['casesLag0', 'casesLag1', 'vim', 'tempAvg', 'humidityAvg', 'population', 'precipitationLag3', 'precipitationLag4' ].forEach((field) => {
            if (isNaN(formData[field]) || formData[field] === '') {
                newErrors[field] = 'Enter a valid number';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async () => {
        if (!validate()) return;

        const year = parseInt(formData.week.substring(0, 4));
        const weekOfYear = parseInt(formData.week.substring(4, 6));
        const month = Math.floor((weekOfYear - 1) / 4.33) + 1;

        const casesLag0 = parseFloat(formData.casesLag0);
        const population = parseFloat(formData.population);

        const payload = {
            cases_lag0: casesLag0,
            vim: parseFloat(formData.vim),
            cases_lag1: parseFloat(formData.casesLag1),
            cases_per_100k: (casesLag0 / population) * 100000,
            week: formData.week,
            temp_avg: parseFloat(formData.tempAvg),
            month_cos: Math.cos((2 * Math.PI * month) / 12),
            month_sin: Math.sin((2 * Math.PI * month) / 12),
            week_cos: Math.cos((2 * Math.PI * weekOfYear) / 52),
            week_sin: Math.sin((2 * Math.PI * weekOfYear) / 52),
            humidity_avg: parseFloat(formData.humidityAvg),
            precipitation_lag3: parseFloat(formData.precipitationLag3),
            precipitation_lag4: parseFloat(formData.precipitationLag4),
        };

        // Replace this with actual API call
        const dummyPrediction = {
            nextWeek: 45,
            weekAfter: 52,
        };
        setPrediction(dummyPrediction);
    };

    return (
        <Box className="form-wrapper">
            <Card className="form-card" sx={{ boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h5" className="form-title">
                        Dengue Outbreak Predictor
                    </Typography>
                    <Typography className="form-subtitle">
                        Enter current data to predict dengue cases for the next two weeks
                    </Typography>
                    <Grid container spacing={2} sx={{ marginTop: '10px' }} className="form-grid">
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

                    {prediction.nextWeek !== null && (
                        <Box className="result-box">
                            <Typography className="result-title">Prediction Results</Typography>
                            <Typography>🟠 Next Week: {prediction.nextWeek} cases</Typography>
                            <Typography>🔴 Week After: {prediction.weekAfter} cases</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PredictionForm;
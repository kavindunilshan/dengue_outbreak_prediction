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
    });

    const [errors, setErrors] = useState({});
    const [prediction, setPrediction] = useState({ nextWeek: null, weekAfter: null });

    const validate = () => {
        const newErrors = {};
        if (!/^\d{6}$/.test(formData.week)) {
            newErrors.week = 'Week must be in format like 202152';
        }
        if (isNaN(formData.casesLag0)) newErrors.casesLag0 = 'Enter a valid number';
        if (isNaN(formData.casesLag1)) newErrors.casesLag1 = 'Enter a valid number';
        if (isNaN(formData.vim)) newErrors.vim = 'Enter a valid number';
        if (isNaN(formData.tempAvg)) newErrors.tempAvg = 'Enter a valid number';
        if (isNaN(formData.humidityAvg)) newErrors.humidityAvg = 'Enter a valid number';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async () => {
        if (!validate()) return;

        const payload = {
            ...formData,
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
            <Card className="form-card" sx={{
                boxShadow: 2,
            }}>
                <CardContent>
                    <Typography variant="h5" className="form-title">
                        Dengue Outbreak Predictor
                    </Typography>
                    <Typography className="form-subtitle">
                        Enter current data to predict dengue cases for the next two weeks
                    </Typography>
                    <Grid container spacing={2} sx={{marginTop: '10px'}} className="form-grid">
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

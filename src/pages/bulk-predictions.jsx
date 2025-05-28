import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import {
    Button,
    Typography,
    Card,
    CardContent,
    Box,
    Input,
    CircularProgress,
    Alert
} from '@mui/material';

const BulkPredictionForm = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const requiredColumns = [
        'week',
        'temp_avg',
        'humidity_avg',
        'vim',
        'cases_lag0',
        'cases_lag1',
        'precipitation_avg_ordinary_kriging_lag3',
        'precipitation_avg_ordinary_kriging_lag4',
        'population',
        'geocode'
    ];

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResults([]);
        setError('');
    };


    const handleUpload = () => {
        if (!file) {
            setError('Please upload a CSV file.');
            return;
        }

        setLoading(true);
        setError('');
        setResults([]);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                const data = result.data;

                console.log('Parsed CSV Data:', data);

                const hasAllColumns = requiredColumns.every(col =>
                    result.meta.fields.includes(col)
                );

                if (!hasAllColumns) {
                    setError(`CSV file must include all required columns: ${requiredColumns.join(', ')}`);
                    setLoading(false);
                    return;
                }

                // Convert string values to proper types
                const typedData = data.map(row => ({
                    week: Number(row.week),
                    geocode: Number(row.geocode),
                    temp_avg: Number(row.temp_avg),
                    humidity_avg: Number(row.humidity_avg),
                    vim: Number(row.vim),
                    cases_lag0: Number(row.cases_lag0),
                    cases_lag1: Number(row.cases_lag1),
                    precipitation_avg_ordinary_kriging_lag3: Number(row.precipitation_avg_ordinary_kriging_lag3),
                    precipitation_avg_ordinary_kriging_lag4: Number(row.precipitation_avg_ordinary_kriging_lag4),
                    population: Number(row.population),
                }));

                console.log('Typed Data for Prediction:', typedData);

                try {
                    const res = await axios.post('http://127.0.0.1:8000/bulk-predict-json', typedData);
                    setResults(res.data.predictions || []);
                } catch (err) {
                    console.error(err);
                    setError('Prediction failed. Please check the server or CSV data.');
                } finally {
                    setLoading(false);
                }
            },
            error: (err) => {
                console.error('CSV parsing error:', err);
                setError('Error parsing CSV file.');
                setLoading(false);
            }
        });
    };


    return (
        <Box className="form-wrapper">
            <Card className="form-card" sx={{ boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h5" className="form-title">
                        Bulk Dengue Prediction (Rio State)
                    </Typography>
                    <Typography sx={{ mt: 1, mb: 2 }}>
                        Upload a CSV with dengue data for multiple cities in Rio State.
                    </Typography>

                    <Input type="file" accept=".csv" onChange={handleFileChange} />
                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
                        Upload and Predict
                    </Button>

                    {loading && <CircularProgress sx={{ mt: 2 }} />}
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                    {results.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Prediction Results</Typography>
                            {results.map((item, index) => (
                                <Typography key={index}>
                                    📍 {item.geocode} — Predicted Cases: {item.prediction}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default BulkPredictionForm;
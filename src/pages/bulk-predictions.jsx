import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import {
    Typography,
    Button,
    Card,
    CardContent,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const BulkPredictionForm = () => {
    const [csvData, setCsvData] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setCsvData(results.data);
                    setPredictions([]);
                    setError(null);
                },
                error: (err) => setError("CSV parsing failed")
            });
        }
    };

    const handleBulkPredict = async () => {
        if (!csvData.length) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://127.0.0.1:8000/bulk-predict', csvData);
            setPredictions(response.data);
        } catch (err) {
            setError('Prediction failed. Check your input or server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="form-wrapper" sx={{ mt: 4 }}>
            <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Bulk Dengue Outbreak Prediction
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Upload a CSV file to predict dengue cases for the next two weeks
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<UploadFileIcon />}
                            sx={{ mr: 2 }}
                        >
                            Upload CSV
                            <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleBulkPredict}
                            disabled={!csvData.length || loading}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Predict'}
                        </Button>
                    </Box>

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
                    )}

                    {predictions.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Next Week</TableCell>
                                        <TableCell>Week After</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {predictions.map((pred, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{pred.nextWeek}</TableCell>
                                            <TableCell>{pred.weekAfter}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {csvData.length > 0 && predictions.length === 0 && (
                        <Typography sx={{ mt: 2 }} color="text.secondary">
                            Ready to predict {csvData.length} records.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default BulkPredictionForm;
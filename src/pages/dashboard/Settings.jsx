import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '@/api/Settingsapi';
import DynamicFormField from '@/widgets/layout/InputField';
import { Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Settings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                console.log("Fetched Settings:", data);
                setSettings(data.form_fields);
            } catch (err) {
                console.log(err.message)
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Prepare settings for submission
            const formattedSettings = Object.entries(settings).reduce((acc, [key, field]) => {
                acc[key] = field.type === 'file' ? field.value : field.value.toString(); // Handle file input differently
                return acc;
            }, {});
            await saveSettings(formattedSettings);
            toast.success('Settings saved successfully!');
            // Clear fields after successful submission
            setSettings(prevSettings => {
                const clearedSettings = { ...prevSettings };
                Object.keys(clearedSettings).forEach(key => {
                    clearedSettings[key].value = ''; // Reset value to empty string
                });
                return clearedSettings;
            });
        } catch (err) {
                  console.log(err.message)
            toast.error(err.message);
        }
    };

    const handleChange = (name, value) => {
        console.log(`Changing ${name} to ${value}`);
        setSettings((prev) => {
            const newSettings = {
                ...prev,
                [name]: {
                    ...prev[name],
                    value: value,
                }
            };
            console.log("Updated Settings:", newSettings);
            return newSettings;
        });
    };

    if (loading) return <CircularProgress />;
    if (error) {
        toast.error(`Error: ${error}`);
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card sx={{ width: '400px', padding: '16px' }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Settings
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        {Object.entries(settings).map(([key, field]) => (
                            <DynamicFormField
                                key={key}
                                field={{
                                    ...field,
                                    value: field.value || '',
                                    extra: {
                                        onChange: (e) => {
                                            const newValue = field.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
                                            handleChange(key, newValue);
                                        },
                                    },
                                }}
                            />
                        ))}
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Save Settings
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <ToastContainer />
        </div>
    );
};

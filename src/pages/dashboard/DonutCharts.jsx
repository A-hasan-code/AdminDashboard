import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Register required components
Chart.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const [selectedPipeline, setSelectedPipeline] = useState('All');
  const [pipelines, setPipelines] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const colors = ['#0088FE', '#FF6384']; // Colors for incoming and won leads

  // Fetch pipelines data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://lightgray-elephant-928373.hostingersite.com/api/lead_chart');
        const pipelinesData = response.data.pipelines || []; // Default to an empty array if not found
        setPipelines(pipelinesData);
        setSelectedPipeline('All');
      } catch (error) {
        console.error('Error fetching pipelines data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const prepareChartData = () => {
      if (!pipelines.length) return; // Exit early if no pipelines

      const filtered = selectedPipeline === 'All' 
        ? pipelines 
        : pipelines.filter(pipeline => pipeline.name === selectedPipeline);

      const incomingLeads = filtered.reduce((sum, pipeline) => sum + pipeline.incoming_leads, 0);
      console.log(incomingLeads)
      const wonLeads = filtered.reduce((sum, pipeline) => sum + pipeline.won_leads, 0);
console.log(wonLeads)
      setChartData({
        labels: ['Incoming Leads', 'Won Leads'],
        datasets: [{
          label: 'Leads',
          data: [incomingLeads, wonLeads],
          backgroundColor: colors,
        }],
      });
    };

    prepareChartData();
  }, [selectedPipeline, pipelines]);

  const handlePipelineChange = (event) => {
    setSelectedPipeline(event.target.value);
  };

  return (
    <Card sx={{ width: '100%', maxWidth: 400, margin: 'auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h6">Leads Distribution by Pipeline</Typography>
        
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="pipeline-select-label">Select Pipeline</InputLabel>
          <Select
            labelId="pipeline-select-label"
            value={selectedPipeline}
            onChange={handlePipelineChange}
          >
            <MenuItem value="All">All</MenuItem>
            {pipelines.map((pipeline) => (
              <MenuItem key={pipeline.name} value={pipeline.name}>
                {pipeline.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Doughnut data={chartData} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DonutChart;

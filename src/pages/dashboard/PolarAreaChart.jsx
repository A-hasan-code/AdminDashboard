import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PolarArea } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Card, CardContent, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Register required components
Chart.register(ArcElement, Tooltip, Legend, RadialLinearScale);

const PolarAreaChart = () => {
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
        const response = await axios.post('https://red-aardvark-461723.hostingersite.com/api/lead_chart');
        const pipelinesData = response.data.pipelines || []; // Default to an empty array if not found
        setPipelines(pipelinesData);
        setSelectedPipeline('All');
      } catch (error) {
        console.error('Error fetching pipelines data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data whenever the selected pipeline or pipeline data changes
  useEffect(() => {
    const prepareChartData = () => {
      if (!pipelines.length) return; // Exit early if no pipelines

      // Filter pipelines based on selected pipeline
      const filtered = selectedPipeline === 'All' 
        ? pipelines 
        : pipelines.filter(pipeline => pipeline.name === selectedPipeline);

      // Calculate the incoming and won leads
      const incomingLeads = filtered.reduce((sum, pipeline) => sum + pipeline.incoming_leads, 0);
      const wonLeads = filtered.reduce((sum, pipeline) => sum + pipeline.won_leads, 0);

      // Set chart data
      setChartData({
        labels: ['Incoming Leads', 'Won Leads'],
        datasets: [{
          label: 'Leads Distribution',
          data: [incomingLeads, wonLeads],
          backgroundColor: colors,
          borderWidth: 1,
        }],
      });
    };

    prepareChartData();
  }, [selectedPipeline, pipelines]);

  // Handle pipeline selection change
  const handlePipelineChange = (event) => {
    setSelectedPipeline(event.target.value);
  };

  return (
    <div style={{ width: '100%', maxWidth: 350, margin: 'auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{margin:2}}>Leads Distribution by Pipeline</Typography>
        
        <FormControl fullWidth sx={{ marginBottom: 0 }}>
          <InputLabel id="pipeline-select-label">Select Pipeline</InputLabel>
          <Select
            sx={{ marginBottom: 2,justifyContent: 'center', height:'2rem',width:'100%'}}
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

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>  <div style={{ width: '270px', height: '300px' }}>
          <PolarArea data={chartData} /></div>
        </Box>
      </CardContent>
    </div>
  );
};

export default PolarAreaChart;

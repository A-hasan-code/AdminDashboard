import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import { Chart, RadarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Card, CardContent, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Register required components
Chart.register(RadarElement, Tooltip, Legend, CategoryScale, LinearScale);

const RadarChart = () => {
  const [selectedPipeline, setSelectedPipeline] = useState('All');
  const [pipelines, setPipelines] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [], // For Radar chart, these are axis labels
    datasets: [], // Data for each pipeline category
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

  useEffect(() => {
    const prepareChartData = () => {
      if (!pipelines.length) return; // Exit early if no pipelines

      const filtered = selectedPipeline === 'All' 
        ? pipelines 
        : pipelines.filter(pipeline => pipeline.name === selectedPipeline);

      const incomingLeads = filtered.reduce((sum, pipeline) => sum + pipeline.incoming_leads, 0);
      const wonLeads = filtered.reduce((sum, pipeline) => sum + pipeline.won_leads, 0);

      setChartData({
        labels: ['Incoming Leads', 'Won Leads'], // Axis labels for radar chart
        datasets: [{
          label: selectedPipeline === 'All' ? 'All Pipelines' : selectedPipeline,
          data: [incomingLeads, wonLeads], // Data points for each axis
          backgroundColor: colors[0], // Semi-transparent fill for radar
          borderColor: colors[1], // Line color for the radar chart
          borderWidth: 2,
          pointBackgroundColor: colors[1], // Points color on the radar
        }],
      });
    };

    prepareChartData();
  }, [selectedPipeline, pipelines]);

  const handlePipelineChange = (event) => {
    setSelectedPipeline(event.target.value);
  };

  return (
    <div style={{ width: '100%', maxWidth: 350, margin: 'auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{margin:9}}>Leads Distribution by Pipeline</Typography>
        
        <FormControl fullWidth sx={{ marginTop: 8 }}>
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
          <Radar data={chartData} options={{
            responsive: true,
            scales: {
              r: {
                min: 0,
                max: 100, // Adjust as needed for the range of data
                ticks: {
                  stepSize: 10,
                },
              },
            },
            elements: {
              line: {
                borderWidth: 3,
              },
            },
          }} />
        </Box>
      </CardContent>
    </div>
  );
};

export default RadarChart;

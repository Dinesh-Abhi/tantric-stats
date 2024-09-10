const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Function to generate random CPU statuses
const generateRandomCPUStatuses = () => {
  return Array.from({ length: 15 }, (_, index) => {
    const cpuId = index + 1;
    const statuses = ['published', 'started', 'stopped'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const isActive = randomStatus !== 'stopped';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return {
      id: cpuId,
      cpu: `CPU ${cpuId}`,
      status: randomStatus,
      active: isActive,
      timestamp: currentTime
    };
  });
};

// Function to generate random CPU details
const generateRandomCPUDetails = () => {
  return Array.from({ length: 15 }, (_, index) => {
    const cpuId = index + 1;
    return {
      consumption: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      errors: [Math.random() > 0.5 ? 'No errors' : 'Error: Random'],
      usageHistory: Array.from({ length: 3 }, () => Math.floor(Math.random() * 100)),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }).reduce((acc, curr, idx) => {
    acc[idx + 1] = curr;
    return acc;
  }, {});
};

// API to get current CPU statuses
app.get('/cpu-statuses', (req, res) => {
  res.json(generateRandomCPUStatuses());
});

// API to get detailed CPU info by ID
app.get('/cpu/:id', (req, res) => {
  const cpuId = parseInt(req.params.id);
  const cpuDetails = generateRandomCPUDetails();
  const cpuData = cpuDetails[cpuId];
  
  if (cpuData) {
    res.json(cpuData);
  } else {
    res.status(404).json({ error: 'CPU not found' });
  }
});

// Update CPU statuses every 1 minute
setInterval(() => {
  // Force a cache refresh by touching the endpoints
  console.log('CPU data refreshed');
}, 60000);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

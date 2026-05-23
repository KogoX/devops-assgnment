const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Note: In production, these would be environment variables
const PYTHON_WORKER_URL = 'http://<PYTHON_WORKER_INTERNAL_IP>:8000/compute/5'; 
const TS_WORKER_URL = 'http://<TS_WORKER_INTERNAL_IP>:9000/process';

app.post('/infer', async (req, res) => {
  const text = req.body.text || "hello alchemyst";

  try {
    const pythonResponse = await axios.get(PYTHON_WORKER_URL);
    const tsResponse = await axios.post(TS_WORKER_URL, { text: text });

    res.json({
      gateway: "success",
      python: pythonResponse.data,
      typescript: tsResponse.data
    });
  } catch (error) {
    console.error("Worker communication error:", error.message);
    res.status(500).json({ error: "Failed to communicate with workers" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("API Gateway running on port 3000");
});

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Example endpoint for AI integration
app.post('/api/ai', (req, res) => {
  // Simulate AI response
  const { message } = req.body;
  res.json({ reply: `AI response to: ${message}` });
});

app.get('/', (req, res) => {
  res.send('Porter backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

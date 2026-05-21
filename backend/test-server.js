const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/auth/register', (req, res) => {
  console.log('Register request:', req.body);
  res.json({ success: true, message: 'Registration successful!' });
});

app.listen(5000, () => {
  console.log('Test server running on port 5000');
});

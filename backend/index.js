const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'FINX Backend Running', version: '1.0' });
});

// Mock Route for NGO endpoints
app.get('/api/ngos', (req, res) => {
    res.json({
        success: true,
        data: [] // Would connect to Supabase
    });
});

app.listen(PORT, () => {
    console.log(`FINX Backend listening on port ${PORT}`);
});

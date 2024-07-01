const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/post', require('./routes/post'));
app.use('/api/seeker/profile', require('./routes/seekerProfile'));
app.use('/api/application', require('./routes/application'));
app.use('/api/bookmark', require('./routes/bookmark'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/search', require('./routes/search'));
app.use('/api/filter', require('./routes/filter')); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

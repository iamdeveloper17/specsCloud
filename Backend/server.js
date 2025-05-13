const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // ✅ only once
const fs = require('fs');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.log('❌ MongoDB connection failed', err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const catalogueRoutes = require('./routes/catalogue');
app.use('/api/catalogue', catalogueRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const specificationRoutes = require('./routes/specification');
app.use('/api/specification', specificationRoutes);

// ✅ Ensure uploads folder exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log('📂 Created uploads/ folder');
}

// ✅ Serve static files
app.use('/uploads', express.static(uploadsPath));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

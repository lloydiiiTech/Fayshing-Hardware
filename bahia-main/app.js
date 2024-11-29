
const cors = require('cors'); // Import CORS
const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');


app.use(express.json());  // Parse JSON request body
app.use(cors());
app.use('/api/admin', adminRoutes);  

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


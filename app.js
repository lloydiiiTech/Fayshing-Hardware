const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const cors = require('cors');
const Staffroutes = require('./routes/Staffrouter.js');
const Adminroutes = require('./routes/Adminrouter.js');
const path = require('path'); // Import path

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set up flash messages
app.use(flash());

// Enable CORS
app.use(cors());

// JSON middleware for API requests
app.use(express.json());

// Use routes
app.use('/staff', Staffroutes);
app.use('/admin', Adminroutes);

const PORT = process.env.PORT || 2313;
app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));

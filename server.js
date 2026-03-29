require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const superAdminRoutes = require('./routes/superAdminRoute');
const supportAgentRoutes = require('./routes/supportAgentRoute');
const subAdminRoutes = require('./routes/subAdminRoute');
const authRoutes = require('./routes/authRoute');
const leadsRoutes = require('./routes/leadsRoute');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true,
})),
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({extended: true, limit: "20mb"}));
app.use('/', superAdminRoutes);
app.use('/sub-admin', subAdminRoutes);
app.use('/auth', authRoutes);
app.use('/agent', supportAgentRoutes);
app.use('/lead', leadsRoutes);

mongoose.connect(process.env.DB_URL).then(() => {console.log("mogoDB Connected");
app.listen(PORT, () => {
            console.log(`Server is listening on PORT : ${PORT}`);
        })
    })
    .catch(err => {
        console.error(err);
    })

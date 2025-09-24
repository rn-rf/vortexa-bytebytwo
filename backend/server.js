require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//routers of all modules 
const authRouter = require('./routes/authRoutes')
const homeRouter = require('./routes/homeRoutes')
const transcribeRouter = require('./routes/transcribeRoutes')

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/home', homeRouter);
app.use('/api/transcribe', transcribeRouter);


//connect to mongo db
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    //start the server on port 
    app.listen(PORT, () => {
    console.log("connected to db and server started");
    })
})
.catch((err) => {
    console.log('Error : ' + err);
});

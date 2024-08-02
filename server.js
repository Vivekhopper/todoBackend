const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const TaskSchema = require('./model'); // Assuming model.js exports a Mongoose model
const dotenv=require('dotenv')
const app = express();
dotenv.config();
// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors({
    origin:'*'
})); // Enable CORS if needed

app.get('/', (req, res) => {
    res.send("tesla");
});

// Ensure proper URI encoding for MongoDB connection string


mongoose.connect(process.env.mongoUri)
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

app.post('/addtask', async (req, res) => {
    const { todo } = req.body;
    try {
        const newData = new TaskSchema({ todo });
        await newData.save();
        const tasks = await TaskSchema.find();
        return res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving task', error: err.message });
    }
});
app.get('/gettask',async(req,res)=>{
    try{
        return res.json(await TaskSchema.find())
    }
    catch(err){
        console.log(err);
    }
});

app.delete('/delete/:id',async(req,res)=>{
    try{
        await TaskSchema.findByIdAndDelete(req.params.id)
        console.log("deleted")
        return res.json(await TaskSchema.find())
    }
    catch(err){
        console.log(err)
    }
})
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
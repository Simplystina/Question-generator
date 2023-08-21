const mongoose = require('mongoose')
mongoose.Promise= global.Promise;
const dotenv = require("dotenv");
const e = require('express');
dotenv.config()

const connect = mongoose.connection;
mongoose.set('strictQuery', true)

const connectDB = async()=>{
    const url = process.env.MONGO_URL
    
    connect.on('connected', async()=>{
        console.log('MongoDb Connection Established')
    })
    connect.on('reconnected', async()=>{
        console.log('MongoDB Connection Reestablished')
    })
    connect.on('disconnected',()=>{
        console.log('MongoDB Connection Disconnected')
        console.log('Trying to reconnect to Mongo...')

        setTimeout(()=>{
            mongoose.connect(url,{
                useNewurlParser: true,
                useUnifiedTopology: true,
                keepAlive: true,
                socketTimeourMS: 3000,
                connectTimeoutMS: 3000
            })
        }, 3000)
    })
    connect.on('close',() =>{
        console.log('Mongo Connection Closed')
    });
    connect.on('error', (error) => {
        console.log('Mongo Connection Error: '+ error)
    })
    await mongoose
    .connect(url,{
        useNewurlParser: true,
        useUnifiedTopology: true
    })
    .catch((error) => console.log(error))
}

module.exports = {connectDB, connect}
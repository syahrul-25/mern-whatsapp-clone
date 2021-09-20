import express from "express";
import mongoose from 'mongoose'
import Messages from './dbMessages.js'
import Pusher from "pusher";
import Cors from 'cors'

// App config
const app = express();
const PORT = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1266450",
    key: "9b0d1a3fb3dbe131370a",
    secret: "717f34efdb03076e8dd9",
    cluster: "ap1",
    useTLS: true
  });

// middleware
app.use(express.json())
app.use(Cors());

// DB config
const mongo_url = 'mongodb+srv://admin:dua_lima@whatsapp-mern-backend.6zn3g.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(mongo_url)

const db = mongoose.connection
db.once('open', () => {
    console.log('DB connected')

    const msgCollection = db.collection('messagecontens')
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change) => {
        console.log(change)
        
        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                name : messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
                recived : messageDetails.recived,
            })
        } else {
            console.log('Error triggering pusher')
        }
    })
})

// ???

// API router
app.get('/',(req,res) => {
    res.send("Fuck world");
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) return res.status(500).send(err)
        res.status(200).send(data)
    })
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err,data) => {
        if(err) return res.status(500).send(err)
        res.status(201).send(data)
    })
});
// listen
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
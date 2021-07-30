//importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
//app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: "1237149",
    key: "848960ca4f19dc60fb87",
    secret: "9bc6967a01b43088b3db",
    cluster: "us2",
    useTLS: true
  });

//midleware
app.use(express.json());
app.use(cors());

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})
//db config
const connection_url='mongodb+srv://admin:2vpmCvJ8WdeYHQ95@cluster0.wjmd4.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//??
const db=mongoose.connection;
db.once('open',()=>{
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change",(change)=>{
        console.log(change);
        if(change.operationType=='insert'){
            const messageDetails=change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
              });
        }                                        ṇ̣
        else{
            console.log("Error triggering Pusher");
        }
    });
});

//api routes
app.get('/',(req,res)=> res.status(200).send("Hola") );
app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data) =>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
})
app.post('/messages/new',(req,res)=>{
    const dbMessage = req.body;
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);
        }
    })
})
//listen
app.listen(port,()=>console.log(`listening on localhost with port:${port}`));

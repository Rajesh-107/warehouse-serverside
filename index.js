const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1u7kw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const partCollection = client.db('inventory').collection('stockcarParts');
        
        app.get('/inventory', async(req, res) => {
            const query = {};
            const cursor = partCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        });

        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const part = await partCollection.findOne(query);
            res.send(part);
        });

        app.put('/inventory/:id', async(req,res)=>{
            const id=req.params.id
            const updatedQuantity=req.body
            console.log(updatedQuantity)
            const query={_id: ObjectId(id)}
            const options={upsert: true}
            const updatedDoc={
                $set:{
                    quantity:updatedQuantity.quantity
                }
            }
            const result=await partCollection.updateOne(query,updatedDoc,options)
            res.send(result)
        });

        app.post('/inventory', async(req, res) => {
            const newItem = req.body;
            const result = await partCollection.insertOne(newItem);
            res.send(result);
        });
      
    }


    
    finally{

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running')
})
app.listen(port, () => {
    console.log('shunchi ami', port)
})
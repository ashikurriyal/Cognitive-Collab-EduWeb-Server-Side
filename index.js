const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5300;


app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fplpf8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();
        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        const assignmentCollection = client.db('CognitiveCollabDB').collection('assignments')
        app.get('/assignments', async (req, res) => {
            const cursor = assignmentCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/assignments', async (req, res) => {
            const assignment = req.body;
            const result = await assignmentCollection.insertOne(assignment)
            res.send(result);
            console.log(result);
        })

        //update
        app.put('/assignments/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const updatedItem = req.body;
            const item = {
                $set: {
                    assignmentTitle: updatedItem.assignmentTitle,
                    marks: updatedItem.marks,
                    difficultyLevel: updatedItem.difficultyLevel,
                    assignmentDescription: updatedItem.assignmentDescription,
                    dueDate: updatedItem.dueDate,
                    image: updatedItem.image,
                    
                }
            }
            const result = await placeCollection.updateOne(filter, item)
            res.send(result);
        })

        //delete
        app.delete('/assignments/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            // console.log(query)
            const result = await assignmentCollection.deleteOne(query);
            // console.log(result)
            res.send(result);
          })



    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Cognitive Collab Server is OnGoing!')
})
app.listen(port, () => {
    console.log(`Server is running on port${port}`)
})

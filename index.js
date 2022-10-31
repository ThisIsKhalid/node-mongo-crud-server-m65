const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// p- KgfMdzqS5GCVY0pC
// u- dbUser2

// middleware
app.use(cors());
app.use(express.json());

// <--------- async await ---------->
/* 
// 1. reguler function
async function run() {

}
*/
// 2. arrow function
// const run = async () => {

// }

// run().catch(err => console.error(err));



const uri =
  "mongodb+srv://dbUser2:KgfMdzqS5GCVY0pC@cluster0.uwm1xgh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run(){
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');

        // database theke data ane server er ui te show kora
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await userCollection.findOne(query);
            // console.log(user);
            res.send(user);
        })
        
        // data client theke ane database a pathano hocce
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user); // database a chole gelo
            res.send(result); // server a dekhanor jonno ui te chelo gelo
        })

        // update user
        app.put('/users/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const user = req.body;
          // this option instructs the method to create a document if no documents match the filter
          const options = { upsert: true };
          const updatedUser = {
            $set: {
                name: user.name,
                address: user.address,
                email: user.email
            }
          }
          const result = await userCollection.updateOne(filter, updatedUser, options);
          res.send(result);
        })

        // delete a user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(`trying to delete`, id);
            // query er vitore kicu ditei hbe nahole full document kheye dibe 
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello from node-mongo-crud-server');
})

app.listen(port, () => {
    console.log(`Server is running port ${port}`);
})
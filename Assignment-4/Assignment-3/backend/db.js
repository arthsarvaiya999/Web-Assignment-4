
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient; 

let client;
let db; 

/*client = mongoose.connect('mongodb+srv://sagarvekariya005:8826600Lab4@cluster0.8uii7mo.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB', error);
})*/

module.exports.init = async function() {
  client = new MongoClient('mongodb+srv://sagarvekariya005:8826600Lab4@cluster0.8uii7mo.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
  try {
    await client.connect();
    db = client.db("test");
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err.stack);
  }
 } 

module.exports.insertOne = async function(collectionName, data){
    return await db.collection(collectionName).insertOne(data);
}

module.exports.updateOne = async function(collectionName, id, data){
    return await db.collection(collectionName).updateOne( {"userId" : id}, { $set: data });
}

module.exports.deleteOne = async function(collectionName, id){
    return await db.collection(collectionName).deleteOne({"userId" : id});
}

module.exports.findOne = async function(collectionName, filter){
    return await db.collection(collectionName).findOne(filter);
}

module.exports.find = async function(collectionName){
    return await db.collection(collectionName).find().toArray();
}
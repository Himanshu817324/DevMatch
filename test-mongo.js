const mongoose = require('mongoose');

const uri = 'mongodb+srv://Himanshu:cnDFFMcrZXTnvgNK@cluster0.6lb6c.mongodb.net/DevMatch?retryWrites=true&w=majority';

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Check for collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in the database:');

    // Loop through each collection and count documents
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      console.log(` - ${collectionName}: ${count} documents`);

      // Show sample documents if there are any
      if (count > 0) {
        const samples = await mongoose.connection.db.collection(collectionName).find().limit(1).toArray();
        console.log(`   Sample document from ${collectionName}:`);
        console.log(JSON.stringify(samples[0], null, 2).substring(0, 300) + '...');
      }
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection(); 
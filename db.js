const mongoose=require('mongoose');
const mongoURI="mongodb+srv://shivamsy8264:shivam8764@newsplus.an838.mongodb.net/NewsBook";
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    }
};
module.exports=connectToMongo
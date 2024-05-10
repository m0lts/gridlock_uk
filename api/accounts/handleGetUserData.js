import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to env.local")
}

export default async function handler(request, response) {
    let mongoClient;

    try {
        mongoClient = await (new MongoClient(uri, options)).connect();

        const db = mongoClient.db("gridlock");
        const dbCollection = db.collection("user-data");

        const formData = request.body;
        const userId = formData.userId;

        const userRecord = await dbCollection.findOne({ user_id: userId });

        if (!userRecord) {
            response.status(400).json({ error: "User not found" });
            return;
        }

        response.status(200).json(userRecord);


    } catch (error) {
        console.error(error);
        response.status(500).json(error);
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
}
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
        const dbCollection = db.collection("accounts");

        if (request.method === "POST") {
            const formData = request.body;
            const profilePicture = formData.profilePicture;
            const email = formData.email;

            const emailInDatabase = await dbCollection.findOne({ email });

            if (emailInDatabase) {
                await dbCollection.findOneAndUpdate(
                    { email },
                    { $set: { profilePicture } },
                );
                response.status(200).json({ message: "Profile picture updated" });
            } else {
                response.status(400).json({ error: "Error. Email not found" });
            }

        } else {
            response.status(405).json({ error: "Method Not Allowed" });
        }

    } catch (error) {
        console.error(error);
        response.status(500).json(error);
    } finally {
        // Close database connection
        if (mongoClient) {
            await mongoClient.close();
        }
    }
}
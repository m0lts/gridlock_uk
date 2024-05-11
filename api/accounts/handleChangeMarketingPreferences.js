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
            const email = formData.email;
            const marketingPreference = formData.emailConsent

            const userRecord = await dbCollection.findOne({ email: email });

            if (!userRecord) {
                response.status(400).json({ error: "User not found" });
                return;
            }

            if (marketingPreference !== userRecord.emailConsent) {
                await dbCollection.updateOne(
                    { email: email },
                    { $set: { emailConsent: marketingPreference } }
                )
            }

            response.status(200).json({ message: 'Updated preferences' });


        } else {
            response.status(405).json({ error: "Method Not Allowed" });
        }


    } catch (error) {
        console.error(error);
        response.status(500).json(error);
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
}
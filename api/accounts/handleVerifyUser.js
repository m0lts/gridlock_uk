import { MongoClient, ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';

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
            const receivedData = request.body;
            const verificationCode = receivedData.code;
            const userId = receivedData.userId;

            const userAccount = await dbCollection.findOne({ verificationToken: verificationCode, _id: new ObjectId(userId) });

            if (!userAccount) {
                response.status(400).json({ error: 'Incorrect verification details.' });
                return;
            }

            await dbCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: { verified: true }, $unset: { verificationToken: "" } }
            );

            const jwtToken = jwt.sign({ email: userAccount.email, username: userAccount.username, user_id: userAccount._id, verified: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
            response.status(200).json({ jwtToken });

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
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

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
        const userDataCollection = db.collection("user-data");

        if (request.method === "POST") {
            const formData = request.body;

            if (!formData.user_id) {
                response.status(400).json({ message: "Missing user ID" });
                return;
            }

            const userDataDocument = await userDataCollection.findOne({ user_id: formData.user_id });

            if (!userDataDocument) {
                await userDataCollection.insertOne({
                    user_id: formData.user_id,
                    favouriteDriver: formData.favouriteDriver,
                    favouriteTeam: formData.favouriteTeam,
                    favouriteGrandPrix: formData.favouriteGrandPrix,
                    nationality: formData.nationality,
                    f1Engagement: formData.f1Engagement
                });
            } else {
                const updateFields = {};
                if (formData.favouriteDriver !== userDataDocument.favouriteDriver && formData.favouriteDriver !== '') {
                    updateFields.favouriteDriver = formData.favouriteDriver;
                }
                if (formData.favouriteTeam !== userDataDocument.favouriteTeam && formData.favouriteTeam !== '') {
                    updateFields.favouriteTeam = formData.favouriteTeam;
                }
                if (formData.favouriteGrandPrix !== userDataDocument.favouriteGrandPrix && formData.favouriteGrandPrix !== '') {
                    updateFields.favouriteGrandPrix = formData.favouriteGrandPrix;
                }
                if (formData.nationality !== userDataDocument.nationality && formData.nationality !== '') {
                    updateFields.nationality = formData.nationality;
                }
                if (formData.f1Engagement !== userDataDocument.f1Engagement && formData.f1Engagement !== '') {
                    updateFields.f1Engagement = formData.f1Engagement;
                }

                if (Object.keys(updateFields).length > 0) {
                    await userDataCollection.updateOne(
                        { user_id: formData.user_id },
                        { $set: updateFields }
                    );
                }
            }

            response.status(200).json({ message: "User data updated successfully" });

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
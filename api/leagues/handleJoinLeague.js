import { MongoClient, ObjectId } from "mongodb";

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
        const dbCollection = db.collection("leagues");

        if (request.method === "POST") {
            const formData = request.body;
            const leagueCode = formData.leagueCode;
            const user = formData.user;

            const leagueObjectId = new ObjectId(leagueCode);

            // Check if league exists in database
            const leagueInDatabase = await dbCollection.findOne({ _id: leagueObjectId });

            if (!leagueInDatabase) {
                response.status(400).json({ error: 'League doesnt exist.' });
                return;
            }

            // Check if user already in league
            const leagueMembers = leagueInDatabase.leagueMembers || [];
            const userInLeague = leagueMembers.includes(user);
            if (userInLeague) {
                response.status(401).json({ error: 'User already in league.' });
                return;
            }

            // Add user to league members
            const updatedLeague = await dbCollection.updateOne(
                { _id: leagueObjectId },
                { $push: { leagueMembers: user } }
            );

            if (updatedLeague) {
                response.status(201).json({ message: 'Successfully joined league' });
            } else {
                response.status(402).json({ error: 'Error joining league. Please try again.' });
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
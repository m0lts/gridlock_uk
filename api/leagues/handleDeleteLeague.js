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
            const leagueName = formData.leagueName;

            // Check if league exists in database
            const leagueInDatabase = await dbCollection.findOne({ leagueName: leagueName });

            if (!leagueInDatabase) {
                response.status(400).json({ error: 'League doesnt exist.' });
                return;
            }

            // Delete league
            const deletedLeague = await dbCollection.deleteOne({ leagueName: leagueName });

            if (deletedLeague) {
                response.status(201).json({ message: 'Successfully deleted league' });
            } else {
                response.status(402).json({ error: 'Error deleting league. Please try again.' });
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
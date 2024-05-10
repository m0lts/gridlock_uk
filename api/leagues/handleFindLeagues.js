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
        const publicLeaguesCollection = db.collection("public-leagues");

        if (request.method === "POST") {
            try {
                const formData = request.body;
                const user = formData.user;
        
                // Find leagues that user is in
                const leagues = await dbCollection.find({ leagueMembers: user }).project({ leagueMembers: 1, leagueName: 1, leagueAdmin: 1 }).toArray();

                // Find public leagues that user is in
                const publicLeagues = await publicLeaguesCollection.find({ leagueMembers: user }).project({ leagueMembers: 1, leagueName: 1, leagueAdmin: 1 }).toArray();

                response.status(200).json({ leagues, publicLeagues });
            } catch (error) {
                console.error('Error finding leagues for user:', error);
                response.status(500).json({ error: 'Internal Server Error' });
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
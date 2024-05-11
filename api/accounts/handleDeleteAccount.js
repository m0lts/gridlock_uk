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
        const accountsCollection = db.collection("accounts");
        const predictionsCollection = db.collection("predictions");
        const standingsCollection = db.collection("standings");
        const dataCollection = db.collection("user-data");
        const leaguesCollection = db.collection("leagues");
        const publicLeaguesCollection = db.collection("public-leagues");

        if (request.method === "POST") {
            const { email } = request.body;

            // Find user record by email
            const userRecord = await accountsCollection.findOne({ email });

            if (!userRecord) {
                response.status(400).json({ error: "User not found" });
                return;
            }

            const userId = userRecord._id.toString();
            const username = userRecord.username;

            // Delete the user from different collections
            await accountsCollection.deleteOne({ email });
            await predictionsCollection.deleteMany({ userEmail: email });
            await standingsCollection.deleteOne({ userEmail: email });
            await dataCollection.deleteOne({ user_id: userId });

            // Remove the user from all leagues
            await leaguesCollection.updateMany(
                { leagueMembers: username },
                { $pull: { leagueMembers: username } }
            );
            await publicLeaguesCollection.updateMany(
                { leagueMembers: username },
                { $pull: { leagueMembers: username } }
            );

            response.status(200).json({ message: 'Deleted Account' });

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
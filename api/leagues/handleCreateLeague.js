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

            // Check if league name already exists in database
            const leagueName = formData.leagueName;
            const nameInDatabase = await dbCollection.findOne({ leagueName });

            if (nameInDatabase) {
                response.status(400).json({ error: 'League name already taken.' });
                return;
            }

            // Insert league into database
            const insertedLeague = await dbCollection.insertOne(formData);

            if (insertedLeague) {
                // Get league object ID
                const leagueId = insertedLeague.insertedId; // This will give you the ObjectID of the inserted document
                const leagueCode = leagueId.toString();
    
                response.status(201).json({ message: 'League successfully created', leagueCode });
            } else {
                response.status(401).json({ error: 'Error creating league. Please try again.' });
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
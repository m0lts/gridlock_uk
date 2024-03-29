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
        const dbCollection = db.collection("standings");

        if (request.method === "POST") {
            const dataReceived = request.body;
            const userEmail = dataReceived.userEmail;
            const competitionId = dataReceived.competitionId;

            const userStandings = await dbCollection.findOne({ userEmail });

            const pointsForCompetition = userStandings.points.find(competition => competition.competitionId === competitionId);

            if (userStandings) {
                response.status(200).json(pointsForCompetition.points);
            } else {
                response.status(201).json({ message: 'No prediction submitted for this race.' });
            }            

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
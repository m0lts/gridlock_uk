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

        try {

            const userStandings = await dbCollection.find().toArray();

            const totalPoints = userStandings.reduce((acc, curr) => {
                return acc + curr.points.reduce((acc, curr) => acc + curr.points, 0);
            }, 0);

            response.status(200).json(totalPoints);


        } catch (error) {
            console.error('Error fetching or processing data:', error);
            response.status(500).json(error);
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
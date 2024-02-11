import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

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
        const accountsCollection = db.collection("accounts");

        let usersWithTotalPoints = [];
        let rawStandings = [];

        try {
            const userTotalPoints = await dbCollection.aggregate([
                {
                    $unwind: "$points"
                },
                {
                    $group: {
                        _id: "$userName",
                        totalPoints: { $sum: "$points.points" }
                    }
                }
            ]).toArray();

            usersWithTotalPoints = await Promise.all(userTotalPoints.map(async ({ _id: userEmail, totalPoints }) => {
                const user = await accountsCollection.findOne({ userEmail });
                const username = user ? user.userName : userEmail;
                return {
                    username,
                    totalPoints
                };
            }));

            rawStandings = await dbCollection.find().toArray();

            response.status(200).json({ usersWithTotalPoints, rawStandings });

        } catch (error) {
            console.error('Error fetching or processing data:', error);
            usersWithTotalPoints = [];
            rawStandings = [];
            response.status(200).json({ usersWithTotalPoints, rawStandings });
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
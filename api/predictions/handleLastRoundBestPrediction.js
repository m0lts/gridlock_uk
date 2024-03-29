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
        const predictionsCollection = db.collection("predictions");

        if (request.method === "POST") {
            const predictionCompetitionId = request.body;

            const userStandings = await dbCollection.find().toArray();
            
            let highestPoints = { userEmail: null, competitionId: null, totalPoints: 0 };
            
            for (const user of userStandings) {
                for (const points of user.points) {
                    if (points.competitionId === predictionCompetitionId && points.points > highestPoints.totalPoints) {
                        highestPoints = {
                            userEmail: user.userEmail,
                            userName: user.userName,
                            competitionId: points.competitionId,
                            totalPoints: points.points
                        };
                    }
                }
            }

            const bestPrediction = await predictionsCollection.findOne({ competitionId: highestPoints.competitionId, userEmail: highestPoints.userEmail });

            const userPrediction = bestPrediction.prediction;

            response.status(200).json({
                userName: highestPoints.userName,
                competitionName: bestPrediction.competition,
                competitionCountry: bestPrediction.country,
                competitionId: bestPrediction.competitionId,
                totalPoints: highestPoints.totalPoints,
                userPrediction
            });


        } else {
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
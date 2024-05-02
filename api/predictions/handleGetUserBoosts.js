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
        const dbCollection = db.collection("predictions");

        if (request.method === "POST") {
            const userEmail = request.body.userEmail;
            const dbPrediction = await dbCollection.find({ userEmail }).toArray();
        
            if (dbPrediction.length > 0) {
                let responseSent = false;
        
                for (let prediction of dbPrediction) {
                    if (prediction.boost === 'Quali' || prediction.boost === 'Grid') {
                        response.status(200).json({ 
                            qualiBoost: prediction.boost === 'Quali', 
                            gridBoost: prediction.boost === 'Grid' 
                        });
                        responseSent = true;
                        break;  // Stop searching once the first match is found
                    }
                }
        
                // If no relevant boosts are found in any of the predictions
                if (!responseSent) {
                    response.status(200).json({ qualiBoost: false, gridBoost: false });
                }
            } else {
                response.status(200).json({ message: 'No predictions in database' });
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

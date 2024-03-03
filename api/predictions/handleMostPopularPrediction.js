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
        console.log("Just Connected!");

        const db = mongoClient.db("gridlock");
        const dbCollection = db.collection("predictions");

        try {
            
            const allPredictions = await dbCollection.find().toArray();

            const predictionsArrays = allPredictions.map(predictionDoc => predictionDoc.prediction);

            const positionCounts = {};

            // Iterate over each prediction array
            predictionsArrays.forEach(predictionArray => {
                // Iterate over each position in the prediction array
                predictionArray.forEach((driver, index) => {
                    // If it's the first occurrence of this position, initialize its count
                    if (!positionCounts[index]) {
                        positionCounts[index] = {};
                    }
                    // If it's the first occurrence of this driver for this position, initialize its count
                    if (!positionCounts[index][driver]) {
                        positionCounts[index][driver] = 1;
                    } else {
                        // Increment the count of this driver for this position
                        positionCounts[index][driver]++;
                    }
                });
            });

            // Find the most picked driver for each position
            const mostPickedDrivers = {};
            for (const position in positionCounts) {
                const drivers = positionCounts[position];
                let mostPickedDriver = null;
                let maxCount = 0;
                for (const driver in drivers) {
                    if (drivers[driver] > maxCount) {
                        mostPickedDriver = driver;
                        maxCount = drivers[driver];
                    }
                }
                mostPickedDrivers[position] = mostPickedDriver;
            }

            console.log(mostPickedDrivers)

            response.status(200).json(mostPickedDrivers);

            

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
            console.log("MongoDB connection closed.");
        }
    }
}
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
        
            const positionDrivers = {};
        
            // Iterate over each prediction array
            predictionsArrays.forEach(predictionArray => {
                // Iterate over each position in the prediction array
                predictionArray.forEach((driverObj, index) => {
                    const driver = driverObj.driverId;
                    // If it's the first occurrence of this position, initialize its Set
                    if (!positionDrivers[index]) {
                        positionDrivers[index] = {};
                    }
                    // Count occurrences of this driver for this position
                    if (!positionDrivers[index][driver]) {
                        positionDrivers[index][driver] = 1;
                    } else {
                        positionDrivers[index][driver]++;
                    }
                });
            });
        
            // Find the total number of picks for each position
            const totalPicks = predictionsArrays.length;
        
            // Calculate the most picked driver for each position along with their percentage
            const mostPickedDrivers = [];
            for (const position in positionDrivers) {
                const drivers = positionDrivers[position];
                let maxCount = 0;
                let mostPickedDriver = null;
                // Iterate over unique drivers for this position
                for (const driver in drivers) {
                    const count = drivers[driver];
                    // Update if this driver has more counts than current most picked driver
                    if (count > maxCount) {
                        maxCount = count;
                        mostPickedDriver = driver;
                    }
                }
                // Calculate the percentage of picks for the most picked driver
                const percentage = (maxCount / totalPicks) * 100;
                mostPickedDrivers.push({ position: parseInt(position), driver: mostPickedDriver, percentage: percentage.toFixed(2) });
            }
                
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
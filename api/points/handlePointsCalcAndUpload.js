import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to env.local")
}

export default async function handler(request, response) {

    let mongoClient;

    mongoClient = await (new MongoClient(uri, options)).connect();

    try {
        // Find the most recently completed race and assign it to closestRaceId
        const raceIDQuery = await fetch("https://v1.formula-1.api-sports.io/races?season=2024&timezone=Europe/London", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v1.formula-1.api-sports.io",
                "x-rapidapi-key": process.env.RAPIDAPI_KEY
            }
        });
        const raceIDData = await raceIDQuery.json();
        const competitionRaces = raceIDData.response.filter(event => event.type === 'Race');
        const completedRaces = competitionRaces.filter(event => event.status === "Completed");

        // Stop if no completed races are found
        if (completedRaces.length === 0) {
            response.status(200).json({ message: 'No completed races found.' });
            return;
        }

        
        const currentTime = new Date().getTime();
        let closestRaceId = null;
        let closestRaceCompetitionId = null;
        let closestTimeDifference = Infinity;
        
        completedRaces.forEach(race => {
            if (race.date) {
                const raceTime = new Date(race.date).getTime();
                const timeDifference = Math.abs(currentTime - raceTime);
                if (timeDifference < closestTimeDifference) {
                    closestTimeDifference = timeDifference;
                    closestRaceId = race.id;
                    closestRaceCompetitionId = race.competition.id;
                }
            }
        });

        // Get the result of the most recent race using closestRaceId
        const raceResultQuery = await fetch(`https://v1.formula-1.api-sports.io/rankings/races?race=${closestRaceId}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v1.formula-1.api-sports.io",
                "x-rapidapi-key": process.env.RAPIDAPI_KEY
            }
        });
        const raceResult = await raceResultQuery.json();


        if (raceResult.response.length === 0) {
            response.status(200).json({ message: 'No results found for the race.' });
            return;
        }


        const driverIDs = raceResult.response.map(event => event.driver.id);
        const top10Drivers = driverIDs.splice(0, 10);


        // Get userID and prediction from database using closestRace.id
        const db = mongoClient.db("gridlock");
        const dbCollection = db.collection("predictions");
        const standingsCollection = db.collection("standings");
        const racePredictions = await dbCollection.find({ competitionId: closestRaceCompetitionId }).toArray();

        // Accumulate points for each user's predictions
        const userPointsMap = {}; // Map to store points for each user
        for (const racePrediction of racePredictions) {
            const userEmail = racePrediction.userEmail;
            const userPrediction = racePrediction.prediction;
            let points = 0;

            userPrediction.forEach((driver, index) => {
                if (top10Drivers.includes(driver.driverId)) {
                    points += 1;
                    if (index < 10 && driver.driverId === top10Drivers[index]) {
                        points += 2;
                    }
                }
            });
            if (points === 30) {
                points += 10;
            }

            // Accumulate points for each user
            if (userPointsMap[userEmail]) {
                userPointsMap[userEmail] += points;
            } else {
                userPointsMap[userEmail] = points;
            }
        }

        // Update standings for each user
        for (const [userEmail, points] of Object.entries(userPointsMap)) {
            const userName = racePredictions.find(prediction => prediction.userEmail === userEmail).userName;
            const existingUser = await standingsCollection.findOne({ userEmail });

            if (!existingUser) {
                await standingsCollection.insertOne({
                    userEmail,
                    userName,
                    points: [{ competitionId: closestRaceCompetitionId, points }],
                });
            } else {
                const existingCompetitionPoints = existingUser.points.find(point => point.competitionId === closestRaceCompetitionId);
                if (!existingCompetitionPoints) {
                    await standingsCollection.findOneAndUpdate(
                        { userEmail },
                        { $push: { points: { competitionId: closestRaceCompetitionId, points } } },
                    );
                }
            }
        }

        response.status(200).json({ message: 'Points uploaded to standings collection.' });

    } catch (error) {
        console.error(error);
        response.status(500).json(error);
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
}




import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to env.local")
}

export default async function handler(request, response) {

    let mongoClient;

    mongoClient = await (new MongoClient(uri, options)).connect();

    try {
        // Get all userIDs from database
        const db = mongoClient.db("gridlock");
        const accountsCollection = db.collection("accounts");
        const predictionsCollection = db.collection("predictions");

        const users = await accountsCollection.find({ verified: true }).toArray();

        // Get the next race's ID
        const raceIDQuery = await fetch("https://v1.formula-1.api-sports.io/races?season=2024&timezone=Europe/London", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v1.formula-1.api-sports.io",
                "x-rapidapi-key": process.env.RAPIDAPI_KEY
            }
        });
        const raceIDData = await raceIDQuery.json();
        const competitionRaces = raceIDData.response.filter(event => event.type === 'Race');
        const scheduledRaces = competitionRaces.filter(event => event.status === "Scheduled");
        const competitionID = scheduledRaces[0].competition.id;
        const competitionName = scheduledRaces[0].competition.name;
        const competitionCountry = scheduledRaces[0].competition.location.country;

        // Get qualifying time for race
        const competitionSessions = raceIDData.response.filter(event => event.competition.id === competitionID);
        const competitionQualifying = competitionSessions.filter(event => event.type === '1st Qualifying');
        const qualifyingStartTime = new Date(competitionQualifying[0].date).getTime();
        const competitionRace = competitionSessions.filter(event => event.type === 'Race');
        const raceStartTime = new Date(competitionRace[0].date).getTime();
        const qualifyingTimeDateFormat = new Date(competitionQualifying[0].date);
        const currentTime = new Date().getTime();

        if (currentTime < qualifyingStartTime) {
            response.status(200).json({ message: 'Qualifying has not started yet.' });
            return;
        }


        const driversQuery = await fetch("https://v1.formula-1.api-sports.io/rankings/drivers?season=2024", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "v1.formula-1.api-sports.io",
                "x-rapidapi-key": process.env.RAPIDAPI_KEY
            }
        });
        const driversData = await driversQuery.json();
        const filteredDrivers = [];
        driversData.response.forEach(driver => {
            const spaceIndex = driver.driver.name.indexOf(' ');
            const firstName = driver.driver.name.substring(0, spaceIndex);
            const lastName = driver.driver.name.substring(spaceIndex + 1);
            const driverAbbr = lastName.substring(0, 3).toUpperCase();
            
            const driverAbbrToUse = driver.driver.abbr === null ? driverAbbr : driver.driver.abbr;

            // Drivers to remove from the list
            const oliBearmanId = 101;
            
            if (!(driver.driver.id === oliBearmanId)) {
                filteredDrivers.push({
                    driverId: driver.driver.id,
                    driverFirstName: firstName,
                    driverLastName: lastName,
                    driverAbbr: driverAbbrToUse,
                    driverTeam: driver.team.name,
                    driverNumber: driver.driver.number,
                    driverImage: driver.driver.image,
                });
            }
        });

        function getRandomDrivers(drivers, count) {
            const shuffled = drivers.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }

        const raceHasStarted = raceStartTime < Date.now();


        if (currentTime > qualifyingStartTime) {
            for (const user of users) {
                const userEmail = user.email;
                const userName = user.username;
                const userPrediction = await predictionsCollection.findOne({ userEmail, competitionId: competitionID });
                const userDefaultPredictionDocument = await predictionsCollection.findOne({ userEmail, competitionId: 'Default' });
                const userDefaultPrediction = userDefaultPredictionDocument ? userDefaultPredictionDocument.prediction : null;
                const boostUsed = userPrediction ? userPrediction.boost : null;
        

                if (!userPrediction || userPrediction.prediction.includes(null)) {
                    if (!boostUsed || boostUsed !== 'Quali') {
                        const submissionAt = new Date().toISOString();
                        let predictionToUse = userDefaultPrediction;
                        
                        if (!userDefaultPrediction || boostUsed === 'Grid') {
                            // Get a random prediction if there's no default or if 'Grid' boost is used
                            predictionToUse = getRandomDrivers(filteredDrivers, boostUsed === 'Grid' ? 20 : 10);
                        }
    
                        if (boostUsed === 'Grid') {
                            // Update the user's prediction with the default prediction
                            await predictionsCollection.updateOne({
                                userEmail,
                                competitionId: competitionID
                            }, {
                                $set: {
                                    prediction: predictionToUse,
                                    submittedAt: submissionAt
                                }
                            
                            });
                        } else {
                            // Create a new prediction object
                            const newPrediction = {
                                prediction: predictionToUse,
                                userEmail: userEmail,
                                userName: userName,
                                competition: competitionName,
                                country: competitionCountry,
                                competitionId: competitionID,
                                submittedAt: submissionAt
                            };
                            // Insert the new prediction into the database
                            await predictionsCollection.insertOne(newPrediction);
                        }
                    } else if (boostUsed === 'Quali' && raceHasStarted) {
                        const submissionAt = new Date().toISOString();
                        let predictionToUse = userDefaultPrediction;
                        
                        if (!userDefaultPrediction) {
                            predictionToUse = getRandomDrivers(filteredDrivers, 10);
                        }
    
                        // Update the user's prediction with the default prediction
                        await predictionsCollection.updateOne({
                            userEmail,
                            competitionId: competitionID
                        }, {
                            $set: {
                                prediction: predictionToUse,
                                submittedAt: submissionAt
                            }
                        
                        });
                    } else {
                        // Do nothing if the user already has a valid 'Quali' boost prediction
                    }

                } else {
                    if (boostUsed === 'Grid' && userPrediction.prediction.length < 20) {
                        const submissionAt = new Date().toISOString();
                        const predictionToUse = getRandomDrivers(filteredDrivers, 20);
    
                        // Update the user's prediction with the default prediction
                        await predictionsCollection.updateOne({
                            userEmail,
                            competitionId: competitionID
                        }, {
                            $set: {
                                prediction: predictionToUse,
                                submittedAt: submissionAt
                            }
                        
                        });
                    }
                    // Do nothing if the user meets none of the conditions or already has a valid 'Quali' boost prediction
                }
            }
        
            response.status(200).json({message: `Predictions processed for all users.`});
        } else {
            response.status(200).json({ message: 'Qualifying has not started yet.' });
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




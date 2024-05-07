import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

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
        const userDataCollection = db.collection("user-data");
        const publicLeaguesCollection = db.collection("public-leagues");

        if (request.method === "POST") {
            const formData = request.body;

            if (!formData.user_id) {
                response.status(400).json({ message: "Missing user ID" });
                return;
            }

            const userDataDocument = await userDataCollection.findOne({ user_id: formData.user_id });

            if (!userDataDocument) {
                await userDataCollection.insertOne({
                    user_id: formData.user_id,
                    favouriteDriver: formData.favouriteDriver,
                    favouriteTeam: formData.favouriteTeam,
                    favouriteGrandPrix: formData.favouriteGrandPrix,
                    nationality: formData.nationality,
                    f1Engagement: formData.f1Engagement
                });

                if (formData.favouriteDriver === 'Max Verstappen') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Verstappen Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Sergio Perez') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Perez Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Lewis Hamilton') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Hamilton Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Charles Leclerc') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Leclerc Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Lando Norris') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Norris Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Carlos Sainz Jr') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Sainz Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Oscar Piastri') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Piastri Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'George Russell') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Russell Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Fernando Alonso') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Alonso Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Yuki Tsunoda') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Tsunoda Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Lance Stroll') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Stroll Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Nico Hulkenberg') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Hulkenberg Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Daniel Ricciardo') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Ricciardo Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Esteban Ocon') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Ocon Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Kevin Magnussen') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Magnussen Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Alexander Albon') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Albon Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Guanyu Zhou') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Zhou Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Pierre Gasly') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Gasly Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Valtteri Bottas') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Bottas Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteDriver === 'Logan Sargeant') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Sargeant Fans' }, { $push: { leagueMembers: formData.username } });
                }

                if (formData.favouriteTeam === 'Red Bull Racing') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Red Bull Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Scuderia Ferrari/n') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Ferrari Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Scuderia Ferrari') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Ferrari Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'McLaren Racing') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'McLaren Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Mercedes-AMG Petronas') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Mercedes Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Aston Martin F1 Team') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Aston Martin Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Visa Cash App RB Formula One Team') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'RB Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Haas F1 Team') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Haas Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Alpine F1 Team') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Alpine Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Williams F1 Team') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Williams Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.favouriteTeam === 'Stake F1 Team Kick Sauber') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Sauber Fans' }, { $push: { leagueMembers: formData.username } });
                }

                if (formData.f1Engagement === 'Casual Viewer') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Casual Viewers' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.f1Engagement === 'Regular Fan') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Regular Fans' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.f1Engagement === 'Enthusiast') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'F1 Enthusiasts' }, { $push: { leagueMembers: formData.username } });
                } else if (formData.f1Engagement === 'Die-Hard Fan') {
                    await publicLeaguesCollection.updateOne({ leagueName: 'Die-Hard Fans' }, { $push: { leagueMembers: formData.username } });
                }

            } else {
                const updateFields = {};
                if (formData.favouriteDriver !== userDataDocument.favouriteDriver && formData.favouriteDriver !== '') {
                    updateFields.favouriteDriver = formData.favouriteDriver;

                    if (userDataDocument.favouriteDriver === 'Max Verstappen') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Verstappen Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Sergio Perez') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Perez Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Lewis Hamilton') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Hamilton Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Charles Leclerc') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Leclerc Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Lando Norris') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Norris Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Carlos Sainz Jr') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Sainz Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Oscar Piastri') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Piastri Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'George Russell') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Russell Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Fernando Alonso') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Alonso Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Yuki Tsunoda') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Tsunoda Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Lance Stroll') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Stroll Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Nico Hulkenberg') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Hulkenberg Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Daniel Ricciardo') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ricciardo Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Esteban Ocon') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ocon Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Kevin Magnussen') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Magnussen Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Alexander Albon') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Albon Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Guanyu Zhou') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Zhou Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Pierre Gasly') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Gasly Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Valtteri Bottas') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Bottas Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteDriver === 'Logan Sargeant') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Sargeant Fans' }, { $pull: { leagueMembers: formData.username } });
                    }

                    if (formData.favouriteDriver === 'Max Verstappen') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Verstappen Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Sergio Perez') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Perez Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Lewis Hamilton') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Hamilton Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Charles Leclerc') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Leclerc Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Lando Norris') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Norris Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Carlos Sainz Jr') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Sainz Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Oscar Piastri') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Piastri Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'George Russell') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Russell Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Fernando Alonso') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Alonso Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Yuki Tsunoda') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Tsunoda Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Lance Stroll') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Stroll Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Nico Hulkenberg') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Hulkenberg Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Daniel Ricciardo') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ricciardo Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Esteban Ocon') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ocon Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Kevin Magnussen') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Magnussen Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Alexander Albon') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Albon Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Guanyu Zhou') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Zhou Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Pierre Gasly') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Gasly Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Valtteri Bottas') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Bottas Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteDriver === 'Logan Sargeant') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Sargeant Fans' }, { $push: { leagueMembers: formData.username } });
                    }

                }
                if (formData.favouriteTeam !== userDataDocument.favouriteTeam && formData.favouriteTeam !== '') {
                    updateFields.favouriteTeam = formData.favouriteTeam;

                    if (userDataDocument.favouriteTeam === 'Red Bull Racing') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Red Bull Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Scuderia Ferrari') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ferrari Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'McLaren Racing') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'McLaren Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Mercedes-AMG Petronas') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Mercedes Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Aston Martin F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Aston Martin Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Visa Cash App RB Formula One Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'RB Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Haas F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Haas Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Alpine F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Alpine Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Williams F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Williams Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Stake F1 Team Kick Sauber') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Sauber Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.favouriteTeam === 'Scuderia Ferrari/n') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ferrari Fans' }, { $pull: { leagueMembers: formData.username } });
                    }

                    if (formData.favouriteTeam === 'Red Bull Racing') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Red Bull Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Scuderia Ferrari/n') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ferrari Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Scuderia Ferrari') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Ferrari Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'McLaren Racing') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'McLaren Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Mercedes-AMG Petronas') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Mercedes Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Aston Martin F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Aston Martin Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Visa Cash App RB Formula One Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'RB Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Haas F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Haas Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Alpine F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Alpine Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Williams F1 Team') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Williams Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.favouriteTeam === 'Stake F1 Team Kick Sauber') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Sauber Fans' }, { $push: { leagueMembers: formData.username } });
                    }

                }
                if (formData.favouriteGrandPrix !== userDataDocument.favouriteGrandPrix && formData.favouriteGrandPrix !== '') {
                    updateFields.favouriteGrandPrix = formData.favouriteGrandPrix;
                }
                if (formData.nationality !== userDataDocument.nationality && formData.nationality !== '') {
                    updateFields.nationality = formData.nationality;
                }
                if (formData.f1Engagement !== userDataDocument.f1Engagement && formData.f1Engagement !== '') {
                    updateFields.f1Engagement = formData.f1Engagement;

                    if (userDataDocument.f1Engagement === 'Casual Viewer') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Casual Viewers' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.f1Engagement === 'Regular Fan') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Regular Fans' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.f1Engagement === 'Enthusiast') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'F1 Enthusiasts' }, { $pull: { leagueMembers: formData.username } });
                    } else if (userDataDocument.f1Engagement === 'Die-Hard Fan') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Die-Hard Fans' }, { $pull: { leagueMembers: formData.username } });
                    }

                    if (formData.f1Engagement === 'Casual Viewer') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Casual Viewers' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.f1Engagement === 'Regular Fan') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Regular Fans' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.f1Engagement === 'Enthusiast') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'F1 Enthusiasts' }, { $push: { leagueMembers: formData.username } });
                    } else if (formData.f1Engagement === 'Die-Hard Fan') {
                        await publicLeaguesCollection.updateOne({ leagueName: 'Die-Hard Fans' }, { $push: { leagueMembers: formData.username } });
                    }

                }

                if (Object.keys(updateFields).length > 0) {
                    await userDataCollection.updateOne(
                        { user_id: formData.user_id },
                        { $set: updateFields }
                    );
                }
            }

            response.status(200).json({ message: "User data updated successfully" });

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
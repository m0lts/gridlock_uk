import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import sendgrid from '@sendgrid/mail';

// Send grid API key
sendgrid.setApiKey(process.env.SENDGRIDAPI_KEY);

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
        const dbCollection = db.collection("accounts");
        const leagueCollection = db.collection("leagues");

        if (request.method === "POST") {
            const formData = request.body;
            delete formData.verify_password;

            // Hash the user's password
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            formData.password = hashedPassword;

            formData.verified = false;

            // Check if email or username already exists in database
            const email = formData.email;
            formData.email = email.toLowerCase();
            const username = formData.username;
            const emailInDatabase = await dbCollection.findOne({ email });
            const usernameInDatabase = await dbCollection.findOne({ username });
            if (emailInDatabase) {
                response.status(400).json({ error: 'Email address taken.' });
                return;
            } else if (usernameInDatabase) {
                response.status(401).json({ error: 'Username taken.' });
                return;
            }

            const generateRandomToken = (length) => {
                const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                let token = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    token += characters[randomIndex];
                }
                return token;
            };

            const verificationToken = generateRandomToken(24);
            formData.verificationToken = verificationToken;

            const verificationLink = `https://www.f1gridlock.com/verifyaccount?email=${email}&token=${verificationToken}`;

            const msg = {
                to: email,
                from: 'gridlock.contact@gmail.com',
                templateId: 'd-f9b818d2289e4c2da46e434c87a9b9e9',
                dynamic_template_data: {
                    verificationLink: verificationLink,
                }
            };

            const sendEmail = await sendgrid.send(msg);

            if (!sendEmail) {
                response.status(500).json({ error: "Error sending verification email." });
                return;
            } else {
                switch (formData.roundNo) {
                    case 1:
                        break;
                    case 2:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 2 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 3:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 3 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 4:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 4 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 5:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 5 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 6:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 6 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 7:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 7 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 8:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 8 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 9:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 9 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 10:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 10 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 11:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 11 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 12:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 12 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 13:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 13 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 14:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 14 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 15:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 15 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 16:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 16 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 17:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 17 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 18:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 18 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 19:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 19 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 20:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 20 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 21:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 21 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 22:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 22 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 23:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 23 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    case 24:
                        await leagueCollection.updateOne(
                            { leagueName: "Round 24 Joiners" },
                            { $push: { leagueMembers: formData.username } }
                        );
                        break;
                    default:
                        break;
                }
                delete formData.roundNo;

                await dbCollection.insertOne(formData);
                response.status(201).json({ message: 'Email successfully sent' });
            }

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


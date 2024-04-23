import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

        if (request.method === "POST") {
            const formData = request.body;
            const emailOrUsername = formData.email;
            const password = formData.password;

            let query = {};

            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            if (isValidEmail(emailOrUsername)) {
                query.email = emailOrUsername.toLowerCase();
            } else {
                query.username = emailOrUsername;
            }

            const userRecord = await dbCollection.findOne({
                $or: [
                    { email: query.email },
                    { username: query.username }
                ]
            });

            if (!userRecord) {
                response.status(400).json({ error: "User not found" });
                return;
            }

            const dbPassword = userRecord.password;
            const passwordMatch = await bcrypt.compare(password, dbPassword);

            if (passwordMatch) {
                delete userRecord.password;
                const jwtToken = jwt.sign({ 
                    email: userRecord.email, 
                    username: userRecord.username, 
                    user_id: userRecord._id, 
                    verified: userRecord.verified
                }, process.env.JWT_SECRET, { expiresIn: '14d' });

                response.setHeader('Set-Cookie', `jwtToken=${jwtToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`);
                response.status(200).json({
                    message: 'Authentication successful',
                    user: {
                        email: userRecord.email,
                        username: userRecord.username,
                        user_id: userRecord._id,
                        verified: userRecord.verified
                    }
                });

            } else {
                response.status(401).json({ error: 'Incorrect password' });
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


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

        if (request.method === "POST") {
            const formData = request.body;
            delete formData.verify_password;

            // Hash the user's password
            const hashedPassword = await bcrypt.hash(formData.password, 10);
            formData.password = hashedPassword;

            formData.verified = false;

            // Check if email or username already exists in database
            const email = formData.email;
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


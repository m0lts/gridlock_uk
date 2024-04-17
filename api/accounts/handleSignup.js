import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import sendgrid from '@sendgrid/mail';
import client from "@sendgrid/client";
import jwt from "jsonwebtoken";


// Send grid API key
sendgrid.setApiKey(process.env.SENDGRIDAPI_KEY);
client.setApiKey(process.env.SENDGRIDAPI_KEY);

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
                from: {
                    name: 'Gridlock',
                    email: 'gridlock.contact@gmail.com'
                },
                templateId: 'd-f9b818d2289e4c2da46e434c87a9b9e9',
                dynamic_template_data: {
                    verificationLink: verificationLink,
                    username: formData.username
                }
            };

            const sendEmail = await sendgrid.send(msg);

            const contactData = {
                "contacts": [
                    {
                        "email": email,
                        "first_name": formData.forename,
                        "last_name": formData.surname,
                    }
                ],
                "list_ids": formData.emailConsent ? ['036a4122-8866-4476-bc31-946611d0f7c1'] : ['75df1a79-11c7-46fa-b1eb-834b9d6d3028'],
            };

            const contactRequest = {
                method: 'PUT',
                url: '/v3/marketing/contacts',
                body: contactData,
            };

            const contactAdded = await client.request(contactRequest);

            if (!sendEmail || !contactAdded) {
                response.status(500).json({ error: "Error sending verification email." });
                return;
            } else {
                await dbCollection.insertOne(formData);
                const userDocument = await dbCollection.findOne({ email });
                const jwtToken = jwt.sign({ email: userDocument.email, username: userDocument.username, user_id: userDocument._id, verified: userDocument.verified }, process.env.JWT_SECRET, { expiresIn: '1d' });
                response.status(201).json({ jwtToken });
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


import { MongoClient, ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import sendgrid from '@sendgrid/mail';
import client from "@sendgrid/client";


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
        const verificationCollection = db.collection("verification-codes");


        if (request.method === "POST") {
            const receivedData = request.body;
            const verificationCode = receivedData.code;
            const userEmail = receivedData.email;

            const verificationDocument = await verificationCollection.findOne({ verificationToken: verificationCode, email: userEmail })

            if (!verificationDocument) {
                response.status(400).json({ error: 'Incorrect verification details.' });
                return;
            }
            
            const contactData = {
                "contacts": [
                    {
                        "email": userEmail,
                        "first_name": verificationDocument.username,
                    }
                ],
                "list_ids": verificationDocument.emailConsent ? ['036a4122-8866-4476-bc31-946611d0f7c1'] : ['75df1a79-11c7-46fa-b1eb-834b9d6d3028'],
            };
            
            const contactRequest = {
                method: 'PUT',
                url: '/v3/marketing/contacts',
                body: contactData,
            };
            
            const contactAdded = await client.request(contactRequest);
            
            if (!contactAdded) {
                response.status(401).json({ error: 'Error adding contact.' });
                return;
            }

            verificationDocument.verified = true;
            delete verificationDocument.verificationToken;

            await dbCollection.insertOne(verificationDocument);

            const userAccount = await dbCollection.findOne(
                { email: userEmail }
            );
            
            await verificationCollection.deleteOne({ email: userEmail });

            const jwtToken = jwt.sign({ 
                email: userAccount.email, 
                username: userAccount.username, 
                user_id: userAccount._id, 
                verified: userAccount.verified, 
            }, process.env.JWT_SECRET, { expiresIn: '14d' });
            response.setHeader('Set-Cookie', `jwtToken=${jwtToken}; HttpOnly; Secure; Path=/; Max-Age=1209600; SameSite=Strict`);
            response.status(200).json({
                message: 'Account verified successfully',
                user: {
                    email: userAccount.email,
                    username: userAccount.username,
                    user_id: userAccount._id,
                    verified: userAccount.verified
                }
            });

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
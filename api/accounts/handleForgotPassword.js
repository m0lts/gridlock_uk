import { MongoClient } from "mongodb";
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
        const passwordResetCollection = db.collection("password_reset_tokens");


        if (request.method === "POST") {
            const receivedData = request.body;
            const email = receivedData.email;

            const userRecord = await dbCollection.findOne({ email });
            console.log(userRecord)
            const userRecordId = userRecord._id.toString();
            console.log(userRecordId);

            if (!userRecord) {
                response.status(400).json({ error: "Email not found" });
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
            const resetToken = generateRandomToken(24);

            const dataToEnter = {
                userId: userRecordId,
                email: email,
                token: resetToken,
                createdAt: new Date(),
            }

            await passwordResetCollection.insertOne(dataToEnter);

            const resetLink = `http://localhost:3000/resetpassword?token=${resetToken}&user=${userRecordId}`;

            const msg = {
                to: email,
                from: 'gridlock.contact@gmail.com',
                subject: 'Reset Your Password',
                // text: `Please use this one-time-password code to reset your password: ${resetToken}`,
                html: `<p>Please follow this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
            };

            const sendEmail = await sendgrid.send(msg);
            response.status(200).json({ message: 'Email successfully sent', sendEmail})

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

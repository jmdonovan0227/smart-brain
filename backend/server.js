import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import nodemailer from 'nodemailer';
import decrypt from './decryption/decryption.js';
import { handleImageGet, handleFaceApiCall } from './controllers/image.js';
import { handleSignIn } from './controllers/signin.js';
import { handleProfileGetById, handleProfileDeletion } from './controllers/profile.js';
import { handleRegister } from './controllers/register.js';
import { forgotPassword, resetPassword } from './controllers/password.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
        client: 'pg',
        connection: {
          connectionString: process.env.DB_URL,
          ssl: { rejectUnauthorized: false },
          host: process.env.DB_HOST,
          port: 5432,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        },
});

const PORT = process.env.PORT || 3000;

app.post('/api/signin', (req, res) => { handleSignIn(req, res, db, bcrypt) });

// dependency injection we are injecting whatever dependencies handleRegister needs

app.post('/api/register', (req, res) => { handleRegister(req, res, db, bcrypt, decrypt, nodemailer) });

app.get('/api/profile/:id', (req, res) => { handleProfileGetById(req, res, db) });

app.put('/api/image', (req, res) => { handleImageGet(req, res, db) });

app.post('/api/faceurl', (req, res) => { handleFaceApiCall(req, res, db) });

app.delete('/api/delete', (req, res) => { handleProfileDeletion(req, res, db, bcrypt) });

app.post('/api/forgot_password', (req, res) => { forgotPassword(req, res, db, decrypt, nodemailer)});

app.post('/api/reset_password', (req, res) => { resetPassword(req, res, db, bcrypt)});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

/**
 * / ==> res = this is working
 * /signin ==> POST = success/fail
 * /register ==> POST = new user object
 * /profile/:userId ==> GET = user
 * /image ==> PUT ==> user object (count for number of images in application)
 */
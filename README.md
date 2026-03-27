Unimate Coding Setup Guide

This guide explains how to run the client and server on a new device for this branch.

1. Clone the project

If you are cloning for the first time:

git clone <your-repo-url>
cd unimatecoding
git checkout <your-branch-name>

If you already have the repo:

git fetch
git checkout <your-branch-name>
git pull origin <your-branch-name>

2. Install dependencies

You need to install packages for both the server and the client.

Server

cd server
npm install

Client

cd ../client
npm install

3. Environment variables

Create the required .env files.

Server .env

Create a file at:

server/.env

Example:

PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

If the project uses more variables, add them here too.

Client .env

Create a file at:

client/.env

Add:

VITE_API_BASE_URL=http://127.0.0.1:5001/api

4. Run the server

From the server folder:

npm run dev

Expected backend URL:

http://127.0.0.1:5001

5. Run the client

Open another terminal, then run:

cd client
npm run dev

Expected frontend URL:

http://localhost:5173

6. Open the app

Open this in your browser:

http://localhost:5173

7. Login behavior
	•	Student login goes to /canteen
	•	Staff login goes to /staff

8. Upload folder

If the project uses payment slip uploads, make sure the upload folder exists.

Create this if needed:

mkdir -p server/uploads/payment-slips

9. MongoDB notes

If you are using MongoDB Atlas, put the Atlas connection string in server/.env.

If you are using local MongoDB, make sure MongoDB is running and use something like:

MONGO_URI=mongodb://127.0.0.1:27017/unimatecoding

10. Quick start summary

Run the project in this order:

git checkout <your-branch-name>

cd server
npm install
# create server/.env
npm run dev

cd ../client
npm install
# create client/.env
npm run dev

11. Common problems

Port already in use

If port 5001 or 5173 is already in use, stop the other process or change the port in your config.

Backend not connecting

Check:
	•	MONGO_URI
	•	internet connection if using Atlas
	•	MongoDB service if using local database

Frontend cannot call backend

Check:
	•	VITE_API_BASE_URL in client/.env
	•	backend is running on port 5001
	•	no typo in the .env file

Uploaded slips not opening

Check:
	•	backend is serving /uploads statically
	•	server/uploads/payment-slips exists

12. Recommended workflow for a new developer
	1.	Pull the correct branch.
	2.	Install server dependencies.
	3.	Install client dependencies.
	4.	Add .env files.
	5.	Start the server.
	6.	Start the client.
	7.	Test student login and staff login.
	8.	Check that menu, orders, and uploads are working.
# Deployment

## Setup

### Prep-work
1. in mongoDB Atlas, set up a cluster and/or database containing one or more of the collections used (assessment-cards, mission-cards, users)
2. in .env (in the backend directory), change MONGO_URI to the connection link provided by Atlas
3. (optional) change ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET and PORT as desired in .env
If you already have a cluster set up that you want to use, you can skip step 1. and simply specify the database name in the connection link as shown below; the connection script should create the database if it does not already exist.
e.g. "mongodb+srv://[username]:[password]@[cluster].mongodb.net/[DBname]"

### Backend
1. cd into backend
2. run "npm i"

### Frontend
1. cd into frontend
2. run "npm i"

### Database
1. configure "populateDB.js" (in backend) user if desired (lines 35 & 39-46)
2. run "node run setup"
This creates any collections not created during the prep-work, and populates the database with dummy data.

## Deployment
1. run "npm run start" (in backend)
2. run "npm run dev" (in frontend)

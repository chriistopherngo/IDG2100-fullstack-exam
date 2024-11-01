#!/bin/bash

#Backend
cd backend
npm i
npm run dev &

#Frontend
cd ../frontend
npm i
npm run dev

#Fishnish Message
echo "done"
# FROM node:alpine

FROM nikolaik/python-nodejs:latest

# RUN apk update && apk add --no-cache gcc make git python3 py3-pip && ln -sf python3 /usr/bin/python

WORKDIR '/usr/app'
COPY ./package.json ./
RUN npm install
COPY . .

RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r ./bot/requirements.txt
RUN npm run build

RUN chmod -r 777 /usr/app

CMD ["node", "./dist/main.js"]
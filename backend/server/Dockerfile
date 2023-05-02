FROM node:alpine

RUN apk update && apk add --no-cache make git python3 python3-pip

WORKDIR '/usr/app'
COPY ./package.json ./
RUN npm install
COPY . .

RUN pip3 install -r ./bot/requirements.txt
RUN npm build

CMD ["node", "./dist/main.js"]
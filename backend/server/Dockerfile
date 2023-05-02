FROM node:alpine

RUN apk update && apk add --no-cache make git python3 && ln -sf python3 /usr/bin/python py3-pip
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR '/usr/app'
COPY ./package.json ./
RUN npm install
COPY . .

RUN python3 -m pip install -r ./bot/requirements.txt
RUN npm build

CMD ["node", "./dist/main.js"]
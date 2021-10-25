#Filename: DockerFile
FROM node:10-alpine
WORKDIR /discord_bot/can-san/src
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
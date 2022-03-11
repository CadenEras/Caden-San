#Filename: DockerFile
FROM node:10-alpine
ENTRYPOINT ["tail", "-f", "/dev/null"]
ENV NODE_ENV=production
WORKDIR /Caden_San_V4_Discord
COPY . ./
RUN npm install
COPY . .
EXPOSE 3000
WORKDIR ./src
CMD ["node", "index.js"]
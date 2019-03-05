FROM node:10.15.2-stretch
 
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
 
COPY package.json ./
RUN npm install
 
COPY . .
 
EXPOSE 8081
CMD ["npm", "start"]

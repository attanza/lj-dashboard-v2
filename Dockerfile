FROM node:12-alpine

WORKDIR ./

COPY package*.json ./

RUN npm install
RUN npm run build

COPY . .

EXPOSE 13000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=13000

CMD [ "npm", "start" ]


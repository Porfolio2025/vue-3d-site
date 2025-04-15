FROM node:20


WORKDIR /app


COPY package-lock.yaml package.json ./


RUN npm install


COPY . .


RUN npm build-only


RUN npm install -g serve


EXPOSE 3001


CMD ["serve", "-s", "dist", "-l", "3001"]
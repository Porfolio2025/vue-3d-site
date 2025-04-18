FROM node:20


WORKDIR /app


COPY package-lock.json package.json ./


RUN npm install


COPY . .


RUN npm run build-only


RUN npm install -g serve


EXPOSE 3001


CMD ["serve", "-s", "dist", "-l", "3001"]
# syntax=docker/dockerfile:1

FROM node:20.2.0-alpine
ENV NODE_ENV=production
ENV PREFIX="!"
ENV LANG=de
ENV COOLDOWN=30000
ENV TZ=UTC
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY ["src", "./src/"]
CMD ["node", "src/index.js"]

FROM node:24-bookworm-slim AS production

USER node
WORKDIR /home/node/app

COPY --chown=1000:1000 ./package.json ./package-lock.json /home/node/app/
RUN npm ci -f --only-production && npm cache clean --force

COPY --chown=1000:1000 . /home/node/app
RUN ["npm", "run", "build"]

CMD ["npm", "run", "start"]

FROM node:24-bookworm-slim AS development

#RUN apt update && apt install -y iproute2 procps \
#  && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/app

COPY --chown=1000:1000 ./package.json ./package-lock.json /home/node/app/
RUN npm ci && npm cache clean --force

COPY --chown=1000:1000 . /home/node/app
RUN npm run build

CMD ["npm", "run", "start"]

LABEL app=weather-frontend

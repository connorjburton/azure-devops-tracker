FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn

# Bundle app source
COPY . .

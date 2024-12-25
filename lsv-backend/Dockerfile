# Dockerfile
# Specify node version and choose image
FROM node:20 AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /src/app

# Copy the package.jsons from host to container
COPY package*.json ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN pnpm run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:20 AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /src/app

# Copy all from development stage
COPY --from=development /src/app/ .

EXPOSE 8080

# Run app
CMD [ "node", "dist/main" ]
# Use the official Node.js image from Docker Hub as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies specified in package.json
RUN npm ci 

# Copy the rest of the application code to the working directory
COPY . .









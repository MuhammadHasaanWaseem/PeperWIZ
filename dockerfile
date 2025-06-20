# Use official Node.js LTS version
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8081 for Expo Metro Bundler
EXPOSE 8081

# Start the application
CMD ["npm", "start"]

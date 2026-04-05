# Use official Node image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Create tmp folder (important for your project)
RUN mkdir -p tmp

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
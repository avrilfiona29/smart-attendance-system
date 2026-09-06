# Use Python + Node.js combined base image
FROM nikolaik/python-nodejs:python3.11-nodejs20

# Set working directory
WORKDIR /app

# Install system dependencies needed for dlib/OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install them first (cached layer)
COPY python/requirements.txt ./python/requirements.txt
RUN pip install --no-cache-dir -r python/requirements.txt

# Copy Node.js package files and install
COPY package*.json ./
RUN npm install --production

# Copy rest of backend code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

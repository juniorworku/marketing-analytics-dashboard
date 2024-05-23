#!/bin/bash

# Define the Docker Compose file
DOCKER_COMPOSE_FILE=docker-compose.yml

# Function to check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null
  then
    echo "Docker could not be found. Please install Docker first."
    exit 1
  fi
}

# Function to check if Docker Compose is installed
check_docker_compose() {
  if ! command -v docker-compose &> /dev/null
  then
    echo "Docker Compose could not be found. Please install Docker Compose first."
    exit 1
  fi
}

# Check if Docker and Docker Compose are installed
check_docker
check_docker_compose

# Pull the latest images
echo "Pulling the latest Docker images..."
docker-compose -f $DOCKER_COMPOSE_FILE pull

# Start the Docker containers
echo "Starting the Docker containers..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d

echo "Dashboard system setup completed successfully!"

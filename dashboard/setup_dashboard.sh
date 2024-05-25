#!/bin/bash

# Update package lists
sudo apt-get update

# Install Docker
if ! [ -x "$(command -v docker)" ]; then
  echo 'Docker is not installed. Installing Docker...'
  sudo apt-get install -y docker.io
else
  echo 'Docker is already installed.'
fi

# Install Docker Compose
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Docker Compose is not installed. Installing Docker Compose...'
  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
else
  echo 'Docker Compose is already installed.'
fi

# Create Docker Compose file for Metabase and PostgreSQL
cat <<EOL > docker-compose.yml
version: '3.1'

services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_DB: new_database
      POSTGRES_USER: new_username
      POSTGRES_PASSWORD: new_password
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  metabase:
    image: metabase/metabase:latest
    ports:
      - "3000:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: metabase
      MB_DB_PORT: 5432
      MB_DB_USER: metabase_user
      MB_DB_PASS: metabase_password
      MB_DB_HOST: db

volumes:
  db_data:
EOL

# Start Docker Compose
docker-compose up -d

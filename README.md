# Marketing Analytics Project

## Business Objective
As a Marketing Analytics Engineer at a tech-savvy bank in Ethiopia, the goal is to track and improve the efficiency of the bank's marketing strategy. This project involves collecting and analyzing data from various sources to provide insights into marketing performance. Key tasks include data collection, data processing, setting up dashboards, and performing in-depth analysis.

## Project Structure
The project is organized into several tasks, each focusing on specific aspects of the marketing analytics pipeline:

### Task 1: Exploratory Data Analysis (EDA)
- **Data Summarization**
- **Data Quality Assessment**
- **Univariate Analysis**
- **Bivariate or Multivariate Analysis**
- **Data Enrichment**
- **Data Comparison**
- **Trends Over Time**
- **Correlation between Different Datasets**
- **Outlier Detection**
- **Visualization**

### Task 2: Dashboard Setup
- Created a Docker-based setup script using `docker-compose` to deploy Redash/Metabase/Superset.
- This script helps set up the dashboard system for production deployment.

### Task 3: Data Processing with Kedro
- Implemented data processing using the Kedro framework.
- Organized data into the following layers:
  - **Raw Layer**
  - **Intermediate Layer**
  - **Primary Layer**
- Created dashboards to provide insights on various marketing metrics:
  - Ad performance comparisons of different banks on Tikvah.
  - Impact of ad placement time on performance.
  - Differences between different ads.
  - Bank performance in terms of optimal ad placements.
  - Play Store review sentiment analysis.
  - Impact of Tikvah ads on app downloads and review sentiment.
  - Impact of Tikvah ads on Telegram channel subscriptions.

### Task 4: Database and Dashboard Migration
- Wrote scripts to migrate database tables and dashboards to a remote instance.
- Ensured smooth data and dashboard transition to the production environment.

## Getting Started
### Prerequisites
- Docker
- Docker Compose
- Python
- Kedro
- PostgreSQL

### Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/marketing-analytics.git
   cd marketing-analytics

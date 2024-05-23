import psycopg2
import csv

# Database connection parameters
HOST = "localhost"
DATABASE = "new_database"
USER = "new_username"
PASSWORD = "new_password"

# CSV file paths
TELEGRAM_MESSAGES_CSV = "/home/ted/Desktop/DEV/marketing-analytics-dashboard/data/banks_ad_data.csv"
PLAY_STORE_REVIEWS_CSV = "/home/ted/Desktop/DEV/marketing-analytics-dashboard/data/abyssinia_bank_reviews.csv"

def load_telegram_messages(connection):
    try:
        # Open CSV file and create cursor
        with open(TELEGRAM_MESSAGES_CSV, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header row
            cursor = connection.cursor()

            # Execute COPY command to load data into PostgreSQL table
            cursor.copy_from(file, 'all_banks_telegram_messages', sep=',', null='')
            connection.commit()
            print("Telegram messages data loaded successfully.")

    except Exception as e:
        print("Error loading telegram messages data:", e)

def load_play_store_reviews(connection):
    try:
        # Open CSV file and create cursor
        with open(PLAY_STORE_REVIEWS_CSV, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header row
            cursor = connection.cursor()

            # Execute COPY command to load data into PostgreSQL table
            cursor.copy_from(file, 'abyssinia_bank_reviews', sep=',', null='')
            connection.commit()
            print("Play Store reviews data loaded successfully.")

    except Exception as e:
        print("Error loading play store reviews data:", e)

def main():
    try:
        # Connect to PostgreSQL database
        connection = psycopg2.connect(host=HOST, database=DATABASE, user=USER, password=PASSWORD)
        print("Connected to PostgreSQL database.")

        # Load data into tables
        load_telegram_messages(connection)
        load_play_store_reviews(connection)

    except Exception as e:
        print("Error:", e)

    finally:
        if connection:
            connection.close()
            print("PostgreSQL connection closed.")

if __name__ == "__main__":
    main()

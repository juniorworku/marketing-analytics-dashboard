import os
import pandas as pd
from google_play_scraper import Sort, reviews_all
import nltk
import spacy
from textblob import TextBlob
from nltk.corpus import stopwords

# Ensure necessary resources are downloaded
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

# Function to download and load spaCy model
def load_spacy_model():
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        os.system("python -m spacy download en_core_web_sm")
        nlp = spacy.load("en_core_web_sm")
    return nlp

# Load spaCy model
nlp = load_spacy_model()

def fetch_reviews(app_id):
    try:
        reviews = reviews_all(
            app_id,
            sleep_milliseconds=0,
            lang='en',
            country='us',
            sort=Sort.NEWEST,
        )
        print(f"Fetched {len(reviews)} reviews.")
        return reviews
    except Exception as e:
        print(f"Failed to fetch reviews: {e}")
        return None

def process_reviews(reviews):
    processed_reviews = []
    for review in reviews:
        processed_review = {
            "reviewId": review.get("reviewId", ""),
            "userName": review.get("userName", ""),
            "userImage": review.get("userImage", ""),
            "👍": review.get("thumbsUpCount", 0),
            "reviewCreatedVersion": review.get("reviewCreatedVersion", ""),
            "at": review.get("at", "").isoformat() if review.get("at") else "",
            "replyContent": review.get("replyContent", ""),
            "repliedAt": review.get("repliedAt", "").isoformat() if review.get("repliedAt") else "",
            "appVersion": review.get("appVersion", ""),
            "score": review.get("score", 0),
            "Comments": review.get("content", "")
        }
        processed_reviews.append(processed_review)
    print(f"Processed {len(processed_reviews)} reviews.")
    return processed_reviews

def extract_keywords(comment):
    doc = nlp(comment)
    keywords = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop and token.lemma_ not in stop_words]
    return ", ".join(keywords[:5])

def categorize_review(comment):
    categories = {
        "Account and Identification Issues": ["otp", "identification", "account", "login"],
        "Operational Challenges within the App": ["crash", "bug", "feature", "slow"]
    }
    comment_words = set(comment.lower().split())
    for category, keywords in categories.items():
        if comment_words.intersection(set(keywords)):
            return category
    return "Other"

def extract_insight(comment):
    blob = TextBlob(comment)
    if blob.sentiment.polarity > 0:
        return "Positive"
    elif blob.sentiment.polarity < 0:
        return "Negative"
    else:
        return "Neutral"

def analyze_reviews(reviews):
    for review in reviews:
        review["Sentiment"] = extract_insight(review["Comments"])
        review["Keywords"] = extract_keywords(review["Comments"])
        review["LDA_Category"] = categorize_review(review["Comments"])
        review["Insight"] = f"Influential words: {review['Keywords']}"
    print(f"Analyzed {len(reviews)} reviews.")
    return reviews

def save_to_csv(reviews, filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    df = pd.DataFrame(reviews)
    df.to_csv(filename, index=False)
    print(f"Saved reviews to {filename}")

def main():
    app_id = 'com.ofss.dgbb'  # Abyssinia Bank app ID
    reviews = fetch_reviews(app_id)
    if reviews:
        processed_reviews = process_reviews(reviews)
        enriched_reviews = analyze_reviews(processed_reviews)
        save_to_csv(enriched_reviews, 'data/global_bank_reviews.csv')
    else:
        print("No reviews to process.")

if __name__ == "__main__":
    main()

CREATE TABLE telegram_post_performance (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(50),
    view_count INT,
    like_count INT,
    comment_count INT,
    post_date TIMESTAMP
);

CREATE TABLE google_play_reviews (
    id SERIAL PRIMARY KEY,
    review_id VARCHAR(50),
    review_text TEXT,
    rating INT,
    review_date TIMESTAMP
);

CREATE TABLE google_play_downloads (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP,
    download_count INT
);

CREATE TABLE telegram_subscriptions (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP,
    subscriber_count INT
);

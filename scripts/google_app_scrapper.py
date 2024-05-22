import requests
from bs4 import BeautifulSoup

def scrape_reviews():
    url = "https://play.google.com/store/apps/details?id=com.bankofabyssinia.mobilebanking"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        reviews = []
        for review in soup.find_all('div', class_='zc7KVe'):
            user_name = review.find('span', class_='X43Kjb').text
            rating = int(review.find('div', class_='pf5lIe').find('div')['aria-label'].split()[1])
            review_text = review.find('span', class_='p2TkOb').text
            review_date = review.find('span', class_='p2TkOb').next_sibling.text
            reviews.append({
                'user_name': user_name,
                'rating': rating,
                'review_text': review_text,
                'review_date': review_date
            })
        return reviews
    else:
        print("Failed to fetch reviews")

# Example usage
reviews = scrape_reviews()
for review in reviews:
    print(review)

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Function to generate random view counts
const generateRandom = (value) => {
    if (parseInt(value) > 1000) {
        return "+";
    }
    let max = parseInt(value) - 1;
    let min = parseInt(value) / 100;
    return Math.floor(Math.random() * (max - min) + min);
};

// Function to replace view counts with random values
const replaceValuesFromView = (view) => {
    let viewNumber = parseFloat(view);
    // Adjust the logic here if needed
    return (parseInt(viewNumber)).toString();
};

// Function to fetch messages from the Tikva Ethiopia channel
const fetchMessageTest = async () => {
    const TELEGRAM_URL = "https://t.me/";
    const CHANNEL_NAME = "tikvahethiopia";

    let messages = [];

    // Example post data
    let posts = [
      {
        "_id": "1",
        "message_id": "4295054337"
      },
      {
        "_id": "2",
        "message_id": "4295053332"
      },
      {
        "_id": "3",
        "message_id": "4295052260"
      },
      {
        "_id": "4",
        "message_id": "4295051018"
      },
      {
        "_id": "5",
        "message_id": "4295050394"
      },
      {
        "_id": "6",
        "message_id": "4295049861"
      },
      // Add more post objects as needed
    ];

    

    // Loop through each post to fetch message details
    for (let post of posts) {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: `/usr/bin/google-chrome`,
            args: [`--no-sandbox`, `--headless`, `--disable-dev-shm-usage`]
        });

        const page = await browser.newPage();

        // Navigate to the target Telegram message URL
        await page.goto(`${TELEGRAM_URL}${CHANNEL_NAME}/${post.message_id}?embed=1&mode=tme`, {
            waitUntil: 'networkidle0', // Wait for the network to be idle
        });

        // Extract the message content from the page
        let message_content = await page.evaluate(() => {
            try {
                const message = document.body.querySelector(".tgme_widget_message_text");
                if (message !== undefined) {
                    return message.innerHTML;
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }
        });

        // Extract the number of views from the page
        let views = await page.evaluate(() => {
            try {
                const span = document.body.querySelector(".tgme_widget_message_views");
                if (span !== undefined) {
                    return span.innerText;
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }
        });

        // Extract the date of the post from the page
        let post_date = await page.evaluate(() => {
            try {
                const p_date = document.body.querySelector(".datetime");
                if (p_date !== undefined) {
                    return p_date.innerText;
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }
        });

        // Extract the post hour from the page
        let postHour = await page.evaluate(() => {
            try {
                const postHourElement = document.body.querySelector(".post-meta time");
                if (postHourElement !== undefined) {
                    return postHourElement.getAttribute("datetime");
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error extracting post hour:", error);
                return null;
            }
        });

        // Close the browser
        await browser.close();

        // Add the fetched data to the messages array
        messages.push({
            "Date": post_date || "",
            "Post link": `${TELEGRAM_URL}${CHANNEL_NAME}/${post.message_id}`,
            "View": views ? replaceValuesFromView(views) : "",
            "Post Hour": "", // You can add the post hour here if available
            "Bank": "Global Bank Ethiopia",
            "Time of day": "" // You can calculate the time of day based on post hour here
        });
    }

    // Return the messages array with all the fetched data
    return messages;
};

// Function to save data to a CSV file
const saveToCSV = (data, filename) => {
    const folderPath = path.dirname(filename);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const csvHeaders = Object.keys(data[0]);
    const csvRows = data.map(row => csvHeaders.map(header => row[header]).join(','));
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    fs.writeFileSync(filename, csvContent, 'utf8');
};

// Main function to fetch data and save to CSV
const fetchDataAndSaveToCSV = async () => {
    try {
        const messages = await fetchMessageTest();

        if (messages.length > 0) {
            saveToCSV(messages, 'data/global_bank_telegram_messages.csv');
            console.log("Data saved successfully to 'data/telegram_messages.csv'");
        } else {
            console.log("No messages found.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

// Run the main function
fetchDataAndSaveToCSV();

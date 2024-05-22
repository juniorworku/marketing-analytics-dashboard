import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export const VIEW_INDICATORS = ["K", "M", "B"];

const getIndicatorAndValueFromView = (view) => {
    for (let i = 0; i < VIEW_INDICATORS.length; i++) {
        if (view.toString().includes(VIEW_INDICATORS[i])) {
            let length = (i + 1) * 3;
            let zeros = Array.from({length}, (_, index) => `0`);
            let value = `1${zeros.join('')}`;
            return [VIEW_INDICATORS[i], value];
        }
    }
    return [null, 1];
};

const generateRandom = (value) => {
    if (parseInt(value) > 1000) {
        return "+";
    }
    let max = parseInt(value) - 1;
    let min = parseInt(value) / 100;
    return Math.floor(Math.random() * (max - min) + min);
};

const replaceValuesFromView = (view) => {
    let [indicator, value] = getIndicatorAndValueFromView(view);
    if (indicator !== null) {
        let viewNumber = parseFloat(`${view.toString().split(indicator)[0]}${generateRandom(value)}`);
        // let viewNumber = parseFloat(`${view.toString().split(indicator)[0]}5`)
        return (parseInt(viewNumber * parseInt(value))).toString();
    }
    return view;
};


const fetchMessageTest = async () => {
    const TELEGRAM_URL = "https://t.me/";
    // URL for accessing Telegram messages
    
    let messages = [];
  
    // Example post data
    let posts = [
      {
        "_id": "1",
        "message_id": "4295054430"
      },
      {
        "_id": "2",
        "message_id": "4295054314"
      },
      {
        "_id": "3",
        "message_id": "4295054246"
      },
      {
        "_id": "4",
        "message_id": "4295053851"
      },
      {
        "_id": "5",
        "message_id": "4295053767"
      },
      {
        "_id": "6",
        "message_id": "4295053631"
      },
      {
        "_id": "7",
        "message_id": "4295053496"
      },
      {
        "_id": "8",
        "message_id": "4295053443"
      },
      {
        "_id": "9",
        "message_id": "4295053290"
      },
      {
        "_id": "10",
        "message_id": "4295052919"
      },
      {
        "_id": "11",
        "message_id": "4295052703"
      },
      {
        "_id": "12",
        "message_id": "4295052602"
      },
      {
        "_id": "13",
        "message_id": "4295052501"
      },
      {
        "_id": "14",
        "message_id": "4295052230"
      },
      {
        "_id": "14",
        "message_id": "4295038149"
      },
      // Add more post objects as needed
    ];
  
    // Loop through each post to fetch message details
    for (let post of posts) {
  
      // Initiate the browser using Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: `/usr/bin/google-chrome`,
        args: [`--no-sandbox`, `--headless`, `--disable-dev-shm-usage`]
      });
  
      // Create a new page in headless Chrome
      const page = await browser.newPage();
  
      // Navigate to the target Telegram message URL
      await page.goto(`${TELEGRAM_URL}tikvahethiopia/${post.message_id}?embed=1&mode=tme`, {
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
        "Post link": `${TELEGRAM_URL}tikvahethiopia/${post.message_id}`,
        "View": views ? replaceValuesFromView(views) : "",
        "Post Hour": "", // You can add the post hour here if available
        "Bank": "BOA",
        "Time of day": "" // You can calculate the time of day based on post hour here
      });
    }

    // Return the messages array with all the fetched data
    return messages;
};

// Function to format post date
const formatPostDate = (post_date) => {
    // Add your date formatting logic here
    return post_date;
};

// Function to extract post hour from formatted date
const getPostHour = (post_date) => {
    // Add your logic to extract post hour from formatted date
    return post_date;
};

// Function to get time of day based on hour
const getTimeOfDay = (hour) => {
    if (hour >= 0 && hour < 6) return "night";
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 18) return "afternoon";
    return "evening";
};

// Function to save data to a CSV file
const saveToCSV = (data, filename) => {
    // Create the data folder if it doesn't exist
    const folderPath = path.dirname(filename);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Convert data to CSV format
    const csvHeaders = Object.keys(data[0]);
    const csvRows = data.map(row => csvHeaders.map(header => row[header]).join(','));
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Write CSV content to file
    fs.writeFileSync(filename, csvContent, 'utf8');
};

// Main function to fetch data and save to CSV
const fetchDataAndSaveToCSV = async () => {
    try {
        // Fetch data
        const messages = await fetchMessageTest();
        
        if (messages.length > 0) {
            // Save data to CSV
            saveToCSV(messages, 'data/telegram_messages.csv');
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

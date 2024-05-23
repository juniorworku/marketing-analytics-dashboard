const fs = require('fs');
const { Telegraf } = require('telegraf');

// Initialize your Telegram bot
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

// Function to save subscription data to a CSV file
const saveToCSV = (subscriberCount, subscribers, filename) => {
    try {
        // Create a CSV content string
        let csvContent = `Subscriber Count,${subscriberCount}\n\nList of Subscribers\n\n`;

        // Add subscriber usernames to the CSV content
        subscribers.forEach((subscriber, index) => {
            csvContent += `${index + 1},${subscriber.user.username}\n`;
        });

        // Write CSV content to file
        fs.writeFileSync(filename, csvContent, 'utf8');

        console.log(`Subscription data saved successfully to ${filename}`);
    } catch (error) {
        console.error('Error saving subscription data to CSV:', error);
    }
};

// Modify the fetchSubscriptionData function to call the saveToCSV function
const fetchSubscriptionData = async (filename) => {
    try {
        // Fetch data about the BoAEth channel
        const channelInfo = await bot.telegram.getChat('BoAEth');

        // Extract relevant subscription data
        const subscriberCount = channelInfo['members_count'];
        
        // Fetch all subscribers (may require additional permissions)
        const subscribers = await bot.telegram.getChatMembersCount('BoAEth');

        // Save subscription data to CSV
        saveToCSV(subscriberCount, subscribers, filename);
    } catch (error) {
        console.error('Error fetching subscription data:', error);
    }
};

// Call the fetchSubscriptionData function to initiate the data fetching process
const CSV_FILENAME = 'telegram_subscription_data.csv';
fetchSubscriptionData(CSV_FILENAME);

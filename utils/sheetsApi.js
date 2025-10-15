// import { google } from 'googleapis';
// import path from 'path';
// import fs from 'fs'; // Using Node's built-in file system module
// import { fileURLToPath } from 'url';
// import logger from './logger.js';

// // Helper to get the directory name in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Check for required environment variables on startup
// if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.SHEET_ID) {
//     logger.error('FATAL: Missing Google Sheets API credentials or Sheet ID in environment variables.');
//     // In a production app, you might want to stop the server if credentials are not found
//     // process.exit(1); 
// }

// const SHEET_ID = process.env.SHEET_ID;
// // Default to 'Sheet1' if SHEET_NAME is not provided, making it more robust
// const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1'; 
// const KEY_FILE_PATH = path.resolve(__dirname, '..', process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// /**
//  * Initializes and returns an authenticated Google Sheets API client.
//  */
// const getSheetsClient = () => {
//     // --- UPDATED AUTHENTICATION METHOD ---
//     // This fixes the 'keyFilename is deprecated' warning.
//     try {
//         // Read the credentials file content synchronously
//         const keyFileContent = fs.readFileSync(KEY_FILE_PATH);
//         const credentials = JSON.parse(keyFileContent);

//         // Use the 'credentials' option instead of the deprecated 'keyFile'
//         const auth = new google.auth.GoogleAuth({
//             credentials,
//             scopes: SCOPES,
//         });
//         return google.sheets({ version: 'v4', auth });
//     } catch (error) {
//         logger.error(`Failed to read or parse Google credentials file at: ${KEY_FILE_PATH}`, { error: error.message });
//         throw new Error('Could not initialize Google Sheets client. Check credentials file path and format.');
//     }
// };

// /**
//  * Appends a new order to the Google Sheet.
//  * @param {object} orderData - The order data to append.
//  */
// export const appendOrder = async (orderData) => {
//     try {
//         const sheets = getSheetsClient();
//         const values = [
//             [
//                 orderData.orderId,
//                 orderData.orderDate,
//                 orderData.customerName,
//                 orderData.customerPhone,
//                 orderData.customerAddress,
//                 orderData.itemsJson,
//                 orderData.totalAmount,
//                 orderData.language,
//                 orderData.status,
//             ],
//         ];

//         await sheets.spreadsheets.values.append({
//             spreadsheetId: SHEET_ID,
//             range: `${SHEET_NAME}!A:I`, // Uses the configured sheet name
//             valueInputOption: 'USER_ENTERED',
//             resource: {
//                 values: values,
//             },
//         });
//     } catch (err) {
//         logger.error(`Error appending to Google Sheet: ${err.message}`, { fullError: err });
//         throw new Error(`Google Sheets API Error: ${err.message}`);
//     }
// };

// /**
//  * Retrieves all orders from the Google Sheet.
//  * @returns {Promise<Array<Object>>} An array of order objects.
//  */
// export const getOrders = async () => {
//     try {
//         const sheets = getSheetsClient();
//         const response = await sheets.spreadsheets.values.get({
//             spreadsheetId: SHEET_ID,
//             range: `${SHEET_NAME}!A:I`, // Uses the configured sheet name
//         });

//         const rows = response.data.values;
//         if (!rows || rows.length <= 1) { // Check for header only or empty sheet
//             return [];
//         }

//         const headers = rows[0];
//         const orders = rows.slice(1).map((row) => {
//             const order = {};
//             headers.forEach((header, index) => {
//                 // Safely assign values, preventing errors from empty cells in a row
//                 order[header] = row[index] || ''; 
//             });
//             return order;
//         });

//         return orders;
//     } catch (err) {
//         logger.error(`Error reading from Google Sheet: ${err.message}`);
//         throw new Error('Could not read from Google Sheet.');
//     }
// };

import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from './logger.js';

// Helper to get directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment Variable Checks
if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.SHEET_ID) {
    logger.error('FATAL: Missing GOOGLE_SERVICE_ACCOUNT_KEY or SHEET_ID in environment variables.');
}

const SHEET_ID = process.env.SHEET_ID;
// Use the correct variable name you have set on Render (e.g., SHEET_NAME or SHEET_TAB_NAME)
const SHEET_NAME = process.env.SHEET_NAME || process.env.SHEET_TAB_NAME || 'Sheet1'; 
const KEY_FILE_PATH = path.resolve(__dirname, '..', process.env.GOOGLE_SERVICE_ACCOUNT_KEY || 'google-key.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initializes and returns an authenticated Google Sheets API client.
 */
const getSheetsClient = () => {
    try {
        const keyFileContent = fs.readFileSync(KEY_FILE_PATH);
        const credentials = JSON.parse(keyFileContent);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: SCOPES,
        });
        return google.sheets({ version: 'v4', auth });
    } catch (error) {
        logger.error(`Failed to read or parse credentials file at: ${KEY_FILE_PATH}`, { error: error.message });
        throw new Error('Could not initialize Google Sheets client. Check credentials file path and format.');
    }
};


/**
 * Retrieves all orders from the Google Sheet.
 * THIS FUNCTION HAS BEEN MADE MORE ROBUST.
 * @returns {Promise<Array<Object>>} An array of order objects.
 */
export const getOrders = async () => {
    try {
        const sheets = getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}`, // Read the entire sheet
        });

        const rows = response.data.values;

        // If there are no rows or only a header row, return empty
        if (!rows || rows.length <= 1) {
            logger.info('No data rows found in Google Sheet.');
            return [];
        }

        const headers = rows[0];
        // Filter out any completely empty rows to avoid errors
        const dataRows = rows.slice(1).filter(row => row.some(cell => cell && cell.trim() !== ''));

        // --- ADDED LOGGING FOR DEBUGGING ---
        // This will show us exactly what the server is reading in the Render logs.
        logger.info(`Successfully retrieved ${dataRows.length} data rows from Google Sheet.`);

        const orders = dataRows.map((row) => {
            const order = {};
            headers.forEach((header, index) => {
                // Trim the header to remove any hidden spaces (like in "Name ")
                const trimmedHeader = header.trim(); 
                // Safely assign value, defaulting to an empty string if a cell is missing
                order[trimmedHeader] = row[index] || ''; 
            });

            // Attempt to parse the items JSON string back into an array
            // It will now look for "Product" based on your JSON output
            const itemsKey = "ItemsJSON"; // The frontend expects this key
            const sheetItemsKey = "Product"; // Your sheet provides this key

            if (order[sheetItemsKey]) {
                try {
                    // We assign the parsed data to the key the frontend wants
                    order[itemsKey] = JSON.parse(order[sheetItemsKey]);
                } catch (e) {
                    logger.warn(`Could not parse product data for order ${order.OrderID}`);
                    order[itemsKey] = []; // Default to empty array on failure
                }
            } else {
                 order[itemsKey] = [];
            }
            return order;
        });
        
        // --- ADDED LOGGING FOR DEBUGGING ---
        logger.info(`Processed ${orders.length} orders to be sent to frontend.`);
        return orders;

    } catch (err) {
        logger.error(`Error reading from Google Sheet: ${err.message}`);
        throw new Error('Could not read from Google Sheet.');
    }
};

// The appendOrder function remains the same as it is working correctly.
export const appendOrder = async (orderData) => {
    try {
        const sheets = getSheetsClient();
        // The headers in the sheet must match this order
        const values = [
            [
                orderData.orderId,
                orderData.orderDate,
                orderData.customerName,
                orderData.customerPhone,
                orderData.customerAddress,
                JSON.stringify(orderData.items), // This column must be named "Product" in your sheet header
                orderData.totalAmount,
                orderData.language,
                'Pending',
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:I`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values,
            },
        });
    } catch (err) {
        logger.error(`Error appending to Google Sheet: ${err.message}`);
        throw new Error(`Google Sheets API Error: ${err.message}`);
    }
};
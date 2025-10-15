import { google } from 'googleapis';
import path from 'path';
import fs from 'fs'; // Using Node's built-in file system module
import { fileURLToPath } from 'url';
import logger from './logger.js';

// Helper to get the directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for required environment variables on startup
if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.SHEET_ID) {
    logger.error('FATAL: Missing Google Sheets API credentials or Sheet ID in environment variables.');
    // In a production app, you might want to stop the server if credentials are not found
    // process.exit(1); 
}

const SHEET_ID = process.env.SHEET_ID;
// Default to 'Sheet1' if SHEET_NAME is not provided, making it more robust
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1'; 
const KEY_FILE_PATH = path.resolve(__dirname, '..', process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initializes and returns an authenticated Google Sheets API client.
 */
const getSheetsClient = () => {
    // --- UPDATED AUTHENTICATION METHOD ---
    // This fixes the 'keyFilename is deprecated' warning.
    try {
        // Read the credentials file content synchronously
        const keyFileContent = fs.readFileSync(KEY_FILE_PATH);
        const credentials = JSON.parse(keyFileContent);

        // Use the 'credentials' option instead of the deprecated 'keyFile'
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: SCOPES,
        });
        return google.sheets({ version: 'v4', auth });
    } catch (error) {
        logger.error(`Failed to read or parse Google credentials file at: ${KEY_FILE_PATH}`, { error: error.message });
        throw new Error('Could not initialize Google Sheets client. Check credentials file path and format.');
    }
};

/**
 * Appends a new order to the Google Sheet.
 * @param {object} orderData - The order data to append.
 */
export const appendOrder = async (orderData) => {
    try {
        const sheets = getSheetsClient();
        const values = [
            [
                orderData.orderId,
                orderData.orderDate,
                orderData.customerName,
                orderData.customerPhone,
                orderData.customerAddress,
                orderData.itemsJson,
                orderData.totalAmount,
                orderData.language,
                orderData.status,
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:I`, // Uses the configured sheet name
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values,
            },
        });
    } catch (err) {
        logger.error(`Error appending to Google Sheet: ${err.message}`, { fullError: err });
        throw new Error(`Google Sheets API Error: ${err.message}`);
    }
};

/**
 * Retrieves all orders from the Google Sheet.
 * @returns {Promise<Array<Object>>} An array of order objects.
 */
export const getOrders = async () => {
    try {
        const sheets = getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:I`, // Uses the configured sheet name
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) { // Check for header only or empty sheet
            return [];
        }

        const headers = rows[0];
        const orders = rows.slice(1).map((row) => {
            const order = {};
            headers.forEach((header, index) => {
                // Safely assign values, preventing errors from empty cells in a row
                order[header] = row[index] || ''; 
            });
            return order;
        });

        return orders;
    } catch (err) {
        logger.error(`Error reading from Google Sheet: ${err.message}`);
        throw new Error('Could not read from Google Sheet.');
    }
};


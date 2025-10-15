import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error("FATAL ERROR: SHEET_ID or GOOGLE_SERVICE_ACCOUNT_KEY is not defined in the .env file. Please check your configuration.");
}

const SHEET_ID = process.env.SHEET_ID;

// --- MODIFICATION FOR CONFIGURABLE SHEET NAME ---
// Use the SHEET_NAME from .env, or default to 'Sheet1' if it's not provided.
const SHEET_NAME = process.env.SHEET_TAB_NAME ;

const keyFileFromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY.trim().replace(/["']/g, '');
const KEY_FILE_PATH = path.resolve(__dirname, '..', keyFileFromEnv);
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Initializes and returns an authenticated Google Sheets API client.
 */
const getSheetsClient = () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: SCOPES,
    });
    return google.sheets({ version: 'v4', auth });
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

        // Use the SHEET_NAME variable for the range
        const range = `${SHEET_NAME}!A:I`;

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: range,
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
        // Use the SHEET_NAME variable for the range
        const range = `${SHEET_NAME}!A:I`;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: range,
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
            return [];
        }

        const headers = rows[0];
        const orders = rows.slice(1).map((row) => {
            const order = {};
            headers.forEach((header, index) => {
                order[header] = row[index];
            });
            return order;
        });

        return orders;
    } catch (err) {
        logger.error(`Error reading from Google Sheet: ${err.message}`);
        throw new Error('Could not read from Google Sheet.');
    }
};


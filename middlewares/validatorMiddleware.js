import { check, body } from 'express-validator';

// This is the validation chain for creating a new order.
// It has been updated to match the exact data structure sent by the React frontend.
export const validateOrder = [
  // Validate top-level customer information
  check('customerName', 'Customer name is required.').not().isEmpty().trim().escape(),
  check('customerPhone', 'A valid phone number is required.').not().isEmpty().trim().escape(),
  check('customerAddress', 'Delivery address is required.').not().isEmpty().trim().escape(),
  
  // Validate that 'items' is a non-empty array
  check('items', 'Cart items cannot be empty.').isArray({ min: 1 }),

  // --- FIX APPLIED HERE ---
  // Validate each object within the 'items' array.
  // The '*' is a wildcard that applies these rules to every item in the array.

  // It now checks for 'id' and 'price' which are sent by the frontend, instead of 'name'.
  body('items.*.id', 'Each item must have an ID.').not().isEmpty(),
  body('items.*.price', 'Each item must have a price.').isNumeric(),
  
  // It now correctly checks for 'qty' instead of 'quantity'.
  body('items.*.qty', 'Item quantity must be a positive number.').isFloat({ gt: 0 }),
];
```

### Your Final Action Plan

1.  In your project, navigate to the `middleware` folder.
2.  Open the `validationMiddleware.js` file.
3.  **Replace** its entire content with the code I've provided above.
4.  **Save** the file.
5.  **Commit and push** this final change to your GitHub repository.
    ```bash
    git add middleware/validationMiddleware.js
    git commit -m "fix: Align order validation with frontend data schema"
    git push origin main
    


import React, { useState, useReducer, useEffect, useCallback } from 'react';

import { createRoot } from 'react-dom/client';



// Load lucide-react icons for a clean look

import { ShoppingCart, User, Lock, Store, Zap, X, CheckCircle, Truck, RefreshCw, AlertTriangle, ListOrdered, IndianRupee } from 'lucide-react';



// --- Static Product Data ---

const PRODUCTS = [

  // Added placeholder image URLs (using base64 for Aalu, URLs for others)

  { id: 'aalu', name_en: 'Potato', name_hi: 'आलू', price: 20, unit: 'kg', image: 'data:image/jpeg;base64,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' },

  { id: 'piyaz', name_en: 'Onion', name_hi: 'प्याज़', price: 30, unit: 'kg', image: 'https://placehold.co/100x100/800080/FFFFFF?text=Piyaz' },

  { id: 'adrak', name_en: 'Ginger', name_hi: 'अदरक', price: 120, unit: 'kg', image: 'https://placehold.co/100x100/FFD700/000000?text=Adrak' },

  { id: 'lasun', name_en: 'Garlic', name_hi: 'लहसुन', price: 150, unit: 'kg', image: 'https://placehold.co/100x100/FFFFFF/000000?text=Lasun' }

];



// --- Localization Map (T) ---

// Updated app name to Faiz Traders

const T = {

  // Navigation & General

  app_name: { en: 'Faiz Traders', hi: 'फैज़ ट्रेडर्स' }, // Updated Name

  role: { en: 'Role', hi: 'भूमिका' },

  customer: { en: 'Customer', hi: 'ग्राहक' },

  admin: { en: 'Admin', hi: 'प्रबंधक' },

  language: { en: 'Language', hi: 'भाषा' },

  shop: { en: 'Shop', hi: 'खरीददारी' },

  view_cart: { en: 'View Cart', hi: 'कार्ट देखें' },

  admin_dashboard: { en: 'Admin Dashboard', hi: 'प्रबंधक डैशबोर्ड' },

  back_to_shop: { en: 'Back to Shop', hi: 'दुकान पर वापस जाएँ' }, // Added explicit back string



  // Product/Cart

  per_kg: { en: 'per kg', hi: 'प्रति किलो' },

  add_to_cart: { en: 'Add to Cart', hi: 'कार्ट में जोड़ें' },

  update_cart: { en: 'Update Cart', hi: 'कार्ट अपडेट करें' },

  subtotal: { en: 'Subtotal', hi: 'उप-कुल' },

  total: { en: 'Total Amount', hi: 'कुल राशि' },

  empty_cart: { en: 'Your cart is empty. Please add some items!', hi: 'आपका कार्ट खाली है। कृपया कुछ आइटम जोड़ें!' },

  checkout: { en: 'Checkout', hi: 'खरीदें' },

  items: { en: 'Items', hi: 'आइटम' },

  price: { en: 'Price', hi: 'मूल्य' },

  qty: { en: 'Qty', hi: 'मात्रा' },

  remove: { en: 'Remove', hi: 'हटाएँ' },

 

  // Checkout Form

  customer_info: { en: 'Customer Information', hi: 'ग्राहक जानकारी' },

  full_name: { en: 'Full Name', hi: 'पूरा नाम' },

  phone_number: { en: 'Phone Number', hi: 'फ़ोन नंबर' },

  delivery_address: { en: 'Delivery Address', hi: 'डिलीवरी पता' },

  name_placeholder: { en: 'e.g., Ramesh Singh', hi: 'जैसे, रमेश सिंह' },

  phone_placeholder: { en: 'e.g., 9876543210', hi: 'जैसे, 9876543210' },

  address_placeholder: { en: 'Full address including street and city', hi: 'सड़क और शहर सहित पूरा पता' },

  place_order: { en: 'Place Order', hi: 'ऑर्डर करें' },



  // Confirmation/Errors

  order_success: { en: 'Order Confirmed!', hi: 'ऑर्डर पक्का हो गया!' },

  order_id: { en: 'Your Order ID is', hi: 'आपका ऑर्डर ID है' },

  order_summary: { en: 'Order Summary', hi: 'ऑर्डर सारांश' },

  network_error: { en: 'Network Error! Please try again.', hi: 'नेटवर्क त्रुटि! कृपया पुनः प्रयास करें।' },

  fill_all_fields: { en: 'Please fill all required fields.', hi: 'कृपया सभी आवश्यक फ़ील्ड भरें।' },

  cart_empty_error: { en: 'Cannot checkout with an empty cart.', hi: 'खाली कार्ट के साथ चेकआउट नहीं किया जा सकता।' },

 

  // Admin

  admin_auth_title: { en: 'Admin Access Required', hi: 'प्रबंधक पहुँच आवश्यक' },

  admin_password: { en: 'Admin Password', hi: 'प्रबंधक पासवर्ड' },

  login: { en: 'Login', hi: 'लॉग इन करें' },

  logout: { en: 'Logout', hi: 'लॉग आउट' },

  password_incorrect: { en: 'Incorrect Password.', hi: 'गलत पासवर्ड।' },

  orders_retrieved: { en: 'Orders Retrieved', hi: 'ऑर्डर प्राप्त हुए' },

  status_new: { en: 'New', hi: 'नया' },

  status_completed: { en: 'Completed', hi: 'पूरा हो गया' },

};



// --- Config and Constants ---

// NOTE: These endpoints match the Node.js/Express routing setup.

const ORDERS_ENDPOINT = '/api/orders';

const ADMIN_LOGIN_ENDPOINT = '/api/admin/login';

const ADMIN_VIEW_TOKEN_KEY = 'adminToken';

const MOCK_ADMIN_PASSWORD = 'password'; // Use this for frontend-only auth demo



// --- Cart Reducer ---

const cartReducer = (state, action) => {

  switch (action.type) {

    case 'ADD_ITEM': {

      const { item, quantity } = action.payload;

      const existingItem = state.find(i => i.id === item.id);

     

      if (existingItem) {

        return state.map(i =>

          i.id === item.id ? { ...i, qty: quantity } : i

        ).filter(i => i.qty > 0);

      } else if (quantity > 0) {

        return [...state, { ...item, qty: quantity }];

      }

      return state.filter(i => i.qty > 0);

    }

    case 'REMOVE_ITEM':

      return state.filter(item => item.id !== action.payload.id);

    case 'CLEAR_CART':

      return [];

    default:

      return state;

  }

};



// --- Helper Functions ---

const calculateCartTotal = (cart) => {

  return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

};



// --- Language/UI Helpers ---

const getLabel = (key, lang) => {

  if (!T[key]) return key;

  if (lang === 'en') return T[key].en;

  if (lang === 'hi') return T[key].hi;

  // Default to showing both if both are requested

  return `${T[key].en} / ${T[key].hi}`;

};



// --- Components ---



/**

 * Cart Item Card component used in the Cart view.

 */

const CartItemCard = ({ item, dispatch, lang }) => {

  const [qty, setQty] = useState(item.qty);

  const subtotal = item.price * item.qty;



  const handleUpdate = () => {

    dispatch({ type: 'ADD_ITEM', payload: { item, quantity: qty } });

  };



  const handleRemove = () => {

    dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });

  };



  return (

    <div className="flex items-center justify-between p-3 border-b last:border-b-0">

      <div className="flex-1 min-w-0">

        <p className="font-semibold text-lg text-gray-800">{getLabel(item.id, lang)}</p>

        <p className="text-sm text-gray-500">

          {getLabel('price', lang)}: ₹{item.price}/{item.unit}

        </p>

      </div>



      <div className="flex items-center space-x-2 text-sm">

        <input

          type="number"

          value={qty}

          onChange={(e) => setQty(Math.max(0, parseInt(e.target.value) || 0))}

          className="w-16 p-2 border rounded-md text-center text-gray-700"

          min="0"

        />

        <button

          onClick={handleUpdate}

          className="p-2 text-blue-600 hover:text-blue-800 transition duration-150"

          aria-label={getLabel('update_cart', 'en')}

        >

          <RefreshCw size={18} />

        </button>

        <button

          onClick={handleRemove}

          className="p-2 text-red-600 hover:text-red-800 transition duration-150"

          aria-label={getLabel('remove', 'en')}

        >

          <X size={18} />

        </button>

      </div>

      <p className="w-20 text-right font-medium text-lg">₹{subtotal.toFixed(2)}</p>

    </div>

  );

};



/**

 * Product Card component used in the Shop view.

 */

const ProductCard = ({ product, dispatch, cart, lang }) => {

  const currentItem = cart.find(i => i.id === product.id);

  const [qty, setQty] = useState(currentItem ? currentItem.qty : 0);



  useEffect(() => {

    // Sync local quantity state with cart state when cart changes (e.g., after successful order)

    const syncedItem = cart.find(i => i.id === product.id);

    setQty(syncedItem ? syncedItem.qty : 0);

  }, [cart, product.id]);



  const handleUpdateCart = () => {

    dispatch({ type: 'ADD_ITEM', payload: { item: product, quantity: qty } });

  };



  return (

    <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col justify-between">

      {/* Image for visual clarity */}

      <img

        src={product.image}

        alt={getLabel(product.id, 'en')}

        className="w-full h-32 object-contain mb-4 rounded-lg bg-gray-100 p-2"

        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/cccccc/333333?text=Veggie" }}

      />

      <div>

        <h3 className="text-xl font-bold text-gray-800">{getLabel(product.id, 'en')} / <span className="text-green-600">{getLabel(product.id, 'hi')}</span></h3>

        <p className="text-3xl font-extrabold text-green-700 my-2 flex items-center">

          <IndianRupee size={20} className="mr-1"/>{product.price}

          <span className="text-sm text-gray-500 font-normal ml-1"> / {product.unit}</span>

        </p>

      </div>

     

      <div className="mt-4 flex flex-col space-y-3">

        <label className="text-sm font-medium text-gray-600">

          {getLabel('qty', lang)} ({product.unit})

        </label>

        <input

          type="number"

          value={qty}

          onChange={(e) => setQty(Math.max(0, parseFloat(e.target.value) || 0))}

          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-lg"

          min="0"

          step="0.5"

        />

        <button

          onClick={handleUpdateCart}

          className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-green-700 transition duration-200 flex items-center justify-center text-base"

        >

          <ShoppingCart size={18} className="mr-2" />

          {getLabel(qty > 0 ? 'update_cart' : 'add_to_cart', lang)}

        </button>

      </div>

    </div>

  );

};



/**

 * Full Cart View and Checkout Button

 */

const Cart = ({ cart, dispatch, setView, lang }) => {

  const total = calculateCartTotal(cart);

  const cartIsEmpty = cart.length === 0;



  return (

    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">

      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">

        <ShoppingCart size={24} className="mr-3 text-green-600" />

        {getLabel('view_cart', lang)}

      </h2>



      <div className="min-h-48 border rounded-lg overflow-hidden bg-gray-50">

        {cartIsEmpty ? (

          <p className="p-6 text-center text-gray-500 text-lg">{getLabel('empty_cart', lang)}</p>

        ) : (

          <div>

            {cart.map(item => (

              <CartItemCard key={item.id} item={item} dispatch={dispatch} lang={lang} />

            ))}

          </div>

        )}

      </div>



      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-dashed">

        <p className="text-2xl font-extrabold text-gray-900">

          {getLabel('total', lang)}: ₹{total.toFixed(2)}

        </p>

        <button

          onClick={() => setView('checkout')}

          disabled={cartIsEmpty}

          className={`py-3 px-6 text-lg font-bold rounded-xl shadow-lg transition duration-200 mt-4 sm:mt-0 ${

            cartIsEmpty

              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'

              : 'bg-green-600 text-white hover:bg-green-700 flex items-center'

          }`}

        >

          <Truck size={20} className="mr-2" />

          {getLabel('checkout', lang)}

        </button>

      </div>

      {/* Back button confirmed */}

      <button onClick={() => setView('shop')} className="text-sm text-blue-600 hover:underline mt-4">

        &larr; {getLabel('back_to_shop', lang)}

      </button>

    </div>

  );

};



/**

 * Checkout Form for Customer Details and Order Submission

 */

const CheckoutForm = ({ cart, dispatch, setView, setOrderSubmissionStatus, setConfirmedOrder, lang }) => {

  const total = calculateCartTotal(cart);

  const [formData, setFormData] = useState({

    customerName: '',

    customerPhone: '',

    customerAddress: '',

  });

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });

  };



  const validate = () => {

    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {

      setError(getLabel('fill_all_fields', lang));

      return false;

    }

    if (cart.length === 0) {

      setError(getLabel('cart_empty_error', lang));

      return false;

    }

    setError(null);

    return true;

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;



    const orderPayload = {

      orderId: 'ORD-' + crypto.randomUUID().substring(0, 8), // Client-side generated ID

      customerName: formData.customerName,

      customerPhone: formData.customerPhone,

      customerAddress: formData.customerAddress,

      items: cart.map(item => ({

        id: item.id,

        name_en: item.name_en,

        name_hi: item.name_hi,

        qty: item.qty,

        unit: item.unit,

        price: item.price

      })),

      totalAmount: total,

      language: lang,

      orderDate: new Date().toISOString(),

    };



    setLoading(true);

    setOrderSubmissionStatus(null);

    setConfirmedOrder(null);



    try {

      // --- API call to backend (connected via relative path /api/orders) ---

      const response = await fetch(ORDERS_ENDPOINT, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(orderPayload),

      });



      const result = await response.json();



      if (response.ok) {

        setConfirmedOrder({ ...orderPayload, orderId: result.orderId || orderPayload.orderId });

        setOrderSubmissionStatus('success');

        dispatch({ type: 'CLEAR_CART' });

        setView('confirmation');

      } else {

        // Handle backend validation/error messages

        setError(result.message || getLabel('network_error', lang));

        setOrderSubmissionStatus('error');

      }



    } catch (err) {

      setError(getLabel('network_error', lang));

      setOrderSubmissionStatus('error');

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-xl border border-gray-200">

      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">

        <Truck size={24} className="mr-3 text-green-600" />

        {getLabel('checkout', lang)}

      </h2>



      <p className="text-2xl font-extrabold text-green-700 mb-6 text-center">

        {getLabel('total', lang)}: ₹{total.toFixed(2)}

      </p>



      <form onSubmit={handleSubmit} className="space-y-5">

        <h3 className="text-xl font-semibold mb-4 border-b pb-2">

          {getLabel('customer_info', lang)}

        </h3>

       

        {/* Name Input */}

        <div>

          <label htmlFor="customerName" className="block text-base font-medium text-gray-700">

            {getLabel('full_name', lang)}

          </label>

          <input

            type="text"

            name="customerName"

            id="customerName"

            value={formData.customerName}

            onChange={handleChange}

            placeholder={getLabel('name_placeholder', 'en')}

            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-green-500 focus:border-green-500"

          />

        </div>



        {/* Phone Input */}

        <div>

          <label htmlFor="customerPhone" className="block text-base font-medium text-gray-700">

            {getLabel('phone_number', lang)}

          </label>

          <input

            type="tel"

            name="customerPhone"

            id="customerPhone"

            value={formData.customerPhone}

            onChange={handleChange}

            placeholder={getLabel('phone_placeholder', 'en')}

            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-green-500 focus:border-green-500"

          />

        </div>



        {/* Address Input */}

        <div>

          <label htmlFor="customerAddress" className="block text-base font-medium text-gray-700">

            {getLabel('delivery_address', lang)}

          </label>

          <textarea

            name="customerAddress"

            id="customerAddress"

            rows="3"

            value={formData.customerAddress}

            onChange={handleChange}

            placeholder={getLabel('address_placeholder', 'en')}

            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-green-500 focus:border-green-500"

          ></textarea>

        </div>



        {error && (

          <p className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">

            <AlertTriangle size={20} className="mr-2" />

            {error}

          </p>

        )}



        <button

          type="submit"

          disabled={loading || total <= 0}

          className={`w-full py-4 px-4 text-xl font-bold rounded-xl shadow-lg transition duration-200 flex items-center justify-center ${

            loading || total <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'

          }`}

        >

          {loading ? (

            '...'

          ) : (

            <>

              <CheckCircle size={22} className="mr-2" />

              {getLabel('place_order', lang)}

            </>

          )}

        </button>

      </form>

      {/* Back button confirmed */}

      <button onClick={() => setView('shop')} className="text-sm text-blue-600 hover:underline mt-4">

        &larr; {getLabel('back_to_shop', lang)}

      </button>

    </div>

  );

};



/**

 * Order Confirmation Screen

 */

const ConfirmationScreen = ({ confirmedOrder, setView, lang }) => (

  <div className="max-w-xl mx-auto bg-green-50 p-8 rounded-xl shadow-xl text-center border border-green-300">

    <CheckCircle size={60} className="text-green-600 mx-auto mb-4" />

    <h2 className="text-4xl font-extrabold text-green-800 mb-2">

      {getLabel('order_success', lang)}

    </h2>

    <p className="text-xl font-semibold text-gray-700 mb-6">

      {getLabel('order_id', lang)}: <span className="text-red-500">{confirmedOrder?.orderId || 'N/A'}</span>

    </p>



    <div className="bg-white p-4 rounded-lg border border-gray-100 text-left">

      <h3 className="text-lg font-bold mb-2">{getLabel('order_summary', lang)}</h3>

      <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">

        {confirmedOrder?.items.map(item => (

          <li key={item.id}>

            {getLabel(item.id, 'en')} ({item.name_hi}) x {item.qty} {item.unit} @ ₹{item.price}

          </li>

        ))}

      </ul>

      <p className="mt-4 text-xl font-extrabold text-gray-900 border-t pt-2">

        {getLabel('total', lang)}: ₹{confirmedOrder?.totalAmount.toFixed(2)}

      </p>

    </div>



    <button

      onClick={() => setView('shop')}

      className="mt-8 bg-blue-600 text-white py-3 px-6 text-lg font-bold rounded-xl hover:bg-blue-700 transition duration-200"

    >

      {getLabel('back_to_shop', lang)}

    </button>

  </div>

);



/**

 * Admin Authentication Modal

 */

const AuthModal = ({ unlockAdmin, setRole, setView, lang }) => {

  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError(null);

    setLoading(true);



    if (password === MOCK_ADMIN_PASSWORD) {

        // --- MOCK AUTH SUCCESS (FALLBACK) ---

        const token = 'MOCK_ADMIN_TOKEN_12345';

        sessionStorage.setItem(ADMIN_VIEW_TOKEN_KEY, token);

        unlockAdmin(token);

        setLoading(false);

        return;

    }



    try {

        // --- REAL AUTH ATTEMPT (connected via relative path /api/admin/login) ---

        const response = await fetch(ADMIN_LOGIN_ENDPOINT, {

            method: 'POST',

            headers: { 'Content-Type': 'application/json' },

            body: JSON.stringify({ password }),

        });



        const result = await response.json();



        if (response.ok && result.token) {

            sessionStorage.setItem(ADMIN_VIEW_TOKEN_KEY, result.token);

            unlockAdmin(result.token);

        } else {

            setError(result.message || getLabel('password_incorrect', 'en'));

            sessionStorage.removeItem(ADMIN_VIEW_TOKEN_KEY);

        }

    } catch (err) {

        setError(getLabel('network_error', 'en'));

        sessionStorage.removeItem(ADMIN_VIEW_TOKEN_KEY);

    } finally {

        setLoading(false);

    }

  };



  return (

    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">

      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">

          <Lock size={24} className="mr-2 text-red-500" />

          {getLabel('admin_auth_title', 'en')}

        </h2>

       

        <form onSubmit={handleSubmit} className="space-y-4">

          <input

            type="password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            placeholder={getLabel('admin_password', 'en')}

            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-red-500 focus:border-red-500"

          />

          {error && (

            <p className="text-sm text-red-600 flex items-center">

              <AlertTriangle size={16} className="mr-1" />{error}

            </p>

          )}

          <button

            type="submit"

            disabled={loading}

            className={`w-full py-3 px-4 text-lg font-bold rounded-xl transition duration-200 flex items-center justify-center ${

              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'

            }`}

          >

            {loading ? '...' : getLabel('login', 'en')}

          </button>

        </form>

        {/* Added Back Button to close the authentication modal */}

        <button

          onClick={() => {

            setRole('customer');

            setView('shop');

          }}

          className="mt-4 w-full py-3 px-4 text-lg font-bold rounded-xl transition duration-200 text-blue-600 hover:text-blue-800"

        >

          &larr; {getLabel('back_to_shop', lang)}

        </button>



        <p className="mt-4 text-center text-xs text-gray-500">

            *Mock password: **{MOCK_ADMIN_PASSWORD}**

        </p>

      </div>

    </div>

  );

};



/**

 * Admin Dashboard - Fetches and displays orders

 */

const AdminDashboard = ({ token, lang, onLogout }) => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);



  const fetchOrders = useCallback(async () => {

    setLoading(true);

    setError(null);

    try {

      // --- API call to backend (connected via relative path /api/orders) ---

      const response = await fetch(ORDERS_ENDPOINT, {

        method: 'GET',

        headers: {

          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json',

        },

      });



      if (response.ok) {

        const result = await response.json();

        setOrders(result.orders || []);

      } else if (response.status === 403 || response.status === 401) {

        setError("Authorization Failed. Please log in again.");

        sessionStorage.removeItem(ADMIN_VIEW_TOKEN_KEY);

        onLogout();

      } else {

        const result = await response.json();

        setError(result.message || getLabel('network_error', lang));

      }

    } catch (err) {

      setError(getLabel('network_error', lang));

    } finally {

      setLoading(false);

    }

  }, [token, lang, onLogout]);



  useEffect(() => {

    fetchOrders();

  }, [fetchOrders]);



  const renderItems = (items) => {

    // Items are parsed from JSON string in the backend utility, so they should be an array here.

    if (!Array.isArray(items)) return 'N/A';

    return items.map(item => `${getLabel(item.id, 'en')}(${item.qty}kg)`).join(', ');

  };



  return (

    <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-200">

      <div className="flex justify-between items-center mb-6 border-b pb-4">

        <h2 className="text-3xl font-bold text-red-700 flex items-center">

          <ListOrdered size={24} className="mr-3" />

          {getLabel('admin_dashboard', lang)}

        </h2>

        <button

            onClick={onLogout}

            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 text-sm"

        >

            {getLabel('logout', 'en')}

        </button>

      </div>



      <div className="flex justify-between items-center mb-4">

        <p className="text-lg font-medium text-gray-700">

            {getLabel('orders_retrieved', lang)}: {loading ? '...' : orders.length}

        </p>

        <button

            onClick={fetchOrders}

            disabled={loading}

            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 text-sm disabled:opacity-50"

        >

            {loading ? 'Refreshing...' : <RefreshCw size={16} className='inline mr-1'/>}

            Refresh

        </button>

      </div>



      {error && (

        <p className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center mb-4">

          <AlertTriangle size={20} className="mr-2" />

          {error}

        </p>

      )}



      <div className="overflow-x-auto rounded-lg border border-gray-300">

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-100">

            <tr className="text-xs font-semibold uppercase tracking-wider text-gray-600">

              <th className="px-6 py-3 text-left">Order ID</th>

              <th className="px-6 py-3 text-left">Date</th>

              <th className="px-6 py-3 text-left">Customer</th>

              <th className="px-6 py-3 text-left">Address</th>

              <th className="px-6 py-3 text-left">Items</th>

              <th className="px-6 py-3 text-right">Total</th>

              <th className="px-6 py-3 text-left">Status</th>

            </tr>

          </thead>

          <tbody className="bg-white divide-y divide-gray-200">

            {orders.length === 0 && !loading && (

                <tr>

                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No orders found.</td>

                </tr>

            )}

            {orders.map((order, index) => (

              <tr key={order.OrderID || index} className="hover:bg-gray-50">

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.OrderID}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.OrderDate).toLocaleDateString('en-US')}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.CustomerName}<br/>({order.CustomerPhone})</td>

                <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-xs">{order.CustomerAddress}</td>

                <td className="px-6 py-4 whitespace-normal text-xs text-gray-600 max-w-sm">{renderItems(order.ItemsJSON)}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">₹{parseFloat(order.TotalAmount).toFixed(2)}</td>

                <td className="px-6 py-4 whitespace-nowrap text-xs">

                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">

                        {order.Status || T.status_new.en}

                    </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};





/**

 * Main Application Component (App)

 */

const App = () => {

  // State for Role (customer/admin) and Admin lock status

  const [role, setRole] = useState('customer');

  const [adminToken, setAdminToken] = useState(sessionStorage.getItem(ADMIN_VIEW_TOKEN_KEY));

  const adminUnlocked = role === 'admin' && !!adminToken;



  // State for routing (shop, cart, checkout, confirmation, admin)

  const [view, setView] = useState('shop');

 

  // State for language preference (en, hi, or both)

  const [lang, setLang] = useState('both');



  // State for order submission feedback

  const [orderSubmissionStatus, setOrderSubmissionStatus] = useState(null); // 'success', 'error', null

  const [confirmedOrder, setConfirmedOrder] = useState(null);



  // Cart State Management using useReducer

  const [cart, dispatch] = useReducer(cartReducer, []);



  // Handlers

  const handleRoleChange = (newRole) => {

    setRole(newRole);

    if (newRole === 'admin' && !sessionStorage.getItem(ADMIN_VIEW_TOKEN_KEY)) {

        setView('adminAuth');

    } else if (newRole === 'admin' && sessionStorage.getItem(ADMIN_VIEW_TOKEN_KEY)) {

        setView('admin');

    } else {

        setView('shop');

    }

  };



  const unlockAdmin = (token) => {

    setAdminToken(token);

    setView('admin');

  };



  const adminLogout = () => {

      sessionStorage.removeItem(ADMIN_VIEW_TOKEN_KEY);

      setAdminToken(null);

      setRole('customer');

      setView('shop');

  };



  const renderView = () => {

    if (role === 'admin' && view === 'adminAuth') {

        // Passed setRole and setView to allow closing the AuthModal

        return <AuthModal unlockAdmin={unlockAdmin} setRole={setRole} setView={setView} lang={lang} />;

    }

    if (adminUnlocked && view === 'admin') {

      return <AdminDashboard token={adminToken} lang={lang} onLogout={adminLogout} />;

    }



    switch (view) {

      case 'cart':

        return <Cart cart={cart} dispatch={dispatch} setView={setView} lang={lang} />;

      case 'checkout':

        return <CheckoutForm cart={cart} dispatch={dispatch} setView={setView} setOrderSubmissionStatus={setOrderSubmissionStatus} setConfirmedOrder={setConfirmedOrder} lang={lang} />;

      case 'confirmation':

        return <ConfirmationScreen confirmedOrder={confirmedOrder} setView={setView} lang={lang} />;

      case 'shop':

      default:

        return (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {PRODUCTS.map(product => (

              <ProductCard

                key={product.id}

                product={product}

                dispatch={dispatch}

                cart={cart}

                lang={lang}

              />

            ))}

          </div>

        );

    }

  };



  return (

    <div className="min-h-screen bg-gray-50 font-sans">

     

      {/* --- Header & Controls --- */}

      <header className="bg-white shadow-md sticky top-0 z-40">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

         

          {/* Logo & Title - Updated Name */}

          <div className="flex items-center text-3xl font-extrabold text-gray-900">

            <Store size={30} className="text-green-600 mr-3" />

            {getLabel('app_name', 'en')} / <span className="text-green-600 ml-2">{getLabel('app_name', 'hi')}</span>

          </div>

         

          {/* Controls */}

          <div className="flex items-center space-x-4">

           

            {/* Role Switcher */}

            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-xl text-sm font-medium">

              <span className="text-gray-600">{getLabel('role', 'en')}:</span>

              <button

                onClick={() => handleRoleChange('customer')}

                className={`px-3 py-1 rounded-lg transition ${role === 'customer' ? 'bg-green-600 text-white' : 'hover:bg-gray-200'}`}

              >

                <User size={16} className="inline mr-1"/> {getLabel('customer', 'en')}

              </button>

              <button

                onClick={() => handleRoleChange('admin')}

                className={`px-3 py-1 rounded-lg transition ${role === 'admin' ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`}

              >

                <Lock size={16} className="inline mr-1"/> {getLabel('admin', 'en')}

              </button>

            </div>

           

            {/* Cart Button */}

            {role === 'customer' && (

                <button

                    onClick={() => setView('cart')}

                    className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-blue-700 transition duration-200"

                >

                    <ShoppingCart size={20} className="mr-2" />

                    {getLabel('view_cart', 'en')} ({cart.length})

                </button>

            )}



            {/* Admin Dashboard Button */}

            {role === 'admin' && adminUnlocked && (

                <button

                    onClick={() => setView('admin')}

                    className="flex items-center bg-red-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-red-700 transition duration-200"

                >

                    <ListOrdered size={20} className="mr-2" />

                    {getLabel('admin_dashboard', 'en')}

                </button>

            )}

           

            {/* Language Toggle (Currently shows 'both', but for a pure toggle) */}

            <div className="bg-gray-100 p-2 rounded-xl text-sm font-medium">

                <span className="text-gray-600">{getLabel('language', 'en')}:</span>

                <span className="ml-2 text-green-600 font-bold">EN / HI</span>

            </div>



          </div>

        </div>

      </header>



      {/* --- Main Content Area --- */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

       

        {/* Current View Render */}

        {renderView()}



      </main>



      {/* --- Footer --- */}

      <footer className="w-full bg-gray-200 text-center py-4 text-gray-600 text-sm">

        &copy; 2024 {getLabel('app_name', 'en')}. {getLabel('app_name', 'hi')}.

      </footer>

    </div>

  );

};



// Mount the application

// const container = document.getElementById('root');

// const root = createRoot(container);

// root.render(<App />);



export default App;
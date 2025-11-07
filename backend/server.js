require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cookieParser());
app.use(express.json());

const validateFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field] || body[field].toString().trim() === '') {
      return `Field "${field}" is required.`;
    }
  }
  return null;
};

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_URL,
  BACKEND_URL,
  JSON_SERVER_URL,
  JWT_SECRET
} = process.env;

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.get('/auth/github/login', (req, res) => {
  const state = uuidv4();
  res.cookie('oauth_state', state, { httpOnly: true, sameSite: 'lax' });
  const redirect_uri = `${BACKEND_URL}/auth/github/callback`;
  const scope = 'user:email';
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  res.redirect(url);
});

app.get('/auth/github/callback', async (req, res) => {
  const { code, state } = req.query;
  const cookieState = req.cookies.oauth_state;
  if (!state || !cookieState || state !== cookieState) {
    return res.status(400).send('Invalid state');
  }
  try {
    const tokenResp = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${BACKEND_URL}/auth/github/callback`,
        state
      },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenResp.data.access_token;
    if (!accessToken) throw new Error('No access token');
    const userResp = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}`, Accept: 'application/json' }
    });
    let email = userResp.data.email;
    if (!email) {
      const emailsResp = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${accessToken}`, Accept: 'application/json' }
      });
      const primary = Array.isArray(emailsResp.data) && (emailsResp.data.find(e => e.primary) || emailsResp.data[0]);
      email = primary ? primary.email : null;
    }
    const githubId = userResp.data.id;
    const name = userResp.data.name || userResp.data.login || 'GitHub User';
    const findResp = await axios.get(`${JSON_SERVER_URL}/users?email=${encodeURIComponent(email)}`);
    let user;
    if (findResp.data && findResp.data.length > 0) {
      user = findResp.data[0];
    } else {
      const createResp = await axios.post(`${JSON_SERVER_URL}/users`, {
        name,
        email,
        password: '',
        provider: 'github',
        githubId,
        role: 'customer'
      });
      user = createResp.data;
    }
    const token = jwt.sign(
      { id: user.id, role: user.role || 'customer' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.clearCookie('oauth_state');
    return res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}`);
  } catch (err) {
    console.error('OAuth callback error', err.response?.data || err.message);
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

app.get('/auth/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = payload.id;
    const resp = await axios.get(`${JSON_SERVER_URL}/users/${userId}`);
    return res.json(resp.data);
  } catch (err) {
    console.error('auth/me error:', err.message || err);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
};

app.get('/api/businesses', async (req, res) => {
  try {
    const resp = await axios.get(`${JSON_SERVER_URL}/businesses`);
    res.json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

app.post('/api/businesses', authenticate, requireAdmin, async (req, res) => {
  const errorMsg = validateFields(['name'], req.body);
  if (errorMsg) return res.status(400).json({ error: errorMsg });
  try {
    const resp = await axios.post(`${JSON_SERVER_URL}/businesses`, req.body);
    res.status(201).json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to create business' });
  }
});

app.put('/api/businesses/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const resp = await axios.put(`${JSON_SERVER_URL}/businesses/${req.params.id}`, req.body);
    res.json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to update business' });
  }
});

app.delete('/api/businesses/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await axios.delete(`${JSON_SERVER_URL}/businesses/${req.params.id}`);
    res.json({ message: 'Business deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete business' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const resp = await axios.get(`${JSON_SERVER_URL}/products`);
    res.json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', authenticate, requireAdmin, async (req, res) => {
  const { name, price, businessId } = req.body;
  if (!name || !price || !businessId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const resp = await axios.post(`${JSON_SERVER_URL}/products`, req.body);
    res.status(201).json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const resp = await axios.put(`${JSON_SERVER_URL}/products/${req.params.id}`, req.body);
    res.json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await axios.delete(`${JSON_SERVER_URL}/products/${req.params.id}`);
    res.json({ message: 'Product deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    const resp = await axios.get(`${JSON_SERVER_URL}/orders`);
    const allOrders = resp.data;
    const user = req.user;
    const filtered = user.role === 'admin'
      ? allOrders
      : allOrders.filter(o => o.userId === user.id);
    res.json(filtered);
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', authenticate, async (req, res) => {
  const { businessId, orderItems, totalPrice } = req.body;
  if (!businessId || !orderItems || !Array.isArray(orderItems)) {
    return res.status(400).json({ error: 'Invalid order data' });
  }
  try {
    const orderData = {
      userId: req.user.id,
      businessId,
      orderItems,
      totalPrice,
      status: 'Pending'
    };
    const resp = await axios.post(`${JSON_SERVER_URL}/orders`, orderData);
    res.status(201).json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', authenticate, async (req, res) => {
  try {
    const existing = await axios.get(`${JSON_SERVER_URL}/orders/${req.params.id}`);
    const order = existing.data;
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    const updated = { ...order, ...req.body };
    const resp = await axios.put(`${JSON_SERVER_URL}/orders/${req.params.id}`, updated);
    res.json(resp.data);
  } catch {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.delete('/api/orders/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await axios.delete(`${JSON_SERVER_URL}/orders/${req.params.id}`);
    res.json({ message: 'Order deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.post('/api/payment/simulate', authenticate, async (req, res) => {
  const { orderId, result } = req.body;
  if (!orderId || !result) return res.status(400).json({ error: 'Missing orderId or result' });
  try {
    const existing = await axios.get(`${JSON_SERVER_URL}/orders/${orderId}`);
    const order = existing.data;
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    const status = result === 'success' ? 'Paid' : 'Payment Failed';
    const updatedOrder = { ...order, status };
    await axios.put(`${JSON_SERVER_URL}/orders/${orderId}`, updatedOrder);
    res.json({ message: `Payment ${result}`, updatedOrder });
  } catch (err) {
    console.error('Payment simulation error:', err.message);
    res.status(500).json({ error: 'Failed to simulate payment' });
  }
});

app.post('/api/orders/:id/next-status', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await axios.get(`${JSON_SERVER_URL}/orders/${id}`);
    const order = resp.data;
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const stages = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIndex = stages.indexOf(order.status);
    if (currentIndex === -1) return res.status(400).json({ error: 'Invalid current status' });
    if (order.status === 'Delivered')
      return res.status(400).json({ error: 'Order already delivered' });
    const nextStatus = stages[currentIndex + 1];
    const updated = { ...order, status: nextStatus };
    await axios.put(`${JSON_SERVER_URL}/orders/${id}`, updated);
    res.json({ message: `Order moved to ${nextStatus}`, updated });
  } catch (err) {
    console.error('Delivery update error:', err.message);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Auth server started on ${port}`));

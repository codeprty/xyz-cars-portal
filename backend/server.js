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
        githubId
      });
      user = createResp.data;
    }

    const token = jwt.sign(
      { id: user.id },
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

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Auth server started on ${port}`));

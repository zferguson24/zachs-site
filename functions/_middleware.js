const COOKIE_NAME = 'zs_session';
const AUTH_PATH = '/__login';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60;

async function sign(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') ?? '';
  const match = header.split(';').find(c => c.trim().startsWith(`${name}=`));
  return match ? match.trim().slice(name.length + 1) : null;
}

async function isValidSession(cookie, secret) {
  if (!cookie) return false;
  const dot = cookie.lastIndexOf('.');
  if (dot === -1) return false;
  const ts = cookie.slice(0, dot);
  const sig = cookie.slice(dot + 1);
  if (Date.now() - parseInt(ts, 10) > SESSION_DURATION_MS) return false;
  return (await sign(secret, ts)) === sig;
}

function loginPage(error = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f0f0f;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .card {
      background: #1a1a1a;
      border: 1px solid #2e2e2e;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 360px;
    }
    h1 { color: #f0f0f0; font-size: 1.25rem; margin-bottom: 1.5rem; font-weight: 600; }
    input[type="password"] {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #0f0f0f;
      border: 1px solid #3a3a3a;
      border-radius: 8px;
      color: #f0f0f0;
      font-size: 1rem;
      margin-bottom: 1rem;
      outline: none;
      transition: border-color 0.15s;
    }
    input[type="password"]:focus { border-color: #666; }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #f0f0f0;
      color: #0f0f0f;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    button:hover { background: #d4d4d4; }
    .error { color: #f87171; font-size: 0.875rem; margin-top: 0.875rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Enter password</h1>
    <form method="POST" action="${AUTH_PATH}">
      <input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" />
      <button type="submit">Continue</button>
      ${error ? `<p class="error">${error}</p>` : ''}
    </form>
  </div>
</body>
</html>`;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // POST: validate password and set signed session cookie
  if (url.pathname === AUTH_PATH && request.method === 'POST') {
    const form = await request.formData();
    if (form.get('password') !== env.GATE_PASSWORD) {
      return new Response(loginPage('Incorrect password.'), {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const ts = Date.now().toString();
    const sig = await sign(env.COOKIE_SECRET, ts);
    const redirectParam = url.searchParams.get('redirect');
    const safePath = redirectParam?.startsWith('/') ? redirectParam : '/';

    return new Response(null, {
      status: 302,
      headers: {
        Location: safePath,
        'Set-Cookie': `${COOKIE_NAME}=${ts}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_S}`,
      },
    });
  }

  // GET: show login form
  if (url.pathname === AUTH_PATH) {
    return new Response(loginPage(), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // All other paths: enforce session
  if (!(await isValidSession(getCookie(request, COOKIE_NAME), env.COOKIE_SECRET))) {
    return Response.redirect(
      `${url.origin}${AUTH_PATH}?redirect=${encodeURIComponent(url.pathname)}`,
      302
    );
  }

  return next();
}

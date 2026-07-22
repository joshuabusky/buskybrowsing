const PROTECTED_PATHS = [
  "/portfolio-main",
  "/school",
  "/idk"
];

const PASSWORD = Netlify.env.get("GATE_PASSWORD"); // set in Netlify site settings
const COOKIE_NAME = "site_auth";

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  const isProtected = PROTECTED_PATHS.some(p => path === p || path.startsWith(p + "/"));
  if (!isProtected) {
    return context.next();
  }

  // Handle password submission
  if (request.method === "POST") {
    const form = await request.formData();
    const submitted = form.get("password");

    if (submitted === PASSWORD) {
      const response = await context.next();
      const headers = new Headers(response.headers);
      headers.append(
        "Set-Cookie",
        `${COOKIE_NAME}=${PASSWORD}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      );
      return new Response(response.body, { status: response.status, headers });
    }
    return new Response(renderForm(true), {
      status: 401,
      headers: { "Content-Type": "text/html" }
    });
  }

  // Check existing cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const hasAuth = cookieHeader
    .split(";")
    .some(c => c.trim() === `${COOKIE_NAME}=${PASSWORD}`);

  if (hasAuth) {
    return context.next();
  }

  return new Response(renderForm(false), {
    status: 401,
    headers: { "Content-Type": "text/html" }
  });
};

function renderForm(wrong) {
  return `
    <!DOCTYPE html>
    <html>
    <head><title>Password Required</title>
    <style>
      body { font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#111; color:#eee; }
      form { text-align:center; }
      input { padding: 10px; font-size: 16px; margin-right: 8px; }
      button { padding: 10px 16px; font-size: 16px; }
      .error { color: #ff6b6b; margin-top: 10px; }
    </style>
    </head>
    <body>
      <form method="POST">
        <div>
          <input type="password" name="password" placeholder="Enter password" autofocus required />
          <button type="submit">Enter</button>
        </div>
        ${wrong ? '<div class="error">Incorrect password, try again.</div>' : ''}
      </form>
    </body>
    </html>
  `;

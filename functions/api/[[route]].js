export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const upstream = new URL(url.pathname + url.search, env.RAILWAY_URL);

  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${env.API_KEY}`);
  headers.delete('Host');

  const upstreamRequest = new Request(upstream.toString(), {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });

  return fetch(upstreamRequest);
}

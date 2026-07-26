export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Plain concatenation, not `new URL(path, base)` — a leading-slash path argument
  // to the URL constructor replaces the base's own path instead of appending to it,
  // which would silently drop SERVICE_URL's /timewalkers prefix on the shared zachs-api gateway.
  const upstream = new URL(env.SERVICE_URL + url.pathname + url.search);

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
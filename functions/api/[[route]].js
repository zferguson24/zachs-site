export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Path split across the two backend services on the same EC2 instance:
  // /api/cars/* → matchbox (CAR_SERVICE_URL, port 8081), its own API key;
  // everything else → timewalkers (SERVICE_URL, port 8080).
  const isCars = url.pathname.startsWith('/api/cars');
  const serviceUrl = isCars ? env.CAR_SERVICE_URL : env.SERVICE_URL;
  const apiKey = isCars ? env.CAR_API_KEY : env.API_KEY;

  const upstream = new URL(url.pathname + url.search, serviceUrl);

  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${apiKey}`);
  headers.delete('Host');

  const upstreamRequest = new Request(upstream.toString(), {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });

  return fetch(upstreamRequest);
}

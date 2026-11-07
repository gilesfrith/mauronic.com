// Serve the dad joke videos with HTTP byte-range support (206 Partial Content).
// Cloudflare Pages static assets ignore the Range header and always send the
// whole file; Safari and iOS expect partial responses for <video>.
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const range = request.headers.get("Range");
  if (!url.pathname.endsWith(".mp4") || !["GET", "HEAD"].includes(request.method)) {
    return env.ASSETS.fetch(request);
  }

  const asset = await env.ASSETS.fetch(new Request(url, { method: "GET" }));
  if (!asset.ok) return asset;

  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.delete("Content-Length");
  headers.delete("Content-Encoding");

  const body = await asset.arrayBuffer();
  const size = body.byteLength;
  const head = request.method === "HEAD";

  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m || (m[1] === "" && m[2] === "")) {
    headers.set("Content-Length", String(size));
    return new Response(head ? null : body, { status: 200, headers });
  }

  let start, end;
  if (m[1] === "") {
    // Suffix range: the last N bytes.
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }

  if (start >= size || start > end) {
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(head ? null : body.slice(start, end + 1), { status: 206, headers });
}

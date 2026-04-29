import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export const config = {
  runtime: "nodejs",
  api: { bodyParser: false },
  supportsResponseStreaming: true,
};

const TARGET = (process.env.TARGET_DOMAIN || "").replace(/\/$/, "");

const BLOCKED = new Set([
  "host","connection","keep-alive","proxy-authenticate","proxy-authorization",
  "te","trailer","transfer-encoding","upgrade","forwarded",
  "x-forwarded-host","x-forwarded-proto","x-forwarded-port"
]);

export default async function handler(req, res) {
  if (!TARGET) {
    res.statusCode = 500;
    return res.end("TARGET_DOMAIN not set");
  }

  try {
    const url = TARGET + req.url;

    const headers = {};
    let ip = null;

    for (const key of Object.keys(req.headers)) {
      const k = key.toLowerCase();
      const v = req.headers[key];

      if (BLOCKED.has(k)) continue;
      if (k.startsWith("x-vercel-")) continue;

      if (k === "x-real-ip") { ip = v; continue; }
      if (k === "x-forwarded-for") { if (!ip) ip = v; continue; }

      headers[k] = Array.isArray(v) ? v.join(", ") : v;
    }

    if (ip) headers["x-forwarded-for"] = ip;

    const method = req.method;
    const hasBody = method !== "GET" && method !== "HEAD";

    const options = {
      method,
      headers,
      redirect: "manual"
    };

    if (hasBody) {
      options.body = Readable.toWeb(req);
      options.duplex = "half";
    }

    const upstream = await fetch(url, options);

    res.statusCode = upstream.status;

    for (const [k, v] of upstream.headers) {
      if (k.toLowerCase() === "transfer-encoding") continue;
      try { res.setHeader(k, v); } catch {}
    }

    if (upstream.body) {
      await pipeline(Readable.fromWeb(upstream.body), res);
    } else {
      res.end();
    }

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end("Bad Gateway");
    }
  }
}

# vercel-xhttp-relay

```json
{
  "protocol": "vless",
  "settings": {
    "vnext": [{
      "address": "vercel.com",
      "port": 443,
      "users": [{ "id": "YOUR-UUID", "encryption": "none" }]
    }]
  },
  "streamSettings": {
    "network": "xhttp",
    "security": "tls",
    "tlsSettings": {
      "serverName": "vercel.com",
      "allowInsecure": false
    },
    "xhttpSettings": {
      "path": "/yourpath",
      "host": "your-app.vercel.app",
      "mode": "auto"
    }
  }
}
```

### Tips

- You can use **any Vercel-fronted hostname** for SNI as long as the TLS
  handshake reaches Vercel. Custom domains pointed at Vercel work too.
- The `path` and `id` (UUID) must match the **backend Xray** XHTTP inbound,
  not this relay.
- If censorship targets `*.vercel.app` directly, attach a custom domain in
  the Vercel dashboard and use that as both `address` and `sni`.

---

## Limitations

- **XHTTP only.** WebSocket / gRPC / raw TCP / mKCP / QUIC do **not** work
  on Vercel's Edge runtime regardless of how the relay is implemented.
- **Edge per-invocation CPU budget** (~50 ms compute on Hobby, more on
  Pro). I/O wait time doesn't count, so streaming proxies stay well within
  budget — but a stuck upstream can hit the wall-clock limit.
- **Bandwidth quotas.** All traffic counts against your Vercel account's
  quota. Heavy use → upgrade to Pro/Enterprise.
- **Logging.** Vercel logs request metadata (path, IP, status). The body
  is not logged, but be aware of the trust model.

## Project Layout

```
.
├── api/index.js     # Edge function: streams request → TARGET_DOMAIN, streams response back
├── package.json     # Project metadata (no runtime deps; fetch/Headers are globals)
├── vercel.json      # Routes all paths → /api/index
└── README.md
```

## License

MIT.

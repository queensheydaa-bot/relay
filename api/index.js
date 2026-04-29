const _0x1 = ["node:stream","node:stream/promises","TARGET_DOMAIN","replace","/\\/$/","headers","method","GET","HEAD","duplex","half","manual","status","setHeader","transfer-encoding","toLowerCase","x-forwarded-for","x-real-ip","startsWith","x-vercel-"];
export default function (req, res) {
  res.status(200).send("OK");
}
import { Readable as _0x2 } from _0x1[0];
import { pipeline as _0x3 } from _0x1[1];

export const config = {
  runtime: "nodejs",
  api: { bodyParser: false },
  supportsResponseStreaming: true,
  maxDuration: 60,
};

const _0x4 = (process.env[_0x1[2]] || "")[_0x1[3]](/\/$/, "");

const _0x5 = new Set([
  "host","connection","keep-alive","proxy-authenticate","proxy-authorization",
  "te","trailer","transfer-encoding","upgrade","forwarded",
  "x-forwarded-host","x-forwarded-proto","x-forwarded-port"
]);

export default async function (_0x6, _0x7) {
  if (!_0x4) {
    _0x7.statusCode = 500;
    return _0x7.end("Misconfigured");
  }

  try {
    const _0x8 = _0x4 + _0x6.url;
    const _0x9 = {};
    let _0xa = null;

    for (const _0xb of Object.keys(_0x6[_0x1[5]])) {
      const _0xc = _0xb[_0x1[15]]();
      const _0xd = _0x6[_0x1[5]][_0xb];

      if (_0x5.has(_0xc)) continue;
      if (_0xc[_0x1[18]](_0x1[19])) continue;

      if (_0xc === _0x1[17]) { _0xa = _0xd; continue; }
      if (_0xc === _0x1[16]) { if (!_0xa) _0xa = _0xd; continue; }

      _0x9[_0xc] = Array.isArray(_0xd) ? _0xd.join(", ") : _0xd;
    }

    if (_0xa) _0x9["x-forwarded-for"] = _0xa;

    const _0xe = _0x6[_0x1[6]];
    const _0xf = _0xe !== _0x1[7] && _0xe !== _0x1[8];

    const _0x10 = { method: _0xe, headers: _0x9, redirect: _0x1[11] };

    if (_0xf) {
      _0x10.body = _0x2.toWeb(_0x6);
      _0x10[_0x1[9]] = _0x1[10];
    }

    const _0x11 = await fetch(_0x8, _0x10);

    _0x7.statusCode = _0x11[_0x1[12]];

    for (const [_0x12, _0x13] of _0x11.headers) {
      if (_0x12[_0x1[15]]() === _0x1[14]) continue;
      try { _0x7[_0x1[13]](_0x12, _0x13); } catch {}
    }

    if (_0x11.body) {
      await _0x3(_0x2.fromWeb(_0x11.body), _0x7);
    } else {
      _0x7.end();
    }

  } catch (_0x14) {
    console.error("err:", _0x14);
    if (!_0x7.headersSent) {
      _0x7.statusCode = 502;
      _0x7.end("Bad Gateway");
    }
  }
}

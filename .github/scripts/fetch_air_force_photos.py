#!/usr/bin/env python3
"""Cache real public-domain Air Force photographs from DVIDS into both builds."""
from pathlib import Path
from urllib.request import Request, urlopen
import time

ROOT = Path(__file__).resolve().parents[2]
PHOTOS = {
    "AF_F35_Takeoff.jpg": "https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2501/8847670/1000w_q95.jpg",
    "AF_C17_Golden_Hour.jpg": "https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2609/9904000/1000w_q95.jpg",
    "AF_Cyber_Operations.jpg": "https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/2507/9179112/1000w_q95.jpg",
}
def retrieve(url):
    error = None
    for attempt in range(3):
        try:
            req = Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "image/jpeg,image/*"})
            with urlopen(req, timeout=45) as stream:
                data = stream.read(8 * 1024 * 1024)
            if len(data) < 10000 or not data.startswith(bytes.fromhex("ffd8ff")):
                raise ValueError("Invalid JPEG image")
            return data
        except Exception as exc:
            error = exc
            time.sleep(1 + attempt)
    raise RuntimeError("Unable to retrieve photo " + url) from error

if __name__ == "__main__":
    for name, url in PHOTOS.items():
        data = retrieve(url)
        for folder in ("docs", "operational"):
            path = ROOT / folder / "assets" / "images" / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        print("Downloaded", name, len(data), "bytes")

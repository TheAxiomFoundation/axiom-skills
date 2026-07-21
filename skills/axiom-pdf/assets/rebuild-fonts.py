#!/usr/bin/env python3
"""Regenerate assets/fonts-embed.css (base64 @font-face for the print stack).

Only needed to refresh the bundled fonts — the committed fonts-embed.css already
contains everything. Requires network for Newsreader (OFL, fetched from Google
Fonts) and local Geist woff2 from an axiom-foundation.org checkout.

    python3 rebuild-fonts.py \
        --geist   /path/to/axiom-foundation.org/ds-bundle/fonts/Geist-Variable.woff2 \
        --geist-italic /path/to/.../Geist-Italic[wght].woff2 \
        --geist-mono   /path/to/.../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2

Newsreader is OFL; Geist is OFL/MIT (Vercel). Both are redistributable, which is
why the base64 output is safe to commit.
"""
import argparse, base64, re, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 Chrome/120 Safari/537.36"}

def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()

def face(fam, style, weight, data):
    return (f"@font-face{{font-family:'{fam}';font-style:{style};font-weight:{weight};"
            f"font-display:swap;src:url(data:font/woff2;base64,{data}) format('woff2');}}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--geist", required=True)
    ap.add_argument("--geist-italic", required=True)
    ap.add_argument("--geist-mono", required=True)
    ap.add_argument("--out", default="fonts-embed.css")
    a = ap.parse_args()

    b64f = lambda p: base64.b64encode(open(p, "rb").read()).decode()
    blocks = [
        face("Geist", "normal", "100 900", b64f(a.geist)),
        face("Geist", "italic", "100 900", b64f(a.geist_italic)),
        face("Geist Mono", "normal", "100 900", b64f(a.geist_mono)),
    ]
    # Newsreader latin: roman 400/500 + italic 400
    css = fetch("https://fonts.googleapis.com/css2?family=Newsreader:"
                "ital,wght@0,400;0,500;1,400&display=swap").decode()
    for block in re.findall(r"@font-face\s*\{(.*?)\}", css, re.S):
        if "U+0000-00FF" not in block:        # latin subset only
            continue
        style = "italic" if "italic" in block else "normal"
        wght = re.search(r"font-weight:\s*(\d+)", block).group(1)
        url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
        blocks.append(face("Newsreader", style, wght, base64.b64encode(fetch(url)).decode()))

    open(a.out, "w").write("\n".join(blocks))
    print("wrote", a.out)

if __name__ == "__main__":
    main()

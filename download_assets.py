import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

assets = [
    {"name": "banner.webp", "url": "https://thecoolcanvas.in/cdn/shop/files/ChatGPT_Image_May_24_2026_04_09_42_PM.png?v=1779619271&width=3840"},
    {"name": "product1.webp", "url": "https://thecoolcanvas.in/cdn/shop/files/ChatGPTImageMay22_2026_10_38_35AM.png?v=1779617258&width=533"},
    {"name": "product2.webp", "url": "https://thecoolcanvas.in/cdn/shop/files/ChatGPTImageMay22_2026_10_39_40AM.png?v=1779617258&width=533"},
    {"name": "product3.webp", "url": "https://thecoolcanvas.in/cdn/shop/files/ChatGPTImageMay13_2026_07_42_34AM.png?v=1778894759&width=533"},
    {"name": "product4.webp", "url": "https://thecoolcanvas.in/cdn/shop/files/rn-image_picker_lib_temp_f70a3eb2-5ffc-4e8c-887b-1a0431bf3462.png?v=1780251960&width=533"},
    {"name": "video1.mp4", "url": "https://thecoolcanvas.in/cdn/shop/videos/c/vp/a67645aba6a442dfa4cb235b3756cca3/a67645aba6a442dfa4cb235b3756cca3.SD-480p-0.9Mbps-85344328.mp4?v=0"},
    {"name": "video2.mp4", "url": "https://thecoolcanvas.in/cdn/shop/videos/c/vp/cb9f3fbe9c9548d799b8e53eca4dc73d/cb9f3fbe9c9548d799b8e53eca4dc73d.HD-1080p-7.2Mbps-85344327.mp4?v=0"}
]

os.makedirs("thecoolcanvas/public/images", exist_ok=True)

for asset in assets:
    try:
        urllib.request.urlretrieve(asset["url"], f"thecoolcanvas/public/images/{asset['name']}")
        print(f"Downloaded {asset['name']}")
    except Exception as e:
        print(f"Failed to download {asset['name']}: {e}")

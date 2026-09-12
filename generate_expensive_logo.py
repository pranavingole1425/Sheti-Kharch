import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_expensive_logo(size=512):
    # Create RGBA image
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    margin = 16
    r = (size - 2 * margin) // 2
    cx, cy = size // 2, size // 2

    # 1. Outer Soft Shadow
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse([cx - r + 4, cy - r + 8, cx + r - 4, cy + r + 12], fill=(0, 0, 0, 80))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=16))
    img.paste(shadow, (0, 0), shadow)

    # 2. Main Background Circle (Emerald Deep Green)
    # Radial Gradient simulation
    for radius in range(r, 0, -1):
        factor = radius / r
        # Deep emerald #0a3a1b to bright emerald #166534 to gold border highlight
        red = int(10 + (22 - 10) * (1 - factor))
        green = int(58 + (101 - 58) * (1 - factor))
        blue = int(27 + (52 - 27) * (1 - factor))
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(red, green, blue, 255))

    # 3. Gold Foil Double Border
    gold_outer = (245, 158, 11, 255)  # Amber gold
    gold_inner = (254, 240, 138, 255) # Light gold highlight

    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=gold_outer, width=8)
    draw.ellipse([cx - r + 12, cy - r + 12, cx + r - 12, cy + r - 12], outline=gold_inner, width=3)

    # 4. Central Decorative Gold Shield / Emblem Background
    emblem_r = int(r * 0.68)
    draw.ellipse([cx - emblem_r, cy - emblem_r, cx + emblem_r, cy + emblem_r], fill=(21, 128, 61, 230), outline=gold_outer, width=4)

    # 5. Draw Decorative Golden Wheat Stalk & Rupee Symbol Graphic
    # Wheat Stalk Leaves & Center Rupee Emblem
    gold_fill = (251, 191, 36, 255)
    gold_bright = (254, 240, 138, 255)

    # Center Rupee Symbol '₹'
    try:
        # Load bold font if available
        font_path = "C:\\Windows\\Fonts\\arialbd.ttf"
        font_symbol = ImageFont.truetype(font_path, int(size * 0.28))
        font_text = ImageFont.truetype(font_path, int(size * 0.08))
    except:
        font_symbol = ImageFont.load_default()
        font_text = ImageFont.load_default()

    # Draw Rupee Symbol '₹'
    symbol_text = "₹"
    bbox = draw.textbbox((0, 0), symbol_text, font=font_symbol)
    w_sym = bbox[2] - bbox[1]
    h_sym = bbox[3] - bbox[1]
    draw.text((cx - w_sym // 2, cy - h_sym // 2 - int(size * 0.05)), symbol_text, fill=gold_bright, font=font_symbol)

    # Draw Wheat Grain Accents
    grain_pts = [
        (cx - int(size * 0.22), cy - int(size * 0.08)),
        (cx - int(size * 0.28), cy - int(size * 0.18)),
        (cx - int(size * 0.20), cy - int(size * 0.26)),
        (cx + int(size * 0.22), cy - int(size * 0.08)),
        (cx + int(size * 0.28), cy - int(size * 0.18)),
        (cx + int(size * 0.20), cy - int(size * 0.26))
    ]
    for pt in grain_pts:
        draw.ellipse([pt[0] - 12, pt[1] - 18, pt[0] + 12, pt[1] + 18], fill=gold_fill, outline=gold_bright, width=2)

    # 6. Bottom Banner Label: "SHETI KHARCHA"
    banner_w = int(size * 0.75)
    banner_h = int(size * 0.14)
    banner_y = cy + int(size * 0.22)
    
    # Rounded Rectangle Banner
    draw.rounded_rectangle(
        [cx - banner_w // 2, banner_y - banner_h // 2, cx + banner_w // 2, banner_y + banner_h // 2],
        radius=16,
        fill=(245, 158, 11, 255),
        outline=gold_bright,
        width=3
    )

    text_app = "SHETI KHARCHA"
    bbox_t = draw.textbbox((0, 0), text_app, font=font_text)
    w_t = bbox_t[2] - bbox_t[0]
    h_t = bbox_t[3] - bbox_t[1]
    draw.text((cx - w_t // 2, banner_y - h_t // 2 - 2), text_app, fill=(15, 23, 42, 255), font=font_text)

    return img

if __name__ == "__main__":
    os.makedirs("public/icons", exist_ok=True)
    
    logo_512 = create_expensive_logo(512)
    logo_512.save("public/icons/icon-512.png")
    logo_512.save("public/icons/logo-expensive.png")

    logo_192 = create_expensive_logo(192)
    logo_192.save("public/icons/icon-192.png")

    # Save favicon
    logo_64 = create_expensive_logo(64)
    logo_64.save("public/favicon.ico")

    print("Expensive PNG app logos generated successfully in public/icons/!")

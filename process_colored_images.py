#!/usr/bin/env python3
"""
Process colored images from the evolution game:
- Split composite images into individual parts
- Remove white background (make transparent)
- Center and crop to content
"""

from PIL import Image
import numpy as np
import os

INPUT_DIR = "Evolutiespel afbeeldingen gekleurd"
OUTPUT_DIR = "Evolutiespel afbeeldingen gekleurd transparant"

def ensure_output_dir():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def remove_white_background(img, threshold=240):
    """Remove white/near-white background using flood fill from edges.

    This preserves internal white areas (like eye whites) by only removing
    white pixels that are connected to the image edges.
    """
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    data = np.array(img)
    height, width = data.shape[:2]

    # Find pixels that are white or near-white
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    is_white = (r > threshold) & (g > threshold) & (b > threshold)

    # Create mask for background (white pixels connected to edges)
    background_mask = np.zeros((height, width), dtype=bool)

    # Use flood fill from all edge pixels that are white
    from collections import deque

    visited = np.zeros((height, width), dtype=bool)
    queue = deque()

    # Add all white edge pixels to queue
    for x in range(width):
        if is_white[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_white[height-1, x]:
            queue.append((height-1, x))
            visited[height-1, x] = True

    for y in range(height):
        if is_white[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_white[y, width-1]:
            queue.append((y, width-1))
            visited[y, width-1] = True

    # Flood fill to find all connected white pixels (the background)
    while queue:
        y, x = queue.popleft()
        background_mask[y, x] = True

        # Check 4 neighbors
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < height and 0 <= nx < width:
                if not visited[ny, nx] and is_white[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))

    # Make only background white pixels transparent
    data[:,:,3] = np.where(background_mask, 0, 255)

    return Image.fromarray(data)

def crop_to_content(img, padding=10):
    """Crop image to content with optional padding."""
    # Get the alpha channel
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Find bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Add padding
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(img.width, bbox[2] + padding)
        bottom = min(img.height, bbox[3] + padding)
        img = img.crop((left, top, right, bottom))

    return img

def center_on_canvas(img, canvas_size=None):
    """Center image on a transparent canvas."""
    if canvas_size is None:
        # Use image size with some margin
        canvas_size = (img.width, img.height)

    canvas = Image.new('RGBA', canvas_size, (0, 0, 0, 0))
    x = (canvas_size[0] - img.width) // 2
    y = (canvas_size[1] - img.height) // 2
    canvas.paste(img, (x, y), img)
    return canvas

def process_and_save(img, output_path):
    """Process image: remove background, crop to content, and save."""
    img = remove_white_background(img)
    img = crop_to_content(img)
    img.save(output_path, 'PNG')
    print(f"  Saved: {output_path}")
    return img

def split_2x2_grid(img_path, output_names, margin=80):
    """Split a 2x2 grid image into 4 separate images with margin to avoid overlap."""
    img = Image.open(img_path)
    w, h = img.size
    mid_w, mid_h = w // 2, h // 2

    # Add margin to avoid including parts of adjacent images
    regions = [
        (0, 0, mid_w - margin, mid_h - margin),           # top-left
        (mid_w + margin, 0, w, mid_h - margin),           # top-right
        (0, mid_h + margin, mid_w - margin, h),           # bottom-left
        (mid_w + margin, mid_h + margin, w, h),           # bottom-right
    ]

    for region, name in zip(regions, output_names):
        cropped = img.crop(region)
        output_path = os.path.join(OUTPUT_DIR, name)
        process_and_save(cropped, output_path)

def split_vertical(img_path, output_names, margin=80):
    """Split image vertically into 2 parts (top and bottom) with margin."""
    img = Image.open(img_path)
    w, h = img.size
    mid_h = h // 2

    regions = [
        (0, 0, w, mid_h - margin),      # top
        (0, mid_h + margin, w, h),      # bottom
    ]

    for region, name in zip(regions, output_names):
        cropped = img.crop(region)
        output_path = os.path.join(OUTPUT_DIR, name)
        process_and_save(cropped, output_path)

def split_vertical_custom(img_path, output_names, split_ratio=0.5, margin=80):
    """Split image vertically with custom split ratio."""
    img = Image.open(img_path)
    w, h = img.size
    split_h = int(h * split_ratio)

    regions = [
        (0, 0, w, split_h - margin),           # top
        (0, split_h + margin, w, h),           # bottom
    ]

    for region, name in zip(regions, output_names):
        cropped = img.crop(region)
        output_path = os.path.join(OUTPUT_DIR, name)
        process_and_save(cropped, output_path)

def split_ogen_kleur(img_path, output_names):
    """Special handling for Ogen kleur which has close-together images."""
    img = Image.open(img_path)
    w, h = img.size
    # Image is 1600x1200
    # Use explicit regions - bottom images need more headroom
    mid_w, mid_h = w // 2, h // 2

    regions = [
        (0, 0, mid_w - 20, mid_h - 50),              # top-left (night 1) - end a bit before middle
        (mid_w + 20, 0, w, mid_h - 50),              # top-right (day 1)
        (0, mid_h + 20, mid_w - 20, h),              # bottom-left (night 2) - start closer to middle
        (mid_w + 20, mid_h + 20, w, h),              # bottom-right (day 2)
    ]

    for region, name in zip(regions, output_names):
        cropped = img.crop(region)
        output_path = os.path.join(OUTPUT_DIR, name)
        process_and_save(cropped, output_path)

def split_poten_kleur_2(img_path, output_names):
    """Special handling for Poten kleur 2 which has overlapping images."""
    img = Image.open(img_path)
    w, h = img.size
    # Image is 1600x1200
    # Flying wings: from top to about 56% height
    # Swimming legs: from about 64% height to bottom (larger gap)

    regions = [
        (0, 0, w, int(h * 0.56)),             # flying wings - top portion
        (0, int(h * 0.64), w, h),             # swimming legs - bottom portion
    ]

    for region, name in zip(regions, output_names):
        cropped = img.crop(region)
        output_path = os.path.join(OUTPUT_DIR, name)
        process_and_save(cropped, output_path)

def process_single_image(img_path, output_name):
    """Process a single image: remove background, crop, save."""
    img = Image.open(img_path)
    output_path = os.path.join(OUTPUT_DIR, output_name)
    process_and_save(img, output_path)

def main():
    ensure_output_dir()

    print("Processing Dieet kleur.jpg...")
    # Left column = herbivores (planten), Right column = carnivores (vlees)
    # Layout: top-left, top-right, bottom-left, bottom-right
    split_2x2_grid(
        os.path.join(INPUT_DIR, "Dieet kleur.jpg"),
        [
            "Dieet 1 planten 1 kleur.png",  # top-left (herbivore 1)
            "Dieet 3 vlees 1 kleur.png",    # top-right (carnivore 1)
            "Dieet 2 planten 2 kleur.png",  # bottom-left (herbivore 2)
            "Dieet 4 vlees 2 kleur.png",    # bottom-right (carnivore 2)
        ]
    )

    print("\nProcessing Ogen kleur.jpg...")
    # Left column = night eyes, Right column = day eyes
    split_ogen_kleur(
        os.path.join(INPUT_DIR, "Ogen kleur.jpg"),
        [
            "Ogen 3 nacht 1 kleur.png",     # top-left (night 1)
            "Ogen 1 dag 1 kleur.png",       # top-right (day 1)
            "Ogen 4 nacht 2 kleur.png",     # bottom-left (night 2)
            "Ogen 2 dag 2 kleur.png",       # bottom-right (day 2)
        ]
    )

    print("\nProcessing Poten kleur 1.jpg...")
    # Top = swimming pair 1, Bottom = flying pair 1
    split_vertical(
        os.path.join(INPUT_DIR, "Poten kleur 1.jpg"),
        [
            "Poten 3 zwemmen 1 kleur.png",  # top (swimming 1)
            "Poten 1 vliegen 1 kleur.png",  # bottom (flying 1)
        ]
    )

    print("\nProcessing Poten kleur 2.jpg...")
    # Top = flying pair 2, Bottom = swimming pair 2
    # These are very close together, use explicit regions
    split_poten_kleur_2(
        os.path.join(INPUT_DIR, "Poten kleur 2.jpg"),
        [
            "Poten 2 vliegen 2 kleur.png",  # top (flying 2)
            "Poten 4 zwemmen 2 kleur.png",  # bottom (swimming 2)
        ]
    )

    print("\nProcessing Lijf images...")
    lijf_files = [
        ("Lijf 1 kleur hard koudbloedig 1.jpg", "Lijf 1 hard koudbloedig 1 kleur.png"),
        ("Lijf 2 kleur hard koudbloedig 2.jpg", "Lijf 2 hard koudbloedig 2 kleur.png"),
        ("Lijf 3 kleur zacht warmbloedig 1.jpg", "Lijf 3 zacht warmbloedig 1 kleur.png"),
        ("Lijf 4 kleur zacht warmbloedig 2.jpg", "Lijf 4 zacht warmbloedig 2 kleur.png"),
    ]

    for input_name, output_name in lijf_files:
        input_path = os.path.join(INPUT_DIR, input_name)
        process_single_image(input_path, output_name)

    print("\nDone! All images saved to:", OUTPUT_DIR)

if __name__ == "__main__":
    main()

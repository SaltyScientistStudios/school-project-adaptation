from PIL import Image
import os

# Create output directory
output_dir = "Evolutiespel afbeeldingen transparant"
os.makedirs(output_dir, exist_ok=True)

# Input directory
input_dir = "Evolutiespel afbeeldingen"

# Get all jpg files
image_files = [f for f in os.listdir(input_dir) if f.endswith('.jpg')]

for filename in image_files:
    print(f"Processing {filename}...")

    # Open image
    img_path = os.path.join(input_dir, filename)
    img = Image.open(img_path)

    # Convert to RGBA if not already
    img = img.convert("RGBA")

    # Get image data
    data = img.getdata()

    # Create new image data with white pixels made transparent
    new_data = []
    for item in data:
        # If pixel is white or very close to white (accounting for jpeg artifacts)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            # Make it transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    # Update image data
    img.putdata(new_data)

    # Save as PNG with transparency
    output_filename = filename.replace('.jpg', '.png')
    output_path = os.path.join(output_dir, output_filename)
    img.save(output_path, "PNG")

    print(f"Saved {output_filename}")

print(f"\nDone! Processed {len(image_files)} images.")
print(f"Transparent images saved to '{output_dir}' folder")

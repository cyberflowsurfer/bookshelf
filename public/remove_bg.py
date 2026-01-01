from PIL import Image
import sys

def remove_white_bg(input_path, output_path, tolerance=30):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        for item in datas:
            # Check if white (or close to white)
            # item is (R, G, B, A)
            if item[0] > 255 - tolerance and item[1] > 255 - tolerance and item[2] > 255 - tolerance:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_white_bg(
        '/home/seth/myDev/bookshelf/app/public/header_mascot.png', 
        '/home/seth/myDev/bookshelf/app/public/header_mascot_transparent.png'
    )

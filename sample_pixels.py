import subprocess
import sys

def get_pixel_rgb(x, y, image_path):
    """Get RGB values at specific coordinates using ffmpeg"""
    try:
        # Use ffmpeg to crop a 1x1 pixel and get its RGB values
        cmd = [
            'ffmpeg', '-i', image_path, 
            '-vf', f'crop=1:1:{x}:{y}',
            '-f', 'rawvideo', '-pix_fmt', 'rgb24',
            '-'
        ]
        result = subprocess.run(cmd, capture_output=True, stderr=subprocess.DEVNULL)
        if result.returncode == 0 and len(result.stdout) >= 3:
            rgb = [result.stdout[0], result.stdout[1], result.stdout[2]]
            return rgb
        return None
    except Exception as e:
        return None

# Parameters
width = 1792
height = 53
num_rectangles = 30
rect_width = width // num_rectangles
center_y = height // 2

colors = []
print(f"Extracting RGB values from {num_rectangles} rectangles:")
print(f"Rectangle width: {rect_width}, Sampling at y={center_y}")
print()

for i in range(num_rectangles):
    center_x = int((i + 0.5) * rect_width)
    rgb = get_pixel_rgb(center_x, center_y, 'pix.png')
    
    if rgb is not None:
        colors.append(rgb)
        print(f"Rectangle {i:2d}: x={center_x:3d}, RGB: {rgb}")
    else:
        print(f"Rectangle {i:2d}: Failed to get RGB")

print(f"\nFinal RGB array ({len(colors)} colors):")
print(colors)

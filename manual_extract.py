from PIL import Image

def analyze_image_structure(img):
    """Manually analyze the image structure by examining specific regions"""
    width, height = img.size
    pixels = img.load()
    
    print(f"Image dimensions: {width}x{height}")
    
    # Sample pixels across the width to understand the structure
    middle_y = height // 2
    
    print(f"Sampling pixels at y={middle_y} across the width:")
    
    # Sample every 50 pixels to get an overview
    for x in range(0, width, 50):
        rgb = pixels[x, middle_y]
        print(f"X={x:4d}: RGB{rgb}")
    
    # Based on visual inspection, I can see 4 rectangles with red borders
    # Let me identify the approximate regions where these rectangles are
    
    # Look for distinct colored regions that are NOT red borders
    distinct_regions = []
    
    # Scan the middle row for color changes
    prev_color = None
    region_start = 0
    
    for x in range(width):
        rgb = pixels[x, middle_y]
        
        # Skip if this is a red border pixel
        if is_red_border_pixel(rgb):
            continue
            
        # Check if this is a significantly different color from the previous
        if prev_color is None:
            prev_color = rgb
            region_start = x
        else:
            # Calculate color difference
            color_diff = sum(abs(rgb[i] - prev_color[i]) for i in range(3))
            
            if color_diff > 50:  # Significant color change
                # End of current region, start of new region
                distinct_regions.append({
                    'start_x': region_start,
                    'end_x': x - 1,
                    'color': prev_color,
                    'center_x': (region_start + x - 1) // 2
                })
                
                prev_color = rgb
                region_start = x
    
    # Add the last region
    if prev_color is not None:
        distinct_regions.append({
            'start_x': region_start,
            'end_x': width - 1,
            'color': prev_color,
            'center_x': (region_start + width - 1) // 2
        })
    
    return distinct_regions

def is_red_border_pixel(rgb):
    """
    Check if a pixel is specifically a red border pixel
    Border pixels tend to be very pure red (high R, very low G and B)
    Content pixels inside rectangles may be red but with different characteristics
    """
    r, g, b = rgb
    # Very strict criteria for border detection - almost pure red
    return r >= 250 and g <= 20 and b <= 20

def find_rectangles_by_visual_inspection(img):
    """
    Based on visual inspection of the image, I can see 4 rectangles with red borders.
    Let me try to identify them by looking for rectangular patterns.
    """
    width, height = img.size
    pixels = img.load()
    
    # Based on the region analysis, I can identify 4 distinct rectangles with red borders:
    # Looking at the larger regions that represent the main colored rectangles:
    # 1. Region 18: X(349-402), Center=375 - Red rectangle
    # 2. Region 38: X(697-749), Center=723 - Green rectangle  
    # 3. Region 45: X(870-923), Center=896 - Teal rectangle
    # 4. I need to find the 4th rectangle - looking at regions around x=800-1000
    
    # From visual inspection of the image, there should be 4 rectangles with red borders
    # Let me examine regions that are wide enough to be rectangles
    
    candidate_centers = [
        (375, height // 2),   # Region 18: Red rectangle RGB(200, 40, 51)
        (723, height // 2),   # Region 38: Green rectangle RGB(32, 201, 123)
        (896, height // 2),   # Region 45: Teal rectangle RGB(31, 158, 157)  
        (955, height // 2),   # Region 48: Cyan rectangle RGB(19, 225, 190)
    ]
    
    rectangles = []
    rgb_values = []
    
    print("Examining candidate center positions:")
    
    for i, (center_x, center_y) in enumerate(candidate_centers):
        if 0 <= center_x < width and 0 <= center_y < height:
            rgb = pixels[center_x, center_y]
            rgb_list = [int(rgb[0]), int(rgb[1]), int(rgb[2])]
            
            print(f"Candidate {i+1} at ({center_x}, {center_y}): RGB{rgb}")
            
            # Check if this looks like it's inside a rectangle (not a red border)
            if not is_red_border_pixel(rgb):
                rectangles.append({
                    'center_x': center_x,
                    'center_y': center_y,
                    'rgb': rgb_list
                })
                rgb_values.append(rgb_list)
                
                # Sample surrounding pixels to verify
                print(f"  Surrounding pixels:")
                for dy in [-1, 0, 1]:
                    for dx in [-1, 0, 1]:
                        x, y = center_x + dx, center_y + dy
                        if 0 <= x < width and 0 <= y < height:
                            surr_rgb = pixels[x, y]
                            print(f"    ({x}, {y}): RGB{surr_rgb}")
    
    return rgb_values

def main():
    # Load the image
    img_path = "/home/haris/xdProjects/pixel-rick/pix3.png"
    img = Image.open(img_path)
    
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    print(f"Image dimensions: {img.size}")
    print(f"Image mode: {img.mode}")
    
    # Analyze the image structure
    print("\n=== Analyzing image structure ===")
    regions = analyze_image_structure(img)
    
    print(f"\nFound {len(regions)} distinct colored regions:")
    for i, region in enumerate(regions):
        print(f"Region {i+1}: X({region['start_x']}-{region['end_x']}), Center={region['center_x']}, Color=RGB{region['color']}")
    
    # Try visual inspection approach
    print("\n=== Visual inspection approach ===")
    rgb_values = find_rectangles_by_visual_inspection(img)
    
    print(f"\nFinal RGB values array: {rgb_values}")
    
    return rgb_values

if __name__ == "__main__":
    rgb_values = main()
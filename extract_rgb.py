from PIL import Image

def is_red_pixel(rgb, red_threshold_min=200, other_threshold_max=50):
    """Check if a pixel is red (high R, low G and B)"""
    r, g, b = rgb
    return r >= red_threshold_min and g <= other_threshold_max and b <= other_threshold_max

def find_red_bordered_rectangles(img):
    """
    Find rectangles with red borders by scanning the image systematically
    """
    width, height = img.size
    pixels = img.load()
    
    rectangles = []
    red_positions = []
    
    # First, find all red pixels
    for y in range(height):
        for x in range(width):
            rgb = pixels[x, y]
            if is_red_pixel(rgb):
                red_positions.append((x, y))
    
    print(f"Found {len(red_positions)} red pixels")
    
    if len(red_positions) == 0:
        return []
    
    # Group red pixels into rectangles by finding connected regions
    # For simplicity, we'll look for distinct x-coordinate ranges
    x_coords = [pos[0] for pos in red_positions]
    y_coords = [pos[1] for pos in red_positions]
    
    print(f"Red pixels X range: {min(x_coords)} to {max(x_coords)}")
    print(f"Red pixels Y range: {min(y_coords)} to {max(y_coords)}")
    
    # Analyze the distribution of x-coordinates to find gaps
    x_coords_sorted = sorted(set(x_coords))
    print(f"Total unique x-coordinates with red pixels: {len(x_coords_sorted)}")
    
    # Look for large gaps in x-coordinates
    gaps = []
    for i in range(1, len(x_coords_sorted)):
        gap = x_coords_sorted[i] - x_coords_sorted[i-1]
        if gap > 5:  # Significant gap
            gaps.append((x_coords_sorted[i-1], x_coords_sorted[i], gap))
    
    print(f"Found {len(gaps)} significant gaps:")
    for start, end, gap_size in gaps:
        print(f"  Gap from X={start} to X={end}, size={gap_size}")
    
    # Split x-coordinates based on significant gaps
    groups = []
    current_group = []
    
    for x in x_coords_sorted:
        if not current_group:
            current_group = [x]
        else:
            # Check if there's a significant gap
            gap = x - current_group[-1]
            if gap > 5:  # Start a new group
                if len(current_group) >= 2:
                    groups.append(current_group)
                current_group = [x]
            else:
                current_group.append(x)
    
    # Add the last group
    if len(current_group) >= 2:
        groups.append(current_group)
    
    print(f"Found {len(groups)} x-coordinate groups after gap analysis:")
    
    # Print details about each group
    for i, group in enumerate(groups):
        print(f"Group {i+1}: X({min(group)}-{max(group)}), width={max(group)-min(group)+1}")
    
    # For each group, check if it might contain multiple rectangles
    for group_idx, x_group in enumerate(groups):
        x_min, x_max = min(x_group), max(x_group)
        
        # Find y-coordinates for pixels in this x-range
        y_coords_in_range = []
        red_pixels_in_group = []
        for pos in red_positions:
            if x_min <= pos[0] <= x_max:
                y_coords_in_range.append(pos[1])
                red_pixels_in_group.append(pos)
        
        if y_coords_in_range:
            y_min, y_max = min(y_coords_in_range), max(y_coords_in_range)
            
            print(f"Analyzing Group {group_idx + 1}: X({x_min}-{x_max}), Y({y_min}-{y_max})")
            print(f"  Group width: {x_max - x_min + 1}, red pixels in group: {len(red_pixels_in_group)}")
            
            # If this is a very wide group (like group 2), it might contain multiple rectangles
            if x_max - x_min > 100:  # Wide group - likely multiple rectangles
                print(f"  Wide group detected - looking for internal structures")
                
                # Analyze the distribution of red pixels within this group
                # Look for internal gaps in x-coordinates within this group
                group_x_coords = sorted(set([pos[0] for pos in red_pixels_in_group]))
                
                # Find internal gaps
                internal_gaps = []
                for i in range(1, len(group_x_coords)):
                    gap = group_x_coords[i] - group_x_coords[i-1]
                    if gap > 10:  # Significant internal gap
                        internal_gaps.append((group_x_coords[i-1], group_x_coords[i], gap))
                
                print(f"  Found {len(internal_gaps)} internal gaps:")
                for start, end, gap_size in internal_gaps:
                    print(f"    Internal gap from X={start} to X={end}, size={gap_size}")
                
                # Split this group based on internal gaps
                subgroups = []
                current_subgroup = []
                
                for x in group_x_coords:
                    if not current_subgroup:
                        current_subgroup = [x]
                    else:
                        gap = x - current_subgroup[-1]
                        if gap > 10:  # Significant internal gap
                            if len(current_subgroup) >= 2:
                                subgroups.append(current_subgroup)
                            current_subgroup = [x]
                        else:
                            current_subgroup.append(x)
                
                if len(current_subgroup) >= 2:
                    subgroups.append(current_subgroup)
                
                print(f"  Split into {len(subgroups)} subgroups")
                
                # Process each subgroup as a separate rectangle
                for subgroup in subgroups:
                    sub_x_min, sub_x_max = min(subgroup), max(subgroup)
                    
                    # Find y-coordinates for this subgroup
                    sub_y_coords = []
                    for pos in red_pixels_in_group:
                        if sub_x_min <= pos[0] <= sub_x_max:
                            sub_y_coords.append(pos[1])
                    
                    if sub_y_coords:
                        sub_y_min, sub_y_max = min(sub_y_coords), max(sub_y_coords)
                        center_x = (sub_x_min + sub_x_max) // 2
                        center_y = (sub_y_min + sub_y_max) // 2
                        
                        rectangles.append({
                            'x_min': sub_x_min,
                            'x_max': sub_x_max,
                            'y_min': sub_y_min,
                            'y_max': sub_y_max,
                            'center_x': center_x,
                            'center_y': center_y,
                            'width': sub_x_max - sub_x_min + 1,
                            'height': sub_y_max - sub_y_min + 1
                        })
                        
                        print(f"    Subgroup: X({sub_x_min}-{sub_x_max}), Y({sub_y_min}-{sub_y_max}), Center({center_x}, {center_y})")
            
            else:  # Normal sized group - treat as single rectangle
                center_x = (x_min + x_max) // 2
                center_y = (y_min + y_max) // 2
                
                rectangles.append({
                    'x_min': x_min,
                    'x_max': x_max,
                    'y_min': y_min,
                    'y_max': y_max,
                    'center_x': center_x,
                    'center_y': center_y,
                    'width': x_max - x_min + 1,
                    'height': y_max - y_min + 1
                })
                
                print(f"  Single rectangle: X({x_min}-{x_max}), Y({y_min}-{y_max}), Center({center_x}, {center_y})")
    
    return rectangles

def main():
    # Load the image
    img_path = "/home/haris/xdProjects/pixel-rick/pix3.png"
    img = Image.open(img_path)
    
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    print(f"Image dimensions: {img.size}")
    print(f"Image mode: {img.mode}")
    
    # Find red-bordered rectangles
    rectangles = find_red_bordered_rectangles(img)
    
    print(f"\nFound {len(rectangles)} rectangles with red borders:")
    
    # Extract RGB values from rectangle centers
    rgb_values = []
    pixels = img.load()
    
    for i, rect in enumerate(rectangles):
        center_x = rect['center_x']
        center_y = rect['center_y']
        
        # Make sure coordinates are within bounds
        if 0 <= center_x < img.size[0] and 0 <= center_y < img.size[1]:
            rgb = pixels[center_x, center_y]
            rgb_list = [int(rgb[0]), int(rgb[1]), int(rgb[2])]
            rgb_values.append(rgb_list)
            print(f"Rectangle {i+1} center ({center_x}, {center_y}): RGB{rgb}")
            print(f"  Bounds: X({rect['x_min']}-{rect['x_max']}), Y({rect['y_min']}-{rect['y_max']})")
            print(f"  Size: {rect['width']}x{rect['height']}")
        else:
            print(f"Rectangle {i+1} center coordinates ({center_x}, {center_y}) out of bounds")
    
    print(f"\nFinal RGB values array: {rgb_values}")
    
    # Also sample a few pixels around each center to verify consistency
    print("\nVerification - sampling nearby pixels:")
    for i, rect in enumerate(rectangles):
        center_x = rect['center_x']
        center_y = rect['center_y']
        
        print(f"Rectangle {i+1} nearby pixels:")
        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                x, y = center_x + dx, center_y + dy
                if 0 <= x < img.size[0] and 0 <= y < img.size[1]:
                    rgb = pixels[x, y]
                    print(f"  ({x}, {y}): RGB{rgb}")
        print()
    
    return rgb_values

if __name__ == "__main__":
    rgb_values = main()
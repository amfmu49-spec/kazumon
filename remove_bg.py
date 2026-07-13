from PIL import Image
import sys
from collections import deque

def remove_white_bg(input_path, output_path, threshold=200):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    visited = set()
    queue = deque()
    
    # Start flood fill from the 4 corners
    for start_node in [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]:
        queue.append(start_node)
        visited.add(start_node)
        
    while queue:
        x, y = queue.popleft()
        r, g, b, a = pixels[x, y]
        
        # If it's bright enough to be background
        if r > threshold and g > threshold and b > threshold and a > 0:
            pixels[x, y] = (255, 255, 255, 0)
            
            # Check 4-way neighbors
            for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_white_bg(sys.argv[1], sys.argv[2])

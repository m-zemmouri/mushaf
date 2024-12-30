from PIL import Image, ImageDraw

# Define image dimensions
width, height = 1913, 2735

# Create a new transparent image
image = Image.new("RGBA", (width, height), (0, 0, 0, 0))

# Initialize drawing context
draw = ImageDraw.Draw(image)

# Define the left section width and line spacing
left_section_width = width // 4  # Adjust the width of the left section if needed
line_spacing = left_section_width // 15  # Space between lines

# Draw 15 vertical lines in the left section
line_color = (0, 0, 0, 255)  # Black color with full opacity
for i in range(1, 16):
    x_position = i * line_spacing
    draw.line([(x_position, 0), (x_position, height)], fill=line_color, width=1)

# Save the image as a transparent PNG
image.save("transparent_image_with_lines.png", "PNG")
print("Image saved as 'transparent_image_with_lines.png'")

from PIL import Image, ImageDraw

# Image dimensions
width, height = 1913, 2735  # Example dimensions

# Create a new transparent image
image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

# Define gradient stops
start_alpha = 0  # Alpha at 95% (0.95)
end_alpha = int(0.2 * 255)  # Alpha at 100% (0.2 opacity)

# Generate the gradient
for x in range(width):
    # Calculate the alpha for the current position
    alpha = int(
        start_alpha + (end_alpha - start_alpha) * ((x - 0.95 * width) / (0.05 * width))
        if x > 0.95 * width
        else start_alpha
    )
    alpha = max(0, min(255, alpha))  # Clamp alpha between 0 and 255

    # Draw the vertical line for this position
    draw.line([(x, 0), (x, height)], fill=(0, 0, 0, alpha))


# # Define the left section width and line spacing
# left_section_width = 30  # Adjust the width of the left section if needed
# line_spacing = 2  # Space between lines

# # Draw 15 vertical lines in the left section
# line_color = (0, 0, 0, 255)  # Black color with full opacity
# for i in range(1, 16):
#     x_position = i * line_spacing
#     draw.line([(x_position, 0), (x_position, height)], fill=line_color, width=1)

# Save the image
output_path = "gradient_output.png"
image.save(output_path, "PNG")
print(f"Gradient image saved to {output_path}")

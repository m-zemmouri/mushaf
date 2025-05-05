import os

from PIL import Image

# IMAGES PATH EXAMPLE: https://book-compass.com/wimages/144.webp


def ensure_output_dir(output_directory):
    """
    Create the output directory if it does not exist.

    :param output_directory: Path where output images will be saved.
    """
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)


def convert_webp_to_png(input_directory: str, output_directory: str):
    """
    Convert all .webp images in a directory to .png format.

    :param input_directory: Directory containing .webp files.
    :param output_directory: Directory to save converted .png files.
    """
    ensure_output_dir(output_directory)
    try:
        for filename in os.listdir(input_directory):
            if filename.lower().endswith(".webp"):
                input_path = os.path.join(input_directory, filename)
                output_path = os.path.join(
                    output_directory, f"{os.path.splitext(filename)[0]}.png"
                )

                # Open and convert the image to PNG
                with Image.open(input_path) as img:
                    img.save(output_path, "PNG")
                print(f"Converted: {filename} -> {output_path}")
    except Exception as e:
        print(f"Error: {e}")


def make_background_transparent(
    input_directory: str, output_directory: str, bg_color=(255, 255, 255), tolerance=0.3
):
    """
    Make background transparent for all PNG images by replacing a specific color.

    :param input_directory: Directory with PNG images.
    :param output_directory: Directory to save modified images.
    :param bg_color: RGB color to make transparent (default: white).
    :param tolerance: Tolerance for color match (0.0 to 1.0 scale).
    """
    ensure_output_dir(output_directory)
    try:
        for filename in os.listdir(input_directory):
            if filename.lower().endswith(".png"):
                input_path = os.path.join(input_directory, filename)
                output_path = os.path.join(output_directory, filename)

                with Image.open(input_path).convert("RGBA") as img:
                    datas = img.getdata()
                    newData = []

                    # Process each pixel to determine if it should be transparent
                    for item in datas:
                        r, g, b, a = item
                        diff = (
                            sum(
                                [
                                    (channel - bg_color[i]) ** 2
                                    for i, channel in enumerate((r, g, b))
                                ]
                            )
                            ** 0.5
                        )

                        if diff < 255 * tolerance:
                            newData.append((r, g, b, 0))  # Make pixel transparent
                        else:
                            newData.append((r, g, b, a))

                    img.putdata(newData)
                    img.save(output_path)
                print(f"Made background transparent: {filename} -> {output_path}")
    except Exception as e:
        print(f"Error: {e}")


def crop_images(input_directory: str, output_directory: str, crop_box: tuple):
    """
    Crop all PNG images in a directory to a specified rectangle.

    :param input_directory: Directory with source .png images.
    :param output_directory: Directory to save cropped images.
    :param crop_box: Tuple (left, upper, right, lower) defining the crop area.
    """
    ensure_output_dir(output_directory)
    try:
        for filename in os.listdir(input_directory):
            if filename.lower().endswith(".png"):
                input_path = os.path.join(input_directory, filename)
                output_path = os.path.join(output_directory, filename)

                # Crop image using the crop box
                with Image.open(input_path) as img:
                    cropped_img = img.crop(crop_box)
                    cropped_img.save(output_path)
                print(f"Cropped: {filename} -> {output_path}")
    except Exception as e:
        print(f"Error: {e}")


def expand_images(input_directory: str, output_directory: str, target_size: tuple):
    """
    Expand each image to a fixed size with a black background, centering the image.

    :param input_directory: Directory with source PNG images.
    :param output_directory: Directory to save padded images.
    :param target_size: Tuple (width, height) for the new canvas size.
    """
    ensure_output_dir(output_directory)
    target_width, target_height = target_size

    for filename in os.listdir(input_directory):
        if filename.lower().endswith(".png"):
            input_path = os.path.join(input_directory, filename)
            output_path = os.path.join(output_directory, filename)

            with Image.open(input_path) as img:
                img = img.convert("RGBA")  # Ensure alpha channel
                original_width, original_height = img.size

                # Calculate top-left corner to paste the image centered
                x = (target_width - original_width) // 2
                y = (target_height - original_height) // 2

                # Create a black background canvas
                new_img = Image.new(
                    "RGBA", (target_width, target_height), (255, 255, 255, 255)
                )
                new_img.paste(
                    img, (x, y), mask=img
                )  # Use mask for transparency support
                new_img.save(output_path)
                print(f"Centered on white canvas: {filename} -> {output_path}")


def optimize_images(input_dir, output_dir, colors=64):
    """
    Optimize all PNG images in a directory by reducing the number of colors.

    :param input_dir: Path to the directory containing original PNG images.
    :param output_dir: Path to save optimized PNG images.
    :param colors: Number of colors to reduce to (default is 64).
    """
    ensure_output_dir(output_dir)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".png"):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)

            # Convert image to a palette-based image using adaptive color reduction
            with Image.open(input_path) as img:
                optimized = img.convert("P", palette=Image.ADAPTIVE, colors=colors)
                optimized.save(output_path, format="PNG", optimize=True)
                print(f"Optimized: {filename} -> {output_path}")


# --- Example Usage ---
if __name__ == "__main__":
    input_directory = "./pages"  # Directory for webp images
    output_directory = "./pages/PNG/1"
    # convert_webp_to_png(input_directory, "./pages/PNG/1")

    input_directory = "./pages/PNG/1"
    output_directory = "./pages/PNG/2"
    # crop_box = (60, 60, 840, 1327)  # Crop coordinates (left, upper, right, lower)
    # crop_images(input_directory, "./pages/PNG/2", crop_box)

    input_directory = "./pages"
    output_directory = "./pages/1"
    expand_images(input_directory, output_directory, target_size=(800, 1280))

    input_directory = "./pages/PNG/2"
    output_directory = "./pages/PNG/3"
    # make_background_transparent(input_directory, output_directory)

    input_directory = "./pages/older/Warsh Madina/Mobile App/"
    output_directory = "./pages/output/Warsh Madina/Mobile App/"
    # optimize_images(input_directory, output_directory, colors=64)

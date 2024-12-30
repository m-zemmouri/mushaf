from PIL import Image


def FillPage(page):
    # Load the PNG image
    image = Image.open(page+".png").convert("RGBA")

    # Create a new image with the same size and a solid background color
    background_color = (
		252,
		252,
		242,
		255,
	)  # Convert #FCFCF2 to RGBA (R=252, G=252, B=242, A=255)
    background = Image.new("RGBA", image.size, background_color)

    # Paste the original image on top of the background
    # This will replace all transparent areas with the background color
    background.paste(image, (0, 0), mask=image)

    # Save the result
    background.save("output/"+page+".png", "PNG")
    print("Transparent areas filled and saved as 'image_filled_with_color.png'")

FillPage("380")
FillPage("381")
FillPage("382")
FillPage("383")
FillPage("384")
FillPage("385")
FillPage("386")
FillPage("387")
FillPage("388")
FillPage("389")
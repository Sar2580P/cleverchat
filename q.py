# import requests

# response = requests.post(
#     f"https://api.stability.ai/v2beta/stable-image/generate/sd3",
#     headers={
#         "authorization": f"Bearer sk-AtIVx1SfTJLbltcmNqL1hTEmuzDzGtnkbzyzVH72ed0JwAB3",
#         "accept": "image/*"
#     },
#     files={"none": ''},
#     data={
#         "prompt": "rose 18 per cent to ₹14,768.7 crore, compared to ₹12,494.7 crore",
#         "output_format": "jpeg",
#     },
# )

# if response.status_code == 200:
#     with open("./finance_figures.jpeg", 'wb') as file:
#         file.write(response.content)
# else:
#     raise Exception(str(response.json()))

from PIL import Image, ImageDraw, ImageFont

def create_image(initial_value, final_value, percentage_increase):
    # Create a blank image with yellow background
    width, height = 800, 300
    image = Image.new('RGB', (width, height), 'yellow')

    # Initialize ImageDraw
    draw = ImageDraw.Draw(image)

    # Define the text and font
    font_size = 24
    try:
        # Use a truetype or opentype font file that supports special characters
        font = ImageFont.truetype("DejaVuSans.ttf", font_size)
    except IOError:
        # If the specified font is not found, use the default font
        font = ImageFont.load_default()

    # Texts to display
    initial_text = f"{initial_value}"
    final_text = f"{final_value}"
    percentage_text = f"{percentage_increase}"

    # Calculate text sizes
    initial_bbox = draw.textbbox((0, 0), initial_text, font=font)
    final_bbox = draw.textbbox((0, 0), final_text, font=font)
    percentage_bbox = draw.textbbox((0, 0), percentage_text, font=font)

    initial_width = initial_bbox[2] - initial_bbox[0]
    final_width = final_bbox[2] - final_bbox[0]
    percentage_width = percentage_bbox[2] - percentage_bbox[0]

    initial_height = initial_bbox[3] - initial_bbox[1]
    final_height = final_bbox[3] - final_bbox[1]
    percentage_height = percentage_bbox[3] - percentage_bbox[1]

    # Positions for the texts
    initial_position = (50, (height - initial_height) // 2)
    final_position = (width - 50 - final_width, (height - final_height) // 2)
    arrow_y_position = height // 2
    percentage_position = ((width - percentage_width) // 2, arrow_y_position - 50 - percentage_height)

    # Draw the texts
    draw.text(initial_position, initial_text, fill="black", font=font)
    draw.text(final_position, final_text, fill="black", font=font)
    draw.text(percentage_position, percentage_text, fill="black", font=font)

    # Draw the arrow
    arrow_start = (initial_position[0] + initial_width + 10, arrow_y_position)
    arrow_end = (final_position[0] - 10, arrow_y_position)
    arrow_head_size = 15

    draw.line([arrow_start, arrow_end], fill="black", width=4)
    draw.polygon([
        (arrow_end[0] - arrow_head_size, arrow_end[1] - arrow_head_size),
        (arrow_end[0], arrow_end[1]),
        (arrow_end[0] - arrow_head_size, arrow_end[1] + arrow_head_size)
    ], fill="black")

    # Save the image
    image.save("value_increase.png")

    # If you want to display the image
    image.show()

# Example usage
# create_image("₹ 12,494.7 crore", "₹ 14,768.7 crore", "18%")


#__________________________________________________________________________________________
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import requests

def search_and_download_video(query):
    # Specify the ChromeDriver version explicitly
    chrome_version = "125.0.6422.77"  # e.g., "91.0.4472.101"
    driver = webdriver.Chrome(service=Service(ChromeDriverManager(version=chrome_version).install()))
    driver.get("https://www.google.com")
    
    # Perform search
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)
    
    # Click on the first few search results
    links = []
    for i in range(1, 6):  # Check the first 5 links
        try:
            result = driver.find_element(By.XPATH, f"(//h3)[{i}]/ancestor::a")
            links.append(result.get_attribute("href"))
        except:
            continue

    for link in links:
        try:
            driver.get(link)
            # Here, you need to adapt to the specific website structure to find video elements.
            video_element = driver.find_element(By.TAG_NAME, "video")
            video_url = video_element.get_attribute("src")

            if video_url:
                # Download the video
                video_content = requests.get(video_url).content
                with open("downloaded_video.mp4", "wb") as video_file:
                    video_file.write(video_content)
                print("Video downloaded successfully!")
                break
        except Exception as e:
            print(f"Failed to download video from {link}: {e}")
            continue

    driver.quit()

if __name__ == "__main__":
    search_query = "clip on car manufacturing"
    search_and_download_video(search_query)

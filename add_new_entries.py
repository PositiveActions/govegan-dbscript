import sys
import os
import json
import requests
from pathlib import Path
import shutil

print("The arguments are: ", str(sys.argv))
if len(sys.argv) < 3:
    sys.exit("You need the apiUrl and apiKey arguments")
# First argument is the url and second is the apiKey
(apiUrl, apiKey, typeData) = (sys.argv[1], sys.argv[2], sys.argv[3])
headers = {'Content-Type': 'application/json',
           'Authorization': f"Bearer {apiKey}"}

headersImg = {'Authorization': f"Bearer {apiKey}"}
pathRestaurant= "restaurants/add"
print(f"apiUrl: {apiUrl}")
print(f"apiUrl: {apiKey}")
# Get the json data

def postRestaurant(data):
    restData = {
        "name": data["name"],
        "location": data["location"],
        "opening_time": data["opening_time"],
        "location_name": data["location_name"]
    }
    return requests.post(f"{apiUrl}/restaurants", json=restData, headers=headers).json()


def postRestaurantInfo(id, data):
    resInfoData = {
        "restaurant_id": id,
        "description": data["description"],
    }
    return requests.post(f"{apiUrl}/restaurantinfo", data=resInfoData).json()


def uploadImg(path, name, id, model):
    fileBuffer = open(path / name,"rb")
    img = {
        "files": fileBuffer,
        "name": name,
        "refId": id,
        "ref": model["ref"],
        "field": model["field"],
    }
    return requests.post(f"{apiUrl}/upload", files=img, headers=headersImg).json()


def processRestaurants(item):
    pathData = Path(f"{pathRestaurant}/{item}/data.json")
    with open(pathData) as json_file:
        data = json.load(json_file)
        resData = postRestaurant(data)
        uploadImg(Path(f"{pathRestaurant}/{item}/img"),"thumbnail.png", resData["id"], {"ref": "restaurant", "field": "thumbnail"})
        resInfoData = postRestaurantInfo(resData["id"], data)
        for image in os.listdir(Path(f"{pathRestaurant}/{item}/img")):
            uploadImg(Path(f"{pathRestaurant}/{item}/img"), image,  resInfoData["id"], {"ref": "restaurantinfo", "field": "pictures"})

# upload the images and restaurant data
for item in os.listdir(pathRestaurant):
    processRestaurants(item)
    # remove directories from and and moved them to init
    shutil.move(f"pathRestaurant/{item}", "restaurants/init")





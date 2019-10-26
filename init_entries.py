import sys
import os
import json
import requests
from pathlib import Path
import mimetypes
import magic

print("The arguments are: ", str(sys.argv))
if len(sys.argv) < 2:
    sys.exit("You need the apiUrl and apiKey arguments")
# First argument is the url and second is the apiKey
(apiUrl, apiKey) = (sys.argv[1], sys.argv[2])
headers = {'Content-Type': 'application/json',
           'Authorization': "Bearer " + apiKey}

headersImg = {'Authorization': f"Bearer {apiKey}"}
pathRestaurant = "restaurants/init"
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
    return requests.post(f"{apiUrl}/restaurantinfos", json=resInfoData, headers=headers).json()


def uploadImg(path, name, id, model):
    newPath = path.joinpath(name)
    img = {
        "files":newPath.open('rb'),
        "refId": id,
        "ref": model["ref"],
        "field": model["field"],
    }
    # print(file) 
    return requests.post(f"{apiUrl}/upload", files={'file': ('readme.txt', img, 'image/jpeg')}, headers=headersImg).json()


def uploadMultipleImg(files, id, model):
    imgArray = []
    for file in files:
        imgArray.append({
            "files": open(file, 'rb'),
            "refId": id,
            "ref": model["ref"],
            "field": model["field"]
        })
    return requests.post(f"{apiUrl}/upload", files=imgArray, headers=headersImg).json()


def processRestaurants(item):
    pathData = Path(f"{pathRestaurant}/{item}/data.json")
    pathImg = Path(f"{pathRestaurant}/{item}/img")
    with open(pathData) as json_file:
        data = json.load(json_file)
        resData = postRestaurant(data)
        resUpload = uploadImg(pathImg, "thumbnail.jpeg", resData["_id"], {
                              "ref": "restaurant", "field": "thumbnail"})
        resInfoData = postRestaurantInfo(resData['_id'], data)
        print('resData', resUpload)
        # pictures=[]
        # for image in os.listdir(pathImg):
        #     if (image !='thumbnail.png'):
        #         pictures.append(pathImg.joinpath(image))
        # uploadMultipleImg(pictures, resInfoData["_id"], {"ref": "restaurantinfo", "field": "pictures"})


for item in os.listdir(pathRestaurant):
    processRestaurants(item)


# upload the images

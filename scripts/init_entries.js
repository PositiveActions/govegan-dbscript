const requests = require('axios');
const Ora = require('ora');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path')
const util = require('util');

const readdir = util.promisify(fs.readdir);

const spinner = new Ora();

let apiUrl, apiKey, headers, headersImg;
const pathRestaurant = "restaurants/init";


function postRestaurant(data) {
    const restData = {
        "name": data["name"],
        "location": data["location"],
        "opening_time": data["opening_time"],
        "location_name": data["location_name"]
    }
    return requests.post(`${apiUrl}/restaurants`, restData, { headers }).then(res => res.data);
}

function postRestaurantInfo(id, data) {
    const resInfoData = {
        "restaurant_id": id,
        "description": data["description"],
    }
    return requests.post(`${apiUrl}/restaurantinfos`, resInfoData, { headers }).then(res => res.data);
}

function uploadImg(pathGiven, name, id, model) {
    const newPath = path.join(pathGiven, name)
    const form = new FormData();
    form.append('files', fs.createReadStream(newPath));
    form.append('refId', id);
    form.append('ref', model["ref"]);
    form.append('field', model["field"]);
    const head = { ...headersImg, ...form.getHeaders() }
    return requests.post(`${apiUrl}/upload`, form, {
        headers: head,
    });
}


async function processRestaurants(item) {
    const pathData = path.join(pathRestaurant, item, 'data.json');
    const pathImg = path.join(pathRestaurant, item, 'img');
    const rawData = fs.readFileSync(pathData);
    const jsonData = JSON.parse(rawData);
    try {
        const resPost = await postRestaurant(jsonData)
        const resInfoData = await postRestaurantInfo(resPost['_id'], jsonData)
        const images = await readdir(pathImg);
        await Promise.all(images.map(image => {
            const imageStr = image.split(".").length > 1 ? image.split(".")[0] : null;
            if (imageStr && imageStr !== 'thumbnail') {
                return uploadImg(pathImg, image, resInfoData["_id"], { "ref": "restaurantinfo", "field": "pictures" })
            }
            if (imageStr === 'thumbnail') {
                return uploadImg(pathImg, image, resPost["_id"], {
                    "ref": "restaurant", "field": "thumbnail"
                });
            }
            return Promise.resolve();
        }));
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

module.exports = async function (url, key) {
    try {
        apiUrl = url;
        apiKey = key
        headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + apiKey
        }
        headersImg = { 'Authorization': `Bearer ${apiKey}` }
        const restaurants = await readdir(pathRestaurant);
        await Promise.all(restaurants.map(rest => processRestaurants(rest)));
        return 'finish';
    } catch (err) {
        if (err.response) {
            throw new Error(err.response);
        } else {
            throw new Error(err);
        }
    }
}


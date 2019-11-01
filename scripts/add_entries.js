// const requests = require('axios');
// const arg = require('arg');
// const Ora = require('ora');
// const FormData = require('form-data');
// const fs = require('fs');
// const path = require('path')

// const args = arg({
//     // Types
//     '--apiUrl': String,
//     '--apiKey': String,
// });

// const spinner = new Ora();

// if (!args['--apiUrl'] || !args['--apiKey']) {
//     console.log('All options are mandatory --apiUrl --apiKey');
//     process.exit(1);
//     return;
// }

// const apiUrl = args['--apiUrl'];
// const apiKey = args['--apiKey'];



// const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': "Bearer " + apiKey
// }

// const headersImg = { 'Authorization': `Bearer ${apiKey}` }
// const pathRestaurant = "restaurants/init"


// function postRestaurant(data) {
//     const restData = {
//         "name": data["name"],
//         "location": data["location"],
//         "opening_time": data["opening_time"],
//         "location_name": data["location_name"]
//     }
//     return requests.post(`${apiUrl}/restaurants`, restData, { headers }).then(res => Promise.resolve(res.data));
// }

// function postRestaurantInfo(id, data) {
//     const resInfoData = {
//         "restaurant_id": id,
//         "description": data["description"],
//     }
//     return requests.post(`${apiUrl}/restaurantinfos`, resInfoData, { headers }).then(res => Promise.resolve(res.data));
// }

// function uploadImg(pathGiven, name, id, model) {
//     const newPath = path.join(pathGiven, name)
//     const form = new FormData();
//     form.append('files', fs.createReadStream(newPath));
//     form.append('refId', id);
//     form.append('ref', model["ref"]);
//     form.append('field', model["field"]);
    
//     const head = {...headersImg, ...form.getHeaders()}
//     return requests.post(`${apiUrl}/upload`, form, {
//         headers: head,
//     });
// }


// async function processRestaurants(item) {
//     const pathData = path.join(pathRestaurant, item, 'data.json');
//     const pathImg = path.join(pathRestaurant, item, 'img');
//     const rawData = fs.readFileSync(pathData);
//     const jsonData = JSON.parse(rawData);
//     try {
//         const resPost = await postRestaurant(jsonData)
//         await uploadImg(pathImg, "thumbnail.jpeg", resPost["_id"], {
//             "ref": "restaurant", "field": "thumbnail"
//         });
//         resInfoData = await postRestaurantInfo(resPost['_id'], jsonData)
//         fs.readdirSync(pathImg).forEach(async image => {
//             const imageStr = image.split(".").length > 1 ? image.split(".")[0] : null;
//             if (imageStr && imageStr !== 'thumbnail') {
//                 await uploadImg(pathImg, image, resInfoData["_id"], { "ref": "restaurantinfo", "field": "pictures" })
//             }
//         });
//     } catch(err) {
//         console.error(err);
//     }
// }

// module.exports = async function main() {
//     try {
//         spinner.text = "#### Starting the database initialization ####";
//         spinner.start();
//         fs.readdirSync(pathRestaurant).forEach(async rest => {
//             spinner.succeed();
//             spinner.text = `Processing restaurant ${rest}`;
//             spinner.start();
//             await processRestaurants(rest)
//             spinner.succeed();
//             spinner.clear();
//         });
//     } catch (err) {
//         console.error(err);
//     }
// }



// main();


### NodeJS go vegan mongodb data intialization/addition scripts

The init_entries.py script is called to initialize the database data based on what we find in the `restaurants/init` folder
- Each restaurant folder contain a `data.json`file that have the generale information about the restaurant
- We will also find an img folder, that contain the restaurant image.
    - A file named `thumbnail.png` in this folder is mandatory.
    - the other image can be named as you wish


- the `restaurants/add` is used to add new restaurant to the database
- the folder will automatically be emptied and added to the init function when the restaurant processing is finished


#### Prerequisites ####
- You need to install NodeJS > 8.x.x
- Git clone the project and run `npm install`
- Have the api_url and api_key
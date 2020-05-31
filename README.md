## Features
**Cave Locations**
* View all caves in the database in a table format.
* Search by property (length, pit depth, county, etc)
* Displays all properties and any available maps.
  <img src="https://i.imgur.com/fepNNMb.png" width="300"/>
* View all information on a specific cave.
  <img src="https://i.imgur.com/WBpzp0j.png" width="300"/>
	
---
**Admins**
* Can accept, reject, or modify proposed changes to a cave location.
* Can accept, reject, or modify new cave submissions.
  <img src="https://i.imgur.com/Zim5lsN.png" width="300"/
 <img src="https://i.imgur.com/ZhKDpsU.png" width="300"/>
* Approve users who request a membership.
---
**Users**
* Once approved, have access to all cave locations, maps, etc.
* Can propose changes and add new caves to the database.
* Add leads that have been checked and don't go anywhere.
* Add in cave leads
---
**Dashboard**
* Download all points as GPX or CSV.
* Upload leads that a user has confirmed are not a cave.

<img src="https://i.imgur.com/sg3cgFX.png" width="300"/>

---
**Map**
  * View all 10,000+ caves.
  * Points are clustered if zoomed out to increase efficiency.
  * Get information on a point by clicking it.
  * Search cave locations or places.
  * Use a Topo, 3DEP Elevation (Lidar), and OSM map layer.

<img src="https://i.imgur.com/mWHJap4.jpg" width="300"/> 
<img src="https://i.imgur.com/C0lbsp2.png" width="300"/>
<img src="https://i.imgur.com/X5zcHAc.png" width="300"/>


## Technologies Used
**Server:** Node, Express, Passport, MongoDB, and Typescript

**Client:** React, Passport, Leaflet, and Typescript

## How to Run
After installing [NodeJS](https://nodejs.org/en/download/) you will need to setup a few config files.

**Client config**

```typescript
// create the ./client/src/config/urlConfig.ts file
const serverBaseURL = "http://server_ip_address_here:5000/";
const siteBaseURL = "http://client_ip_address_here:3000/";

export { serverBaseURL, siteBaseURL };
```
**Server config**

```typescript
// create the ./server/src/config/keys.ts file
export const mongoURI = "mongo_connection_string_here"
```
**Install dependencies**
```bash
# Install required global dependencies
> npm i typescript -g
> npm i ts-node -g

# Install required server dependencies
> cd server
> npm i

# Install required client dependencies
> cd client
> npm i
```
**Starting the server**
``` bash
# Start running the server
> cd server
> npm run dev
```
**Starting the client**
```bash
# Start running the client
> cd client
> npm start
```

**Registering a user**

In you web browser, navigate to `http://your_ip_address:3000/register`
To create the first admin user, modify the role property of the user document. Change the role from `User` to `Admin`.

***Uploading data**

In you web browser, navigate to `http://your_ip_address:3000/upload`
The screenshots here contain fake data, as the data that this project is meant for is proprietary. If you would like to test this out, fake data has been provided in a CSV file for you to upload.

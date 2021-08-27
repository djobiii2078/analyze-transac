# Analyze-Transacs

The goal is to monitor mobile payments issued in secondary schools of Cameroon.

Composed of two main parts: `funcs` which englobes all the backend functionnalities exposed and `face` which englobes the views presented to the user.

## Install node, npm, and mongodb

If you're on windows, just follow the steps mentioned here:

- Nodejs,npm: https://nodejs.org/en/download/ (msi)
- Mongodb tools: https://www.mongodb.com/try/download/database-tools?tck=docs_databasetools
- Mongodb : https://www.mongodb.com/try/download/community?tck=docs_server

If you're on Ubuntu, just type:

```
sudo apt update
sudo apt install nodejs npm 
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt-get install -y mongodb-org
```



## Deploy funcs

`funcs` represents the backend of transac-cm. Ideally, it is hosted on a several servers linked by a load balancer to distribute the requests between them and evenly distribute the load. 

To install funcs, you must have `nodejs` and `mongodb` installed. To deploy `funcs`, just follow these commands:

```
cd funcs/
npm install .
node index.js // Init the server on port 4000
```

## Deploy face
`face` represents the frontend of transac-cm. It relies mainly on `REACTJS` to achieve dynamic loading and unloading of graphs datastructures while minimizing the load on clients.

To install funcs, you must have `nodejs` installed. If the latter requirement is met, follow these commands:
```
cd face/
npm install .
npm start //start the application on the port 3000
```

## Test
To test the app, we provide a fake database to visualise the looks of the application in production.

Concretely, ensure you don't have protection on your mongodb (else you will need to update the file `funcs/_db_helpers/config.json`).

Then import the database `transac-cm` in the folder dump. 

To achieve this, just run:

```
mongorestore --db transac-cm dump/transac-cm --drop
```

Now, you can visualize your application with a web browser under `localhost:3000/login`. 

Default user/pass: **djobiiiKill@gmail.com**/**djobiii2078**

## Recommandations

Checkout this tutorial https://we.tl/t-YZK84njX3z 

# Sensei -- Node Manager

![Screenshot](https://raw.githubusercontent.com/lcxnetwork/SenseiNode/development/screenshot.png "screenshot of sensei node manager")

# How to Set up a Node
1. Acquire a VPS with enough SSD disk space to host the blockchain.
2. Log in, download the latest software via wget. (Install wget if you don't have it)

`https://github.com/lcxnetwork/LightChain/releases/download/v0.2.1/LightChain-v0.2.1-linux.zip`

3. Unzip the archive. (install unzip if you don't have it)

`unzip LightChain-v0.2.1-linux.zip`

4. Open up a screen session to keep your node open. (Install screen if you don't have it)

`screen`

5. Change the directory into the directory containing the LightChain executables.

`cd LightChain-v0.2.1-linux.zip`

6. Register and log in to your dahsboard page, and run the command from underneath the "register a node" form. It will look something like this, but with a different validation string.

`./LightChaind --validate 5eb11dc9b3bd28f9487f18d8e8579d96 --enable-blockexplorer --enable-cors "*" --rpc-bind-ip 0.0.0.0`

7. Input the IP address of your VPS into the "register a node" form and also enter your rpc port. (If you don't know what your RPC port is, you're using the default which is 10002.)

7. You can now press ctrl + a, ctrl +d to detach from the screen and `exit` the ssh session. Once your node is synced, it is now running and submitting shares to Sensei! You can watch your balance build up in real time as the nodes earn rewards. Payouts are at the top of every hour.

# Development Setup

## Requirements
- node.js 8+
- knex.js compatible database
- RabbitMQ (optional)
- Recaptcha v2 Keys

## Includes
- MVC framework - express.js 
- User system - registration, login, 2FA, password manager - passport.js
- SQL query/schema builder - knex.js
- Template system - pug.js
- Public frontend page
- App dashboard page
- User settings page
- Welcome + ToS page
- Input validation middleware
- RabbitMQ lib - amqplib
- Google Recaptcha middleware
- Bulma 
- Swanson Assets

## Setup

Clone the repository:

```
git clone https://github.com/ExtraHash/SenseiNodeManager/
cd SenseiNodeManager
```

Install dependencies: 
* [MariaDB installation instructions](https://downloads.mariadb.org/mariadb/repositories/#mirror=digitalocean-nyc&distro=Ubuntu&distro_release=bionic--ubuntu_bionic&version=10.3)
* [MariaDB configuration instructions](https://mariadb.com/kb/en/library/getting-installing-and-upgrading-mariadb/)
* [NodeJS installation instructions](https://nodejs.org/en/download/package-manager/) 

Create the database in the MariaDB command line:

```sql
CREATE DATABASE mydatabase;
```

Sign up for and generate recaptcha keys [here](https://www.google.com/recaptcha/intro/v3.html). Only recaptcha v2 is supported, do not select v3.

Copy the example .env file to .env and fill it out. All fields are required except the RABBITMQ fields.

```
cp .env-example .env
```

Here's an example of a completed .env file:

```
APP_PORT=8015
APP_SECRET=appsecret
APP_COOKIE_SECRET=appcookiesecret

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourdbpassword
DB_NAME=mydatabase

RABBITMQ_USER=
RABBITMQ_PASS=

RECAPTCHA_SITE_KEY=recaptchaapikeyhere
RECAPTCHA_SECRET_KEY=recaptchasecretkeyhere
```

Install the nodejs modules:

```
npm i
```

Start the application:

```
npm start
```

The application will be served on whatever port you configured in .env for `APP_PORT`.

## Useful Links
* Node.js documentation: https://nodejs.org/en/docs/
* Knex.js documentation: https://knexjs.org/
* Turtlecoin-rpc documentation: https://api-docs.turtlecoin.lol/

# AdonisJS v6 API Starter Kit

This workspace using AdonisJS v6 is licensed under the MIT license

## How to use

-   Clone this repo
-   copy .env.example to .env
-   Run command: `npm install`
-   Run command: `node ace generate:key`. This command will replace AP_KEY value in .env file.
<!-- -   Edit `ecosystem.config.js` file and change name to domain name or something unique on server. -->

## Features

-   Login
-   Registration
-   Email verification
-   Middleware for email verified users only
-   Forgot password
-   Reset password
-   MJML for mail templates

## Deploy script

```
cd /path/to/your/project/folder

git pull origin main

pnpm install --no-save

pnpm run build


node ace migration:run --force --disable-locks
```

# vZJX Website
---
The Virtual Jacksonville ARTCC Website.

>[!WARNING]  
> This repo and readme are still under development!

---

Environment Variables (all are required):
- `DEV_MODE`: If set to `true`, disables the VATUSA roster check and grants access to all pages regardless of rating.
- `DATABASE_URL`: URL for the database. Example: `postgres://dbuserhere:dbpasswordhere@localhost:5432/dbnamehere`
- `NEXTAUTH_URL`: URL to specify where VATSIM should redirect users after a successful login.  This should just be the url without anything after `.com` `.org` etc.  Example: `https://zjxartcc.org`
- `NEXTAUTH_SECRET`: Secret key to encrypt tokens, this can be anything (hopefully secure).  Example: `anything`
- `VATSIM_CLIENT_ID`: Client ID for VATSIM Connect.
- `VATSIM_CLIENT_SECRET`: Client Secret for VATSIM Connect.
- `VATUSA_FACILITY`: Name of the facility. Example: `ZJX`
- `VATUSA_API_KEY`: Used to authenticate with the VATUSA API.

# Development
#### Prerequisites

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#prerequisites)

- Node v18 or later
- NPM 9.6 or later
- Latest PNPM version
- **EMPTY** Relational Database (preferably Postgres)
- VATSIM Connect Keys https://auth-dev.vatsim.net/

To begin contributing, **start by setting up your local environment** with the steps below.

## Local Environment
Clone this repository:
```shell
git clone https://github.com/zjx-artcc/website.git
```

Change directories:
```shell
cd website-master
```

Install dependencies:
```shell
pnpm i
```

Configure your environment variables by copying the .env.example file and renaming the copy to `.env.local`. Edit the values appropriately:
```shell
cp .env.example .env.local
```

Verify that the local database is active and run migrations:
```shell
pnpm run db:deploy
```

Generate the prisma client:
```shell
pnpm prisma generate
```

Finally, run the development server:
```shell
pnpm run dev
```
And you're all set! View the local site at http://localhost:3000/



# Production

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#production)

Build the project:

```shell
npm run build
```

Start the production server:

Important

Make sure environment variables on the server are configured correctly

```shell
npm run start
```

Seed the database (`/api/seed`) on your production URL.

##### Docker

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#docker)

After configuring facilities correctly, run the `docker build` command:

```shell
docker build -t website .
```

Run the image with the environment variables:

```shell
docker run -p 80:80 --env-file <YOUR .env.local FILE> website
```

Important

The container will run on port 80, unlike the development server.

---
## To-Do List / Features



---
### Developed by the Jacksonville ARTCC Web Team.
##### README Version 0.2.0

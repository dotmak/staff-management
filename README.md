This project uses concurrently to run the development server and the database in parallel. To start the development server, run:

## How to start the development server

```bash
npm install
then
npm run dev:db
```

The json-server is configured to run on the 4001 port. In case this change please edit the `.env` file with the appropriate port.
The `.env` is commited for development purposes, but it is not recommended to use it in production.

## Login Credentials

```bash
username: admin@example.com
password: 123
```

# MotoMenus-SaaS-UI

SaaS Front-End User Interface; Static JS site hosted in S3.
All subdomains (\*.motomenus.com) route via DNS to MotoMenus-SaaS-UI.

### Install dependencies

```shell
npm install
```

### Format with Prettier locally

```shell
npm run dev:prettier:format
```

### Lint to check for errors locally

```shell
npm run dev:eslint:check
```

### Run development server locally

```shell
npm run dev:webpack:server
```

Alternatively:

```shell
docker-compose up
```

### Build assets for use in production

```shell
npm run prod:webpack:build
```

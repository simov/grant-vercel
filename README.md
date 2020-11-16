
# grant-vercel

> _Vercel Serverless Function handler for **[Grant]**_

```js
var grant = require('grant').vercel({
  config: {/*configuration - see below*/}, session: {secret: 'grant'}
})

module.exports = async (req, res) => {
  var {response} = await grant(req, res)
  if (response) {
    res.statusCode = 200
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(response))
  }
}
```

> _Also available for [AWS], [Azure], [Google Cloud]_

> _[ES Modules and TypeScript][grant-types]_

---

## Configuration

The `config` key expects your [**Grant** configuration][grant-config].

#### vercel.json

The following optional routing is used in all examples:

```json
{
  "rewrites": [
    {"source": "/(.*)", "destination": "/api/grant"}
  ]
}
```

#### .vercel

You need a `.vercel` folder containing a `project.json` file in every example:

```json
{"orgId":"...","projectId":"..."}
```

---

## Routing

You login by navigating to:

```
https://[PROJECT].vercel.app/connect/google
```

The redirect URL of your OAuth app have to be set to:

```
https://[PROJECT].vercel.app/connect/google/callback
```

And locally:

```
http://localhost:3000/connect/google
http://localhost:3000/connect/google/callback
```

---

## Session

The `session` key expects your session configuration:

Option | Description
:- | :-
`name` | Cookie name, defaults to `grant`
`secret` | Cookie secret, **required**
`cookie` | [cookie] options, defaults to `{path: '/', httpOnly: true, secure: false, maxAge: null}`
`store` | External session store implementation

#### NOTE:

- The default cookie store is used unless you specify a `store` implementation!
- Using the default cookie store **may leak private data**!
- Implementing an external session store is recommended for production deployments!

Example session store implementation using [Firebase]:

```js
var request = require('request-compose').client

var path = process.env.FIREBASE_PATH
var auth = process.env.FIREBASE_AUTH

module.exports = {
  get: async (sid) => {
    var {body} = await request({
      method: 'GET', url: `${path}/${sid}.json`, qs: {auth},
    })
    return body
  },
  set: async (sid, json) => {
    await request({
      method: 'PATCH', url: `${path}/${sid}.json`, qs: {auth}, json,
    })
  },
  remove: async (sid) => {
    await request({
      method: 'DELETE', url: `${path}/${sid}.json`, qs: {auth},
    })
  },
}
```

---

## Handler

The AWS Lambda handler for Grant accepts:

Argument | Type | Description
:- | :- | :-
`req` | **required** | The request object
`res` | **required** | The response object
`state` | optional | [Dynamic State][grant-dynamic-state] object `{dynamic: {..Grant configuration..}}`

The AWS Lambda handler for Grant returns:

Parameter | Availability | Description
:- | :- | :-
`session` | Always | The session store instance, `get`, `set` and `remove` methods can be used to manage the Grant session
`redirect` | On redirect only | HTTP redirect controlled by Grant, it is set to `true` when Grant is going to handle the redirect internally
`response` | Based on transport | The [response data][grant-response-data], available for [transport-state][example-transport-state] and [transport-session][example-transport-session] only

---

## Examples

Example | Session | Callback λ
:- | :- | :-
`transport-state` | Cookie Store | ✕
`transport-querystring` | Cookie Store | ✓
`transport-session` | Firebase Session Store | ✓
`dynamic-state` | Firebase Session Store | ✕

> _Different session store types were used for example purposes only._

#### Configuration

All variables at the top of the [`Makefile`][example-makefile] with value set to `...` have to be configured:

- `token` - Vercel Token

The [transport-session][example-transport-session] and the [dynamic-state][example-dynamic-state] examples requires your [Firebase] configuration to be set in `vercel.json`:

```json
{
  "env": {
    "FIREBASE_PATH": "...",
    "FIREBASE_AUTH": "..."
  }
}
```

- `firebase_path` - [Firebase] path of your database

```
https://[project].firebaseio.com/[prefix]
```

- `firebase_auth` - [Firebase] auth key of your database

```json
{
  "rules": {
    ".read": "auth == '[key]'",
    ".write": "auth == '[key]'"
  }
}
```

All variables can be passed as arguments to `make` as well:

```bash
make plan example=transport-querystring ...
```

---

## Develop

```bash
# build example locally
make build-dev
# run example locally
make run-dev
```

---

## Deploy

```bash
# deploy Grant
make deploy
```

---

  [Grant]: https://github.com/simov/grant
  [AWS]: https://github.com/simov/grant-aws
  [Azure]: https://github.com/simov/grant-azure
  [Google Cloud]: https://github.com/simov/grant-gcloud
  [Vercel]: https://github.com/simov/grant-vercel

  [cookie]: https://www.npmjs.com/package/cookie
  [Firebase]: https://firebase.google.com/

  [grant-config]: https://github.com/simov/grant#configuration
  [grant-dynamic-state]: https://github.com/simov/grant#dynamic-state
  [grant-response-data]: https://github.com/simov/grant#callback-data
  [grant-types]: https://github.com/simov/grant#misc-es-modules-and-typescript

  [example-makefile]: https://github.com/simov/grant-vercel/tree/master/Makefile
  [example-transport-state]: https://github.com/simov/grant-vercel/tree/master/examples/transport-state
  [example-transport-querystring]: https://github.com/simov/grant-vercel/tree/master/examples/transport-querystring
  [example-transport-session]: https://github.com/simov/grant-vercel/tree/master/examples/transport-session
  [example-dynamic-state]: https://github.com/simov/grant-vercel/tree/master/examples/dynamic-state

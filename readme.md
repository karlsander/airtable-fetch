__Warning__: This module is no longer maintained. There is an unresolved security warning in the `airtable` dependency version, so it is not advisible to use this. Instead I would suggest copy and pasting the code, if you need something like this.

# airtable-fetch

[![npm link](https://img.shields.io/npm/v/airtable-fetch.svg)](https://www.npmjs.com/package/airtable-fetch)
[![Build Status](https://travis-ci.org/karlsander/airtable-fetch.svg?branch=master)](https://travis-ci.org/karlsander/airtable-fetch)

A module that helps fetch an entire Airtable base or parts of it. This can be useful for running a proxy to avoid the 5/req per second API Limit.

## Usage

```javascript
const { AirtableFetch } = require("airtable-fetch");
```

or

```javascript
import AirtableFetch from "airtable-fetch";
```

then setup with your BaseID, the structure of the views you want to fetch and your API key. The key can also be provided in the `AIRTABLE_API_KEY` environment variable:

```javascript
const refresh = AirtableFetch(
  "appYOURBASEID",
  { TableX: ["ViewA", "ViewB"], TableY: ["ViewC"] },
  "YOURAPIKEY"
);
```

This function returns a promise. So if you just want the data once:

```javascript
const data = await AirtableFetch(/*setup stuff*/)();
```

The resulting data uses the \_rawJson fields from Airtable and has the following structure:

```javascript
{
  "TableX": {
    "ViewA": [
      {
        "id": "recsH4J7VZkhCDUVJ",
        "fields": {/*your actual table fields */},
        "createdTime": "2017-07-26T09:44:36.000Z"
      },
      /*...*/
    ],
    "ViewB": [/*...*/]
  },
  "TableY" : {
    "ViewC": [/*...*/]
  }
}
```

In a proxy scenario you might want to keep the function around to refresh the data periodically. Here's a little example of that using the handy `json-server`.

```javascript
const { AirtableFetch } = require("airtable-fetch");
const schedule = require("node-schedule");
const jsonServer = require("json-server");

const refresh = AirtableFetch("appYOURBASEID", {
  TableX: ["ViewA", "ViewB"],
  TableY: ["ViewC"]
});
const server = jsonServer.create();

const refreshJob = schedule.scheduleJob("*/5 * * * *", function() {
  refresh().then(newData => server.use(jsonServer.router(newData)));
});

refreshJob.invoke();
server.listen(3000);
```

## Caveats

Fetching the entire base is my goal, but while the Airtable Schema API is not public, I can't. Once it becomes generally available I'd like fetch everything by default so the module can have the desired simplicity.

This kind of naive approach for a proxy server doesn't really scale to huge bases, but neither does Airtable, really, so its fine (for me, for now).

## Changelog

### 0.1.2

- update dependencies

### 0.1.1

- update dependencies

### 0.1.0

- intial release

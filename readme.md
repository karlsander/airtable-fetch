# airtable-fetch

A module that helps fetch an entire Airtable Base or parts of it. This can be useful for running a proxy to avoid the 5/req per second API Limit.

## Usage

```javascript
const { AirtableFetch } = require('airtable-fetch');
```
or

```javascript
import AirtableFetch from 'airtable-fetch';
```

then setup with your BaseID, the structure of the views you want to fetch and your API key. The key can also be provided in the `AIRTABLE_API_KEY` environment variable:

```javascript
const refresh = AirtableFetch(
  "appYOURBASEID",
  { "TableX": ["ViewA", "ViewB"], "TableY" : ["ViewC"] },
  "YOURAPIKEY"
);
```

This function returns a promise. So if you just want the data once:

```javascript
const data = await AirtableFetch(/*setup stuff*/)();
```

The resulting data uses the _rawJson fields from Airtable and has the following structure:

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
const { AirtableFetch } = require('airtable-fetch');
const schedule = require('node-schedule');
const jsonServer = require('json-server');

const refresh = AirtableFetch(
  "appYOURBASEID",
  { "TableX": ["ViewA", "ViewB"], "TableY" : ["ViewC"] });
const server = jsonServer.create();

const refreshJob = schedule.scheduleJob('*/5 * * * *', function () {
  refresh().then((newData) => server.use(jsonServer.router(newData)));
});

refreshJob.invoke();
server.listen(3000);
```
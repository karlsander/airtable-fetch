# airtable-fetch

## Example

```javascript
const airtableFetch = require('airtable-fetch');
const schedule = require('node-schedule');
const jsonServer = require('json-server');

const refresh = airtableFetch(
  "appYOURBASEID",
  { "TableX": ["ViewA", "ViewB"], "TableY" : ["ViewC"] });
const server = jsonServer.create();

const refreshJob = schedule.scheduleJob('*/5 * * * *', function () {
  refresh().then((newData) => server.use(jsonServer.router(newData)));
});

refreshJob.invoke();
server.listen(3000);
```
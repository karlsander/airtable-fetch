import airtable from 'airtable';

function AirtableFetch(baseID, baseSchema, apiKey) {
  if (apiKey) {
    airtable.configure({ apiKey: apiKey });
  }
  const base = airtable.base(baseID);

  return function refresh() {
    return new Promise(async function(resolve, reject) {
      let data = {};
      for (let tableName in baseSchema) {
        data[tableName] = data[tableName] || {};
        for (let viewName of baseSchema[tableName]) {
          try {
            let res =
              await base(tableName)
                .select({ maxRecords: 50000, view: viewName })
                .all();
            data[tableName][viewName] = res.map(e => e._rawJson);
          }
          catch (e) {
            reject(e);
          }
        }
      }
      resolve(data);
    });
  };
}

export default AirtableFetch;
export { AirtableFetch };
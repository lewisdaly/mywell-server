{"where": {"or": [{"postcode": 12345}]}}


{
   or: [
     { and: [{ field1: 'foo' }, { field2: 'bar' }] },
     { field1: 'morefoo' }
   ]
 }


{"where": { "and": [{"date": {"gt": "2015-04-01T18:30:00.000Z"}}, {"or":[{"postcode": "313603"}]}]}}

{"where": {"or": [{"postcode": 313603}]}, "limit": 10, "order": "date DESC"}

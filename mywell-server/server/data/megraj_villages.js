var loopback = require("loopback");

const villages = 
[
{id:12, name:"Dhadhiya", postcode:383350, coordinates:new loopback.GeoPoint({lat:23.54868492320261,lng:73.44577496732028}) },              
{id:13, name:"Navaghara", postcode:383350, coordinates:new loopback.GeoPoint({lat:23.932004830724626,lng:73.77724637671498}) },              
{id:14, name:"Ranjedi", postcode:383350, coordinates:new loopback.GeoPoint({lat:23.56492182539683,lng:73.49123452380952}) },              
{id:15, name:"Tarakvadiya", postcode:383350, coordinates:new loopback.GeoPoint({lat:23.536290798611102,lng:73.45459886631943}) },              
{id:16, name:"Valuna", postcode:383350, coordinates:new loopback.GeoPoint({lat:23.535140277777774,lng:73.46966666666668}) },              
{id:11, name:"Bhatkota", postcode:383350, coordinates:new loopback.GeoPoint({lat:23.53358194444444,lng:73.48233395061727}) },              
];

module.exports = villages;

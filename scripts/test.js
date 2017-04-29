var loopback = require("loopback");

const villages = 
[
{id:12, name:"Dhadhiya", postcode:383350, coordinates:new loopback.GeoPoint({lat:73.44577496732028,lng:23.54868492320261}) },              
{id:13, name:"Navaghara", postcode:383350, coordinates:new loopback.GeoPoint({lat:73.77724637671498,lng:23.932004830724626}) },              
{id:14, name:"Ranjedi", postcode:383350, coordinates:new loopback.GeoPoint({lat:73.49123452380952,lng:23.56492182539683}) },              
{id:15, name:"Tarakvadiya", postcode:383350, coordinates:new loopback.GeoPoint({lat:73.45459886631943,lng:23.536290798611102}) },              
{id:16, name:"Valuna", postcode:383350, coordinates:new loopback.GeoPoint({lat:73.46966666666668,lng:23.535140277777774}) },              
{id:11, name:"Bhatkota", postcode:383350, coordinates:new loopback.GeoPoint({lat:73.48233395061727,lng:23.53358194444444}) },              
];

module.exports = villages;

var loopback = require("loopback");

const resources = 
[
{id:1111,geo:new loopback.GeoPoint({lat:23.5556388888889,lng:73.4458055555556}),last_value:0, last_date:0, villageId:11, owner:"Damor Limbabhai Kodarbhai", elevation:0, type:"well", postcode:383350, well_depth:30.5},            
{id:1112,geo:new loopback.GeoPoint({lat:23.5529444444444,lng:73.4440833333333}),last_value:0, last_date:0, villageId:11, owner:"Bhagora Mavjibhai Ramabhai", elevation:0, type:"well", postcode:383350, well_depth:14.45},            
{id:1113,geo:new loopback.GeoPoint({lat:23.55425,lng:73.4464722222222}),last_value:0, last_date:0, villageId:11, owner:"Kharadi Martabhai", elevation:0, type:"well", postcode:383350, well_depth:15.6},            
{id:1114,geo:new loopback.GeoPoint({lat:23.5519444444444,lng:73.44775}),last_value:0, last_date:0, villageId:11, owner:"Damor Vishrambhai Nanjibahi", elevation:0, type:"well", postcode:383350, well_depth:21.4},            
{id:1115,geo:new loopback.GeoPoint({lat:23.5506944444444,lng:73.4425}),last_value:0, last_date:0, villageId:11, owner:"Gameti Dhulabhai Surajibhai", elevation:0, type:"well", postcode:383350, well_depth:22.1},            
{id:1116,geo:new loopback.GeoPoint({lat:23.5469444444444,lng:73.4503888888889}),last_value:0, last_date:0, villageId:11, owner:"Bhagora Manubhai Dharmabhai", elevation:0, type:"well", postcode:383350, well_depth:23.65},            
{id:1117,geo:new loopback.GeoPoint({lat:23.5483333333333,lng:73.4488055555556}),last_value:0, last_date:0, villageId:11, owner:"Bhagora Lalubhai Lakshmanbhai", elevation:0, type:"well", postcode:383350, well_depth:22.5},            
{id:1118,geo:new loopback.GeoPoint({lat:23.5483055555556,lng:73.4436666666667}),last_value:0, last_date:0, villageId:11, owner:"Bhagora Santibhai", elevation:0, type:"well", postcode:383350, well_depth:17.75},            
{id:1119,geo:new loopback.GeoPoint({lat:23.54525,lng:73.4426944444444}),last_value:0, last_date:0, villageId:11, owner:"Pandor Savjibhai Ladubhai", elevation:0, type:"well", postcode:383350, well_depth:18.26},            
{id:1120,geo:new loopback.GeoPoint({lat:23.5453055555556,lng:73.4409444444444}),last_value:0, last_date:0, villageId:11, owner:"Pandor Govindkumar Jivanbhai", elevation:0, type:"well", postcode:383350, well_depth:17.24},            
{id:1121,geo:new loopback.GeoPoint({lat:23.5463333333333,lng:73.4430277777778}),last_value:0, last_date:0, villageId:11, owner:"Pandor Savjibhai Ladubhai", elevation:0, type:"well", postcode:383350, well_depth:20.0},            
{id:1122,geo:new loopback.GeoPoint({lat:23.5462777777778,lng:73.4446944444445}),last_value:0, last_date:0, villageId:11, owner:"Pandor Nathabhai Sanjabhai", elevation:0, type:"well", postcode:383350, well_depth:13.9},            
{id:1123,geo:new loopback.GeoPoint({lat:23.5450048055556,lng:73.4463916666667}),last_value:0, last_date:0, villageId:11, owner:"Bhagora Manibhai Lalubhai", elevation:0, type:"well", postcode:383350, well_depth:18.76},            
{id:1124,geo:new loopback.GeoPoint({lat:23.5451388888889,lng:73.4496666666667}),last_value:0, last_date:0, villageId:11, owner:"Parmar Kavabhai Motibhai", elevation:0, type:"well", postcode:383350, well_depth:18.2},            
{id:1125,geo:new loopback.GeoPoint({lat:23.5468888888889,lng:73.4494722222222}),last_value:0, last_date:0, villageId:11, owner:"Parmar Surjibhai Rupabhai", elevation:0, type:"well", postcode:383350, well_depth:16.0},            
{id:1126,geo:new loopback.GeoPoint({lat:23.5532777777778,lng:73.4503055555556}),last_value:0, last_date:0, villageId:11, owner:"Bhagora Pravinbhai Kamjibhai", elevation:0, type:"well", postcode:383350, well_depth:21.4},            
{id:1127,geo:new loopback.GeoPoint({lat:23.5451111111111,lng:73.441505}),last_value:0, last_date:0, villageId:11, owner:"Bhoi Jivabhai Sakrabhai", elevation:0, type:"well", postcode:383350, well_depth:19.9},            
{id:1211,geo:new loopback.GeoPoint({lat:23.9238888888889,lng:73.8313888888889}),last_value:0, last_date:0, villageId:12, owner:"Khokhar Kodarbhai Hirabhai", elevation:0, type:"well", postcode:383350, well_depth:18.5},            
{id:1212,geo:new loopback.GeoPoint({lat:23.9233333333333,lng:73.8291666666667}),last_value:0, last_date:0, villageId:12, owner:" Paradhi Dhulabhai Nagabhai", elevation:0, type:"well", postcode:383350, well_depth:17.7},            
{id:1213,geo:new loopback.GeoPoint({lat:23.9244444444444,lng:73.8252777777778}),last_value:0, last_date:0, villageId:12, owner:"Menat Chunnilal Kavabhai", elevation:0, type:"well", postcode:383350, well_depth:23.9},            
{id:1214,geo:new loopback.GeoPoint({lat:23.9280555555556,lng:73.8183333333333}),last_value:0, last_date:0, villageId:12, owner:"Sukhabhai Kalabhai Baranda", elevation:0, type:"well", postcode:383350, well_depth:22.7},            
{id:1215,geo:new loopback.GeoPoint({lat:23.42,lng:73.49111111}),last_value:0, last_date:0, villageId:12, owner:"Khokhariya Sanjabhai Hirabhai", elevation:0, type:"well", postcode:383350, well_depth:17.35},            
{id:1216,geo:new loopback.GeoPoint({lat:23.74694444,lng:73.68361111}),last_value:0, last_date:0, villageId:12, owner:"Sadat Vinodbhai Dharmabhai", elevation:0, type:"well", postcode:383350, well_depth:19.3},            
{id:1217,geo:new loopback.GeoPoint({lat:23.9230555555556,lng:73.8016666666667}),last_value:0, last_date:0, villageId:12, owner:"Doda Rameshbhai Thavarabhai", elevation:0, type:"well", postcode:383350, well_depth:23.6},            
{id:1218,geo:new loopback.GeoPoint({lat:23.9236111111111,lng:73.8105555555556}),last_value:0, last_date:0, villageId:12, owner:"Menant Sureshbhai Danabhai", elevation:0, type:"well", postcode:383350, well_depth:12.0},            
{id:1219,geo:new loopback.GeoPoint({lat:23.9258333333333,lng:73.7858333333333}),last_value:0, last_date:0, villageId:12, owner:"Tabiyad Sukabhai Babubhai", elevation:0, type:"well", postcode:383350, well_depth:28.86},            
{id:1220,geo:new loopback.GeoPoint({lat:24.9097222222222,lng:73.8058333333333}),last_value:0, last_date:0, villageId:12, owner:"Rathor Bharatsingh", elevation:0, type:"well", postcode:383350, well_depth:12.3},            
{id:1221,geo:new loopback.GeoPoint({lat:23.9183333333333,lng:73.7988888888889}),last_value:0, last_date:0, villageId:12, owner:"Paragi Kantibhai Somabhai", elevation:0, type:"well", postcode:383350, well_depth:11.48},            
{id:1222,geo:new loopback.GeoPoint({lat:23.9069444444444,lng:73.7913888888889}),last_value:0, last_date:0, villageId:12, owner:"Rathod Rameshsingh Balusingh", elevation:0, type:"well", postcode:383350, well_depth:14.0},            
{id:1223,geo:new loopback.GeoPoint({lat:23.9063888888889,lng:73.7836111111111}),last_value:0, last_date:0, villageId:12, owner:"Rathor Mulsingh Harisingh", elevation:0, type:"well", postcode:383350, well_depth:14.9},            
{id:1224,geo:new loopback.GeoPoint({lat:23.9202777777778,lng:73.7925}),last_value:0, last_date:0, villageId:12, owner:"Sadat Nanjibhai Sadubhai", elevation:0, type:"well", postcode:383350, well_depth:18.73},            
{id:1225,geo:new loopback.GeoPoint({lat:23.9066666666667,lng:73.7872222222222}),last_value:0, last_date:0, villageId:12, owner:"Rathor Madhusingh Vajesingh", elevation:0, type:"well", postcode:383350, well_depth:8.9},            
{id:1226,geo:new loopback.GeoPoint({lat:23.9175,lng:73.7808333333333}),last_value:0, last_date:0, villageId:12, owner:"Rot Suramabhai Rupabhai", elevation:0, type:"well", postcode:383350, well_depth:18.65},            
{id:1227,geo:new loopback.GeoPoint({lat:23.9072222222222,lng:73.7813888888889}),last_value:0, last_date:0, villageId:12, owner:"Rathor Anusingh Mansingh", elevation:0, type:"well", postcode:383350, well_depth:16.0},            
{id:1228,geo:new loopback.GeoPoint({lat:23.9161111111111,lng:73.7758333333333}),last_value:0, last_date:0, villageId:12, owner:"Dhirabhai Kevadabhai Sadat", elevation:0, type:"well", postcode:383350, well_depth:16.86},            
{id:1229,geo:new loopback.GeoPoint({lat:23.9183333333333,lng:73.7702777777778}),last_value:0, last_date:0, villageId:12, owner:"Rot Manabhai Manjibhai", elevation:0, type:"well", postcode:383350, well_depth:16.15},            
{id:1230,geo:new loopback.GeoPoint({lat:23.9177777777778,lng:73.7736111111111}),last_value:0, last_date:0, villageId:12, owner:"Asari Lakshamanbhai Kodarbhai", elevation:0, type:"well", postcode:383350, well_depth:18.22},            
{id:1231,geo:new loopback.GeoPoint({lat:23.9136111111111,lng:73.7672222222222}),last_value:0, last_date:0, villageId:12, owner:"Sadat Bachubhai Sadubhai", elevation:0, type:"well", postcode:383350, well_depth:34.25},            
{id:1232,geo:new loopback.GeoPoint({lat:23.9158333333333,lng:73.7625}),last_value:0, last_date:0, villageId:12, owner:"Katara Ramabhai Maratabhai", elevation:0, type:"well", postcode:383350, well_depth:15.65},            
{id:1233,geo:new loopback.GeoPoint({lat:23.9172222222222,lng:73.8244444444444}),last_value:0, last_date:0, villageId:12, owner:"Khokhariya Ramabhai Sojabhai", elevation:0, type:"well", postcode:383350, well_depth:22.6},            
{id:1234,geo:new loopback.GeoPoint({lat:23.9288888888889,lng:73.8355555555556}),last_value:0, last_date:0, villageId:12, owner:"Manubhai Hakasibhai Khokhariya", elevation:0, type:"well", postcode:383350, well_depth:24.3},            
{id:1311,geo:new loopback.GeoPoint({lat:23.5624166666667,lng:73.49475}),last_value:0, last_date:0, villageId:13, owner:"Menat Khatubhai Martabhai", elevation:0, type:"well", postcode:383350, well_depth:21.6},            
{id:1312,geo:new loopback.GeoPoint({lat:23.5612777777778,lng:73.4968055555556}),last_value:0, last_date:0, villageId:13, owner:"Tabiyad Surjibhai Kamabhai", elevation:0, type:"well", postcode:383350, well_depth:18.8},            
{id:1313,geo:new loopback.GeoPoint({lat:23.5597222222222,lng:73.4883333333333}),last_value:0, last_date:0, villageId:13, owner:"Ninama Kavjibhai Becharbhai", elevation:0, type:"well", postcode:383350, well_depth:19.24},            
{id:1314,geo:new loopback.GeoPoint({lat:23.5616472222222,lng:73.4883527777778}),last_value:0, last_date:0, villageId:13, owner:"Valjibhai Kalabhai Dodha", elevation:0, type:"well", postcode:383350, well_depth:19.55},            
{id:1315,geo:new loopback.GeoPoint({lat:23.563225,lng:73.4885583333333}),last_value:0, last_date:0, villageId:13, owner:"Martabhai Rupabhai Ninama", elevation:0, type:"well", postcode:383350, well_depth:18.7},            
{id:1316,geo:new loopback.GeoPoint({lat:23.5595555555556,lng:73.4870916666667}),last_value:0, last_date:0, villageId:13, owner:"Ninama Maganbhai Somabhai", elevation:0, type:"well", postcode:383350, well_depth:15.4},            
{id:1317,geo:new loopback.GeoPoint({lat:23.5587166666667,lng:73.4850444444444}),last_value:0, last_date:0, villageId:13, owner:"Ninama Laxmanbhai Jivabhai", elevation:0, type:"well", postcode:383350, well_depth:18.55},            
{id:1318,geo:new loopback.GeoPoint({lat:23.5565,lng:73.4825694444445}),last_value:0, last_date:0, villageId:13, owner:"Barda Galabhai Manglabhai", elevation:0, type:"well", postcode:383350, well_depth:18.53},            
{id:1319,geo:new loopback.GeoPoint({lat:23.5699722222222,lng:73.4965555555556}),last_value:0, last_date:0, villageId:13, owner:"Menat Navjibhai Kanabhai", elevation:0, type:"well", postcode:383350, well_depth:16.61},            
{id:1320,geo:new loopback.GeoPoint({lat:23.5705833333333,lng:73.4931666666667}),last_value:0, last_date:0, villageId:13, owner:"Menat Jashvantbhai Lalabhai", elevation:0, type:"well", postcode:383350, well_depth:23.6},            
{id:1321,geo:new loopback.GeoPoint({lat:23.5706388888889,lng:73.4898055555555}),last_value:0, last_date:0, villageId:13, owner:"Bhagora Badabhai Valabhai", elevation:0, type:"well", postcode:383350, well_depth:20.7},            
{id:1322,geo:new loopback.GeoPoint({lat:23.5744166666667,lng:73.4886388888889}),last_value:0, last_date:0, villageId:13, owner:"Bhagora Ramanbhai Thavrabhai", elevation:0, type:"well", postcode:383350, well_depth:17.8},            
{id:1323,geo:new loopback.GeoPoint({lat:23.5667222222222,lng:73.4878888888889}),last_value:0, last_date:0, villageId:13, owner:"Menat Babubhai Navjibhai", elevation:0, type:"well", postcode:383350, well_depth:17.73},            
{id:1324,geo:new loopback.GeoPoint({lat:23.5636583333333,lng:73.484725}),last_value:0, last_date:0, villageId:13, owner:"Rathor Ranusingh Hemsingh", elevation:0, type:"well", postcode:383350, well_depth:28.1},            
{id:1325,geo:new loopback.GeoPoint({lat:23.5686944444444,lng:73.4868055555555}),last_value:0, last_date:0, villageId:13, owner:"Katara Valjibhai Jivabhai", elevation:0, type:"well", postcode:383350, well_depth:20.0},            
{id:1326,geo:new loopback.GeoPoint({lat:23.5670555555556,lng:73.4921388888889}),last_value:0, last_date:0, villageId:13, owner:"Menat Surjibhai Sajabhai", elevation:0, type:"well", postcode:383350, well_depth:15.85},            
{id:1327,geo:new loopback.GeoPoint({lat:23.5644722222222,lng:73.49325}),last_value:0, last_date:0, villageId:13, owner:"Damor Jivrambhai Martabhai", elevation:0, type:"well", postcode:383350, well_depth:15.2},            
{id:1328,geo:new loopback.GeoPoint({lat:23.5591666666667,lng:73.4913888888889}),last_value:0, last_date:0, villageId:13, owner:"Shankarbhai Navjibhai", elevation:0, type:"well", postcode:383350, well_depth:38.1},            
{id:1329,geo:new loopback.GeoPoint({lat:23.5645277777778,lng:73.4950555555556}),last_value:0, last_date:0, villageId:13, owner:"Menat Dhulabhai Sakarabhai", elevation:0, type:"well", postcode:383350, well_depth:14.1},            
{id:1330,geo:new loopback.GeoPoint({lat:23.56675,lng:73.4965}),last_value:0, last_date:0, villageId:13, owner:"Damor Dhirabhai Valjibhai", elevation:0, type:"well", postcode:383350, well_depth:17.95},            
{id:1331,geo:new loopback.GeoPoint({lat:23.5653055555556,lng:73.5006944444444}),last_value:0, last_date:0, villageId:13, owner:"Damor Sajabhai Dhanabhai", elevation:0, type:"well", postcode:383350, well_depth:16.3},            
{id:1332,geo:new loopback.GeoPoint({lat:23.57075,lng:73.5025555555556}),last_value:0, last_date:0, villageId:13, owner:"Katara Pujabhai Somabhai", elevation:0, type:"well", postcode:383350, well_depth:12.1},            
{id:1411,geo:new loopback.GeoPoint({lat:23.5408333333333,lng:73.4472972222222}),last_value:0, last_date:0, villageId:14, owner:"Manjibhai Namabhai Dedor", elevation:0, type:"well", postcode:383350, well_depth:15.93},            
{id:1412,geo:new loopback.GeoPoint({lat:23.5406944444444,lng:73.4476611111111}),last_value:0, last_date:0, villageId:14, owner:"Surmabhai Amarabhai Dedor", elevation:0, type:"well", postcode:383350, well_depth:15.6},            
{id:1413,geo:new loopback.GeoPoint({lat:23.5410083333333,lng:73.4492}),last_value:0, last_date:0, villageId:14, owner:"Maganbhai Rupabhai Dedor", elevation:0, type:"well", postcode:383350, well_depth:14.55},            
{id:1414,geo:new loopback.GeoPoint({lat:23.5394777777778,lng:73.4497888888889}),last_value:0, last_date:0, villageId:14, owner:"Nathubhai Dhanjibhai Dedor", elevation:0, type:"well", postcode:383350, well_depth:21.2},            
{id:1415,geo:new loopback.GeoPoint({lat:23.5376861111111,lng:73.4503666666667}),last_value:0, last_date:0, villageId:14, owner:"Nanjibhai Sadubhai Dedor", elevation:0, type:"well", postcode:383350, well_depth:18.3},            
{id:1416,geo:new loopback.GeoPoint({lat:23.5293694444444,lng:73.4524444444444}),last_value:0, last_date:0, villageId:14, owner:"Harjibhai Lalabhai Dedor", elevation:0, type:"well", postcode:383350, well_depth:16.53},            
{id:1417,geo:new loopback.GeoPoint({lat:23.5341805555556,lng:73.4530277777778}),last_value:0, last_date:0, villageId:14, owner:"Nanjibhai Monghabhai Bamna", elevation:0, type:"well", postcode:383350, well_depth:22.42},            
{id:1418,geo:new loopback.GeoPoint({lat:23.5352972222222,lng:73.4508333333333}),last_value:0, last_date:0, villageId:14, owner:"Banabhai Ratnabhain Dedor", elevation:0, type:"well", postcode:383350, well_depth:18.16},            
{id:1419,geo:new loopback.GeoPoint({lat:23.5373611111111,lng:73.4539722222222}),last_value:0, last_date:0, villageId:14, owner:"Soms Savaji Dedor", elevation:0, type:"well", postcode:383350, well_depth:13.6},            
{id:1420,geo:new loopback.GeoPoint({lat:23.5394111111111,lng:73.4512388888889}),last_value:0, last_date:0, villageId:14, owner:"Jivabhai Hirabhai Dedor", elevation:0, type:"well", postcode:383350, well_depth:15.5},            
{id:1421,geo:new loopback.GeoPoint({lat:23.5255555555556,lng:73.4633333333333}),last_value:0, last_date:0, villageId:14, owner:"Chimanbhai Dhanjibhai Bhagora", elevation:0, type:"well", postcode:383350, well_depth:17.65},            
{id:1422,geo:new loopback.GeoPoint({lat:23.52925,lng:73.4579722222222}),last_value:0, last_date:0, villageId:14, owner:"Bamna Rupabhai Manabhai", elevation:0, type:"well", postcode:383350, well_depth:14.2},            
{id:1423,geo:new loopback.GeoPoint({lat:23.5341388888889,lng:73.4625}),last_value:0, last_date:0, villageId:14, owner:"Jivabhai Thavrabhai Dehan", elevation:0, type:"well", postcode:383350, well_depth:16.0},            
{id:1424,geo:new loopback.GeoPoint({lat:23.5367222222222,lng:73.4640277777778}),last_value:0, last_date:0, villageId:14, owner:"Bamna Bachar Sarubhai", elevation:0, type:"well", postcode:383350, well_depth:15.14},            
{id:1425,geo:new loopback.GeoPoint({lat:23.5378055555556,lng:73.4589763055556}),last_value:0, last_date:0, villageId:14, owner:"Bamna Ramanbhai Somabhai", elevation:0, type:"well", postcode:383350, well_depth:12.33},            
{id:1426,geo:new loopback.GeoPoint({lat:23.5412222222222,lng:73.4556111111111}),last_value:0, last_date:0, villageId:14, owner:"Surmabhai Suja Sadad", elevation:0, type:"well", postcode:383350, well_depth:28.9},            
{id:1427,geo:new loopback.GeoPoint({lat:23.5414722222222,lng:73.4526277777778}),last_value:0, last_date:0, villageId:14, owner:"Kodarbhai Jivabhai Bamna", elevation:0, type:"well", postcode:383350, well_depth:15.5},            
{id:1511,geo:new loopback.GeoPoint({lat:23.5326388888889,lng:73.4644444444444}),last_value:0, last_date:0, villageId:15, owner:"Nanabhai Dalabhai Bamaniya", elevation:0, type:"well", postcode:383350, well_depth:31.0},            
{id:1512,geo:new loopback.GeoPoint({lat:23.5323055555556,lng:73.4689722222222}),last_value:0, last_date:0, villageId:15, owner:"Pujabhai Salubhai Moga", elevation:0, type:"well", postcode:383350, well_depth:17.4},            
{id:1513,geo:new loopback.GeoPoint({lat:23.5368888888889,lng:73.4659166666667}),last_value:0, last_date:0, villageId:15, owner:"Bamaniya Balabhai Bhopabhai", elevation:0, type:"well", postcode:383350, well_depth:12.5},            
{id:1514,geo:new loopback.GeoPoint({lat:23.5359166666667,lng:73.4686944444444}),last_value:0, last_date:0, villageId:15, owner:"Gram Panchayat", elevation:0, type:"well", postcode:383350, well_depth:14.7},            
{id:1515,geo:new loopback.GeoPoint({lat:23.5348333333333,lng:73.4683055555556}),last_value:0, last_date:0, villageId:15, owner:"Khant Mohanbhai Dhirabhai", elevation:0, type:"well", postcode:383350, well_depth:17.0},            
{id:1516,geo:new loopback.GeoPoint({lat:23.5349,lng:73.4703333333333}),last_value:0, last_date:0, villageId:15, owner:"Pagi Bhemabhai Nathabhai", elevation:0, type:"well", postcode:383350, well_depth:15.4},            
{id:1517,geo:new loopback.GeoPoint({lat:23.5334444444444,lng:73.4730555555556}),last_value:0, last_date:0, villageId:15, owner:"Panchal Becharbhai Ramabhai", elevation:0, type:"well", postcode:383350, well_depth:16.56},            
{id:1518,geo:new loopback.GeoPoint({lat:23.5358333333333,lng:73.4720277777778}),last_value:0, last_date:0, villageId:15, owner:"Chamar Vinodbhai Mulabhai", elevation:0, type:"well", postcode:383350, well_depth:12.6},            
{id:1519,geo:new loopback.GeoPoint({lat:23.537,lng:73.4700277777778}),last_value:0, last_date:0, villageId:15, owner:"Bamaniya Virabhai Nathabhai", elevation:0, type:"well", postcode:383350, well_depth:12.25},            
{id:1611,geo:new loopback.GeoPoint({lat:23.531,lng:73.4744444444444}),last_value:0, last_date:0, villageId:16, owner:"JADEJA SANUSINH JEDHUSINH", elevation:0, type:"well", postcode:383350, well_depth:21.9},            
{id:1612,geo:new loopback.GeoPoint({lat:23.5313611111111,lng:73.4770277777778}),last_value:0, last_date:0, villageId:16, owner:"RAMABHAI MANABHAI TARAR", elevation:0, type:"well", postcode:383350, well_depth:18.2},            
{id:1613,geo:new loopback.GeoPoint({lat:23.5235833333333,lng:73.4780833333333}),last_value:0, last_date:0, villageId:16, owner:"TARAR JITENDRAKUMAR DHULABHAI", elevation:0, type:"well", postcode:383350, well_depth:12.3},            
{id:1614,geo:new loopback.GeoPoint({lat:23.5243611111111,lng:73.4820277777778}),last_value:0, last_date:0, villageId:16, owner:"JADEJA MUKESHSINH JETUSINGH", elevation:0, type:"well", postcode:383350, well_depth:12.5},            
{id:1615,geo:new loopback.GeoPoint({lat:23.5275277777778,lng:73.4903333333333}),last_value:0, last_date:0, villageId:16, owner:"Kalasava Dhanajibhai Savajibhai", elevation:0, type:"well", postcode:383350, well_depth:22.0},            
{id:1616,geo:new loopback.GeoPoint({lat:23.5263055555556,lng:73.489}),last_value:0, last_date:0, villageId:16, owner:"BHOI MANJIBHAI JAGNABHAI", elevation:0, type:"well", postcode:383350, well_depth:5.6},            
{id:1617,geo:new loopback.GeoPoint({lat:23.537,lng:73.4757777777778}),last_value:0, last_date:0, villageId:16, owner:"TARAR HIRABHAI KANABHAI", elevation:0, type:"well", postcode:383350, well_depth:11.45},            
{id:1618,geo:new loopback.GeoPoint({lat:23.5385,lng:73.4737222222222}),last_value:0, last_date:0, villageId:16, owner:"BHAGORA RATUBHAI DANJIBHAI", elevation:0, type:"well", postcode:383350, well_depth:21.2},            
{id:1619,geo:new loopback.GeoPoint({lat:23.5401388888889,lng:73.4791944444444}),last_value:0, last_date:0, villageId:16, owner:"BHAGORA SURMABHAI THAVRABHAI", elevation:0, type:"well", postcode:383350, well_depth:15.1},            
{id:1620,geo:new loopback.GeoPoint({lat:23.5406944444444,lng:73.4826666666667}),last_value:0, last_date:0, villageId:16, owner:"KATARA SAFABHAI DHULABHAI", elevation:0, type:"well", postcode:383350, well_depth:16.0},            
{id:1621,geo:new loopback.GeoPoint({lat:23.5416111111111,lng:73.4850277777778}),last_value:0, last_date:0, villageId:16, owner:"PUNABHAI BADABHAI", elevation:0, type:"well", postcode:383350, well_depth:25.14},            
{id:1622,geo:new loopback.GeoPoint({lat:23.5353055555556,lng:73.4800277777778}),last_value:0, last_date:0, villageId:16, owner:"CHAMAR NATHABHAI MANABHAI", elevation:0, type:"well", postcode:383350, well_depth:22.44},            
{id:1623,geo:new loopback.GeoPoint({lat:23.5346111111111,lng:73.4815555555556}),last_value:0, last_date:0, villageId:16, owner:"CHAMAR KACHARABHAI GALABHAI", elevation:0, type:"well", postcode:383350, well_depth:18.25},            
{id:1624,geo:new loopback.GeoPoint({lat:23.5333027777778,lng:73.4841027777778}),last_value:0, last_date:0, villageId:16, owner:"KANTIBHAI LALABHAI", elevation:0, type:"well", postcode:383350, well_depth:18.2},            
{id:1625,geo:new loopback.GeoPoint({lat:23.5308888888889,lng:73.4815833333333}),last_value:0, last_date:0, villageId:16, owner:"MARIVAD JETHABHAI NANABHAI", elevation:0, type:"well", postcode:383350, well_depth:19.88},            
{id:1626,geo:new loopback.GeoPoint({lat:23.5307722222222,lng:73.4873277777778}),last_value:0, last_date:0, villageId:16, owner:"MARIVAD MAGANBHAI KALABHAI", elevation:0, type:"well", postcode:383350, well_depth:13.5},            
{id:1627,geo:new loopback.GeoPoint({lat:23.5419166666667,lng:73.4876111111111}),last_value:0, last_date:0, villageId:16, owner:"DAMOR MANIBEN HARJIBHAI", elevation:0, type:"well", postcode:383350, well_depth:18.2},            
{id:1628,geo:new loopback.GeoPoint({lat:23.5390944444444,lng:73.4833861111111}),last_value:0, last_date:0, villageId:16, owner:"KAHARA SAJABHAI KALABHAI", elevation:0, type:"well", postcode:383350, well_depth:18.34},            
{id:1629,geo:new loopback.GeoPoint({lat:23.5275,lng:73.4835555555556}),last_value:0, last_date:0, villageId:16, owner:"DABHI SIVAJI KHUMAJI", elevation:0, type:"well", postcode:383350, well_depth:17.0},            
];

module.exports = resources;

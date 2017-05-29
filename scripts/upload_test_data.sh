24.62322153680352,
      "lng": 74.13559198379518


#Village:

curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d "{
 \"id\":11,
  \"name\": \"Demo Village\",
  \"postcode\": 333333,
  \"coordinates\": {
    \"lat\": 24.62322153690,
    \"lng\": 74.135691982
  }
}
" "https://mywell-server.marvi.org.in/api/villages?access_token=O03DlocqsR2am6xwcWUrfhxSXsj1pZ6Jx59UIies8Tqhl6lIxwWLxho88WEAL5m1&access_token=O03DlocqsR2am6xwcWUrfhxSXsj1pZ6Jx59UIies8Tqhl6lIxwWLxho88WEAL5m1"


{
  "id": 1112,
  "geo": {
    "lat": 24.62392153690,
    "lng": 74.131691982
  },
  "last_value": 0,
  "well_depth": 35.34,
  "last_date": "2016-05-11 03:04:59",
  "owner": "Basant Ji",
  "elevation": 0,
  "type": "well",
  "postcode": 333333,
  "villageId": 11,
  "villageId,postcode": 0
}

{
  "id": 1113,
  "geo": {
    "lat": 24.61392153690,
    "lng": 74.139991982
  },
  "last_value": 0,
  "well_depth": 0,
  "last_date": "2016-05-11 03:04:59",
  "owner": "Basant Ji",
  "elevation": 0,
  "type": "checkdam",
  "postcode": 333333,
  "villageId": 11,
  "villageId,postcode": 0
}

{
  "id": 1113,
  "geo": {
    "lat": 24.61492153690,
    "lng": 74.11231982
  },
  "last_value": 0,
  "well_depth": 0,
  "last_date": "2016-05-11 03:04:59",
  "owner": "Basant Ji",
  "elevation": 0,
  "type": "raingauge",
  "postcode": 333333,
  "villageId": 11,
  "villageId,postcode": 0
}





curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d "{
  \"id\": 1112,
  \"geo\": {
    \"lat\": 24.62392153690,
    \"lng\": 74.131691982
  },
  \"last_value\": 0,
  \"well_depth\": 35.34,
  \"last_date\": \"2016-05-11 03:04:59\",
  \"owner\": \"Basant Ji\",
  \"elevation\": 0,
  \"type\": \"well\",
  \"postcode\": 333333,
  \"villageId\": 11,
  \"villageId,postcode\": 0
}" "https://mywell-server.marvi.org.in/api/resources?access_token=O03DlocqsR2am6xwcWUrfhxSXsj1pZ6Jx59UIies8Tqhl6lIxwWLxho88WEAL5m1&access_token=O03DlocqsR2am6xwcWUrfhxSXsj1pZ6Jx59UIies8Tqhl6lIxwWLxho88WEAL5m1"

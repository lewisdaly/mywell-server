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

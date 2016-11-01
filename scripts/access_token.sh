#! /bin/bash
curl -# -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 39606c3a-fa33-b5db-67af-cd5fb6175acc" -d '  {"username":"marvi", "password":"MARVI1!"}' "http://docker.local:3000/api/Users/login" | awk -F\" '{print $4}'

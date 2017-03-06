S12


#TODO:
1. run on Android
2. Work on picture upload


Bugs (android)
- Access token on more page
- cannot scroll on report view
- new well cannot scroll (doesn't fit in page)
- lat lng getting cut off
- Only display "download a template" on desktop
- loading more view is too slow (network I think)
- maps not loading (especially when clicking on well)


Run locally on android
```
gulp replace --env prod #just once really
gulp babel && ionic run android
```

Today's Sprint
- overhaul map detail view for resource
  - redo layout
  - add picture endpoint
  - new graphs

- map detail view for village
  - village and postcode average graphs

  - features
    - Update with recent data
    - ensure backups are working, upload to s3
    - export feature - download all data as excel
    - well picture banner
    - well upload picture
    - correcting data error - overwrite?
    - pin code on startup
    - set language and pin code in settings
    - settings icon
    - Android build and submission (signing key is on old mac!!!)

  - slides
  - paper (end of day)
  - brochure
  - postcard




  Tomorrow morning:
  -  code

  Tomorrow Arvo:
  - Work on paper


fun idea:?
http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6


Stretch:
- fix location finding - insecure origins
  https:
  https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04

- first time open - put in postcode
  - every other open, navigate to that postcode



TODO: get in touch with Peter
**New Version - 12th of March**

Trip 6th of 7th of March





Front End

- fix well detail view:
  - change charts
    - weekly readings
      - average of the week?
      - or specify monday as the start of the week, finishes on sunday
- Translations
  - Add language button to top bar
  - replace all strings with Translations
  - actually get translations
- finish getting codepush working

Back End:
- Get readings in format for charts
  - use actual daily readings?
- save backups to s3
- update resource stats scripts to get and calculate resourceType
- Use HTTPS? to fix location bug
- Separate CircleCI for front end and backend
  - CircleCI deployments to codepush!

Other?
- My Water quality

Paper
  - update new architecture
  - add ideas about mycheckdam etc
  - send to basant
  - what can people learn who are tackling a similar issue:
    - what does it mean
    - what can others learn from this


- Overhaul running environments
  - we should be able to configure for dev or staging based on ENVIRONMENT variables, not replacing files


- F: confirm template with Basant
- B: add method to recalculate old stats after upload


Stretch goals:
 - add better server side validation to adding resource (right now duplicate entries cause a 500 error)
 - CI, automated builds and deployments


All tasks:
- adding stats
  - TODO: add resource type into stats, so we can differentiate between rain, wells and dams

- SMS
  - village based query
  - historical query


- Maps
  - improve map, add place names and even watersheds?

- improve add well functions
  - allow dragging map to update location

- add SMS query guide to settings

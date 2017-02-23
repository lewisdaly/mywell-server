#TODO:

Today's Sprint
- overhaul add well feature
  - make max height not required for dam, rain gauge
  - fix location finding - insecure origins
  - validate id better (4 digits)
  - move map/select map to get lat/lng
  - enter postcode to move map


popups:
- battery vertical for well

- first time open - put in postcode
  - every other open, navigate to that postcode

- Add village name to map
  - click on village to get village average and postcode


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

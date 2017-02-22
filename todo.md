#TODO:

Today's Sprint
- Finish june first
- Popup feature
- seed test database
- start looking at translations


Front End
- overhaul popups for rain gauges and checkdams
- overhaul add well feature
  - make max height not required for dam, rain gauge
  - fix location finding- insecure origins
  - validate id better (4 digits)
- fix well detail view:
  - change title from well to resourceType
  - change charts
- Translations
  - Add language button to top bar
  - replace all strings with Translations
  - actually get translations
- finish getting codepush working

Back End:
- Change in height from 1st of June (end of summer)
- test stubs/separate seed data (maybe just export the current database for the test data!)
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

Priorities
- 1-4


- Overhaul running environments
  - we should be able to configure for dev or staging based on ENVIRONMENT variables, not replacing files


- Test should really use their own DB
- F: confirm template with Basant
- B: add method to recalculate old stats after upload


Today:
- Fix icons, move to popup

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

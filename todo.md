#TODO:

Today's Sprint
- Add village name popups/headings
  - migration to get village center lat lng

- map detail view for village
  - village and postcode average
- popup for village?
- vertical battery for well



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

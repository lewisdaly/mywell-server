#TODO:

Backlog:
- use codepush
- save backups to s3


1. Change in height from 1st of June (end of summer)
  - almost done!

1.1
- update resource stats scripts to get and calculate resourceType

- extending graph features
    - highcharts - http://www.highcharts.com/download
    - use actual readings, not monthly averages - but I thought readings were once a month?!
- Separate Apps:
    - use selector at top instead
    - My Water quality
- Paper
    - update new architecture
    - add ideas about mycheckdam etc
    - send to basant
- Translations
    - library

Priorities
- 1-4


- Overhaul running environments
  - we should be able to configure for dev or staging based on ENVIRONMENT variables, not replacing files


Excel/CSV uploading feature:

- Proper Database backups - we should save these somewhere else probably...
  - can do a cron job, that pushes to Digital Ocean storage?
- Fix deployment,
- Test should really use their own DB
- F: confirm template with Basant
- F: remove js folder, change to .build, and ignore
- B: add method to recalculate old stats after upload


Today:
- Fix icons, move to popup

Stretch goals:
 - add better server side validation to adding resource (right now duplicate entries cause a 500 error)
 - CI, automated builds and deployments
 - Make a database backup script, run as a cron job


All tasks:
- adding stats
  - TODO: add resource type into stats, so we can differentiate between rain, wells and dams

- SMS
  - reply using W2M (need credits)
  - village based query
  - historical query


- Maps
  - improve map, add place names and even watersheds?
  - offline maps - wont do


- improve add well functions
  - allow dragging map to update location
  - add depth to fields

- add SMS query guide to settings


Goals by 19/11:

SMS:
  - ensure reply works
  - Submit
  - Receive
App:
- offline features
  - offline maps - won't do

Future:
- excel upload

# mywell-server

Proposed Database Schema:

RESOURCE
@id
geo {lat, lng}
last_value
village_id@
owner
type [well, rain_gauge, etc.]
elevation 

READING
@res_id
@date
value

VILLAGE
@id
name
postcode

#this could be lazily calculated and saved - only when requested!
#the only issue is that past months can technically be modified...
#TODO: worry about this later
MONTHLY_AVERAGE
@village_id
@date (to closest month)
well_value
rain_value

USER
id
verified
token
service [facebook, google]

SMS_HISTORY
@id
date
message
number


to get wells:
select * from resource where type="well"
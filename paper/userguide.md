# MyWell User Guide
**MyWell Version 2.1**

MyWell is a Smartphone and SMS app for tracking wells in MARVI. The app works by crowdsourcing well, rainfall and checkdam readings from MARVI's network of BJs. MyWell displays the current status of each well, as well as historical and village level data for simple comparison and analysis.

## Contents

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [MyWell User Guide](#mywell-user-guide)
	- [Contents](#contents)
	- [MyWell App](#mywell-app)
		- [The Map View](#the-map-view)
			- [Map Detail](#map-detail)
			- [Statistics](#statistics)
			- [Reading Graphs](#reading-graphs)
		- [Recording](#recording)
			- [Logging in](#logging-in)
			- [Saving a Reading](#saving-a-reading)
			- [Offline readings](#offline-readings)
			- [Bulk Upload (Web only)](#bulk-upload-web-only)
		- [MyWell Settings](#mywell-settings)
			- [Register a new Resource](#register-a-new-resource)
			- [Update a resource's photo (App only)](#update-a-resources-photo-app-only)
			- [Other](#other)
	- [MyWell SMS](#mywell-sms)
		- [Recording a new Reading](#recording-a-new-reading)
			- [Examples](#examples)
		- [Query MyWell for Information](#query-mywell-for-information)
			- [Example](#example)
		- [MyWell SMS Screenshots](#mywell-sms-screenshots)

<!-- /TOC -->
## MyWell App
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### The Map View
From the map view, you can see all of the different wells, checkdams and rainfall stations that are being monitored in MyWell.

A resource is one of these wells, checkdams or rainfall stations. They each have different icons:
[image-1-icons]

Click on a resource to find out more information.
[image-2-map-popup]

#### Map Detail
From the popup window of a resource, click 'More' to find out more about this Well, Checkdam or Rainfall Station.

[image-3-map-detail]

This page shows the resource's Photo, some statistics at a glance, and a graph of it's readings.

#### Statistics
Current reading
For Wells this is Depth to Water Table, rainfall stations have
The average shows the current average watertable depth
//TODO: more

#### Reading Graphs

[image-4-reading-graphs]
The reading graphs show a snapshot of 1 month, 3 month and 1 year long intervals. They show the data collected over the last 3 years, and allow for easy comparison from one year to the next


### Recording
It's easy to record a new reading using MyWell.
[image-5-recording-overview]

#### Logging in
First time users will need to log in, using the login button on the top right hand corner.
[image-6-login-button]

From this page, enter the login code that you were provided.
[image-7-login-page]

#### Saving a Reading
Steps:
1. Select the type of reading to be recorded
[image-8-reading-selection]
2. Enter in the postcode, date, ResourceId of the reading
[image-9-reading-values]
3. Fill in any values specific to your reading. For wells, this is WaterTable depth, in metres
4. Click submit, and your reading will be saved

#### Offline readings
If you don't have internet connectivity, your readings will be saved for a later date.
You will see them in a queue below the submit button.
[image-10-offline-submission]

#### Bulk Upload (Web only)
If you want to upload many readings at once, you can drag and drop an excel file here:
[image-11-drag and drop]
Download a template for an example of a correct file from the settings page:
[image-12-download-template]

### MyWell Settings
From this page, you can register a new resource, update a resource's image, and find out more information about MyWell. You must be logged in to make any of these changes.

[image-13-mywell-settings]

#### Register a new Resource
1. From the settings page, tap 'Register a new Well, Rain Gauge or Checkdam'
[image-14-register-resource]
2. Drag around on the map, or use  your device's location to set the latitude and longitude of the new resource
3. Enter the pin code, well owner, and the designated Id for the resource.
4. Select what type of resource you are creating, and fill out any more necessary fields
[image-15-register-dropdown]
5. Hit 'save'. If everything has been filled out correctly, it will add a new resource.

#### Update a resource's photo (App only)
1. From the settings page, tap 'Change an Image'
[image-15-change-image-popup]
2. Enter the Pin code & Id of the resource you want to Change
3. Take a photo and hit 'save'. The photo will be updated

#### Other
You can also download all of the readings in mywell's database as an excel file, and download an example template for bulk uploading many readings at once.

## MyWell SMS
Two of the key MyWell tools are available over SMS as well as through the MyWell app; Recording a new reading, and querying a Well, Checkdam or Raingauge for information

MyWell's SMS number is '90000000', and messages to MyWell SMS all start with the same format:
```
SMA <code> <pincode>
```
Where `<code>` is 000 for saving a reading, and 999 for requesting information,
and   `<pincode>` is the pincode that the Well, Checkdam or Rain Gauge is located in.

### Recording a new Reading
A Recording takes 3 additional parameters:
```
<date> <resourceId> <reading>
```
Where `<date>` is a 6 digit date that the reading has been taken, in format YYMMDD,
and `<resourceId>` is the 4 digit id of the resource being recorded,
and `<reading>` is the value of the reading, in cm

#### Examples
```
SMA 000 313603 170125 1501 1500 # update resource 1501 to a reading of 1500cm in village with pincode 313603, on the 25th of Jan, 2017
```

### Query MyWell for Information
A Query takes 1 additional parameter:
```
<id>
```
where `<id>` is the 2 digit villageId, or the 4 digit resourceId

#### Example
```
SMA 999 313603 15                #Query information from village 15 in pincode 313603
SMA 999 313603 1560              #Query information from resource 1560 in pincode 313603
```

### MyWell SMS Screenshots






# Abstract

# MyWell App
*From here onward, the text needs to be updated – summary of the earlier development, why and how we changed to the new version.*

MyWell is a Smartphone and SMS application for tracking well readings in project MARVI. The app crowdsources Well, Checkdam and Rainfall readings from BJs, and displays the current status of each Well, Rainfall Station and Checkdam, as well as historical and village level data for simple comparison and analysis.

**Figure 2**

## Features
MyWell's is available on Android and iOS smartphones in the form of an app, and also to browsers as a web application. For users with feature phones, MyWell's basic tools and analysis are also available over SMS. When a BJ takes a well reading, they can record it directly using the MyWell app - submitting the date, Well Id, and the depth to water level of the well.

With MARVI's network of BJs collecting data, MyWell is able to provide valuable insights to villagers. MyWell displays simple graphs; snapshots of the readings from a Well, Raingauge or Checkdam over the last 3 years.  MyWell also calculates village level statistics. These tools allow villagers to easily compare and benchmark their wells against each other, and previous years.

MyWell also has a host of tools for BJs to manage the MyWell system. BJs can register a new Well, Rainfall Station or Checkdam - using their device's inbuilt GPS to pinpoint the location. Each well also has a unique Banner Image - usually of the well and well's owner -  allowing for greater personalisation and buy-in from farmers.

Finally, MyWell allows administrators to upload a large number of readings at a time. This allows an import of large amounts of historical data; increasing the immediate value of MyWell to the farmers.

**Figure 4.**
*TODO: integrate this section better*

Users can also query MyWell over SMS, for some basic data analytics. Each well and village has a unique ID, and using these ID’s, users can query at a village or well level. For a well query, a user can send a text message of the format “SMA 999 POSTCODE WELL_ID “. MyWell will process this message and reply with the current watertable depth, last month’s watertable depth, and last year’s watertable depth. To get an average for a village, a user can send a query with the format “SMA 999 POSTCODE VILLAGE_ID”. This will return the same current, month, and last year measures, using the average of all wells within the requested village.

### MyWell Mobile
Similar to the SMS submissions, a user fills out a form on the MyWell app to submit a well level. Since this is on a smartphone, MyWell performs a number of checks to ensure a valid message before the message can be sent to the server. This submission is then processed in a similar manner on MyWell server, and a message thanking the user for submitting is displayed.
Users can query MyWell for well readings from the heatmap on the opening page of MyWell. The heatmap displays the current well readings for all wells within the MyWell database. Upon clicking on a well, a popup showing the well information is displayed to the user. Village- level analytics are displayed above the heat map. As the user scrolls through the heatmap, the closest village to their current position is found, and the village name updates in the button above the heatmap. Upon clicking on this button, the village-level analytics are loaded and displayed to the user.

**Figure 5**

As MyWell is publicly available, an extra layer of user verification is required, to ensure the integrity of the data being reported. User sign on is handled through Facebook or Google, and once a user has signed up for MyWell, they must be verified before they can submit well readings. An already verified user can see and verify new users, allowing for self-management of the MyWell network.

MyWell also deals with a number of constraints that are unique to the areas of low income countries, such as technology. Mobile coverage, especially mobile data coverage is still limited in many parts of rural India, with 3G coverage reaching 75% of the population (GMSA, 2015). Also, smartphone uptake in these communities is small. In 2015, only 29.8% of all Indian mobile phone users had a smartphone (Statista, 2016). In order for MyWell as a platform to have the reach required, it needs to exist as a smartphone application and SMS application.


# MyWell Architecture

**Figure 3.**

MyWell's architecture can be divided into a backend/client model. The client is the application running on the users device - be that the Android, Web browser or SMS chat interface - and the backend is the collection of services that handle the data processing, storage and delivery. These services are the MyWell Database, SMS Gateway, MyWell UI and MyWell server (confusingly).

##Client

### MyWell Mobile & Web Applications
MyWell Mobile is a cross platform HTML5-based mobile app. It was built using Ionic, a framework for building mobile applications for iOS and Android from web apps. This enabled development of both iOS and Android simultaneously, simplifying the development and testing process. Ionic combines the AngularJS web framework with Apache Cordova, an open source tool for integrating web apps with mobile devices. MyWell also uses Google Maps for visualizing wells on a heatmap. It integrates with MyWell server using the Azure MBaaS API to process well updates, as well as user registration and verification.

### MyWell SMS
First, a BJ or farmer takes a reading from a well in the MyWell system. They then send a text message in the format: "SMA 000 WellID DATE WT_DEPTH" to the virtual mobile number. The virtual number provider (Way2Mint) then forwards this message onto MyWell server in the cloud for processing. The message is then processed, and provided it passes a validation check, will be used to update the MyWell database. A reply is sent to the virtual number provider using a HTTP request. The virtual number provider then sends this message onto the user, letting them know that their submission was successful. Should there be an error in the message, the user is informed that they need to fix the error in the message and try again.


##Backend
MyWell's backend is built using a Microservices approach. This means dividing the individual components into smaller services which perform 1 job each. The goal of a microservices approach is to ensure reliable, scalabe and overall maintainable system. We used Docker, a containerization platform in order to manage each service in the backend.

### SMS Gateway
The SMS gateway acts as the middle-layer between the BJ submitting the query over SMS and MyWell Server. It is a critical part of MyWell, as allows for MyWell to receive SMS messages. It receives text messages from farmers and BJ’s, and converts them to HTTP requests. These requests have number and message parameters, allowing MyWell server to parse the message from the BJ, and reply to the mobile number that sent the message. The SMS gateway also receives replies from MyWell as HTTP requests, and converts them back to SMS messages, enabling MyWell to reply to a message.

### MyWell Server
- Built using Node.js
Its primary function is to receive and process HTTP requests from both the SMS gateway, and MyWell mobile app. Upon receiving these requests, it processes them, and connects to the database, allowing users to query and update the well levels.
- handles login and user authentication

### MyWell UI
- Also node.js

### MyWell Database
- MariaDB database
- relational database, stores well data across x tables
- able to scale and stuff

### Hosting
- Backend is hosted in DigitalOcean droplet
- managed using docker compose
- Uses continuous integration with CircleCI


# Approach

## Implementation Journey

This project was managed using agile software development principles. The basic functionality was built, and new features were added to MyWell one at a time, each in complete and working stages.

### Version 0:
- The initial efforts were by Romin Parek, Constantin Baumgartner and James Laney.
- They designed and implemented the first version of MyWell, which focused on the SMS component.
- This version was a Node.js server running at CMU-A, which received HTTP requests from the SMS Gateway. Messages could be received by the system, and were written to a text file. This text file was then imported into SQLite, an in-memory database, with a simple, single table structure. This version also contained a small website, which displayed the heatmap visualization of the wells in the system.

### Version 1:
- Added mobile app component
- Used Azure MBaaS to build out the backend
After this initial version was built, the project scope was expanded, with a focus on replying to users over SMS with basic analysis measures, and a mobile app component. The primary goal of the mobile app was for administrators to be able to see the system as a whole. Functionality from MyWell SMS, such as being able to submit well readings was transferred into MyWell mobile. Once this was done, this app would be public to anyone, and some security measures were put in place; through the login and verification of users.

### Version 2:
- Moved to Microservices approach on Docker
  - Primary motivation was cost & extensibility
  - Issue with cloud services such as MBaaS is vendor lock in - moving to microservices on docker allows us to pick up and move MyWell quite easily
  - Also didn't need many of the
- Expanded app to handle Checkdams and Rainfall Stations
- More features around management, bulk uploads, register new wells
- resource detail
  - More stats
  - Historical charts over the last 3 years
  - Well images - helping personalisation of wells


## Testing & Evaluation
**We will include feedback from the workshop evaluation of the MyWell.**

While there have been some limited field tests, MyWell is yet to receive full scale testing. The first tests revealed the querying system to be effective, but some issues were uncovered with MyWell Mobile in areas of low mobile data coverage. The initial results looked promising, with MyWell SMS and Mobile fully operational. A full scale test is planned in the next few months, and will involve three components, training, testing on a small subset of wells, and scaling up to more wells.

## What’s Happened
Limited field tests on both MyWell SMS and Mobile were conducted. These tests involved travelling to two different wells, and attempting to query the history of each well, and submit the current level of each well over SMS and mobile. An example case of submitting a well level over SMS is demonstrated below.

After well data were successfully submitted over MyWell, MyWell mobile was also tested to ensure that the visualisations were also updated, and correct.

**Figure 6.**

## Initial Results
These limited field tests revealed that MyWell worked successfully, with a few areas for improvement. While MyWell SMS functioned as expected, MyWell Mobile encountered issues when mobile data coverage was limited. Google Maps, the mapping platform used for the visualisations in MyWell Mobile, doesn’t allow for offline access to maps. This meant that when there was no or unreliable data coverage, Google Maps failed to load, and stopped the entire application from working. Related to this is the issue of data usage. Google Maps downloads maps for the current area every time MyWell opens. This wastes valuable data, and is something that will need to be addressed in future versions of MyWell.
Potential issues were also encountered over the translation of MyWell. Currently, MyWell exists in English, which will decrease the utility of the app, as most BJ’s and the MARVI farmers speak mainly Hindi or Gujarati. This is also something that will need to be addressed in the future.
MyWell SMS started with a small set of text-based queries. As features have been added to MyWell, the complexity of the queries has also grown. Testing revealed that erroneous SMS messages resulted in no response to the user. MyWell SMS will need a more robust system for handling errors. This system could reply to a user if their query doesn’t make sense, or even attempt to auto-correct the query before processing.
Despite some minor issues, the initial results show MyWell to be fully functional; users can update wells over SMS and MyWell mobile. These changes are reflected almost instantly in the mobile heat map, which can be found at watervisualizationmobile.azurewebsites.net, or on MyWell mobile. The system for querying data was also tested for both the SMS and mobile application, and found to be working, as shown below

**Figure 7.**

**Figure 8**

## Full Scale Testing
Larger scale tests for MyWell are planned over the next three months. These tests will involve BJ’s from a number of villages. Before conducting these tests, the BJ’s must first be trained in using MyWell SMS. To aid this training, an SMS Query guide is currently being written to explain the functions and query formats of MyWell SMS. Once the BJ’s use MyWell for a number of weeks, the data collected will be analysed for accuracy, and the BJ’s will be interviewed to find any difficulties they encountered, and receive general feedback. After this stage, should there be no major flaws found, MyWell will be scaled up to the entire MARVI study areas in Gujarat and Rajasthan.

## MyWell Benefits
MyWell is an example of crowdsourcing citizen science, made to address the needs of farmers in rural India and project MARVI. It builds on previous applications of crowdsourcing citizen science, to fit the requirements of MARVI. It also has potential as a data collection and processing platform, with a focus on data collection in low income countries.

Similar to IBM's Creekwatch, MyWell uses a mobile app for data collection, with a map-based visualisation on the web. However, Creekwatch collects qualitative data such as images and text, while MyWell focuses on quantitative data.

The SMS based aspect to MyWell is also similar to Social.Water. Fienen notes that in the US, using SMS lowers the barriers to entry for the platform (Lowry and Fienen, 2012). In India, where data coverage is low, and smartphones are not as popular (GSMA, 2016) Statista, 2016) this is even more the case. Using both SMS and mobile app, MyWell can have the advantage of providing advanced features to those users with smartphones, while keeping the platform accessible for all. MyWell SMS also focuses information dissemination, while Social.Water is purely a means for data collection.

MyWell is unique from the above examples, as it was built with an application for data collection in a low income country. Like Agro-Met and NEERI’s water monitoring project, MyWell must work within the technology constraints, such as limited access to mobile data and language constraints (an area of improvement for MyWell. For this reason, MyWell was built with a focus on both SMS data collection, and data collection from a smartphone app.

One of the key values of MyWell is its ability to remove the need for paper-based data collection and allow a distributed, self-organised network of data collection; lowering the barriers of entry into citizen science. MyWell can minimise the manual data entry requirements of MARVI, and reduce the time demand, and errors associated with manual data entry.  Additionally, MyWell is much more ready to scale than paper-based data collection; MyWell server is configured to increase the supply of computing resources as the demand increases, something that cannot happen with manual entry.

MyWell is currently being used for groundwater data collection and information dissemination, but also has potential for other applications, especially in low income countries. The three main components; (1) data collection and processing, (2) basic analytics and (3), user verification are common to many different data collection applications, and could easily be adapted and extended for other purposes. The combination of SMS and mobile app allow it to reach a wide audience, especially in countries or situations where mobile data is limited. MyWell also has robust authentication and administration tools to protect the integrity of the data being collected, while allowing public access to the information collected.








#OLD:

MyWell has two clients, MyWell SMS and MyWell Mobile. Both clients share the same server and database. The server is a Node.js server, written in JavaScript, running on Microsoft Azure Mobile Backend as a Service (MBaaS). MBaaS abstracts away many aspects of traditional web servers, streamlining the maintenance and upkeep of MyWell. MBaaS provides important features, such as autoscaling, user authentication and database management. In addition, Microsoft Azure MSSQL Database is used for storing all of the MyWell relational data. MyWell also benefits from Azure’s 95.95% uptime guarantee, making the system reliable.



The MyWell Database is a MSSQL database, hosted on Microsoft’s Azure cloud. It is a relational database, containing 5 tables for storing all of the MyWell data, including well levels, user information, and historical data. As it is hosted on Azure, it is highly scalable, and is capable of handling thousands of well entries.


### Azure MBaaS
Both the MyWell Database and MyWell Server are managed through Microsoft Azure Mobile Backend as a Service (MBaaS). MBaaS adds another layer of abstraction to hosting and managing the server and database, simplifying the overall development and hosting process. MBaaS has a number of API’s, simplifying integration between MyWell Mobile and MyWell Server. Since it is hosted on Azure, it also has a 99.95% availability guarantee, and benefits from autoscaling and continuous integration (Microsoft Azure, 2015).
MyWell server and database also benefit from the autoscaling features of Azure. Autoscaling is when the supply of computing resources is configured to automatically change to match the demand on the system. As MyWell scales, and the MyWell network grows, more farmers are using MyWell to track their wells, and more BJ’s are submitting well levels on a regular basis. This puts more demand on MyWell server resources. Azure MBaaS will automatically scale the number of servers to match the needs of the system, allowing MyWell to grow without constant monitoring and manual adjustment of computing resources.

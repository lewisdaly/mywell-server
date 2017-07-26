# mywell-gql


MyWell is a serverless GraphQL middleware for MyWell.

The goal of this sub project is to build a layer of abstraction between MyWell Server and MyWell UI, so we can move away from AngularJS/Ionic on the front end, and eventually work towards replacing Loopback on the server.

## MyWell Stats

Initially, this project will serve as a read-only endpoint for connecting (directly?) with MySQL for extracting data and statistics from the MyWell Platform.

Loopback is unsuited for this task, as it requires semi-complicated SQL queries, which

## MyWell Admin & MyWell Collect

The goal will be to extend this middleware for any new front end's built upon MyWell, such as administrative tools, and other data collection platforms. Having a GraphQL middleware will also help us integrate across platforms .


## Roadmap

We will start by writing mywell-gql locally using docker containers. Eventually we will deploy mywell-gql using the serverless platform, which will require some work on the deployment tools

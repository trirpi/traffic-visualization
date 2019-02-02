# Real-time traffic visualisation

The government of Belgium has real-time data about the traffic in Belgium. This project will provide an api to make the data more compact. It will also feature a D3js front end with some interesting visualisations.

The data is available from these URL's:

raw data: http://miv.opendata.belfla.be/miv/verkeersdata

some explanation: http://miv.opendata.belfla.be/miv-verkeersdata.xsd

more explanation: http://miv.opendata.belfla.be/miv-config.xsd

location data: http://miv.opendata.belfla.be/miv/configuratie/xml

## Installation

#### Development

    $ cd frontend
    $ npm install
    $ cd ../backend
    $ npm install

Now you need to start the backend and the front end seperately. 

For the frontend:

    $ cd frontend
    $ npm start

For the backend:

    $ cd backend
    $ npm start

## Todo
1. get a front end up and running
2. creating the d3 thing

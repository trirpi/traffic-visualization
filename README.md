# Traffic visualization
> Website that displays traffic data of Flanders almost in real time.

![](header.png)


## Project info

The government of Belgium has real-time data about the traffic in Flanders. In this project, I built a website that visualizes the speed of the cars.

The data is available from these URL's:

- raw data: http://miv.opendata.belfla.be/miv/verkeersdata
- some explanation: http://miv.opendata.belfla.be/miv-verkeersdata.xsd
- more explanation: http://miv.opendata.belfla.be/miv-config.xsd
- location data: http://miv.opendata.belfla.be/miv/configuratie/xml


## Development setup

The project consists of a nodejs API, some static front end files and a scraping script.

The setup is a bit tedious.

#### Install scraper

```bash
cd backend/scraper
virtualenv venv
source venv/bin/activate
pip install -r requirements.py
```

Now you can run `python data_updater.py` to scrape the website. The generated json file will be saved in the folder `old_data` with its timestamp as a name and will overwrite the file `most_recent_data.json`.

#### Frontend

First change the url to the API's url using the variable `api_url`. Now we need to build everything. Then we need to copy the files to the public folder of our backend.

```bash
cd frontend
npm install
webpack -p
mkdir ../backend/public
cp dist/* ../backend/public
```

#### Backend

First change the `config.js` file. After that it is relatively simple.

```bash
cd backend
npm install
npm start
```

## Release History

* 0.0.1
    * Work in progress

## Meta

[Tristan Trouwen](https://tristantrouwen.com) – [@tristantrouwen](https://twitter.com/tristantrouwen)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/trirpi/traffic-visualization](https://github.com/trirpi/traffic-visualization)

## Contributing

1. Fork it (<https://github.com/yourname/traffic-visualization/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request


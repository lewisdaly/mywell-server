#MyWell Presentation


**22 March, 2017 - 45 minutes + Q's**

##Overview:
- Introduce theme:
  - IT for Development
  - IT innovation in the less noticed areas

- Need for innovation in the rest of the world
- How can we use IT to affect change in these poverty issues?

- How can we apply digital innovation (from Silicon valley) to the rest of the world in order to make a difference?

- Challenges:
  - Groundwater conservation in west India
    - farming industry is made up of many small farms
    - Main source of irrigation (only source in many cases) is from groundwater
    - the tradgedy of the commons!
      - Hard to regulate
      - cheap and easy to obtain
      - shared between villages, and even states (India has 29!)
    - the wells are running dry!
    - consequences
      - farmers plant too much (over commit), and can't finish watering the crop, so entire crop fails:
      - eg: if you know beforehand you only have 70% of the water, you should only plant 70% of the crop, instead of planting 100% of the crop, running out of water and getting 0% returns
    - constraints
      - people are sceptical of scientists (often will consult local 'expert' (water diviner) first)
      - Govt. data is scarce, and not fine grained enough
      - low education and understanding of irrigation, well recharge, rainfall
      - groundwater is an invisible resource!

- What is MARVI?
  - Managed Aquifer Recharge for Village level Intervention
  - Goals:
    - better education
    - better data and understanding
    - uniting villagers together to share this resource

- What is MyWell
  - Technology component of MARVI
  - Smartphone and SMS app for tracking well readings, among other things
    - Currrently, readings are being taken by hand for 10 villages. This obviously doesn't scale!
      - more robust system
      - scaleable system
      - better visualisations
    - IT to the rescue (and enter Lewis)

  - How it works!
    - BJ's travel around to wells, taking readings (this is currently being done on paper)
    - Upload reading using SMS or app: (show example)
    - Populates the map, and graphs etc.
    - Also have the ability to track Rainfall levels and Checkdams (little dams)
    - BJ's can also add new 'resources', by inputting a few details, such as LatLng,
    - Attach pictures for a well
    - View graphs and statistics

  - Describe technology stack
    - MySQL, Nodejs, Docker, DigitalOcean, CircleCI, Ionic, AngularJS

  - Development Journey
    - MyWell-0.1: Initial work (at CMU) - SMS based prototype
    - MyWell-0.2: Migrated to Azure Mobile Backend as a Service, started MyWell for Android and iOS
    - MyWell-1.0: Rewrote everything to run on a $5 Digital Ocean server, MyWell for Android, iOS, Web ...



- Digital Innovation in the rest of the world
  - I really want to talk about this part! This is where I want to make my career

  - Trip to India:
  - What did I learn?
    - IT doesn't solve everything
      - These people don't want more money

    - Don't use CDN's!

  - Mistakes (what could we have done better?)

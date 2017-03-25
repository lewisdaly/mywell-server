#MyWell Presentation


**22 March, 2017 - 45 minutes + Q's**

##Overview:
- Introduce theme:
  - How can IT be used for Economic Development  in low income countries?

   Topics:
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
        - no quantitative analysis going
      - groundwater is an invisible resource!

- What is MARVI?
  - Managed Aquifer Recharge for Village level Intervention
  - Goals:
    - better education
    - better data and understanding
    - uniting villagers together to share this resource

- What is MyWell
  - Technology component of MARVI
  - Crowdsources well information from many people
    - Give people ownership (no longer just scientists coming in - the villagers are the scientists)
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
    - Also support excel uploading for desktop...
    - Information Flows:
      -

  - Small demo

  - The technology
    - Microservices approach on docker
    - MySQL, Nodejs, Docker, DigitalOcean, CircleCI, Ionic, AngularJS
    - Microservices:
      - Database
      - Backend
      - Frontend
      - SMS
    - Deployment Process:
      -
    - Issues and Further Development

  - Development Journey
    - MyWell-0.1: Initial work (at CMU) - SMS based prototype
    - MyWell-0.2: Migrated to Azure Mobile Backend as a Service, started MyWell for Android and iOS
    - MyWell-1.0: Rewrote everything to run on a $5 Digital Ocean server, MyWell for Android, iOS, Web ...



- Digital Innovation in the rest of the world
  - I really want to talk about this part! This is where I want to make my career
  - Other innovations
    - khushibaby: wearables for health in India
    - m-pesa: defacto mobile money through data in Kenya, became actual money platform

  - Trip to India:
  - What did I learn?
    - IT doesn't solve everything
      - These people don't want more money
      - Not a technology problem, just a partial solution
      - It's not a technology problem, just a water problem,
      This is just one simple case of using IT innovation in LIC's

    - Don't use CDN's!

  - How do we apply digital innovation in LICs?
    - Not sure, but I have some ideas:
      1. Don't over engineer the solution.
        - Previously built a robust user login and management component, but threw it all away - it was too complicated. All we needed was a Password
        - It's easy to go in with the latest and greatest (I want to use NoSQL to scale this to 1 million wells!), but really we should be tackling the problem at hand.
      2. We can probably learn as much from innovations in LIC's as they can learn from us
      3. Understand the constraints and build for them
        - eg. Modern web is not built for low-data plans
        - We needed to be able to support SMS as a platform
        
  - Next Steps
    - For MyWell and MARVI
      - Applying for funding
      - opportunities for partnership between SA and Rajasthan, but before then:
    - Personally: I'm starting a company!
      - at least a blog: https://medium.com/aptly
      - I think there is a need for experts in these areas of technologies.
        - A lot of the literature and research out there is for Policy makers, I want to make these things more approachable and appealing to Developers like myself.
        - Google, Facebook, Amazon are attractive- but they solve problems like "How do I sell more toilet paper"
        - Goal is to find similar projects like MARVI, and apply my knowledge and "expertise" to use IT to improve lives in LIC's

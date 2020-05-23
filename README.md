# ridge_walker
## Features
* Cave Locations
  * View all caves in the database in a table format.
    * Search by property (length, pit depth, county, etc)
  * View all information on a specific cave.
    * Displays all properties and any available maps.
  * Add a cave to the database.
  * Download Points as a GPX or CSV file
* Leads
  * Lidar
      * Leads that have been checked and don't go anywhere.
      * Promising leads that have not been checked.
  * In Cave
    * View all in cave leads

* Authentication
  * Admin
    * Can accept, reject, or modify proposed changes to a cave location.
    * Can accept, reject, or modify new cave submissions.
    * Approve users who request a membership.
  * Users
    * Once approved, have access to all cave locations, maps, etc.
    * Can propose changes and add new caves to the database.
    * Add lidar leads.
      * Leads that have been checked and don't go anywhere.
      * Promising leads that have not been checked.
    * Add in cave leads
* Map
  * View all 10,000+ caves.
  * Points are clustered if zoomed out to increase efficiency.
  * Get information on a point by clicking it.
  * Use a Topo, 3DEP Elevation (Lidar), and OSM map layer.
  
#### Technologies Used
* Server
  * Typescript, Node, Express, Passport, MongoDB
* Client
  * React, Passport, Leaflet, 

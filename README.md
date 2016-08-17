# Neighborhood Map Project

This project uses the FourSquare API to find nightlife locations in Milwaukee, Wisconsin and displays the searchable results on a Google Map.

## Technology Stack

This project used:

- JavaScript
- KnockoutJS
- JQuery
- Google Maps API
- Foursquare API
- HTML5/CSS

## Project Requirements

The goal of this project was to use third-party APIs to create a map of a neighborhood with several locations of interest.  The locations had to be displayed in a searchable list as well as on the Google Map.  When selected, the locations had to animate (ie. bouncing map pins) and display additional information.  I choose to get this additional information from Foursquare.

## Obstacles and Lessons Learned

-- How to handle errors when API calls failed by using callback functions.
-- Using the Model-View-View Model pattern with KnockoutJS
-- Asynchronous API requests
-- Tying the Google Map markers visibilty state to the filterable location list

## To Run

First, clone the repository on your local machine.

Change to the `src` directory.  

Start local web server

python3 `python -m http.server 8080` or python 2.7 `python -m SimpleHTTPServer 8080`

View site on localhost:808: 

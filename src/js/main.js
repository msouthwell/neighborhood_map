////////////////////
// Hardcoded locations
///////////////////
var landmarks = {
    landmarks: [{
        "name": "SummerFest Grounds",
        "url": "http://summerfest.com/",
        "location": {
            "lat": 43.0286923,
            "lng": -87.9036728
        }
    }, {
        "name": "Milwaukee Public Market",
        "url": "http://www.milwaukeepublicmarket.org/main.html",
        "location": {
            "lat": 43.034979,
            "lng": -87.908023,
            "formattedAddress": "400 N Water St, Milwaukee, WI 53202",

        }
    }, {
        "name": "Milwaukee Art Museum",
        "url": "http://mam.org/",
        "location": {
            "lat": 43.0400726,
            "lng": -87.897058
        }
    }, {
        "name": "Marcus Ampitheater",
        "url": "http://marcusamp.com/",
        "location": {
            "lat": 43.0273231,
            "lng": -87.8976753
        }
    }, {
        "name": "Milwaukee Public Museum",
        "url": "www.mpm.edu",
        "location": {
            "lat": 43.038733,
            "lng": -87.90998,
            "formattedAddress": "800 W Wells St, Milwaukee, WI 53233",

        }
    }, {
        "name": "Miller Park",
        "url": "https://en.wikipedia.org/wiki/Miller_Park_(Milwaukee)",
        "location": {
            "lat": 43.0279776,
            "lng": -88.0061693
        }
    }]
};


function viewModel() {

    var self = this;

    self.search = ko.observable('');

    // Title for page
    self.header = ko.observable();

    self.header("Milwaukee Night Life (Foursquare)");

    // Error string, appears under header
    self.error = ko.observable("");
    self.googleErrorMessage = ko.observable("");
    // Stores all of the locations
    self.locationData = ko.observableArray();

    self.markers = ko.observableArray();

    // add the hardcoded locations into the observable array
    landmarks.landmarks.forEach(function(land){
        self.locationData.push(land);
    });


    // #########################
    // FOURSQUARE API
    // ##############################
    var client_id = 'DU3IDVY3XD3GUAWUORY3W05XWF43LHISHQHLE2YUM3QCNBIV';

    var client_secret = '5QL3QTVBXUF224UBMQP0OWM0PLCG35CJ3V22PX0NDUS4S4I2';

    var url = "https://api.foursquare.com/v2/venues/search";
    url += '?' + $.param({
        'client_id': client_id,
        'client_secret': client_secret,
        'v': "20130815",
        'll': "43.0389,-87.9065",
        'categoryId': "4bf58dd8d48988d1e3931735,4bf58dd8d48988d155941735,4bf58dd8d48988d116941735,50327c8591d4c4b30a586d5d,4bf58dd8d48988d1d4941735",
        'radius': 1000,
        'limit': 30,
    });

    // JSCON call to foursquare
    $.getJSON(url, function(data) {

        data.response.venues.forEach(function(venue){
                self.locationData.push(venue);
        });

        for (var i = 0; i < self.locationData().length; i++) {
            self.markers.push(new Marker(self.locationData()[i])); // TODO this should be altered to make map markers into an array
        }
    }).error(function() {
        self.error("Foursquare results could not be retrieved");
    });

    // Put locations into a ko computable that allows filtering
    self.filteredItems = ko.computed(function() {
        var filter = self.search().toLowerCase();
        if (!filter) {
            return self.locationData();
        } else {
            return ko.utils.arrayFilter(self.locationData(), function(item) {
                var match = item.name.toLowerCase().indexOf(filter) >= 0;
                if (!match) {
                    return false;
                } else {
                    return item;
                }
            });
        }
    }, self);

    // Put markers into a ko computable for filtering
    self.filterMarkers = ko.computed(function() {
        var filter = self.search().toLowerCase();

        if (!filter) {
            return self.markers();
        } else {
            return ko.utils.arrayFilter(self.markers(), function(pin) {
                var match = pin.name.toLowerCase().indexOf(filter) >= 0;
                pin.isVisible(match);
                return pin;
            });
        }
    });

    self.displayMarker = function(place) {
        google.maps.event.trigger(map, 'click'); //turns off any currently displaying infowindows
        marker = "";
        for (var i in self.markers()) {
            if (self.markers()[i].name == place.name) {
                marker = self.markers()[i];
                google.maps.event.trigger(self.markers()[i].marker, 'click'); //toggles the visibility of the infowindow
            }
        } //  var marker = function() {

    };
    // ################################
    // Map stuff
    // ################################


    // map centers in Milwaukee Wisconsin
    var mapOptions = {
        disableDefaultUI: false,
        center: {
            lat: 43.0389,
            lng: -87.9065
        },
        zoom: 14
    };

    map = new google.maps.Map(document.querySelector('#map'), mapOptions);

    var Marker = function Marker(place) {
        var self = this;
        this.name = place.name;
        var location = place.location;
        self.marker = new google.maps.Marker({
            position: {
                lat: location.lat,
                lng: location.lng
            },
            map: map,
            title: place.name
        });

        var address = place.location.formattedAddress;
        var url = place.url;
        if (address === undefined) {
            address = "";
        }
        if (url === undefined) {
            url = "";
        }
        var infoWindow = new google.maps.InfoWindow({
            content: '<div><h4>' + place.name + '</h4>' +
                '<h5>' + address + '</h5>' +
                '<a href="' + url + '">' + url + "</a>" 
        });
        //toggles info window and bounce when marker is clicked
        google.maps.event.addListener(self.marker, 'click', function() {
            if (!self.marker.open) {
                google.maps.event.trigger(map, 'click');
                infoWindow.open(map, self.marker);
                self.marker.open = true;
                self.marker.setAnimation(google.maps.Animation.BOUNCE);
            } else {
                infoWindow.close();
                self.marker.open = false;
                self.marker.setAnimation(null);

            }
        });
        //closes infowindow if map is clicked on
        google.maps.event.addListener(map, 'click', function() {
            if (self.marker.open) {
                infoWindow.close();
                self.marker.open = false;
                self.marker.setAnimation(null);

            }
        });

        //allows toggling of the infowindow
        this.isVisible = ko.observable(false);

        this.isVisible.subscribe(function(currentState) {
            if (currentState) {
                self.marker.setMap(map);
            } else {
                self.marker.setMap(null);
            }
        });

        this.isVisible(true);
    };


}


ko.applyBindings(new viewModel());
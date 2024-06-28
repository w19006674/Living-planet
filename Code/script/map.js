let activeinfowindow = null;
let activeModal = null;

function initMap() {
    let map;
    const mapOptions = {
        mapId: "My map",
        center: new google.maps.LatLng(54.9778, -1.6045),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.MAP,
        streetViewControl: true,
        overviewMapControl: false,
        rotateControl: false,
        scaleControl: false,
        panControl: false,
    };

    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Function to create markers on the map
    function createMarker(position, title, description) {
        getairquality(position.lat, position.lng).then(airquality => {
            const aqi = airquality.list[0].main.aqi;
            const markerIcon = getMarkerIcon(aqi);
            const aqiColor = getAqiColor(aqi);

            const marker = new google.maps.Marker({
                position: position,
                map: map,
                title: title,
                icon: markerIcon
            });

            // Displays air quality info on the infowindow
            const info = new google.maps.InfoWindow({
                content: `
                    <div id="content">
                        <h1>${title}</h1>
                        <p>${description}</p>
                        <section>
                            <h2 class="active">Air Quality</h2>
                            <p>
                                Air Quality: <span style="color: ${aqiColor};">${aqi}</span>
                                <br>
                                Carbon Monoxide: ${airquality.list[0].components.co}µg/m³
                                <br>
                                Nitrogen Monoxide: ${airquality.list[0].components.no}µg/m³
                                <br>
                                Ozone: ${airquality.list[0].components.o3}µg/m³
                                <br>
                                Sulphur Dioxide: ${airquality.list[0].components.so2}µg/m³
                                <br>
                                PM2.5: ${airquality.list[0].components.pm2_5}µg/m³
                                <br>
                                PM10: ${airquality.list[0].components.pm10}µg/m³
                                <br>
                                NH3: ${airquality.list[0].components.nh3}µg/m³
                            </p>
                        </section>
                    </div>
                `
            });

            // Hover over the marker for infowindow
            marker.addListener("mouseover", () => {
                info.open(map, marker);

                if (activeinfowindow) {
                    activeinfowindow.close();
                }
                activeinfowindow = info;

                // Update air quality data in the AQI container
                updateAqiContainer(airquality);
            });

            // Infowindow closes once mouse moves away from marker
            marker.addListener("mouseout", () => {
                info.close();
                activeinfowindow = null;
            });
        });
    }

    // Add markers for different cities
    createMarker({ lat: 54.976634, lng: -1.60745 }, "Living Planet HQ", "Headquarters of Living Planet");
    createMarker({ lat: 54.98, lng: -1.62 }, "Newcastle Upon Tyne", "Home to the beautiful Tyne Bridge");
    createMarker({ lat: 53.48, lng: -2.24 }, "Manchester", "Known as the secondary capital of the UK");
    createMarker({ lat: 51.51, lng: -0.13 }, "London", "The capital city of the UK");
    createMarker({ lat: 55.95, lng: -3.19 }, "Edinburgh", "The capital city of Scotland");
    createMarker({ lat: 53.38, lng: -1.47 }, "Sheffield", "Known for being one of the greener cities of the UK");
    createMarker({ lat: 51.45, lng: -2.59 }, "Bristol", "Beautiful city built around the River Avon");
    createMarker({ lat: 53.80, lng: -1.55 }, "Leeds", "The unofficial capital of Yorkshire");
    createMarker({ lat: 52.95, lng: -1.15 }, "Nottingham", "Popular city for nightlife");
    createMarker({ lat: 55.86, lng: -4.26 }, "Glasgow", "Known for its vibrant art scene");
    createMarker({ lat: 52.48, lng: -1.89 }, "Birmingham", "Beautiful city in the midlands");

    const renderer = new google.maps.DirectionsRenderer();
    renderer.setMap(map);

    map.addListener('click', event => {
        // Reverse geocode to check if the clicked location is on land
        reverseGeocode(event.latLng.lat(), event.latLng.lng()).then(result => {
            if (result && result.types.includes("natural_feature")) {
                alert("Cannot calculate route for uncrossable terrain such as the sea.");
                return;
            }

            // Get weather data for clicked location
            getweather(event.latLng.lat(), event.latLng.lng()).then(weather => {
                $("#weather").text(weather.weather[0].main);
                $("#weatherdesc").text(weather.weather[0].description);
                $("#temperature").text(weather.main.temp);
                $("#feels_like").text(weather.main.feels_like);
                $("#humidity").text(weather.main.humidity);
                $("#speed").text(weather.wind.speed);
            });

            // If there is an active modal, remove it
            if (activeModal) {
                activeModal.remove();
                activeModal = null;
            }

            const service = new google.maps.DirectionsService();

            // Open modal with buttons to select form of travel
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <p class="modal-text">Are you going to be...</p>
                    <div class="modal-buttons">
                        <button id="driving-btn" class="modal-button driving">Driving</button>
                        <button id="walking-btn" class="modal-button walking">Walking</button>
                        <button id="cycling-btn" class="modal-button cycling">Cycling</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Check if event.pixel is defined before using it
            if (event.pixel) {
                modal.style.top = event.pixel.y + 'px';
                modal.style.left = event.pixel.x + 'px';
            } else {
                console.error('Event pixel is undefined');
            }

            // Append modal to the map
            map.getDiv().appendChild(modal);
            activeModal = modal;

            // Event listeners for each travel mode option
            document.getElementById("driving-btn").addEventListener("click", function() {
                handleRouteSelection(google.maps.TravelMode.DRIVING);
            });

            document.getElementById("walking-btn").addEventListener("click", function() {
                handleRouteSelection(google.maps.TravelMode.WALKING);
            });

            document.getElementById("cycling-btn").addEventListener("click", function() {
                handleRouteSelection(google.maps.TravelMode.BICYCLING);
            });

            // Function to create route based on travel mode selected with Living Planet as destination
            function handleRouteSelection(mode) {
                service.route({
                    origin: event.latLng,
                    destination: "NE1 8ST",
                    travelMode: mode
                }).then(result => {
                    renderer.setDirections(result);

                    const panel = document.getElementById("directions");
                    renderer.setPanel(panel);
                });

                modal.remove();
                activeModal = null;
            }
        });
    });

    // Display air quality for Living Planet as default
    displayDefaultAirQuality();
}

// Function to display air quality for Living Planet as default
function displayDefaultAirQuality() {
    const defaultLat = 54.9783;
    const defaultLng = -1.6174;
    getairquality(defaultLat, defaultLng).then(airquality => {
        console.log(airquality);
        updateAqiContainer(airquality);
    });
}

// Function to update the AQI container
function updateAqiContainer(airquality) {
    const aqi = airquality.list[0].main.aqi;
    $("#aqi").text(aqi).css("color", getAqiColor(aqi));
    $("#co").text(airquality.list[0].components.co);
    $("#no").text(airquality.list[0].components.no);
    $("#o3").text(airquality.list[0].components.o3);
    $("#so2").text(airquality.list[0].components.so2);
    $("#pm2_5").text(airquality.list[0].components.pm2_5);
    $("#pm10").text(airquality.list[0].components.pm10);
    $("#nh3").text(airquality.list[0].components.nh3);
}

// Change colours of marker based on air quality level
function getMarkerIcon(aqi) {
    let color;
    switch (aqi) {
        case 1:
            color = 'green';
            break;
        case 2:
            color = 'yellow';
            break;
        case 3:
            color = 'orange';
            break;
        case 4:
            color = 'red';
            break;
        case 5:
            color = 'purple';
            break;
        default:
            color = 'blue'; 
    }
    return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
}

// Get the color based on AQI level
function getAqiColor(aqi) {
    switch (aqi) {
        case 1: return 'green';
        case 2: return '#FFD700';
        case 3: return 'orange';
        case 4: return 'red';
        case 5: return 'purple';
        default: return 'blue'; 
    }
}

// Define API key
const weatherapikey = 'f0b8942005f12cff465989f8d6b2d32b';

// Function to get air quality data
function getairquality(lat, lon) {
    return $.getJSON(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${weatherapikey}`);
}

// Function to get weather data
function getweather(lat, lon) {
    return $.getJSON(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherapikey}&units=metric`);
}

// Function to perform reverse geocoding if its an invalid route
function reverseGeocode(lat, lon) {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat: lat, lng: lon } }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                resolve(results[0]);
            } else {
                reject(status);
            }
        });
    });
}

// Display initial weather info on the console for a default location
getweather(54.98, -1.61).then(data => {
    console.log(data);
    $("#weather").text(data.weather[0].main);
    $("#weatherdesc").text(data.weather[0].description);
    $('#temperature').text(data.main.temp);
    $("#feels_like").text(data.main.feels_like);
    $("#humidity").text(data.main.humidity);
    $("#speed").text(data.wind.speed);
});

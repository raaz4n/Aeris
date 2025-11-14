let timer;
const searchInput = document.getElementById('search');
const locationList = document.getElementById('locationList');
const clearBtn = document.getElementById('clear-search');

const metricRadio = document.getElementById('metric')
const imperialRadio = document.getElementById('imperial')
let currentCity = '';
let currentState = '';
let currentCountry = '';

metricRadio.addEventListener('change', function(){
    const unit = this.value;
    if (currentCity){
        fetch(`/weather?city=${currentCity}&state=${currentState}&country=${currentCountry}&unit=${unit}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('temperature').textContent = `Temperature: ${data.temperature} ${data.tempChar}`;
                document.getElementById('weather').innerHTML = `Weather: ${data.desc} <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Weather icon">`;
            })
            .catch(error => {
                document.getElementById('temperature').textContent = 'Temperature: Error loading';
                document.getElementById('weather').textContent = 'Weather: Unable to fetch weather data';
            });
    }
})

imperialRadio.addEventListener('change', function(){
    const unit = this.value;
    if (currentCity){
        fetch(`/weather?city=${currentCity}&state=${currentState}&country=${currentCountry}&unit=${unit}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('temperature').textContent = `Temperature: ${data.temperature} ${data.tempChar}`;
                document.getElementById('weather').innerHTML = `Weather: ${data.desc} <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Weather icon">`;
            })
            .catch(error => {
                document.getElementById('temperature').textContent = 'Temperature: Error loading';
                document.getElementById('weather').textContent = 'Weather: Unable to fetch weather data';
            });
    }
});

searchInput.addEventListener('click', function(){
    if (searchInput.value) {
        clearBtn.style.display = 'block';
    }
    else {
        clearBtn.style.display = 'none';
    }
});

searchInput.addEventListener('input', function() {
    if (searchInput.value) {
        clearBtn.style.display = 'block';
    }
    else {
        clearBtn.style.display = 'none';
    }
    
    clearTimeout(timer);
    
    const searchValue = searchInput.value.trim();
    if (!searchValue) {
        locationList.classList.remove('show');
        document.getElementById('temperature').textContent = `Temperature: `;
        document.getElementById('weather').textContent = `Weather: `;
        currentCity = '';
        currentState = '';
        currentCountry = '';
        return;
    }
    
    timer = setTimeout(function() {
    fetch(`/search?q=${searchValue}`)
        .then(response => response.json())
        .then(data => {
            locationList.innerHTML = '';
            data.features.forEach(feature => {
                let cityName;
                if (feature.properties.feature_type === 'place') {
                    cityName = feature.properties.name;
                } else {
                    cityName = feature.properties.context.place.name || feature.properties.name || '';
                }
                
                const regionName = feature.properties.context.region.name || '';
                let stateName = '';
                if (regionName && regionName !== cityName) {
                    const suffixes = ['Prefecture', 'Province', 'State', 'District', 'Region', 'County'];
                    const isJustSuffix = suffixes.some(suffix => 
                        regionName === `${cityName} ${suffix}`
                    );
                    if (!isJustSuffix) {
                        stateName = regionName;
                    }
                }
                
                const countryName = feature.properties.context.country.name || '';
                
                let displayText = cityName;
                if (stateName) {
                    displayText += `, ${stateName}`;
                }
                if (countryName) {
                    displayText += `, ${countryName}`;
                }
                
                const item = document.createElement('div');
                item.className = 'location-item';
                item.textContent = displayText;
                locationList.appendChild(item);
                
                item.addEventListener('click', function() {
                    searchInput.value = displayText;
                    locationList.classList.remove('show');
                    clearBtn.style.display = 'none';
                    
                    currentCity = cityName;
                    currentState = stateName;
                    currentCountry = countryName;

                    const unitRadio = document.querySelector('input[name="unit"]:checked');

                    let unit;
                    if (unitRadio) {
                        unit = unitRadio.value;
                    }
                    else {
                        unit = 'metric';
                    }
                    fetch(`/weather?city=${cityName}&state=${stateName}&country=${countryName}&unit=${unit}`)
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('temperature').textContent = `Temperature: ${data.temperature} ${data.tempChar}`;
                            document.getElementById('weather').innerHTML = `Weather: ${data.desc} <img id="weather-icon" src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="Weather icon">`;
                        })
                        .catch(error => {
                            document.getElementById('temperature').textContent = 'Temperature: Error loading';
                            document.getElementById('weather').textContent = 'Weather: Unable to fetch weather data';
                        });
                    });
                });
                locationList.classList.add('show');

        })
        .catch(error => {
            console.error('Error searching:', error);
            locationList.classList.remove('show');
        });
    }, 300);
});

clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    locationList.classList.remove('show');
    searchInput.focus();
    document.getElementById('temperature').textContent = `Temperature: `;
    document.getElementById('weather').textContent = `Weather: `;
    currentCity = '';
    currentState = '';
    currentCountry = '';
});

document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !locationList.contains(event.target)) {
        locationList.classList.remove('show');
    }
});
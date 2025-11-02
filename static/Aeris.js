let timer;
const locationList = document.getElementById('locationList');

const input = document.getElementById('city');
input.addEventListener('input', function(thing) {
    clearTimeout(timer);
    locationList.innerHTML = '';
    timer = setTimeout(function() {
        console.log('Typed:', thing.target.value);
        const cityValue = thing.target.value;
        const countryValue = document.getElementById('country').value;
        let query = cityValue;
        if (countryValue) {
            query = `${cityValue},${countryValue}`;
        }
        else {
            query = `${cityValue}`;
        }
        fetch(`/search?q=${query}`)
            .then(response => response.json())
            .then(data => { data.features.forEach(feature => {
                const item = document.createElement('div');
                item.textContent = feature.properties.full_address;
                locationList.appendChild(item);
                item.addEventListener('click', function() {
                    document.getElementById('city').value = feature.properties.context.place.name || '';
                    document.getElementById('state').value = feature.properties.context.region.name || '';
                    document.getElementById('country').value = feature.properties.context.country.name || '';
                });
            });
        });
    }, 500);
});

const input2 = document.getElementById('country');
input2.addEventListener('input', function(thing) {
    clearTimeout(timer);
    timer = setTimeout(function() {
        console.log('Typed:', thing.target.value);
        const countryValue = thing.target.value;
        const cityValue = document.getElementById('city').value;
        if (!cityValue) {
            return;
        }
        locationList.innerHTML = '';

        
        fetch(`/search?q=${cityValue},${countryValue}`)
            .then(response => response.json())
            .then(data => { data.features.forEach(feature => {
                const item = document.createElement('div');
                item.textContent = feature.properties.full_address;
                locationList.appendChild(item);
                item.addEventListener('click', function() {
                    document.getElementById('city').value = feature.properties.context.place.name || '';
                    document.getElementById('state').value = feature.properties.context.region.name || '';
                    document.getElementById('country').value = feature.properties.context.country.name || '';
                });
            });
        });
    }, 500);
});
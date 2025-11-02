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
            .then(data => { data.forEach(location => {
                const item = document.createElement('div');
                item.textContent = location.display_name;
                locationList.appendChild(item);
                item.addEventListener('click', function() {
                    document.getElementById('city').value = location.address.city || location.address.town || location.address.village || location.address.county || location.address.municipality || location.name || ''
                    document.getElementById('state').value = location.address.state || '';
                    document.getElementById('country').value = location.address.country;
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
            .then(data => { data.forEach(location => {
                const item = document.createElement('div');
                item.textContent = location.display_name;
                locationList.appendChild(item);
                item.addEventListener('click', function() {
                    document.getElementById('city').value = location.address.city || location.address.town || location.address.village || location.address.county || location.address.municipality || location.name || '';
                    document.getElementById('state').value = location.address.state || '';
                    document.getElementById('country').value = location.address.country;
                });
            });
        });
    }, 500);
});
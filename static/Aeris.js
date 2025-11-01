let timer;
const locationList = document.getElementById('locationList');

const input = document.getElementById('city');
input.addEventListener('input', function(thing) {
    clearTimeout(timer);
    timer = setTimeout(function() {
        console.log('Typed', thing.target.value);
        fetch(`/search?q=${thing.target.value}`)
            .then(response => response.json())
            .then(data => { data.forEach(location => {
                const item = document.createElement('div');
                if (location.state) {
                    item.textContent = `${location.name}, ${location.state}, ${location.country}`;
                } else {
                    item.textContent = `${location.name}, ${location.country}`;
                }
                locationList.appendChild(item);
                item.addEventListener('click', function() {
                    document.getElementById('city').value = location.name;
                    document.getElementById('state').value = location.state || '';
                    document.getElementById('country').value = location.country;
                });
            });
        });
    }, 500);
});

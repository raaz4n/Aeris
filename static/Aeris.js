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
                item.textContent = `${location.name}, ${location.country}`;
                locationList.appendChild(item);
            });
        });
    }, 200);
});

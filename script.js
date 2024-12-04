document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value.trim();

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert('Você precisa digitar uma cidade...');
        return;
    }

    const apiKey = 'd8b971d62f49c3a1f00e884f84541a78';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiUrl);
        const json = await results.json();

        console.log("Resposta da API:", json); // Log para depuração

        if (json.cod === 200) {
            showInfo({
                city: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity,
            });

            updateMap(json.coord.lat, json.coord.lon);
        } else {
            document.querySelector("#weather").classList.remove('show');
            showAlert(`Não foi possível localizar a cidade: ${json.message}`);
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error); // Log para depuração
        document.querySelector("#weather").classList.remove('show');
        showAlert('Ocorreu um erro ao buscar os dados da cidade.');
    }
});

function showInfo(json) {
    showAlert('');

    document.querySelector("#weather").classList.add('show');

    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)} km/h`;
}

function showAlert(msg) {
    console.log("Alerta:", msg); // Log para depuração
    document.querySelector('#alert').innerHTML = msg;
}

// Inicializa o mapa
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Variável global para rastrear o marcador atual
window.currentMarker = null;

function updateMap(lat, lon) {
    // Atualiza a posição do mapa
    map.setView([lat, lon], 13);

    // Remove marcador anterior, se existir
    if (window.currentMarker) {
        map.removeLayer(window.currentMarker);
    }

    // Adiciona novo marcador
    window.currentMarker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`Localização: ${lat}, ${lon}`)
        .openPopup();
}

// Evento de clique no mapa
map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    alert(`Você clicou no mapa em ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
});

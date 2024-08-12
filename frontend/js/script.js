function cosa() {
    alert('Hola medallo!');
}

// Categories selection

// async function selectCategories() {
//     try {
//         let response = await fetch('http://localhost:8000/api/v1/Medallo-Oculto-Test/all_categories');
        
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
        
//         let data = await response.json();
//         alert(JSON.stringify(data));

//     } catch (error) {
//         alert('Error: ' + error.message);
//     }
// }

// Leaflet map configuration
const medelllin = [6.244203, -75.581211];
var map = L.map('map').setView([medelllin[0], medelllin[1]], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.google.comt">Medallo Oculto</a>'
}).addTo(map);

const icon1 = L.icon({
    iconUrl: 'https://w7.pngwing.com/pngs/984/269/png-transparent-blue-check-logo-social-media-instagram-verified-badge-symbol-computer-icons-social-media-blue-leaf-influencer-marketing-thumbnail.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

async function viewMarkers() {
    try {
        let response = await fetch('http://localhost:8000/api/v1/Medallo-Oculto-Test/places');
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        let data = await response.json();
        alert(JSON.stringify(data));

        data.forEach(place => {
            L.marker([place.latitude, place.longitude], {icon:icon1}).addTo(map)
                .bindPopup(`<b>${place.name}</b><br>${place.description}`).openPopup();
        });

    } catch (error) {
        alert('Error: ' + error.message);
    }
}
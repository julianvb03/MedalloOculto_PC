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

// Markers Logic

var markers = [];

async function viewMarkers() {
    try {
        let response = await fetch('http://localhost:8000/api/v1/Medallo-Oculto-Test/places');
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        
        let data = await response.json();
        alert(JSON.stringify(data));

        data.forEach(place => {
            let marker = L.marker([place.latitude, place.longitude], {icon:icon1}).addTo(map)
                .bindPopup(`<b>${place.name}</b><br>${place.description}`).openPopup();
            
            marker.on('click', onMarkerClick);
            markers.push(marker);
        });

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function clear() {
    alert("Clear function called");
    console.log("Clear function called");

    // Eliminar todos los marcadores
    if (markers.length === 0 && routeControl === null) {
        console.log("No markers or routes to remove.");
        return;
    }
    
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
    
    // Eliminar la ruta si existe
    if (routeControl !== null) {
        map.removeControl(routeControl);
        routeControl = null;  // Reiniciar la variable después de eliminar la ruta
    }

    console.log("Markers and routes cleared.");
}

document.getElementById("b001").addEventListener("click", clear);

async function filter(category_id) {
    if(markers.length !== 0) {
        clear();
    }
    const url = `http://localhost:8000/api/v1/Medallo-Oculto-Test/places_by_category${category_id}`;
    try{
        let response = await fetch(url);
        if(!response.ok){
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        alert(data);
        data.forEach(place => {
            let marker = L.marker([place.latitude, place.longitude], {icon:icon1}).addTo(map)
                .bindPopup(`<b>${place.name}</b><br>${place.description}`).openPopup();

            markers.push(marker);
        });
    }
    catch(error){
        alert('Error: ' + error.message);
    }
}

document.getElementById("b003").addEventListener("click", function() {
    const category_id = document.getElementById("b003-options").value;
    alert(category_id);
    filter(category_id);
});

// Routing Logic
var selectedWaypoints = [];

function onMarkerClick(e) {
    selectedWaypoints.push(e.latlng);  // Agregar la latitud y longitud del marcador seleccionado a la lista de waypoints
    console.log("Waypoint added:", e.latlng);  // Puedes ver en la consola los puntos agregados
}

var routeControl = null;  // Variable global para almacenar la referencia al control de la ruta

function createRoute() {
    if (selectedWaypoints.length < 2) {
        alert("Por favor selecciona al menos dos marcadores.");
        return;
    }

    // Si ya existe una ruta, eliminarla antes de crear una nueva
    if (routeControl !== null) {
        map.removeControl(routeControl);
    }

    // Crear la nueva ruta utilizando los waypoints seleccionados
    routeControl = L.Routing.control({
        waypoints: selectedWaypoints,
        createMarker: function(i, wp, nWps) {
            return L.marker(wp.latLng, {
                icon: icon1
            }).bindPopup(`Punto ${i + 1}`);
        },
        routeWhileDragging: true
    }).addTo(map);

    // Limpiar la lista de waypoints después de crear la ruta
    selectedWaypoints = [];
}

var routeButton = L.control({position: 'topright'});
routeButton.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.innerHTML = '<button id="create-route">Crear Ruta</button>'; 
    div.style.backgroundColor = 'white';     
    div.style.cursor = 'pointer';
    return div;
};
routeButton.addTo(map);

document.getElementById("create-route").addEventListener("click", createRoute);
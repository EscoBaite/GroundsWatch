
mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: eventground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
    });
    
new mapboxgl.Marker()
    .setLngLat(eventground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${eventground.title}</h3><p>${eventground.location}</p>`
            )
    )
    .addTo(map)

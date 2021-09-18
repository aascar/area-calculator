import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from 'react-leaflet';
import { useState, useEffect } from 'react';

const LAT_DIST = (6371009 * Math.PI) / 180;

function polygonArea(positions = [], n) {
  let area = 0.0;
  let j = n - 1;
  for (let i = 0; i < n; i++) {
    area += (positions[j].lng + positions[i].lng) * (positions[j].lat - positions[i].lng);
    j = i;
  }
  return Math.abs(area / 2.0);
}

function LocationMarkers() {
  const [positions, setPositions] = useState([]);

  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      const newPositions = [...positions, e.latlng];
      setPositions(newPositions);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const area = polygonArea(positions.map(o => ({...o, lat: o.lat * LAT_DIST, lng: o.lng * LAT_DIST * Math.cos(o.lat)})));

  console.log(positions, area);

  return (
    <>
      {positions.length > 2 && <div className="area-banner">
        <p>{area} sqm</p>
      </div>}
      {positions.map((position, i) => <Marker key={i.toString()} position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>)}
      <Polygon pathOptions={polygonOptions} positions={positions} />
    </>
  )
}

const polygonOptions = { color: 'purple' }

function App() {

  const [position, setPosition] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return (
    <div className="App">
      {position ? 
        <MapContainer center={position} zoom={18} scrollWheelZoom={true} className='map-container'>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJ5bWFwYngiLCJhIjoiY2t0cTJvM28yMHNhMzJvbDRmN2JrYm1keSJ9.tnVmcELQHcF56L_ftEniJQ"
        />
        <LocationMarkers />
      </MapContainer>
      : <h1>We need your location access to render the Map</h1>
      }
    </div>
  );
}

export default App;

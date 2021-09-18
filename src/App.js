import './App.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from 'react-leaflet';
import { useState } from 'react';

function polygonArea(positions = [], n) {
  let area = 0.0;
  let j = n - 1;
  for (let i = 0; i < n; i++) {
    area += (positions[j][0] + positions[i][0]) * (positions[j][1] - positions[i][1]);
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

  return (
    <>
      {positions.map(position => <Marker position={position}>
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

  return (
    <div className="App">
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className='map-container'>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarkers />
      </MapContainer>
    </div>
  );
}

export default App;

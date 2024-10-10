import { Map } from 'maplibre-gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GeoCircle } from './geo-circle/geolayer';
luma.log.enable()
luma.log.level = 3
const map = new Map({
    container: "map",
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
});

const overlay = new DeckOverlay({
    layers: [
        new GeoCircle({
            data: [
                {center: [0,0], radius: 100, color: [255,255,255]}, 
               //{center: [0,0], radius: 100, color: [255,255,255]},
               //{center: [0,0], radius: 100, color: [255,255,255]},
               //{center: [0,0], radius: 100, color: [255,255,255]},
            ],
            getCenter: d => d.center,
            getRadius: d => d.radius,
            getColor: d => d.color,
        }),
    ],
});

await map.once("load");
map.addControl(overlay);

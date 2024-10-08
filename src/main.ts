import { Map } from 'maplibre-gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GeoCircle } from './geo-circle/geolayer';
luma.log.enable()
luma.log.level = 2
const map = new Map({
    container: "map",
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
});

const overlay = new DeckOverlay({
    layers: [
        new GeoCircle({
            getCenter: [0,0],
            getRadius: 1000,
            getColor: [255,0,0,255],
        }),
    ],
});

await map.once("load");
map.addControl(overlay);

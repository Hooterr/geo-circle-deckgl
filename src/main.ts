import { Map } from 'maplibre-gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GeoCircle } from './geo-circle/geolayer';
luma.log.enable();
luma.log.level = 3
const map = new Map({
    container: "map",
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
});

/*
[7.099481920327829, 21.07932313150917] 9944545.500957435
00:22:25.724 sun-calculator.js:49 (2) [7.099481920327829, 21.07932313150917] 9340385.566755507
00:22:25.724 sun-calculator.js:49 (2) [7.099481920327829, 21.07932313150917] 8673215.169130113
00:22:25.725 sun-calculator.js:49 (2) [7.099481920327829, 21.07932313150917] 8006044.77150472
*/
const overlay = new DeckOverlay({
    layers: [
        new GeoCircle({
            data: [
               {center: [7.099481920327829, 21.07932313150917], radius: 9944545.500957435, color: [255,255,255]}, 
               {center: [7.099481920327829, 21.07932313150917], radius: 9340385.566755507, color: [255,255,255]},
               {center: [7.099481920327829, 21.07932313150917], radius: 8673215.169130113, color: [255,255,255]},
               {center: [7.099481920327829, 21.07932313150917], radius: 8006044.77150472, color: [255,255,255]},
            ],
            getCenter: d => d.center,
            getRadius: d => d.radius,
            getColor: d => d.color,
        }),
    ],
});

await map.once("load");
map.addControl(overlay);

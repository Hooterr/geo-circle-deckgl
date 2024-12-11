import { Map, NavigationControl } from 'maplibre-gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import { GeoCircle } from './geo-circle/geolayer';
import { getTwilightInfo } from './geo-circle/sun-calculator';

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
const overlay = new DeckOverlay({});
const twilights = {
    sunrise: 0.566666,
    civil: 6,
    nautical: 12,
    astronomical: 18,
};
await map.once("load");
map.addControl(new NavigationControl(), "bottom-left");
map.addControl(overlay);
let i = 0;
const dateDiv = document.getElementById("date") as HTMLElement;

setInterval(() => {
    const date = new Date((new Date()).getTime() + (i++ * 24 * 3600_000));
    dateDiv.innerText = date.toJSON();
    const infos = [
        getTwilightInfo(date, twilights.sunrise),
        getTwilightInfo(date, twilights.civil),
        getTwilightInfo(date, twilights.nautical),
        getTwilightInfo(date, twilights.astronomical),
    ]

    overlay.setProps({
        layers: [
            new GeoCircle({
                data: [
                   {center: infos[0].position, radius: infos[0].radius, color: [0,0,0,25]}, 
                   {center: infos[1].position, radius: infos[1].radius, color: [0,0,0,25]}, 
                   {center: infos[2].position, radius: infos[2].radius, color: [0,0,0,25]}, 
                   {center: infos[3].position, radius: infos[3].radius, color: [0,0,0,25]}, 
                ],
                getCenter: d => d.center,
                getRadius: d => d.radius,
                getColor: d => d.color,
            }),
        ],
    });
}, 50);

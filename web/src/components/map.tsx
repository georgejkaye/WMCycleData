import maplibregl from 'maplibre-gl';
import React, { useRef, useEffect, useState, useReducer } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from '../css_modules/map.module.css'
import { Counter } from '../types/types';
import { data2geojson } from '../utils/utils';
// const map = new maplibregl.Map({
//     container: 'map',
//     style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
//     center: [-74.5, 40], // starting position [lng, lat]
//     zoom: 9 // starting zoom
//     });

function Map({ counters }: { counters: Counter[] }) {

    const map = useRef<any>(null);
    const mapContainer = useRef<any>(null);
    const [lat] = useState(52.452907468939145);
    const [lng] = useState(-1.727910517089181);
    const [zoom] = useState(9);
    const [API_KEY] = useState('2pdGAnnIuClGHUCta2TU');
    const forceUpdate = useReducer(x => x + 1, 0)[1]

    useEffect(() => {

        console.log("COUNTERS", counters)
        if (map.current && counters.length > 0) {// && source != undefined) {
            const source = map.current.getSource("counters")
            if (source != undefined) {
                console.log("geojson")
                console.log(data2geojson(counters))
                source.setData(data2geojson(counters));
            } else {
                console.log("source undefined")
            }
            console.log("updating data")
        }
    })

    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
            center: [lng, lat],
            zoom: zoom
        });

        map.current.on('load', function () {

            map.current.addControl(
                new maplibregl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            );

            console.log("Creating counters", counters.length)
            map.current.addSource('counters', {
                'type': 'geojson',
                data: data2geojson(counters),
            });

            map.current.addLayer({
                id: 'unclustered-point-1',
                type: 'circle',
                source: 'counters',
                paint: {
                    'circle-color': '#3291fc',
                    'circle-radius': 10,
                    'circle-stroke-width': 4,
                    'circle-stroke-color': '#3291fc50'
                }

            });

            forceUpdate()





        })

    });

    return (
        <div ref={mapContainer} className={styles.mapContainer} />
    );
}

export default Map;
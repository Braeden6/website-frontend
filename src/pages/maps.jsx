/*
 
  Braeden's Personal Website
  Author: Braeden Norman
  Date: 2022-10-27

  Helpful Information

  react-map-gl setup: https://visgl.github.io/react-map-gl/docs/get-started/get-started
  GeoJSON/react-map-gl/Source: https://github.com/visgl/react-map-gl/tree/7.0-release/examples/geojson

  7timer API information: https://www.7timer.info/doc.php#astro

 */
import * as React from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import {useEffect, useState, useCallback} from 'react'
import "../CSS/map.css"
import { Button, Form } from 'react-bootstrap';
import NavBar from '../components/navBar';
import { BsPlusLg } from 'react-icons/bs';
import CountrySearch from '../components/map/countrySearch';
import { variables } from '../configFiles/variables';
import DisplaySource from '../components/map/displaySource';
import {listOfSources} from '../components/map/listOfSources';

export default function SimpleMap() {
    // information can be found here: https://www.7timer.info/doc.php#astro
    const cloudCover = ["0%-6%","6%-19%","19%-31%","31%-44%","44%-56%","56%-69%","69%-81%","81%-94%", "94%-100%"];
    const windSpeed = [ "Below 0.3m/s (calm)", "0.3-3.4m/s (light)","3.4-8.0m/s (moderate)","8.0-10.8m/s (fresh)", 
                    "10.8-17.2m/s (strong)","17.2-24.5m/s (gale)","24.5-32.6m/s (storm)","Over 32.6m/s (hurricane)"];

    // the state of the map viewer
    const [viewState, setViewState] = useState({
        longitude: -100,
        latitude: 40,
        zoom: 3.5
      });
    
    let data = {};
    listOfSources.forEach((source) => {
        data[source.dataName] = source.defaultDisplay;

    });
    const [enableSource, setEnableSource] = useState(data);

    // for the return data from the api
    const [weatherData, setWeatherData] = useState({});
    // used to signal retrieval of data and to disable "Get Weather" Button when making a request
    const [signalGetInfo, setGetInfo] = useState(false);

    const [hoverInfo, setHoverInfo] = useState(null);

    const [interactiveLayerIdsList, setInteractiveLayerIdsList] = useState([]);


    // request information from API
    useEffect(() => {
        if (signalGetInfo) {
            const parameters = {
                lon:viewState.longitude,
                lat:viewState.latitude,
                ac: 0,
                unit: "metric",
                output: "json",
                tzshift: 0
            };
            // TODO: meteo has more information that can be added snow depth, etc.
            // TODO: check out https://www.7timer.info/doc.php#meteo
            fetch("https://www.7timer.info/bin/astro.php?" + new URLSearchParams(parameters).toString(), {
                method: 'GET'
            })
            .then((res) => res.json())
            .then((data) => {
                let newWeather = {
                    temp: data.dataseries[0].temp2m,
                    cloudCover: data.dataseries[0].cloudcover,
                    windDirection: data.dataseries[0].wind10m.direction,
                    windSpeed: data.dataseries[0].wind10m.speed
                }
                setWeatherData((prevState) => {
                    return ({...prevState, weather: newWeather })
                })
            })
            .then(() => setGetInfo(false));
        }
    }, [signalGetInfo, viewState])
    


    const onHover = useCallback(event => {
        const {
          features,
          point: {x, y}
        } = event;
        const hoveredFeature = features && features[0];
        // prettier-ignore
        setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
      }, []);
    
    return (
        <>
            <div id="map-wrapper">
                <BsPlusLg id="center"/>
                <div  id="side-bar">
                    <p> Longitude: {viewState.longitude.toFixed(2)} | Latitude: {viewState.latitude.toFixed(2)} | Zoom : {viewState.zoom.toFixed(1)} </p>
                    <CountrySearch setViewState={setViewState}/>
                    {weatherData.weather? <p> Temperature: {weatherData.weather.temp} | Cloud Cover: {cloudCover[weatherData.weather.cloudCover]} | Wind Direction: {weatherData.weather.windDirection} | Wind Speed: {windSpeed[weatherData.weather.windSpeed]}</p> : <></>}
                    <Button onClick={() => {setGetInfo(true)}} disabled={signalGetInfo}>Get Weather</Button>
                    {listOfSources.map((source) => 
                        <Form.Check
                            key={source.dataName}
                            label={`Select to view ${source.dataName} data.`} 
                            onClick={() => {
                                    setEnableSource((prevState) => {
                                        return {...prevState, [source.dataName] : !enableSource[source.dataName]}
                                    })
                                }
                            }
                        />
                    )}                   
                </div>
                <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    interactiveLayerIds={interactiveLayerIdsList}
                    onMouseMove={onHover}
                    mapboxAccessToken={variables.MAPBOX_ACCESS_TOKEN}
                >  
                    {listOfSources.map((source) => 
                        <DisplaySource 
                            enabledDisplay = {enableSource[source.dataName]} 
                            layerColour={source.layerColour} 
                            dataURL= {source.dataURL} 
                            cluster={source.enableClustering}
                            dataName={source.dataName}
                            setInteractiveLayerIdsList={setInteractiveLayerIdsList}
                            layerStyle={source.layerStyle}
                        />
                    )}
                    
                    {hoverInfo && (
                        <div id="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
                            {Object.keys(hoverInfo.feature.properties).map((value) => 
                                <div key={hoverInfo.feature.properties[value]}>{value.charAt(0).toUpperCase() + value.slice(1)}: {hoverInfo.feature.properties[value]}</div>
                            )}  
                        </div>
                    )}
                </Map>
                
            </div>
            <NavBar color="black"/>
        </>
    );
}
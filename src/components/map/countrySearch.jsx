/*
 
  Braeden's Personal Website
  Author: Braeden Norman
  Date: 2022-11-12

  Helpful Information


 */

import * as React from 'react';
import {useState, useEffect} from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import './countrySearch.css';


export default function CountrySearch(props) {
    const setViewState = props.setViewState;

    const [locations, setLocations] = useState(null);
    const [locationSearch, setLocationSearch] = useState("");


    useEffect( () => {
        fetch(import.meta.env.VITE_MAP_API + "getLocations",{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((data) => setLocations(data.locations))
    }, []);


    const changeView = (coordinates) => {
        setViewState((prevState) => {
            return ({...prevState, 
                longitude: Number(coordinates[0]),
                latitude: Number(coordinates[1]),
                zoom: 3.5})
        }
        )

    }


    return (
        <Dropdown id="country-search">  
            <Dropdown.Toggle>
                <Form.Control type="search" placeholder="Search for Country" onChange={(e)=>{setLocationSearch(e.target.value)}}></Form.Control>
            </Dropdown.Toggle>
            { locations &&
            <Dropdown.Menu>
                {locations.map((e) => {
                    if (e.name.toLowerCase().includes(locationSearch.toLowerCase())) {
                        return (
                            <Dropdown.Item key={e.name} onClick={() => {changeView(e.coordinates)}}>{e.name}</Dropdown.Item>
                        )
                    }
                    return null;
                })}
            </Dropdown.Menu>}
        </Dropdown>
    );
}
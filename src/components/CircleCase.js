import React from 'react';
import {Circle, Popup} from 'react-leaflet';

const CircleCase = (props) => {

    let radiusSize;
    let fColor;
    let circleColor;
    if(props.latestTotalCases < 100) {
        radiusSize = 40000;
        fColor = 'green';
        circleColor = 'orange';
    }else if(props.latestTotalCases >= 100 && props.latestTotalCases < 500) {
        radiusSize = 50000;
        fColor = 'red';
        circleColor = 'orange';
    }else if(props.latestTotalCases >= 500 && props.latestTotalCases <= 5000) {
        radiusSize = 80000;
        fColor = 'red';
        circleColor = 'yellow';
    }else {
        radiusSize = 140000;
        fColor = 'black';
        circleColor = 'red';
    }
    
    

    return(
        <Circle center={[props.lat, props.longi]}
                color={circleColor}
                fillColor={fColor}
                radius={radiusSize}>
            <Popup center={[props.lat, props.longi]}>
                {props.caseState} <br /> {props.caseCountry}
                <br></br>
                Cases: {props.latestTotalCases}
            </Popup>
        </Circle>
    );
};

export default CircleCase;
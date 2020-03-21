import React from 'react';
import './App.css';
import axios from 'axios';
import L from 'leaflet';
import CircleCase from './components/CircleCase';
import { Row, Col, Toast, ToastHeader } from 'reactstrap';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet'
import { Card, CardTitle, CardText, Navbar, NavbarBrand, Table } from 'reactstrap';

import gray from './imgs/gray.png';
import red from './imgs/red.png';
import orange from './imgs/orange.png';
import green from './imgs/green.png';
import coronavirus from './imgs/Coronavirus.png';

var myIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNCIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEwMjguNCkiPjxwYXRoIGQ9Im0xMi4wMzEgMTAzMC40Yy0zLjg2NTcgMC02Ljk5OTggMy4xLTYuOTk5OCA3IDAgMS4zIDAuNDAxNyAyLjYgMS4wOTM4IDMuNyAwLjAzMzQgMC4xIDAuMDU5IDAuMSAwLjA5MzggMC4ybDQuMzQzMiA4YzAuMjA0IDAuNiAwLjc4MiAxLjEgMS40MzggMS4xczEuMjAyLTAuNSAxLjQwNi0xLjFsNC44NDQtOC43YzAuNDk5LTEgMC43ODEtMi4xIDAuNzgxLTMuMiAwLTMuOS0zLjEzNC03LTctN3ptLTAuMDMxIDMuOWMxLjkzMyAwIDMuNSAxLjYgMy41IDMuNSAwIDItMS41NjcgMy41LTMuNSAzLjVzLTMuNS0xLjUtMy41LTMuNWMwLTEuOSAxLjU2Ny0zLjUgMy41LTMuNXoiIGZpbGw9IiNjMDM5MmIiLz48cGF0aCBkPSJtMTIuMDMxIDEuMDMxMmMtMy44NjU3IDAtNi45OTk4IDMuMTM0LTYuOTk5OCA3IDAgMS4zODMgMC40MDE3IDIuNjY0OCAxLjA5MzggMy43NDk4IDAuMDMzNCAwLjA1MyAwLjA1OSAwLjEwNSAwLjA5MzggMC4xNTdsNC4zNDMyIDguMDYyYzAuMjA0IDAuNTg2IDAuNzgyIDEuMDMxIDEuNDM4IDEuMDMxczEuMjAyLTAuNDQ1IDEuNDA2LTEuMDMxbDQuODQ0LTguNzVjMC40OTktMC45NjMgMC43ODEtMi4wNiAwLjc4MS0zLjIxODggMC0zLjg2Ni0zLjEzNC03LTctN3ptLTAuMDMxIDMuOTY4OGMxLjkzMyAwIDMuNSAxLjU2NyAzLjUgMy41cy0xLjU2NyAzLjUtMy41IDMuNS0zLjUtMS41NjctMy41LTMuNSAxLjU2Ny0zLjUgMy41LTMuNXoiIGZpbGw9IiNlNzRjM2MiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMTAyOC40KSIvPjwvZz48L3N2Zz4=',
  iconSize: [64, 64],
  iconAnchor: [32, 60],
  popupAnchor: [-10, -90],

});


class App extends React.Component {

  constructor() {
    super();

    this.state = {
      lat: 51.505,
      lng: -0.09,
      haveUserLocation: false,
      zoom: 2,
      caseStats: []
    }
  }

  componentDidMount() {



    //Get user location
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({

        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 5

      })
    });

    axios.get('https://tracking-corona-server.herokuapp.com/api/data')
      .then(res => {
        const c = res.data;
        this.setState({ caseStats: c });
      });

  }


  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className='App'>

        <Navbar color="dark" dark expand="md">
          <NavbarBrand className="navbar-brand mx-auto" href="/" style={{ fontFamily: 'pacifico' }}>
            <img src={coronavirus} style={{ width: '40px', height: '40px' }} />Covid-19 Tracker</NavbarBrand>

        </Navbar>

        <Map className="map" center={position} zoom={this.state.zoom} maxBounds={[[-85, -220], [85, 250]]}>
          <TileLayer
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            minZoom='2'

          />
          <Marker icon={myIcon} position={position}>
            <Popup onClick={this.clickPopup} position={position}>You</Popup>
          </Marker> 

          {this.state.caseStats.map(c =>

            c.latestTotalCases !== 0 ? <CircleCase
              lat={c.lat}
              longi={c.longi}
              caseState={c.state}
              caseCountry={c.country}
              latestTotalCases={c.latestTotalCases}
            /> : null


          )}
        </Map>

        <Card body className="card-form" style={{ backgroundColor: '#66666699', borderColor: '#333' }}>
          <CardTitle style={{ color: 'white' }}><h4>Severity</h4></CardTitle>
          <Row>
            <Col>
              <img
                src={gray}
                width="100"
                height="100"
                className="d-inline-block align-center"
                style={{ borderRadius: '100px', marginLeft: '10px', border: '4px solid red', opacity: '0.5' }}
              />
              <CardTitle style={{ font: '60', color: 'white' }}> >5000 Cases </CardTitle>
            </Col>

          </Row>
          <br></br>

          <Row>
            <Col>
              <img
                src={red}
                width="75"
                height="75"
                className="d-inline-block align-center"
                style={{ borderRadius: '100px', marginLeft: '10px', border: '3px solid yellow', opacity: '0.5' }}
              />
              <CardTitle style={{ font: '60', color: 'white' }}> 500~5000 Cases</CardTitle>
            </Col>
          </Row>

          <br></br>
          <Row>
            <Col>
              <img
                src={red}
                width="50"
                height="50"
                className="d-inline-block align-center"
                style={{ borderRadius: '100px', marginLeft: '10px', border: '3px solid orange', opacity: '0.5' }}
              />
              <CardTitle style={{ font: '60', color: 'white' }}> 100~499 Cases</CardTitle>
            </Col>
          </Row>

          <br></br>
          <Row>
            <Col>
              <img
                src={green}
                width="25"
                height="25"
                className="d-inline-block align-center"
                style={{ borderRadius: '100px', marginLeft: '10px', border: '3px solid orange', opacity: '0.3' }}
              />
              <CardTitle style={{ font: '60', color: 'white' }}> {'<100 Cases'} </CardTitle>
            </Col>
          </Row>


        </Card>

        {/* Second Card */}
        {/* =============================================================================== */}


        <div>

          <Card body className="second-card" style={{ backgroundColor: '#d9d9d9', borderColor: '#333', maxHeight: "800px" }}>
            <h3>Confirmed Cases</h3>
            <p>*Sorted in descending order</p>

            {/* Table */}
            <div style={{
              maxHeight: '650px',
              overflowY: 'auto'
            }}>

              <Table hover bordered height="200" >
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>State/Province</th>
                    <th>#</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.caseStats.map(c => (c.latestTotalCases !== 0) ?<tr>
                    <th scope="row">{c.country}</th>
                    <td>{c.state}</td>
                    <td>{c.latestTotalCases}</td>
                  </tr>:null)}
                </tbody>
              </Table>
            </div>
          </Card>
        </div>

        <br></br>
        <br></br>


        <div className="credit-text">

          <Toast style={{ height: 30 }}>
            <ToastHeader>
              <p>
                Data Source: <a href="https://github.com/CSSEGISandData/COVID-19">JHU CSSE</a>,
                <a href='http://3g.dxy.cn/newh5/view/pneumonia'>DXY</a>,
                <a href='https://www.who.int/'>WHO</a>,
                <a href='https://www.cdc.gov/coronavirus/2019-ncov/index.html'>US CDC</a>
              </p>
            </ToastHeader>
          </Toast>


          <br></br>

        </div>

        <h4 style={{ fontFamily: 'pacifico' }}>Stay Healthy, Everyone</h4>
        <iframe src="https://giphy.com/embed/bn0zlGb4LOyo8" width="500" height="451" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/90s-wink-nicolas-cage-bn0zlGb4LOyo8"></a></p>
        <footer className="page-footer font-small blue">


          <div className="footer-copyright text-center py-3">© 2020 Made by:
                    <a href="/"> Allen Li</a>
          </div>


        </footer>


      </div>

    );
  }
}

export default App;

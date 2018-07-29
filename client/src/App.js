import React, { Component } from "react";
import "./App.css";
import logo from "./Medical.png"
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Joi from 'joi';

const schema = Joi.object().keys({
  name: Joi.string().min(1).max(30).required(),
  message:Joi.string().min(1).max(500).required(),
})

const API_URL = window.location.hostname ==='localhost'? 'http://localhost:5000/api/messages':'production';


class App extends Component {
  state = {
    location: {
      lat: 51.505,
      lng: -0.09
    },
    haveUsersLocation: false,
    zoom: 3,
    userMessage:{
      name:'',
      message:''
    },
    sendingMessage:false,
    sentMessage:false,
    messages:[]
  };

  componentDidMount() {

    fetch(API_URL)
      .then(res=>res.json())
      .then(messages=>{
        this.setState({
          messages
        })
      })

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          haveUsersLocation: true,
          zoom: 13
        });
      },
      () => {
        console.log("hey  allow location setting");
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(location => {
            this.setState({
              location: {
                lat: location.latitude,
                lng: location.longitude
              },
              haveUsersLocation: true,
              zoom: 13
            });
          });
      }
    );
  }

  formIsValid =()=>{
        const userMessage ={
          name:this.state.userMessage.name,
          message:this.state.userMessage.message
        };
        const result = Joi.validate(userMessage,schema);
        
        return !result.error && this.state.haveUsersLocation ? true: false
  }

  formSubmitted =(event) =>{
    event.preventDefault();
    
    this.setState({
      sendingMessage:true
    })
    if(this.formIsValid()){
      fetch(API_URL,{
        method:'POST',
        headers:{
          'content-type':'application/json',
        },
        body: JSON.stringify({
          name:this.state.userMessage.name,
          message:this.state.userMessage.message,
          latitude:this.state.location.lat,
          longitude:this.state.location.lng
        })
      }).then(res=>res.json())
      .then(message=>{
        console.log(message);
        this.setState({
          sendingMessage:false,
          sentMessage:true
        })
      })
    }
  }
  valueChanged = (event)=>{
    const {name,value}=event.target;
    this.setState((prevState)=>({
      userMessage:{
        ...prevState.userMessage,
        [name]:value
      }
    }))
  }


  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div>
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.haveUsersLocation ? (
            <Marker position={position}>
            </Marker>
          ) : 
            ""
          }
          {this.state.messages.map(message=>(
            <Marker dragable="true" key={message._id} position={[message.latitude,message.longitude]}>
            <Popup>
              <em>{message.name}:</em>{message.message}
              <img style={{height:"100px"}} src={logo} alt="sing"/>
            </Popup>
          </Marker>)
          )}


        </Map>
        <div className="card message-form">
          <div className="card-body">
            <h5 className="card-title">Ambulance Service</h5>
            <p className="card-text">Submit your location </p>
            

            {
              !this.state.sendingMessage && !this.state.sentMessage ? 
              
              
              <form onSubmit={this.formSubmitted}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    onChange={this.valueChanged}
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    aria-describedby="emailHelp"
                    placeholder="Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Emergency</label>
                  <textarea
                  onChange={this.valueChanged}
                  name="message"
                  className="form-control" id="message" rows="3" placeholder="what's the emergency"></textarea>
                </div>
                <button type="submit"  className="btn btn-primary" disabled={!this.formIsValid()}>Submit</button>
              </form> :  <p className="card-text">We'll  reach  you as soon as possible</p>
            }
            
          </div>
        </div>
      </div>
    );
  }
}

export default App;

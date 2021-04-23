import React from "react";
import RecommendationsRow from "./RecommendationsRow";
import "../style/Recommendations.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";

export default class Recommendations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantName: "Las Vegas",
      crusine: [],
      recrestaurants: [],
      Latitude: 0,
      Longitude: 0,
      flag: 1,
      
    };
    // this.componentDidMount = this.componentDidMount(this);
    // this.getUpdate=this.getUpdate(this);
    this.handlerestaurantNameChange = this.handlerestaurantNameChange.bind(this);
    this.submitrestaurant = this.submitrestaurant.bind(this);


  }

  onChange(e) {
    // current array of options
    const options = this.state.crusine
    let index

    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      options.push(e.target.value);
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = options.indexOf(e.target.value);
      options.splice(index, 1);
    }

    // update the state with the new array of options
    this.setState({ crusine: options });
    console.log(this.state.crusine);

  }

  componentDidMount() {


    const success = position => {
      this.setState({ Latitude: position.coords.latitude, Longitude: position.coords.longitude }, () => {
        this.getUpdate();
      })
    }

    function error() {
      console.log("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);


  }



  getUpdate() {
    console.log(" =========================INSIDE UPDATE=====================");
    console.log("this.state.Latitude", this.state.Latitude);
    console.log("this.state.Longitude", this.state.Longitude);
    const url = new URL('http://localhost:8082/recommendations/');
    Axios.post(
      url, {
      lat: this.state.Latitude,
      lon: this.state.Longitude,
      cru: this.state.crusine,
      city: this.state.restaurantName,
      flag: 1,
    }
    ).then(
      (res) => {
        // Convert the response data to a JSON.
        return res.data
      },
      (err) => {
        // Print the error if there is one.
        console.log(err);
      }
    )
      .then(
        (restaurantList) => {
          if (!restaurantList) return;
          console.log(restaurantList);
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          const RecommendationsRowDivs = restaurantList.map(
            (restaurantObj, i) => (
              <RecommendationsRow
                name={restaurantObj.NAME}
                address={restaurantObj.ADDRESS}
                city={restaurantObj.CITY}
                state={restaurantObj.STATE}
                stars={restaurantObj.STARS}
                reviews={restaurantObj.REVIEW_COUNT}

              />
            )
          );

          // Set the state of the keywords list to the value returned by the HTTP response from the server.

          this.setState({
            recrestaurants: RecommendationsRowDivs,
            restaurantName: restaurantList[0].CITY,
          });
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }

      );
  }



  handlerestaurantNameChange(e) {
    this.setState({
      restaurantName: e.target.value,
    });
  }
  // changed here crusine


  submitrestaurant() {

    const url = new URL("http://localhost:8082/recommendations/");

    Axios.post(
      url, {
      lat: this.state.Latitude,
      lon: this.state.Longitude,
      cru: this.state.crusine,
      city: this.state.restaurantName,
      flag: 0
    }
    ).then(
      (res) => {
        // Convert the response data to a JSON.
        return res.data
      },
      (err) => {
        // Print the error if there is one.
        console.log(err);
      }
    )
      .then(
        (restaurantList) => {
          if (!restaurantList) return;
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          console.log(restaurantList);

          const RecommendationsRowDivs = restaurantList.map(
            (restaurantObj, i) => (
              <RecommendationsRow
                name={restaurantObj.NAME}
                address={restaurantObj.ADDRESS}
                city={restaurantObj.CITY}
                state={restaurantObj.STATE}
                stars={restaurantObj.STARS}
                reviews={restaurantObj.REVIEW_COUNT}
              />
            )
          );

          // Set the state of the keywords list to the value returned by the HTTP response from the server.
          this.setState({
            recrestaurants: RecommendationsRowDivs,
          });
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
  }





  render() {



    return (
      <div className="Recommendations">
        <div className="container recommendations-container">
          <div className="jumbotron jumbotron-custom">
            <div className="h5">Restaurant Recommendations</div>
            <br></br>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter restaurant Name"
                value={this.state.restaurantName}
                onChange={this.handlerestaurantNameChange}
                id="restaurantName"
                className="restaurant-input"
              />


            <label>Italian</label>
            <input type="checkbox" value='ITALIAN' onChange={this.onChange.bind(this)} />
            <label>Indian</label>
            <input type="checkbox" value='INDIAN' onChange={this.onChange.bind(this)} />
            <label>Chinese</label>
            <input type="checkbox" value='CHINESE' onChange={this.onChange.bind(this)} />
      
              <button
                id="submitrestaurantBtn"
                className="submit-btn"
                onClick={this.submitrestaurant}
              >
                Submit
                </button>
            </div>
            <div className="header-container">
              <div className="h6">You may like ...</div>
            </div>
            <div >
              {this.state.recrestaurants}
            </div>
          </div>
        </div>
      </div>
    );
  }


}

import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, AppRegistry, Button } from 'react-native';
import { Constants, Location, Permissions, Google } from 'expo';
import MapView from 'react-native-maps';


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentColor: "#841584",
      location: {
        coords: {
          latitude: 46.794219,
          longitude: -71.244461
        }
      }
    };
    this._getLocationAsync();
    console.log("#######" + this.state.location.coords.latitude + "#########")
  }

  componentWillMount() {
    this._getLocationAsync();
  }

  componentDidMount() {
    // setInterval(() => { this._getLocationAsync(); }, 1000)
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let locationFetch = await Location.getCurrentPositionAsync({});
    this.setState(() => {
      return { location: locationFetch };
    });

  }

  setRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    this.setState(() => {
      return { currentColor: color };
    });

    console.log('button clicked!')
    console.log(color);
    console.log(this.state);
  };

  pinMarker(latitude, longitude) {
    return (
      <MapView.Marker
        coordinate={
          {
            latitude: latitude,
            longitude: longitude
          }
        }
        title="This is a title"
        description="This is a description"
      />)
  }

  render() {
    let text = 'Waiting..';
    let longlong = 0;
    let latlat = 0;

    if (this.state.location) {
      text = JSON.stringify({
        latitude: this.state.location.coords.latitude,
        longitude: this.state.location.coords.longitude
      },
        null, '\t');
      latlat = this.state.location.coords.latitude;
      longlong = this.state.location.coords.longitude;

      console.log("@@@@@@@@@@" + longlong + "@@@@@@@" + latlat + "@@@@@@@")
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <MapView
          style={{ flex: 1 }}
          ref={(mapView) => { _mapView = mapView; }}
          provider="google"
          initialRegion={{
            latitude: latlat,
            longitude: longlong,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onUserLocationChange={() => {
            this._getLocationAsync(6);
            _mapView.animateToCoordinate({
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude
            }, 1000)
          }}
          showsUserLocation
        >
        {this.pinMarker(this.state.location.coords.latitude, this.state.location.coords.longitude)}
        </MapView>
        <Button
          onPress={() => {
            this.setRandomColor();
            this._getLocationAsync(6);
          }}
          title="Change color"
          color={this.state.currentColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
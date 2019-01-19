import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, AppRegistry, Button } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { MapView } from 'expo';


export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {currentColor: "#841584"};
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
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

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  setRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    this.setState( () => {
      return { currentColor: color };
    });

    console.log('button clicked!')
    console.log(color);
    console.log(this.state);
  };
  
  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify({
        longitude : this.state.location.coords.longitude, latitude : + this.state.location.coords.latitude},
        null, '\t');
    }
    return (
      <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
        <Button
          onPress={() => {
            this.setRandomColor();
            this._getLocationAsync();
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
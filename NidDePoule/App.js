import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Location, Permissions, MapView } from 'expo'
import { SQLite } from 'expo'

const db = SQLite.openDatabase('db.db')

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentColor: '#841584',
      location: {
        coords: {
          latitude: 46.794219,
          longitude: -71.244461
        }
      }
    }
  }

  componentWillMount() {
    this._getLocationAsync()
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists items (id integer primary key not null, time BIGINT, longitude REAL, latitude REAL);'
        //'drop table items'
      )
    })
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      })
    }

    let locationFetch = await Location.getCurrentPositionAsync({})
    this.setState(() => {
      return { location: locationFetch }
    })
  }

  setRandomColor = () => {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }

    this.setState(() => {
      return { currentColor: color }
    })

    console.log('button clicked!')
    console.log(color)
    console.log(this.state)
  }

  pinMarker(latitude, longitude) {
    return (
      <View>
        <MapView.Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude
          }}
          title="This is a title"
          description="This is a description"
        />
        <MapView.Marker
          coordinate={{
            latitude: 45.513320,
            longitude: -73.601810
          }}
          title="This is a title"
          description="This is a description"
        />
        <MapView.Marker
          coordinate={{
            latitude: 45.508041,
            longitude: -73.618131
          }}
          title="This is a title"
          description="This is a description"
        />
        <MapView.Marker
          coordinate={{
            latitude: 45.505168,
            longitude: -73.610619
          }}
          title="This is a title"
          description="This is a description"
        />

      </View>

    )
  }

  clearLocalData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'drop table items;'
        //'drop table items'
      )
      tx.executeSql(
        'create table if not exists items (id integer primary key not null, time BIGINT, longitude REAL, latitude REAL);'
        //'drop table items'
      )

    })
  }

  saveLocation = () => {
    db.transaction(
      tx => {
        tx.executeSql(
          'insert into items (time, longitude, latitude) values (?, ?, ?)',
          [
            this.state.location.timestamp,
            this.state.location.coords.latitude,
            this.state.location.coords.longitude
          ]
        )
        tx.executeSql('select * from items', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        )
      },
      null,
      this.update
    )
  }

  render() {
    let text = 'Waiting..'
    let longlong = 0
    let latlat = 0

    if (this.state.location) {
      text = JSON.stringify(
        {
          time: this.state.location.timestamp,
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude
        },
        null,
        '\t'
      )
      latlat = this.state.location.coords.latitude
      longlong = this.state.location.coords.longitude

      console.log('@@@@@@@@@@' + longlong + '@@@@@@@' + latlat + '@@@@@@@')
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          My location: {"\n"}
          Latitude: {this.state.location.coords.latitude + "\n"}
          Longitude: {this.state.location.coords.longitude}</Text>
        <MapView
          style={{ flex: 1 }}
          ref={mapView => {
            _mapView = mapView
          }}
          provider="google"
          initialRegion={{
            latitude: latlat,
            longitude: longlong,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          onUserLocationChange={() => {
            this._getLocationAsync(6)
            _mapView.animateToCoordinate(
              {
                latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude
              },
              1000
            )
          }}
          showsUserLocation
        >
          {this.pinMarker(
            this.state.location.coords.latitude,
            this.state.location.coords.longitude
          )}
        </MapView>
        <Button
          onPress={() => {
            this.setRandomColor()
            this._getLocationAsync(6)
            this.saveLocation()
          }}
          title="Nid de 🐔"
          color={this.state.currentColor}
        />
        <Button onPress={() => {
          this.clearLocalData();
        }}
          title="Clear" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#99ccff'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  }
})

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, Image} from 'react-native';

import logoImg from '../../../assets/ps4-logo.png';

export default class Logo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>GUIA</Text>
        <Image source={logoImg} resizeMode="contain" style={styles.image} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 80,
  },
  text: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
});

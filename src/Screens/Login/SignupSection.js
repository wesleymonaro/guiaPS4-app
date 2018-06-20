import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import { withNavigation } from 'react-navigation';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

class SignupSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={styles.text}>Criar conta</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Esqueceu a senha?</Text>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 65,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default withNavigation(SignupSection)

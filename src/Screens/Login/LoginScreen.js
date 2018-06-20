import React, { Component } from 'react';
import { StatusBar } from 'react-native';
//import PropTypes from 'prop-types';
import Logo from './Logo';
import Form from './Form';
import Wallpaper from './Wallpaper';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';

import { STATUS_BAR_COLOR } from "../Consts";

export default class LoginScreen extends Component {

  componentWillMount() {
    console.disableYellowBox = true
  }

  static navigationOptions = {
    title: "Login",
    header: null
  };

  render() {
    return (
      <Wallpaper>
        <StatusBar
          backgroundColor={STATUS_BAR_COLOR}
        />
        <Logo />
        <Form />
        <SignupSection />
        {/* <ButtonSubmit /> */}
      </Wallpaper>
    );
  }
}

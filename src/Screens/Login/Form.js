import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import firebase from 'react-native-firebase';
import moment from 'moment';
import User from "../../Models/User";
import base64 from 'base-64';

import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Text,
  AsyncStorage,
  Alert
} from 'react-native';

import { PRIMARY_COLOR } from "../Consts";
import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';

import usernameImg from '../../../assets/username.png';
import passwordImg from '../../../assets/password.png';
import eyeImg from '../../../assets/eye_black.png';

const MARGIN = 40;

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      email: 'wesley@onnze.com',
      password: '123456'
    };
    this.showPass = this.showPass.bind(this);

    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    if (this.state.isLoading) return;

    this.setState({ isLoading: true });
    Animated.timing(this.buttonAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();

    firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password)
      .then((data) => {

        let token = '';
        let codeEmail = base64.encode(this.state.email);
        let codePassword = base64.encode(this.state.password);
        token = base64.encode(`${codeEmail}|${codePassword}`);
        AsyncStorage.setItem('token', JSON.stringify(token));

        firebase.database().ref(`users/${this.state.email.toLowerCase().replace(/[^\w\s]/gi, '')}`)
          .once('value')
          .then((data) => {
            //console.log(data.val())
            let user = data.val();
            if (!user) {
              console.log('nao existe na base, criando novamente')
              let newUser = new User();
              let name = this.state.email.split('@');
              newUser.name = name[0];
              newUser.email = this.state.email.toLowerCase().replace(/[^\w\s]/gi, '');
              newUser.registerAt = moment().format('DD/MM/YYYY HH:mm:ss');
              newUser.id = '';
              newUser.key = this.state.email.toLowerCase().replace(/[^\w\s]/gi, '');

              firebase.database().ref(`users/`).child(this.state.email.toLowerCase().replace(/[^\w\s]/gi, '')).set(newUser)
                .then(() => {
                  newUser.sections = [];
                  AsyncStorage.setItem('loggedUser', JSON.stringify(newUser))
                    .then(() => {
                      console.log(newUser)
                      this.setState({ email: '', password: '', isLoading: false });
                      this.buttonAnimated.setValue(0);
                      this._onGrow();
                    })
                })

            } else {
              this.setState({ email: '', password: '', isLoading: false });
              this.buttonAnimated.setValue(0);
              this._onGrow();
            }

          })

      }).catch((err) => {
        console.log(err.code);

        let message = '';
        console.log(err)
        switch (err.code) {
          case 'auth/wrong-password':
            message = 'Senha inválida'
            break;
          case 'auth/user-not-found':
            message = 'O e-mail não está registrado. Registre-se para usar o app'
            break;
          case 'auth/user-disabled':
            message = 'Usuário desativado'
            break;

          default:
            message = 'Erro ao realizar login'
            break;
        }

        Alert.alert("Ops...", message);
        this.setState({ ...this.state, isLoading: false })
        this.buttonAnimated.setValue(0);
      })

    // setTimeout(() => {
    //   this._onGrow();
    // }, 2000);

    // setTimeout(() => {
    //   Actions.secondScreen();
    //   this.setState({ isLoading: false });
    //   this.buttonAnimated.setValue(0);
    //   this.growAnimated.setValue(0);
    // }, 2300);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  render() {

    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });


    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <UserInput
            source={usernameImg}
            placeholder="E-mail"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            value={this.state.email}
            onChangeText={(text) => this.setState({ ...this.state, email: text })}
          />
          <UserInput
            source={passwordImg}
            secureTextEntry={this.state.showPass}
            placeholder="Senha"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={this.state.password}
            onChangeText={(text) => this.setState({ ...this.state, password: text })}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btnEye}
            onPress={this.showPass}>
            <Image source={eyeImg} style={styles.iconEye} />
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <View style={styles.buttonContainer}>
          <Animated.View style={{ width: changeWidth }}>
            <TouchableOpacity
              style={styles.button}
              onPress={this._onPress}
              activeOpacity={1}>
              {this.state.isLoading ? (
                <ActivityIndicator size="small" style={styles.image} />
              ) : (
                  <Text style={styles.text}>LOGIN</Text>
                )}
            </TouchableOpacity>
            <Animated.View
              style={[styles.circle, { transform: [{ scale: changeScale }] }]}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
  },
  btnEye: {
    position: 'absolute',
    top: 55,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  buttonContainer: {
    flex: 1,
    //top: -95,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderColor: 'white',
    //borderWidth: 1,
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100,
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: PRIMARY_COLOR,
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  image: {
    width: 24,
    height: 24,
  },
});

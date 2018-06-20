import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import firebase from 'react-native-firebase';
import moment from 'moment';
import User from "../../Models/User";
import { PRIMARY_COLOR } from '../Consts';

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
  Alert
} from 'react-native';

import UserInput from './UserInput';
//import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';

import usernameImg from '../../../assets/username.png';
import passwordImg from '../../../assets/password.png';
import eyeImg from '../../../assets/eye_black.png';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      name: 'Wesley Monaro',
      email: 'wesley@onnze.com',
      password: '123456',
      repPassword: '123456'
    };
    this.showPass = this.showPass.bind(this);

    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    if (this.state.isLoading) return;

    console.log(this.state)

    if (!this.state.name || !this.state.email || !this.state.password || !this.state.repPassword) {
      Alert.alert("Ops...", "Preencha todos os campos.");
      return;
    }

    if (this.state.password !== this.state.repPassword) {
      Alert.alert("Ops...", "As senhas não conferem.");
      return;
    }

    this.setState({ isLoading: true });
    Animated.timing(this.buttonAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();


    //INIT LOGIN
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((data) => {


        let newUser = new User();
        newUser.name = this.state.name;
        newUser.email = this.state.email;
        newUser.registerAt = moment().format('DD/MM/YYYY HH:mm:ss');
        newUser.key = this.state.email.toLowerCase().replace(/[^\w\s]/gi, '');

        firebase.database().ref(`users/`).child(this.state.email.toLowerCase().replace(/[^\w\s]/gi, '')).set(newUser)
          .then(() => {

            this._onGrow();
            this.setState({ email: '', name: '', password: '', repPassword: '', isLoading: false })

          })

          .catch((err) => {
            console.log(err);
            Alert.alert("Ops...", 'Ocorreu um erro');
            this.setState({ ... this.state, isLoading: false })
            this.buttonAnimated.setValue(0);
          })


      })
      .catch((err) => {

        let message = '';
        console.log(err)
        switch (err.code) {
          case 'auth/email-already-in-use':
            message = 'O e-mail já foi registrado'
            break;
          case 'auth/invalid-email':
            message = 'O e-mail inserido é inválido'
            break;
          case 'auth/operation-not-allowed':
            message = 'Operação de login desabilitada'
            break;
          case 'auth/weak-password':
            message = 'Senha deve ter no mínimo 6 caracteres'
            break;

          default:
            message = 'Erro ao registrar'
            break;
        }

        Alert.alert("Ops...", message);
        this.setState({ ... this.state, isLoading: false })
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
            placeholder="Seu Nome"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            value={this.state.name}
            onChangeText={(text) => this.setState({ ...this.state, name: text })}
          />
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
            secureTextEntry={true}
            placeholder="Senha"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={this.state.password}
            onChangeText={(text) => this.setState({ ...this.state, password: text })}
          />
          <UserInput
            source={passwordImg}
            secureTextEntry={true}
            placeholder="Repita a Senha"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={this.state.repPassword}
            onChangeText={(text) => this.setState({ ...this.state, repPassword: text })}
          />

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
                  <Text style={styles.text}>REGISTRAR</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

import {
  LOAD_LOGGED_USER,
  LOADING
} from '../Types'
import { AsyncStorage, Alert, NetInfo } from "react-native";
import User from "../Models/User";
import base64 from 'base-64';
import firebase, { RNFirebase } from 'react-native-firebase';
import _ from 'lodash';
import moment from 'moment'
import AuthFacebook from '../Helpers/AuthFacebook';

export const loadLoggedUser = () => {
  return (dispatch) => {

    AsyncStorage.getItem('loggedUser')
      .then((data) => {
        console.log("user loaded: ", JSON.parse(data))

        if (data) {
          dispatch({
            type: LOAD_LOGGED_USER,
            payload: JSON.parse(data)
          })
        } else {
          dispatch({
            type: LOAD_LOGGED_USER,
            payload: {}
          })
        }
      }).catch((err) => console.log("Erro ao recuperar usuario logado ", err))

  }

}

export const saveLoggedUser = () => {
  return (dispatch) => {

    firebase.database().ref('users/-LBJQiWS3CRz1gN7uFHw')
      .once('value')
      .then((data) => {
        //console.log("user from FB: ", data.val())
        let user = data.val()
        delete user.password;

        AsyncStorage.setItem('loggedUser', JSON.stringify(user))
          .then(() => {
            // ...
          })
      })

  }
}

export const sendMailFotgotPassword = (email, navigate) => {
  return (dispatch) => {
    dispatch({
      type: LOADING,
      payload: true
    })

    firebase.auth().sendPasswordResetEmail(email)
      .then((data) => {
        console.log(data);
        dispatch({
          type: LOADING,
          payload: false
        })
        Alert.alert("Sucesso!", 'Link enviado com sucesso. Verifique seu e-mail.');
        dispatch(navigate);
      }).catch((err) => {
        console.log(err.message);
        let message = '';
        console.log(err)
        switch (err.code) {

          case 'auth/user-not-found':
            message = 'O e-mail não está registrado. Registre-se para usar o app'
            break;
          case 'auth/user-disabled':
            message = 'Usuário desativado'
            break;

          default:
            message = 'Erro ao resetar a senha'
            break;
        }

        Alert.alert("Ops...", message);

        dispatch({
          type: LOADING,
          payload: false
        })
      })
  }
}

export const checkIfUserIsVerified = () => {
  return (dispatch) => {
    NetInfo.getConnectionInfo().then((connection) => {
      if (connection.type !== "none") {
        console.log("checking USER");
        console.log(firebase.auth().currentUser)
      }
    })

  }
}

export const loginUser = (email, password, navigate) => {
  return (dispatch) => {
    dispatch({
      type: LOADING,
      payload: true
    })

    firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
      .then((data) => {

        let diff = moment().diff(moment(data.user.metadata.creationTime), 'days');
        let emailVerified = data.user.emailVerified;

        //VERIFICA SE E-MAIL DO USUÁRIO É VERIFICADO E SE TEM MAIS DE 3 DIAS
        if (diff > 3 && !emailVerified) {
          Alert.alert(
            'Ops...',
            'Você ainda não verificou o seu e-mail. Verifique pelo link que foi enviado para continuar usando o app.',
            [
              {
                text: 'Reenviar E-mail',
                onPress: () => firebase.auth().currentUser.sendEmailVerification().then(() => Alert.alert('Sucesso', 'Link de confirmação enviado. Verifique seu e-mail')).catch(() => Alert.alert('Ops...', 'Ocorreu um erro ao reenviar o link de confirmação. Aguarde um momento e tente novamente.'))
              },
              {
                text: 'OK'
              }
            ])
          dispatch({
            type: LOADING,
            payload: false
          })
          return;
        }

        let token = '';
        let codeEmail = base64.encode(email);
        let codePassword = base64.encode(password);
        token = base64.encode(`${codeEmail}|${codePassword}`);
        AsyncStorage.setItem('token', JSON.stringify(token));

        firebase.database().ref(`users/${email.toLowerCase().replace(/[^\w\s]/gi, '')}`)
          .once('value')
          .then((data) => {
            //console.log(data.val())
            let user = data.val();
            if (!user) {
              console.log('nao existe na base, criando novamente')
              let newUser = new User();
              let name = email.split('@');
              newUser.name = name[0];
              newUser.email = email.toLowerCase().replace(/[^\w\s]/gi, '');
              newUser.registerAt = moment().format('DD/MM/YYYY HH:mm:ss');
              newUser.id = '';
              newUser.key = email.toLowerCase().replace(/[^\w\s]/gi, '');

              firebase.database().ref(`users/`).child(email.toLowerCase().replace(/[^\w\s]/gi, '')).set(newUser)
                .then(() => {
                  newUser.sections = [];
                  AsyncStorage.setItem('loggedUser', JSON.stringify(newUser))
                    .then(() => {
                      console.log(newUser)
                      dispatch(navigate)

                      dispatch({
                        type: LOAD_LOGGED_USER,
                        payload: newUser
                      })

                      dispatch({
                        type: LOADING,
                        payload: false
                      })
                    })
                })

            }

            if (!user.sections) user.sections = [];
            AsyncStorage.setItem('loggedUser', JSON.stringify(user))
              .then(() => {
                console.log(user)
                dispatch(navigate)

                dispatch({
                  type: LOAD_LOGGED_USER,
                  payload: user
                })

                dispatch({
                  type: LOADING,
                  payload: false
                })
              })
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

        dispatch({
          type: LOADING,
          payload: false
        })
      })

  }
}

export const registerUser = (name, email, password, navigate) => {
  return (dispatch) => {
    dispatch({
      type: LOADING,
      payload: true
    })


    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((data) => {

        firebase.auth().currentUser.sendEmailVerification()
          .then(() => console.log('Email de verificacao enviado'))
          .catch((err) => console.log('erro ao enviar email de verificacao ', err));

        let newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.registerAt = moment().format('DD/MM/YYYY HH:mm:ss');
        newUser.id = data.uid;
        newUser.key = email.toLowerCase().replace(/[^\w\s]/gi, '');

        firebase.database().ref(`users/`).child(email.toLowerCase().replace(/[^\w\s]/gi, '')).set(newUser)
          .then(() => {

            Alert.alert("Sucesso!", "Usuário registrado com sucesso. Verifique seu e-mail e faça login com seus dados.")
            dispatch({
              type: LOADING,
              payload: false
            })
            dispatch(navigate)
          })

          .catch((err) => {
            console.log(err);
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

        dispatch({
          type: LOADING,
          payload: false
        })
      })
  }
}


export const updatePhotoURLUser = (user, firebaseURL) => {
  return (dispatch) => {

    AsyncStorage.getItem('loggedUser')
      .then((data) => {
        let user = JSON.parse(data);

        user.photoURL = firebaseURL;

        AsyncStorage.setItem('loggedUser', JSON.stringify(user))
          .then(() => {
            NetInfo.getConnectionInfo().then((connection) => {
              if (connection.type !== "none") {

                firebase.database().ref(`users/`).child(user.key).update(user)
                  .then(() => {
                    console.log('PHOTO URL atualizado com sucesso')
                  })
              }
            })

          })
      })
  }
}


export const loginWithFacebook = (navigate) => {
  return (dispatch) => {

    dispatch({
      type: LOADING,
      payload: true
    })

    AuthFacebook.Facebook.login(['email'])
      .then((token) => {
        firebase.auth()
          .signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token))
          .then((userFB) => {

            firebase.database().ref(`users/`).child(userFB.email.toLowerCase().replace(/[^\w\s]/gi, ''))
              .once('value')
              .then((snapshot) => {

                let userDB = snapshot.val();

                //PRIMEIRO LOGIN DO USUARIO
                if (!userDB) {

                  let newUser = new User();
                  newUser.name = userFB.displayName;
                  newUser.email = userFB.email;
                  newUser.registerAt = moment().format('DD/MM/YYYY HH:mm:ss');
                  newUser.id = userFB.uid;
                  newUser.key = userFB.email.toLowerCase().replace(/[^\w\s]/gi, '');
                  newUser.photoURL = userFB.photoURL;

                  firebase.database().ref(`users/`).child(newUser.key).set(newUser)
                    .then(() => {

                      AsyncStorage.setItem('loginFacebook', JSON.stringify(true));

                      AsyncStorage.setItem('loggedUser', JSON.stringify(newUser))
                        .then(() => {
                          dispatch(navigate)

                          dispatch({
                            type: LOAD_LOGGED_USER,
                            payload: newUser
                          })

                          dispatch({
                            type: LOADING,
                            payload: false
                          })
                        })
                    }).catch((err) => console.log(err))
                } else { //USUÁRIO JÁ EXISTE NA BASE
                  AsyncStorage.setItem('loggedUser', JSON.stringify(userDB))
                    .then(() => {
                      dispatch(navigate)

                      dispatch({
                        type: LOAD_LOGGED_USER,
                        payload: userDB
                      })

                      dispatch({
                        type: LOADING,
                        payload: false
                      })
                    })
                }
              })
          }).catch((err) => {
            console.log(err);
            dispatch({
              type: LOADING,
              payload: false
            })
          })
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: LOADING,
          payload: false
        })
      })
  }
}
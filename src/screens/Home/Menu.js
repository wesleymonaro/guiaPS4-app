import React, { Component } from 'react';

import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native';

import { withNavigation } from 'react-navigation';
import firebase from "react-native-firebase";

const window = Dimensions.get('window');

const primary = 'white';
const secondary = 'blue';
const textColor = 'black'

class Menu extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  goToList() {
    this.props.navigation.navigate('SectionList');
  }

  componentDidMount() {
    // AsyncStorage.getItem('loggedUser')
    //   .then((data) => {
    //     this.setState({ loggedUser: JSON.parse(data) })
    //   })
  }

  _confirmLogout() {
    Alert.alert(
      'Atenção',
      'Deseja realmente efetuar logout?',
      [
        { text: 'Não', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Sim', onPress: () => {
            this.logout()
          }
        },
      ],
      { cancelable: false }
    )
  }

  logout() {
    try {
      firebase.auth().signOut();

      AsyncStorage.removeItem('loggedUser')
        .then(() => {
          this.props.navigation.navigate('Login');
        })
    } catch (error) {
      console.log("ocorreu um erro ao deslogar")
    }

  }

  render() {
    const styles = StyleSheet.create({
      menu: {
        flex: 1,
        height: window.height,
        backgroundColor: 'white',
        //padding: 20,
      },
      menuItemBox: {
        flexDirection: 'row',
        marginTop: 10
      },
      menuItemIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },

      menuItemText: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingVertical: 5
      },
      icon: { color: textColor },
      text: {
        fontSize: 16,
        fontWeight: '600',
        color: textColor,
        paddingLeft: 8
      },
      spacement: {
        flex: .4,
        backgroundColor: primary,
      },
      header: {
        flex: 1,
        backgroundColor: secondary,
        alignItems: 'center',
        justifyContent: 'center'
      },
      optionsContainer: {
        flex: 7
      },
      logo: {
        width: 150,
        height: 70
      },
      profile: {
        flex: 1,
        padding: 10,
        flexDirection: 'row',
        borderBottomWidth: .5,
        borderBottomColor: 'gray'
      },
      avatar: {
        width: 60,
        height: 60,
        borderRadius: 30
      },
      badge: {
        width: 30,
        alignSelf: 'flex-end',
        backgroundColor: secondary,
        alignItems: 'center',
        //paddingRight: 0,
        borderRadius: 10
      }
    });

    return (
      <View style={styles.menu}>

        {/* <View style={styles.spacement}></View>
        <View style={styles.header}>
          <Image source={require('../../../assets/logo/uano_bg_orange.png')} style={styles.logo} resizeMode="contain" />
        </View> */}

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')} style={styles.profile}>
          <View style={{ flex: 1.5, justifyContent: 'center' }}>
            {/* <Image source={{ uri: this.state.loggedUser.photoURL }} style={styles.avatar} /> */}
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            {/* <Text style={{ fontSize: 13, color: textColor }}>{this.state.loggedUser.name}</Text> */}
          </View>
          <View style={{ position: 'absolute', bottom: 5, right: 5 }}>
            {/* <Icon lib="Entypo" style={styles.icon} name="edit" size={20} /> */}
          </View>
        </TouchableOpacity>

        <View style={styles.optionsContainer}>


          <TouchableOpacity style={styles.menuItemBox} onPress={() => this.goToList()}>
            <View style={[styles.menuItemText, { flex: 1 }]}>
              <Text style={styles.text}>Sessões</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', paddingRight: 20 }}>
              <View style={styles.badge}>
                {/* <Text style={[styles.text, { paddingLeft: -8, color: 'white', textAlign: 'center' }]}>{(this.state.loggedUser.sections) ? this.state.loggedUser.sections.length : 0}</Text> */}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemBox} onPress={() => this.props.navigation.navigate('Configuration')}>
            <View style={styles.menuItemText}>
              <Text style={styles.text}>Configurações</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemBox} onPress={() => this.props.navigation.navigate('Tutorial')}>
            <View style={styles.menuItemText}>
              <Text style={styles.text}>Rever Tutorial</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItemBox, { borderTopColor: 'gray', borderTopWidth: .5, paddingTop: 10 }]} onPress={() => this._confirmLogout()}>
            <View style={styles.menuItemText}>
              <Text style={[styles.text, { paddingLeft: -8, color: 'red' }]}>Sair</Text>
            </View>
          </TouchableOpacity>


        </View>
      </View>
    )
  }
}

export default withNavigation(Menu);
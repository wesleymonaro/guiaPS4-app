import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  NetInfo,
  Alert,
  Platform
} from 'react-native';

import { Button } from 'react-native-elements';

const primary = 'white';
const secondary = 'blue';
const textColor = 'black'

import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu';
import Menu from './Menu';

// var Fabric = require('react-native-fabric');
// var { Crashlytics } = Fabric;
import { withNavigation } from 'react-navigation';

class Home extends Component {

  componentDidMount() {
    console.disableYellowBox = true
    console.log(this.props);


    NetInfo.getConnectionInfo().then((connection) => {
      if (connection.type !== "none") {
        //this.props.syncAudios();

        AsyncStorage.getItem('loggedUser')
          .then((data) => {
            let user = JSON.parse(data);

            // Crashlytics.setUserName(user.name);
            // Crashlytics.setUserEmail(user.email);
            // Crashlytics.setUserIdentifier(user.key);
            // Crashlytics.setBool('palestrante', true);
            // Crashlytics.setString('registrado em', user.registerAt);

          })
      }
    })
  }

  static navigationOptions = {
    title: "Home",
    header: null
  };

  render() {

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
      },
      boxButton: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonBox: {
        width: 140,
        height: 140,
        backgroundColor: 'white',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonInner: {
        width: 100,
        height: 100,
        backgroundColor: secondary,
        borderRadius: 100,
      },
      logo: {
        marginBottom: 10,
        zIndex: 99,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

      }

    });

    return (
      <View style={styles.container}>
        <Text>Teste</Text>
        <Button
          raised
          icon={{ name: 'cached' }}
          title='BUTTON WITH ICON' />
      </View>
    );
  }
}


const mapStateToProps = state => ({

});

const mapDispatchToProps = {

};

const HomeWithProps = withNavigation(connect(mapStateToProps, mapDispatchToProps)(Home));


export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
      selectedItem: 'About',
    };
  }

  static navigationOptions = {
    title: "HomeScreen",
    header: null
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
    });

  render() {

    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        openMenuOffset={Dimensions.get('window').width / 2}
        autoClosing={true}
      >
        <HomeWithProps />

      </SideMenu>
    );
  }
}
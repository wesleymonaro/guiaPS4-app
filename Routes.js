import { StackNavigator } from "react-navigation";

import Home from "./src/Screens/Home/Home";
import LoginScreen from "./src/Screens/Login/LoginScreen";
import RegisterScreen from "./src/Screens/Register/RegisterScreen";

const Navigator = StackNavigator({
  Login: {
    screen: LoginScreen
  },
  Register: {
    screen: RegisterScreen
  },
  Home: {
    screen: Home
  }
},
  {
    headerMode: 'screen',
  }
);

export default Navigator;
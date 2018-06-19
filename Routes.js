import { StackNavigator } from "react-navigation";

import Home from "./src/screens/Home/Home";

const Navigator = StackNavigator({
  Home: {
    screen: Home
  }
},
  {
    headerMode: 'screen',
  }
);

export default Navigator;
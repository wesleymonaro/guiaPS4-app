import Reactotron from 'reactotron-react-native'

import host from './Host'

Reactotron.configure({ host }).useReactNative().connect();
import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {store, persistor} from './src/redux/store';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {loadAgentFromStorage} from './src/redux/slices/agentSlice';
import MainNavigator from './src/navigation/MainNavigator';
import Toast from 'react-native-toast-message';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
// import {loadDefaultPrinterAddress} from './src/redux/slices/settingsSlice';
import {Text, View} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';

// Custom hook to handle initial data loading
// const useInitialDataLoad = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Load agent data
//         const [token, agentInfo, printerAddress] = await Promise.all([
//           AsyncStorage.getItem('agentToken'),
//           AsyncStorage.getItem('agentInfo'),
//           AsyncStorage.getItem('defaultPrinter'),
//         ]);

//         // Handle agent data
//         if (token || agentInfo) {
//           const info = agentInfo ? JSON.parse(agentInfo) : null;
//           dispatch(loadAgentFromStorage({info, token}));
//         }

//         // Handle printer data
//         if (printerAddress) {
//           dispatch(loadDefaultPrinterAddress(JSON.parse(printerAddress)));
//         }
//       } catch (error) {
//         console.error('Error loading initial data:', error);
//         Toast.show({
//           type: 'error',
//           text1: 'Error Loading Data',
//           text2: 'Please try restarting the app',
//         });
//       }
//     };

//     loadData();
//   }, [dispatch]);
// };

const AppWrapper = () => {
  // useInitialDataLoad();
  return <MainNavigator />;
};

// Error boundary to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please restart the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = {
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
};
const dogTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#d25c3d', // Rusty orange-red (main project color)
    accent: '#8B4513', // Saddle brown (complementary dog-related tone)
    background: '#F5F5DC', // Beige (like dog's coat or kennel)
    surface: '#FFFFFF', // Clean white
    text: '#333333', // Dark gray for readability

    // Dog-themed custom colors
    dogPaw: '#6F4E37', // Coffee brown
    dogCollar: '#4A2D0F', // Deep brown
    dogBark: '#D2691E', // Darker orange shade
  },

  // Custom typography with a friendly, approachable feel
  fonts: {
    ...DefaultTheme.fonts,
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    light: 'Roboto-Light',
  },

  // Custom spacing and roundness for a playful dog theme
  roundness: 10, // Slightly rounded corners
};
const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={dogTheme}>
            <AppWrapper />
            <Toast />
          </PaperProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;

// import {
//   View,
//   Text,
//   ScrollView,
//   Alert,
//   StyleSheet,
//   NativeEventEmitter,
//   NativeModules,
//   ActivityIndicator,
//   Button,
//   Share,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import dings frrom './src/assets/sound/bell.wav';
// import Sound from 'react-native-sound';

// export default function App() {
//   const [Loading, SetLoading] = useState(false);

//   const [Mydata, setMyData] = useState([]);
//   const [id, Setid] = useState(0);
//   const [LoadData, setLoadData] = useState(true);
  // const ding = new Sound(dings, Sound.MAIN_BUNDLE, error => {
  //   console.log(error);
  // });
  // let object;
  // let a;
  // const OnpressFunction = value => {
  //   ding.play();
  //   a = Mydata;
  //   var __FOUND = a.find(function (post, index) {
  //     if (post.name == value) return true;
  //   });
  //   object = {id: a.length + 1, name: value};

  //   if (__FOUND == undefined) {
  //     a.push(object);
  //     setMyData(a);
  //   }
  //   SetLoading(false);
  // };

  // useEffect(() => {
  //   let eventEmitter;
  //   if (LoadData === true) {
  //     eventEmitter = new NativeEventEmitter(NativeModules.CalendarModule);

  //     eventEmitter.addListener('EventReminder', event => {
  //       SetLoading(true);
  //       OnpressFunction(event.eventProperty);
  //       console.log(event.eventProperty);
  //     });
  //   }
  //   return () => {
  //     eventEmitter.removeAllListeners('EventReminder');
  //   }
  // }, [LoadData]);

//   return (
//     <View>
//       {Loading == true ? (
//         <View
//           style={{
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             zIndex: 100,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <ActivityIndicator color="#fff" />
//         </View>
//       ) : null}
//       <Text>AhlamScreen</Text>

//       <ScrollView>
//         <View style={{width: '100%', backgroundColor: 'green'}}>
//           {Mydata != null ? (
//             <>
//               {Mydata.map((item, index) => {
//                 return (
//                   <View
//                     key={index}
//                     style={{
//                       justifyContent: 'space-between',
//                       flexDirection: 'row',
//                     }}>
//                     <Text
//                       style={{
//                         color: '#fff',
//                         borderRightWidth: 1,
//                         borderColor: '#fff',
//                         paddingLeft: 10,
//                         paddingRight: 10,
//                       }}>
//                       {index}
//                     </Text>
//                     <Text style={{color: '#fff'}}>{item.name}</Text>
//                   </View>
//                 );
//               })}
//             </>
//           ) : null}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

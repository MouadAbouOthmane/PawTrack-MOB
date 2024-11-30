// import React, {useEffect} from 'react';
// import {Provider, useDispatch} from 'react-redux';
// import {store, persistor} from './src/redux/store';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {loadAgentFromStorage} from './src/redux/slices/agentSlice';
// import MainNavigator from './src/navigation/MainNavigator';
// import Toast from 'react-native-toast-message';
// import {PaperProvider} from 'react-native-paper';
// import {loadDefaultPrinterAddress} from './src/redux/slices/settingsSlice';
// import {Text, View} from 'react-native';
// import {PersistGate} from 'redux-persist/integration/react';

// // Custom hook to handle initial data loading
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

// const AppWrapper = () => {
//   useInitialDataLoad();
//   return <MainNavigator />;
// };

// // Error boundary to catch rendering errors
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {hasError: false};
//   }

//   static getDerivedStateFromError(error) {
//     return {hasError: true};
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('App Error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>
//             Something went wrong. Please restart the app.
//           </Text>
//         </View>
//       );
//     }

//     return this.props.children;
//   }
// }

// const styles = {
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
// };

// const App = () => {
//   return (
//     <ErrorBoundary>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <PaperProvider>
//             <AppWrapper />
//             <Toast />
//           </PaperProvider>
//         </PersistGate>
//       </Provider>
//     </ErrorBoundary>
//   );
// };

// export default App;

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  ActivityIndicator,
  Button,
  Share,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import dings from './src/assets/sound/bell.wav';
import Sound from 'react-native-sound';
// import axios from 'axios';
// import {API_URL} from '../Config/Config';
// import RNFS from 'react-native-fs';
// import {ClearData, GetData, saveData} from '../services/CartService';

export default function App() {
  const [Loading, SetLoading] = useState(false);

  const [Mydata, setMyData] = useState([]);
  const [id, Setid] = useState(0);
  const [LoadData, setLoadData] = useState(true);
  const ding = new Sound(dings, Sound.MAIN_BUNDLE, error => {
    console.log(error);
  });
  let object;
  let a;
  const OnpressFunction = value => {
    ding.play();
    a = Mydata;
    var __FOUND = a.find(function (post, index) {
      if (post.name == value) return true;
    });
    object = {id: a.length + 1, name: value};

    if (__FOUND == undefined) {
      a.push(object);
      setMyData(a);
    }
    SetLoading(false);
  };
  // const createTwoButtonAlert = () =>
  //   Alert.alert('Delete Data', 'Delete Data', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'OK',
  //       onPress: () => {
  //         ClearData();
  //         setMyData([]);
  //       },
  //     },
  //   ]);
  // const SafeFileAlert = () =>
  //   Alert.alert('Save File', 'Save File', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     {text: 'OK', onPress: () => exportDataToExcel()},
  //   ]);
  // const exportDataToExcel = () => {
  //   // Created Sample data
  //   let sample_data_to_export = Mydata;
  //   saveData(Mydata);
  //   let wb = XLSX.utils.book_new();
  //   let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
  //   XLSX.utils.book_append_sheet(wb, ws, 'Users');
  //   const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

  //   // Write generated excel to Storage
  //   RNFS.writeFile(
  //     RNFS.ExternalStorageDirectoryPath + '/TagStm.xlsx',
  //     wbout,
  //     'ascii',
  //   )
  //     .then(r => {
  //       console.log('Success');
  //     })
  //     .catch(e => {
  //       console.log('Error', e);
  //     });
  // };
  // useEffect(() => {
  //   // ****************************************************************
  //   setTimeout(() => {
  //     GetData().then(res => {
  //       setMyData(res);
  //       setLoadData(true);
  //     });
  //   }, 1);
  //   // ***************************************************************
  // }, []);
  useEffect(() => {
    if (LoadData === true) {
      const eventEmitter = new NativeEventEmitter(NativeModules.CalendarModule);

      eventEmitter.addListener('EventReminder', event => {
        SetLoading(true);
        OnpressFunction(event.eventProperty);
      });
    }
  }, [LoadData]);

  return (
    <View>
      {Loading == true ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : null}
      <Text>AhlamScreen</Text>


      <ScrollView>
        <View style={{width: '100%', backgroundColor: 'green'}}>
          {Mydata != null ? (
            <>
              {Mydata.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        borderRightWidth: 1,
                        borderColor: '#fff',
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}>
                      {index}
                    </Text>
                    <Text style={{color: '#fff'}}>{item.name}</Text>
                  </View>
                );
              })}
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

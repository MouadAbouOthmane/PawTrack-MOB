// src/services/NavigationService.js
import {
  createNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
}

export function resetRoot(name) {
  console.log(name, 'resetting root');
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes: [{name}],
    });
  }
}

export function logoutAndReset() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}], // Replace 'Login' with your actual login screen name
      }),
    );
  }
}

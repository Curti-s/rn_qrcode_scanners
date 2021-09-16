/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import VisionCameraScreen from './screens/VisionCameraScreen';
import CameraScreen from './screens/CameraScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Visioncamera" component={VisionCameraScreen}/>
          <Stack.Screen name="Camera" component={CameraScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}


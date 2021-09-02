import * as React from 'react'
import { View, Text, Button } from 'react-native'

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>HomeScreen</Text>
      <View style={{ padding:4, textAlign:'center' }}>
        <Button
          title="Test with react native camera"
          onPress={() => navigation.navigate('Visioncamera')}/>
      </View>
      <View style={{ padding:4, textAlign:'center' }}>
        <Button 
          title="Test with react native vision camera"
          onPress={() => navigation.navigate('Visioncamera')}/>
      </View>
    </View>
  );
}

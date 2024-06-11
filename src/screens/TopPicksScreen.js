import React from 'react';
import { View, Text, Button } from 'react-native';

function TopPicksScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Example Screen</Text>
        <Button
          title="Go to Main"
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    );
  }
  
  export default TopPicksScreen;
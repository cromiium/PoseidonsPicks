import React from 'react';
import { View, Button } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

function DashScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <HeaderMenu navigation={navigation} reactNavigation={navigation} />
        <Title>Work In Progress</Title>
        <Paragraph>Dashboard Coming Soon</Paragraph>
        <Button
          title="Go to Main"
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    );
  }
  
  export default DashScreen;
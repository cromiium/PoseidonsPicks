import React from 'react';
import { View, Text, Button } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';
//React Components
import HeaderMenu from '../components/HeaderMenu.js';
import OfferCards from '../components/OfferCards.js';

// In OffersScreen.js
function OffersScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <HeaderMenu navigation={navigation} reactNavigation={navigation} />
        <Title>Offers</Title>
        <Paragraph>Check out our latest offers below!</Paragraph>
        <OfferCards verticalScroll={true} />
      </View>
    );
}
  
  export default OffersScreen;
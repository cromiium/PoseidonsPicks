import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';

const HorizontalCards = ({ verticalScroll = false }) => {
  // Example data for the cards
  const cardsData = [
    { id: 1, title: 'Sign Up Bonus', content: 'Get a 100% bonus on your first deposit up to $500. Double your money right from the start and increase your chances of hitting it big!' },
    { id: 2, title: 'Weekly Boost', content: 'Get a 50% reload bonus on your deposits every week! Boost your bankroll with up to $200 in bonus money every week.' },
    { id: 3, title: 'Referral Bonus', content: 'Invite your friends to join the fun and earn $250 in bonus money for each friend who signs up and makes a deposit!' },
  ];

  return (
    <ScrollView horizontal={!verticalScroll} showsHorizontalScrollIndicator={false}>
      {cardsData.map((card) => (
        <Card key={card.id} style={{ margin: 10, width: 300 }}>
          <Card.Content>
            <Title>{card.title}</Title>
            <Paragraph>{card.content}</Paragraph>
          </Card.Content>
          <Card.Actions style={{ justifyContent: 'space-between' }}>
            <Button onPress={() => console.log('More Info', card.id)}>More Info</Button>
            <Button onPress={() => console.log('Claim Here', card.id)}>Claim Here</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

export default HorizontalCards;
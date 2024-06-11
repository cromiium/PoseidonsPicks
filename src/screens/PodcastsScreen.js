import React from 'react';
import { View } from 'react-native';
import { Card, Button, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
//React Components
import HeaderMenu from '../components/HeaderMenu.js';

function PodcastsScreen({ navigation }) {
    const podcasts = [
        { title: 'Podcast 1', description: 'Description for Podcast 1' },
        { title: 'Podcast 2', description: 'Description for Podcast 2' },
        { title: 'Podcast 3', description: 'Description for Podcast 3' },
        { title: 'Podcast 4', description: 'Description for Podcast 4' },
    ];

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <HeaderMenu navigation={navigation} reactNavigation={navigation} />
            {podcasts.map((podcast, index) => (
                <Card key={index} style={{ margin: 10 }}>
                    <Card.Title title={podcast.title} />
                    <Card.Content>
                        <Paragraph>{podcast.description}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => {/* Navigate to podcast page */ }}>Start Listening</Button>
                    </Card.Actions>
                </Card>
            ))}
        </View>
    );
}

export default PodcastsScreen;
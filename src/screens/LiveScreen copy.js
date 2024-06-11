import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PaperProvider, BottomNavigation, Appbar, Menu, Button, Divider, Card } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

// Screens
import MainScreen from './MainScreen.js';
import MyBetsScreen from './MyBetsScreen.js';
import MyAccountScreen from './myAccountScreen.js';

//Components
import HeaderMenu from '../components/HeaderMenu.js';
import OfferCards from '../components/OfferCards.js';

const BottomTab = createBottomTabNavigator();



function LiveScreen({ navigation }) {

    //menu state variables
    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const [liveGames, setliveGames] = React.useState([]);
    const reactNavigation = useNavigation();

    // State Variables
    const [expandedCardIndex, setExpandedCardIndex] = React.useState(null);
    // API variables

    const API_KEY = '1f8b1fb4621b92c5ebc5280bfedf7bcf';
    const BASE_URL = 'https://api.the-odds-api.com/v4/sports';


    const fetchliveGames = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/upcoming/odds/`, {
                params: {
                    apiKey: API_KEY,
                    regions: 'us', // Adjust based on your needs
                    markets: 'h2h', // Adjust based on your needs
                    oddsFormat: 'american', // Optional
                }
            });

            setliveGames(response.data);
        } catch (error) {
            console.error('There was an error fetching live games:', error);
        }
    };

    React.useEffect(() => {
        fetchliveGames();
    }, []);

    return (

        <PaperProvider>
            {/* Top Ribbon */}
            <HeaderMenu
                navigation={navigation}
                reactNavigation={reactNavigation}
                menuVisible={menuVisible}
                openMenu={openMenu}
                closeMenu={closeMenu}
            />

            {/*Main Section*/}
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                <ScrollView style={{ padding: 10 }}>
                    <OfferCards />
                    <Divider />
                    {liveGames ? liveGames.map((game, index) => (
                        <Card key={index} onPress={() => { setExpandedCardIndex(prevIndex => prevIndex === index ? null : index); fetchOdds(game.sport_key, game.id); }} style={{ borderWidth: 1, borderColor: '#204d8c', marginBottom: 10 }}>
                            <Card.Title title={`${game.away_team} @ ${game.home_team}`} subtitle={new Date(game.commence_time).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />

                            {expandedCardIndex === index && liveGames && (
                                <Card.Content>
                                    {liveGames.bookmakers.filter(bookmaker => myBookmakers.includes(bookmaker.key)).map((bookmaker, i) => (
                                        <List.Section key={i}>
                                            <List.Subheader style={{ alignSelf: 'center' }}>{bookmaker.title}</List.Subheader>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                {bookmaker.markets.map((market) => (
                                                    market.outcomes.map((outcome, k) => (
                                                        <List.Item
                                                            key={k}
                                                            title={
                                                                <Button onPress={() => startBet(bookmaker, outcome, outcome.price)}
                                                                    style={{ borderWidth: 1, borderColor: '#204d8c', }}>
                                                                    {outcome.price}
                                                                </Button>}
                                                        />
                                                    ))
                                                ))}
                                            </View>
                                            <Divider style={{ alignSelf: 'center', marginTop: 10 }} />
                                        </List.Section>
                                    ))}
                                </Card.Content>
                            )}
                            <Card.Actions style={{ justifyContent: 'flex-start' }}>
                                <Text>{game.sport_key}</Text>
                            </Card.Actions>
                        </Card>
                    )) : null}
                </ScrollView>
            </View>

        </PaperProvider>
    );
}
export default LiveScreen;
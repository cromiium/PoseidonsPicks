import React from 'react';
import { Provider as PaperProvider, DefaultTheme, Divider, Button, Title, Appbar, Text, Card, TextInput, List, Modal, } from 'react-native-paper';
import { View, ScrollView, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
//import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, ScrollView, Button, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
// Redux imports
import { connect, useDispatch } from 'react-redux';
import { checkWallet } from '../redux/actions/accountActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const URI = 'https://api.the-odds-api.com';
const API_KEY = '1f8b1fb4621b92c5ebc5280bfedf7bcf';
const myBookmakers = ['draftkings', 'fanduel', 'betmgm', 'williamhill_us', 'wynnb'];


const mapStateToProps = state => ({
    account: state,
});

const myTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#204d8c', // change primary color
        accent: '#cdd5e2', // change accent color
    },
};


function MainScreen({ navigation, account, props }) {

    const [odds, setOdds] = React.useState([]);
    const [sports, setSports] = React.useState([]);
    const [expandedCardIndex, setExpandedCardIndex] = React.useState(null);
    const [oddsData, setOddsData] = React.useState(null);
    const [selectedBets, setSelectedBets] = React.useState([]);
    const [placedBets, setPlacedBets] = React.useState([]);
    const [showConfirmationCard, setShowConfirmationCard] = React.useState(false);
    const [wageredAmount, setWageredAmount] = React.useState(null);


    const dispatch = useDispatch();

    React.useEffect(() => {
        axios.get(`https://api.the-odds-api.com/v4/sports/?apiKey=${API_KEY}`)
            .then((response) => {
                setSports(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }, []);

    // Fetches scores data from API 
    const fetchScores = (sportKey) => {
        setExpandedCardIndex(null);
        setOddsData(null);
        axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?apiKey=${API_KEY}`)
            .then((response) => {
                console.log(response.data);
                setOdds(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const fetchOdds = (sportKey, eventId) => {
        axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/events/${eventId}/odds?apiKey=${API_KEY}&regions=us&oddsFormat=american`)
            .then((response) => {
                console.log(response.data);

                setOddsData(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const startBet = (bookmaker, outcome) => {
        const bet = {
            bookmaker: bookmaker.title,
            team: outcome.name,
            choice: outcome.price,
            wager: 0
        };
        console.log('STARTING BET')
        setSelectedBets(prevBets => {
            const newBets = [...prevBets, bet];
            console.log(newBets); // log the new state here
            return newBets;
        });
        setShowConfirmationCard(true);
    };

    // Handling Buttons
    const handleConfirm = () => {
        selectedBets.forEach(bet => {
            bet.wager += parseFloat(wageredAmount); //wagerAmount is a string, so we need to convert it to a float
            dispatch(checkWallet(bet)); // Dispatch each bet to the store REDUX STUFF
        });
        setShowConfirmationCard(false);
    };
    const handleCancel = () => {
        setSelectedBets([]);
        setShowConfirmationCard(false);
    };

    // Betting Functionality
    function calculateParlayOdds(odds1, odds2) {
        // Convert American odds to decimal odds
        let decimalOdds1 = odds1 > 0 ? odds1 / 100 + 1 : 100 / Math.abs(odds1) + 1;
        let decimalOdds2 = odds2 > 0 ? odds2 / 100 + 1 : 100 / Math.abs(odds2) + 1;

        // Calculate parlay odds
        let parlayOdds = decimalOdds1 * decimalOdds2 - 1;

        return parlayOdds * 100;
    }

    const calculateWinnings = (odds, amount) => {
        if (odds > 0) {
            return (odds / 100) * amount;
        } else {
            return (-100 / odds) * amount;
        }
    };

    const calculatePotentialWinnings = () => {
        if (selectedBets.length === 1) {
            // If there's only one selected bet, calculate the winnings directly
            console.log('only one bet')
            console.log(calculateWinnings(selectedBets[0].choice, wageredAmount))
            return Number(calculateWinnings(selectedBets[0].choice, wageredAmount)).toFixed(2);
        } else if (selectedBets.length > 1) {
            // If there's more than one selected bet, calculate the parlay odds first
            let parlayOdds = 1;
            for (let i = 0; i < selectedBets.length - 1; i += 2) {
                // Pass two odds at a time to calculateParlayOdds
                parlayOdds *= calculateParlayOdds(selectedBets[i].choice, selectedBets[i + 1].choice);
            }
            // If there's an odd number of bets, multiply the last one separately
            if (selectedBets.length % 2 !== 0) {
                parlayOdds *= selectedBets[selectedBets.length - 1].choice;
            }
            // Then calculate the winnings based on the parlay odds
            console.log('more than one bet')
            console.log(parlayOdds)
            console.log(calculateWinnings(parlayOdds, wageredAmount))
            return Number(calculateWinnings(parlayOdds, wageredAmount)).toFixed(2);
        } else {
            // If there are no selected bets, return 0
            return 0;
        }
    };


    return (
        <PaperProvider theme={myTheme}>
            {/* Top Ribbon */}
            <Appbar.Header>
                <ScrollView horizontal>
                    <Button
                        icon="basketball"
                        size={20}
                        onPress={() => fetchScores('basketball_nba')}
                    >
                        <Text>NBA</Text>
                    </Button>
                    <Button
                        icon="baseball"
                        size={20}
                        onPress={() => fetchScores('baseball_mlb')}
                    >
                        <Text>MLB</Text>
                    </Button>
                    <Button
                        icon="hockey-puck"
                        size={20}
                        onPress={() => fetchScores('icehockey_nhl')}
                    >
                        <Text>NHL</Text>
                    </Button>
                    <Button
                        icon="soccer"
                        size={20}
                        onPress={() => fetchScores('soccer_uefa_champs_league')}
                    >
                        <Text>Champions League</Text>
                    </Button>
                    <Button
                        icon="soccer"
                        size={20}
                        onPress={() => fetchScores('soccer_usa_mls')}
                    >
                        <Text>MLS</Text>
                    </Button>
                </ScrollView>
            </Appbar.Header>

            {/*Main Section*/}
            <View>
                <ScrollView>
                    {odds ? odds.map((game, index) => (
                        <Card key={index} onPress={() => { setExpandedCardIndex(prevIndex => prevIndex === index ? null : index); fetchOdds(game.sport_key, game.id); }} style={{ borderWidth: 1, borderColor: '#204d8c' }}>
                            <Card.Title title={`${game.away_team} @ ${game.home_team}`} subtitle={new Date(game.commence_time).toLocaleString()} />

                            {expandedCardIndex === index && oddsData && (
                                <Card.Content>
                                    {oddsData.bookmakers.filter(bookmaker => myBookmakers.includes(bookmaker.key)).map((bookmaker, i) => (
                                        <List.Section key={i}>
                                            <List.Subheader style={{ alignSelf: 'center' }}>{bookmaker.title}</List.Subheader>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                {bookmaker.markets.map((market, j) => (
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
                                            <Divider style={{ alignSelf: 'center' }} />
                                        </List.Section>
                                    ))}
                                </Card.Content>
                            )}
                        </Card>
                    )) : null}
                </ScrollView>
            </View>
            <View style={{ position: 'absolute', bottom: 0, width: '100%', paddingBottom: 5 }}>
                {showConfirmationCard && (
                    <Card style={{ borderWidth: 1, borderColor: '#204d8c' }}>
                        <Card.Content>
                            <ScrollView style={{ flex: 1 }}>
                                {selectedBets.map((bet, index) => (
                                    <View key={index}>
                                        <Text>Team: {bet.team}</Text>
                                        <Text>Odds: {bet.choice}</Text>
                                        <Text>Bookmaker: {bet.bookmaker}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15, padding: 10 }}>$</Text>
                                <TextInput
                                    style={{ height: 50, fontSize: 15, }}
                                    onChangeText={setWageredAmount}
                                    value={wageredAmount}
                                    placeholder="Enter wager amount"
                                    keyboardType="numeric"
                                />
                                <Text style={{ fontSize: 15, padding: 10 }}> {"Potential Winnings:"} ${calculatePotentialWinnings()}</Text>
                            </View>
                            <View>
                                <Button mode="contained" onPress={handleCancel}>Cancel</Button>
                                <Button mode="contained" onPress={handleConfirm}>Confirm</Button>
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </View>
        </PaperProvider >
    );
}

export default connect(mapStateToProps, { checkWallet })(MainScreen);
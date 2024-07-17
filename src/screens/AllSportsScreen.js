import React from 'react';
import { Provider as PaperProvider, DefaultTheme, Divider, Button, Title, Appbar, Text, Card, TextInput, List, Modal, } from 'react-native-paper';
import { View, ScrollView, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
// Redux imports
import { connect, useDispatch } from 'react-redux';
import { checkWallet } from '../redux/actions/accountActions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const URI = 'https://api.the-odds-api.com';
const API_KEY = '1f8b1fb4621b92c5ebc5280bfedf7bcf';
const myBookmakers = ['draftkings', 'fanduel', 'betmgm', 'williamhill_us', 'wynnb'];

// React Components
import HeaderMenu from '../components/HeaderMenu.js';
import OfferCards from '../components/OfferCards.js';

// Weather API
const WEATHER_URI = 'http://api.weatherapi.com/v1/';
const WEATHER_API_KEY = 'ff7d5478cc1647d698224807241707';

const extractLocation = (homeTeam) => {
    // Split the home team string into an array of words
    const words = homeTeam.split(' ');

    // Eliminate the last word, assuming it's the team name
    const location = words.slice(0, -1).join(' ');

    return location;
};

const WeatherInfo = ({ homeTeam }) => {
    const [weather, setWeather] = React.useState('');
    const [windMph, setWindMph] = React.useState(0);

    React.useEffect(() => {
        const location = extractLocation(homeTeam);
        fetchCurrentWeather(location)
            .then(data => {
                // Update state with both condition text and wind speed
                setWeather(data.condition);
                setWindMph(data.windMph);
            })
            .catch(console.error);
    }, [homeTeam]);

    return (
        <React.Fragment>
            <Text style={{marginRight: 10}}>Weather:</Text>
            <Text>{weather}</Text>
            <Divider style={{ width: 1, height: '100%', marginHorizontal: 10}} />
            <Text>{windMph} mph</Text>
        </React.Fragment>
    );
};

const fetchCurrentWeather = async (location) => {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return {
            // Return both the condition text and wind speed
            condition: data.current.condition.text,
            windMph: data.current.wind_mph
        };
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        throw error; // Rethrow the error if you want the caller to handle it
    }
};


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


function AllSportsScreen({ navigation, account, props }) {

    const [odds, setOdds] = React.useState([]);
    const [sports, setSports] = React.useState([]);
    const [expandedCardIndex, setExpandedCardIndex] = React.useState(null);
    const [oddsData, setOddsData] = React.useState(null);
    const [selectedBets, setSelectedBets] = React.useState([]);
    const [placedBets, setPlacedBets] = React.useState([]);
    const [showConfirmationCard, setShowConfirmationCard] = React.useState(false);
    const [wageredAmount, setWageredAmount] = React.useState(null);

    const reactNavigation = useNavigation();

    const dispatch = useDispatch();

    React.useEffect(() => {
        axios.get(`https://api.the-odds-api.com/v4/sports/?apiKey=${API_KEY}`)
            .then((response) => {
                console.log(response.data);
                setSports(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
        fetchScores('basketball_wnba'); // Fetch NBA scores by default
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
        const updatedBets = selectedBets.map(bet => ({
            ...bet,
            wager: bet.wager + parseFloat(wageredAmount) // Ensure wageredAmount is a number
        }));
        updatedBets.forEach(bet => {
            dispatch(checkWallet(bet)); // Dispatch each updated bet to the store
        });
        setSelectedBets([])
        setShowConfirmationCard(false);
        setWageredAmount(0);
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
                <Appbar.BackAction onPress={() => reactNavigation.goBack()} />
                <ScrollView horizontal>
                    <Button
                        size={20}
                        onPress={() => fetchScores('basketball_nba')}
                    >
                        <FontAwesome5Icon name="basketball-ball" />
                        <Text>NBA</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('basketball_wnba')}
                    >
                        <FontAwesome5Icon name="basketball-ball" />
                        <Text>WNBA</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('baseball_mlb')}
                    >
                        <FontAwesome5Icon name="baseball-ball" />
                        <Text>MLB</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('baseball_milb')}
                    >
                        <FontAwesome5Icon name="baseball-ball" />
                        <Text>MILB</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('icehockey_nhl')}
                    >
                        <FontAwesome5Icon name="hockey-puck" />
                        <Text>NHL</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('soccer_uefa_champs_league')}
                    >
                        <FontAwesomeIcon name="soccer-ball-o" />
                        <Text>Champions League</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('rugbyleague_nrl')}
                    >
                        <FontAwesome5Icon name="football-ball" />
                        <Text>Aussie Rugby League</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('soccer_usa_mls')}
                    >
                        <FontAwesomeIcon name="soccer-ball-o" />
                        <Text>MLS</Text>
                    </Button>
                    <Button
                        size={20}
                        onPress={() => fetchScores('soccer_china_superleague')}
                    >
                        <FontAwesomeIcon name="soccer-ball-o" />
                        <Text>Super League - China</Text>
                    </Button>

                </ScrollView>
            </Appbar.Header>

            {/*Main Section*/}
            <View>
                <ScrollView>
                {odds ? odds.map((game, index) => (
                        <Card key={index} onPress={() => {
                            // Handle card expansion
                            setExpandedCardIndex(prevIndex => prevIndex === index ? null : index);
                            fetchOdds(game.sport_key, game.id);
                        }}
                            style={{ borderWidth: 1, borderColor: '#204d8c', marginBottom: 10 }}>
                            <Card.Title title={`${game.away_team} @ ${game.home_team}`} subtitle={new Date(game.commence_time).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />

                            {expandedCardIndex === index && oddsData && (
                                <Card.Content>
                                    {oddsData.bookmakers.filter(bookmaker => myBookmakers.includes(bookmaker.key)).map((bookmaker, i) => (
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

                                <WeatherInfo homeTeam={game.home_team} />
                                <Divider style={{ width: 1, height: '100%', marginHorizontal: 10}} />
                                <Text>{game.sport_key}</Text>
                            </Card.Actions>
                        </Card>
                    )) : null}
                </ScrollView>
            </View>
            <KeyboardAvoidingView
                style={{ position: 'absolute', bottom: 0, width: '100%', paddingBottom: 5 }}
                behavior="padding" enabled={Platform.OS === 'ios'}
            >
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
            </KeyboardAvoidingView>
        </PaperProvider >
    );
}

export default connect(mapStateToProps, { checkWallet })(AllSportsScreen);
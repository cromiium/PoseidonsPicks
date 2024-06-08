import React from 'react';
import { View, ScrollView } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, Appbar, List, Button, Card, Title, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';

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

function MyBetsScreen({ route, navigation, account }) {

    return (
        <PaperProvider theme={myTheme}>
            {/* Top Ribbon */}
            <Appbar.Header>
                    <Appbar.Content title="My Bets" />
            </Appbar.Header>

            {/*Main Section*/}
            <ScrollView>
                <Card>
                        <List.Section>
                            {account.currentBets.map((bet, index) => (
                                <List.Item
                                    key={index}
                                    title={bet.bookmaker}
                                    description={`Team: ${bet.team}, Choice: ${bet.choice}, Wager: ${bet.wager}`}
                                />
                            ))}
                        </List.Section>
                    </Card>
            </ScrollView>
        </PaperProvider>
    );
}

export default connect(mapStateToProps)(MyBetsScreen);
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, Appbar, Button, Card, Title, Paragraph, List } from 'react-native-paper';
import { connect } from 'react-redux';
const URI = 'https://api.the-odds-api.com';
const API_KEY = '1f8b1fb4621b92c5ebc5280bfedf7bcf';
const myBookmakers = ['draftkings', 'fanduel', 'betmgm', 'williamhill_us', 'wynnb'];

// TODO: Should I move functions to a separate file
// TODO: How can I store info from API so I'm not constantly requesting data
// TODO: How can I make the cards expand better

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

function MyAccountScreen({ navigation, account }) {

    const [selectedBets, setSelectedBets] = React.useState([]);

    return (
        <PaperProvider theme={myTheme}>
            {/* Top Ribbon */}
            <Appbar.Header>
                <ScrollView horizontal>
                </ScrollView>
            </Appbar.Header>

            {/*Main Section*/}
            <View>
                <Card>
                    <Card.Content>
                        <Title>Account Information</Title>
                        <Paragraph>First Name: {account.firstName}</Paragraph>
                        <Paragraph>Last Name: {account.lastName}</Paragraph>
                        <Paragraph>Wallet: ${account.wallet}</Paragraph>
                    </Card.Content>
                </Card>
                <Card>
                    <Card.Content>
                        <Title>Account Preferences</Title>
                        <List.Section>
                            <List.Item
                                title="Bookmakers"
                            >
                            </List.Item>
                            <List.Item
                                title="Notifications"
                            >
                            </List.Item>
                        </List.Section>
                    </Card.Content>
                </Card>
            </View>
        </PaperProvider>
    );
}

export default connect(mapStateToProps)(MyAccountScreen);
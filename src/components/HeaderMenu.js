import React from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Menu, Button } from 'react-native-paper';

const HeaderMenu = ({ navigation, reactNavigation }) => {
    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => reactNavigation.goBack()} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <Button onPress={openMenu}>Main Menu</Button>
                    }>
                    <Menu.Item onPress={() => { console.log('Dashboard'); closeMenu(); }} title="Dashboard" />
                    <Menu.Item onPress={() => { navigation.navigate('Offers'); closeMenu(); }} title="Offers" />
                    <Menu.Item onPress={() => { console.log('Affiliate Program'); closeMenu(); }} title="Affiliate Program" />
                    <Menu.Item onPress={() => { console.log('Account Info'); closeMenu(); }} title="Account Info" />
                </Menu>
                <Button onPress={() => navigation.navigate('Live')}>Live Games</Button>
                <Button onPress={() => navigation.navigate('AllSports')}>All Sports</Button>
                <Button onPress={() => navigation.navigate('TopPicks')}>Top Picks</Button>
                <Button onPress={() => navigation.navigate('Podcasts')}>Podcasts</Button>
                <Button onPress={() => navigation.navigate('Chat')}>Chat</Button>
            </ScrollView>
        </Appbar.Header>
    );
};

export default HeaderMenu;
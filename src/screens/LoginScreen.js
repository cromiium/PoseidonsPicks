// LoginScreen.js
import React, { useState } from 'react';
import { View, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, StyleSheet, Dimensions, Platform } from 'react-native';
import { TextInput, Button, Card, Icon } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const testAccounts = {
        'Test1': 'password1',
        'Test2': 'password2',
        // add more test accounts as needed
    };

    const handleLogin = () => {

        if (testAccounts[username] === password) {
            navigation.navigate('App');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Card style={{ width: Dimensions.get('window').width * 0.8 }}>
                {/*React Native image component that is centered within the parent component*/}
                <Image source={require('../../assets/playersedge.png')} style={{ width: 200, height: 200, alignSelf: 'center' }} />
                <Card.Content>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Button mode="contained" onPress={handleLogin}>
                        Login
                    </Button>
                </Card.Content>
            </Card>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
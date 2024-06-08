import React, { useEffect, useState } from 'react';
import { Button, TextInput, ScrollView, Text } from 'react-native';
import firebase from 'firebase';

function ChatScreen({ route }) {
    const { gameId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const messagesRef = firebase.database().ref('messages/' + gameId);
        messagesRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const items = Object.values(data || {});
            setMessages(items);
        });
    }, [gameId]);

    const sendMessage = () => {
        const messagesRef = firebase.database().ref('messages/' + gameId);
        messagesRef.push({ text: newMessage });
        setNewMessage('');
    };

    return (
        <ScrollView>
            {messages.map((message, index) => (
                <Text key={index}>{message.text}</Text>
            ))}
            <TextInput value={newMessage} onChangeText={setNewMessage} />
            <Button title="Send" onPress={sendMessage} />
        </ScrollView>
    );
}

export default ChatScreen;
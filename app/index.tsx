import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useLlmInference, LlmInferenceConfig } from 'react-native-llm-mediapipe';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  message: string;
  isUser: boolean;
}

export default function Index() {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [id, setId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState('');

  const config: LlmInferenceConfig = {
    storageType: 'asset',
    modelName: 'gemma-2b-it-cpu-int4.bin',
  };

  useEffect(() => {
    const newId = Math.random().toString(36).substring(7);
    setId(newId);
  }, []);

  const { generateResponse } = useLlmInference(config);

  const handleGeneratePress = async () => {
    if (isGenerating) return; // Prevent multiple requests
    if (prompt.trim() === '') return; // Ignore empty prompts

    const userMessage: Message = { message: prompt, isUser: true };
    setConversation((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);

    let response = '';
    if (generateResponse && id) {
      try {
        response = await generateResponse(prompt);
        const words = response.split(' ');
        setCurrentTypingMessage('');

        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setCurrentTypingMessage((prev) => (prev + ' ' + words[i]).trim());
        }

        const aiMessage: Message = { message: response, isUser: false };
        setConversation((prev) => [...prev, aiMessage]);
        await AsyncStorage.setItem(
          `chat-${id}`,
          JSON.stringify([...conversation, userMessage, aiMessage])
        );
      } catch (error) {
        console.error('Error generating response:', error);
        Alert.alert('Error', 'Failed to generate response. Please try again.');
      } finally {
        setCurrentTypingMessage('');
        setIsGenerating(false);
      }
    } else {
      setCurrentTypingMessage('');
      console.log('generateResponse is null');
      setIsGenerating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={conversation}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
            ]}
          >
            {!item.isUser && (
              <Image
                source={{ uri: 'https://via.placeholder.com/40' }}
                style={styles.aiAvatar}
              />
            )}
            <View
              style={[
                styles.message,
                item.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
                {item.message}
              </Text>
              {!item.isUser && (
                <TouchableOpacity
                  onPress={() => Alert.alert('Source', 'Insert source here')}
                  style={styles.sourceButton}
                >
                  <Text style={styles.sourceButtonText}>Source</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={() =>
          isGenerating ? (
            <View style={styles.messageContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/40' }}
                style={styles.aiAvatar}
              />
              <View style={[styles.message, styles.aiMessage]}>
                <Text style={styles.aiText}>{currentTypingMessage || 'Thinking...'}</Text>
              </View>
            </View>
          ) : null
        }
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPrompt}
          value={prompt}
          placeholder="Enter your question here"
          placeholderTextColor="#888"
          editable={!isGenerating}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: isGenerating ? '#ccc' : '#3A9DFD' },
          ]}
          onPress={handleGeneratePress}
          disabled={isGenerating}
        >
          <Text style={styles.sendButtonText}>
            {isGenerating ? 'Waiting...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light background for less eye strain
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
    marginHorizontal: 10, // Add spacing to both sides
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  message: {
    padding: 15,
    borderRadius: 10,
    maxWidth: '80%',
    marginBottom: 20, // Add more spacing between text and source button
    position: 'relative',
  },
  userMessage: {
    backgroundColor: '#D0E7FF', // Light blue for user messages
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  aiMessage: {
    backgroundColor: '#ECEFF1', // Neutral light grey for AI messages
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 15, // Add spacing between message text and source button
  },
  userText: {
    color: '#0056A6', // Deep blue for user text
  },
  aiText: {
    color: '#37474F', // Dark grey for AI text
  },
  sourceButton: {
    position: 'absolute',
    bottom: 10, // Adjusted for better spacing from text
    right: 15, // Adjusted for better spacing from edges
    backgroundColor: '#1E88E5',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sourceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

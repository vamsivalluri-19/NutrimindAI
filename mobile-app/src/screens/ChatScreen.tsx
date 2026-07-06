import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your NutriMind AI Personal Coach. What would you like to work on today?" }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Mock replies based on query
    setTimeout(() => {
      const lower = inputText.toLowerCase();
      let reply = "I can estimate calories, draft custom workouts, or create meal preps. Tell me more!";
      
      if (lower.includes('recipe')) {
        reply = "Here is a quick Avocado Salmon Salad recipe: Toss 150g grilled salmon with 1/2 avocado, mixed salad greens, and olive oil. Macros: ~380 kcal, 30g Protein, 20g Fats.";
      } else if (lower.includes('workout') || lower.includes('exercise')) {
        reply = "I recommend 3 sets of Squats, Bench Press, and Rows. Combine with 20 minutes of moderate-intensity cardio on rest days.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.chatScroll} contentContainerStyle={styles.scrollContent}>
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <View key={idx} style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.coachWrapper]}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.coachBubble]}>
                  <Text style={[styles.bubbleText, isUser ? styles.userText : styles.coachText]}>{m.content}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Ask AI Coach anything..."
            placeholderTextColor="#64748B"
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  keyboardView: {
    flex: 1,
  },
  chatScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    width: '100%',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  coachWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    padding: 16,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#16A34A',
    borderTopRightRadius: 0,
  },
  coachBubble: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#F8FAFC',
    fontWeight: '500',
  },
  coachText: {
    color: '#F8FAFC',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#0F172A',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    color: '#F8FAFC',
  },
  sendButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
});

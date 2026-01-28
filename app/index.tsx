import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';
import { useSessionStore } from '../stores/sessionStore';

export default function Index() {
  const [taskInput, setTaskInput] = useState('');

  const newSession = useSessionStore((s) => s.newSession);
  const setTaskName = useSessionStore((s) => s.setTaskName);

  const onStart = () => {
    const trimmed = taskInput.trim();
    const taskName = trimmed.length > 0 ? trimmed : 'Figure out the next step';

    newSession();
    setTaskName(taskName);
    router.push('/timer');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>What is the ONE thing?</Text>

        <TextInput
          value={taskInput}
          onChangeText={setTaskInput}
          placeholder="e.g., Open IDE and run tests"
          placeholderTextColor="#9A9A9A"
          style={styles.input}
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="done"
          onSubmitEditing={onStart}
          accessibilityLabel="Task name"
        />

        <Pressable
          onPress={onStart}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Start Focus"
        >
          <Text style={styles.primaryButtonText}>Start Focus</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  header: {
    color: '#E0E0E0',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#E0E0E0',
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: '#008080',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { useTimerTick } from '../hooks/useTimerTick';
import { useSessionStore } from '../stores/sessionStore';

export default function TimerScreen() {
  const taskName = useSessionStore((s) => s.taskName);
  const status = useSessionStore((s) => s.status);
  const start = useSessionStore((s) => s.start);
  const pause = useSessionStore((s) => s.pause);
  const reset = useSessionStore((s) => s.reset);

  const { formattedTime } = useTimerTick();

  const onToggle = () => {
    const now = Date.now();
    if (status === 'running') {
      pause(now);
    } else {
      start(now);
    }
  };

  const onReset = () => {
    reset(Date.now());
  };

  const toggleLabel = status === 'running' ? 'Pause' : 'Resume';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        <Text style={styles.taskName} numberOfLines={2}>
          {taskName.trim().length > 0 ? taskName : 'Focus session'}
        </Text>

        <View style={styles.timerContainer}>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={onToggle}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel={toggleLabel}
          >
            <Text style={styles.primaryButtonText}>{toggleLabel}</Text>
          </Pressable>

          <Pressable
            onPress={onReset}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Reset"
          >
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.chatPeekPlaceholder} />
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
    paddingTop: 16,
    paddingBottom: 80,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderWidth: 1,
  },
  backButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  taskName: {
    color: '#E0E0E0',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    color: '#E0E0E0',
    fontSize: 96,
    fontWeight: '800',
    letterSpacing: 1,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#008080',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  chatPeekPlaceholder: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#162424',
    borderTopWidth: 1,
    borderTopColor: '#204040',
  },
});

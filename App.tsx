import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Button from './Button';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <Button size={{ width: 250, height: 86 }} text='Get Started' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

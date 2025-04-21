// SettingsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/type';

const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>设置</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Category')}>
        <Text style={styles.buttonText}>分类管理</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: { backgroundColor: '#007aff', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

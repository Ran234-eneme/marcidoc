// src/screens/ProfilScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { COLORS, RADIUS, FONTS, SHADOW } from '../theme';

export default function ProfilScreen({ navigation }) {
  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter', style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('token');
          navigation.replace('Login');
        },
      },
    ]);
  };

  const items = [
    { icon: 'person-outline', label: 'Informations personnelles' },
    { icon: 'shield-checkmark-outline', label: 'Confidentialité & Sécurité' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'help-circle-outline', label: 'Aide & Support' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>MA</Text></View>
        <Text style={styles.name}>Marcia Abessolo</Text>
        <Text style={styles.email}>marcia@email.com</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          {items.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.row, i === items.length - 1 && { borderBottomWidth: 0 }]}>
              <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  header: { backgroundColor: COLORS.primary, paddingTop: 70, paddingBottom: 30, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', marginBottom: 12 },
  avatarText: { fontSize: 24, ...FONTS.bold, color: COLORS.white },
  name: { fontSize: 18, ...FONTS.extrabold, color: COLORS.white },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  content: { padding: 16 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 4, marginBottom: 16, ...SHADOW.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  rowLabel: { fontSize: 13, ...FONTS.semibold, color: COLORS.gray800 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.dangerLight, borderRadius: RADIUS.md, padding: 14 },
  logoutText: { fontSize: 13, ...FONTS.bold, color: COLORS.danger },
});

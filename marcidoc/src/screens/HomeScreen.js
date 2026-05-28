// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';
import { COLORS, RADIUS, FONTS, SHADOW } from '../theme';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.me()
      .then(res => setUser(res.data))
      .catch(() => setUser({ prenom: 'Utilisateur', nom: '' }))
      .finally(() => setLoading(false));
  }, []);

  const services = [
    {
      icon: 'folder-outline', color: COLORS.primary, bg: COLORS.primaryLight,
      title: 'Dossier médical', sub: 'Historique, allergies, antécédents',
      badge: null, screen: 'Dossier',
    },
    {
      icon: 'document-text-outline', color: COLORS.danger, bg: COLORS.dangerLight,
      title: 'Résultats d\'examens', sub: '1 nouveau résultat disponible',
      badge: '1', screen: 'Examens',
    },
    {
      icon: 'medkit-outline', color: COLORS.success, bg: COLORS.successLight,
      title: 'Médicaments & Pharmacies', sub: '3 médicaments actifs',
      badge: null, screen: 'Médicaments',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Ionicons name="heart" size={14} color={COLORS.danger} />
          </View>
          <Text style={styles.logoText}>MARCI-DOC</Text>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <Ionicons name="notifications-outline" size={22} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? (user.prenom[0] + (user.nom?.[0] || '')).toUpperCase() : '..'}
            </Text>
          </View>
          <View>
            <Text style={styles.greet}>Bonjour,</Text>
            <Text style={styles.userName}>
              {loading ? '...' : `${user?.prenom} ${user?.nom || ''}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Urgence QR */}
        <TouchableOpacity style={styles.urgenceCard}>
          <Ionicons name="alert-circle-outline" size={22} color={COLORS.white} />
          <View style={{ flex: 1 }}>
            <Text style={styles.urgT}>Accès urgence — QR Code médical</Text>
            <Text style={styles.urgS}>Infos critiques accessibles sans connexion</Text>
          </View>
          <Ionicons name="qr-code-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[['3', 'Ordonnances'], ['5', 'Examens'], ['2', 'RDV']].map(([n, l]) => (
            <View key={l} style={styles.statCard}>
              <Text style={styles.statN}>{n}</Text>
              <Text style={styles.statL}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Mes services</Text>
        {services.map((s) => (
          <TouchableOpacity
            key={s.title}
            style={styles.serviceCard}
            onPress={() => navigation.navigate(s.screen)}
          >
            <View style={[styles.iconBox, { backgroundColor: s.bg }]}>
              <Ionicons name={s.icon} size={20} color={s.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceTitle}>{s.title}</Text>
              <Text style={styles.serviceSub}>{s.sub}</Text>
            </View>
            {s.badge
              ? <View style={styles.badgeRed}><Text style={styles.badgeText}>{s.badge}</Text></View>
              : <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
            }
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  header: { backgroundColor: COLORS.primary, paddingTop: 56, paddingHorizontal: 18, paddingBottom: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  logoBox: { width: 28, height: 28, backgroundColor: COLORS.white, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 13, ...FONTS.extrabold, color: COLORS.white, letterSpacing: 0.5 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText: { color: COLORS.white, fontSize: 15, ...FONTS.bold },
  greet: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  userName: { fontSize: 16, ...FONTS.extrabold, color: COLORS.white },
  content: { padding: 16 },
  urgenceCard: { backgroundColor: COLORS.danger, borderRadius: RADIUS.md, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  urgT: { fontSize: 12, ...FONTS.bold, color: COLORS.white },
  urgS: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 12, alignItems: 'center', ...SHADOW.card },
  statN: { fontSize: 22, ...FONTS.extrabold, color: COLORS.primary },
  statL: { fontSize: 10, color: COLORS.gray600, marginTop: 2 },
  sectionTitle: { fontSize: 11, ...FONTS.extrabold, color: COLORS.primary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  serviceCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, ...SHADOW.card },
  iconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  serviceTitle: { fontSize: 13, ...FONTS.bold, color: COLORS.gray800 },
  serviceSub: { fontSize: 11, color: COLORS.gray600, marginTop: 2 },
  badgeRed: { backgroundColor: COLORS.danger, borderRadius: RADIUS.full, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: COLORS.white, fontSize: 10, ...FONTS.bold },
});

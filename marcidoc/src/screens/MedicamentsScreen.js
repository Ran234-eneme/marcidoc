// src/screens/MedicamentsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { medicamentsAPI } from '../services/api';
import { COLORS, RADIUS, FONTS, SHADOW } from '../theme';

const STOCK_STYLE = {
  ok: { bg: COLORS.successLight, color: '#065F46', label: 'Stock OK' },
  bientot: { bg: COLORS.warningLight, color: '#92400E', label: 'Bientôt épuisé' },
  epuise: { bg: COLORS.dangerLight, color: COLORS.danger, label: 'Épuisé' },
};

const DOT_COLORS = [COLORS.primary, COLORS.danger, COLORS.success, '#7C3AED'];

export default function MedicamentsScreen() {
  const [ordonnances, setOrdonnances] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    Promise.all([
      medicamentsAPI.getOrdonnances(),
      medicamentsAPI.getPharmacies(0.3902, 9.4544), // Libreville coords
    ])
      .then(([o, p]) => {
        setOrdonnances(o.data);
        setPharmacies(p.data);
      })
      .catch(() => {
        setOrdonnances([
          { id: 1, nom: 'Amlodipine 5mg', posologie: '1 comprimé/jour — matin', stock: 'ok' },
          { id: 2, nom: 'Metformine 500mg', posologie: '2 comprimés/jour — repas', stock: 'bientot' },
          { id: 3, nom: 'Vitamine D3 1000UI', posologie: '1 comprimé/jour — soir', stock: 'ok' },
        ]);
        setPharmacies([
          { id: 1, nom: 'Pharmacie Centrale', adresse: 'Bvd Triomphal', distance: '0.8 km', ouvert: true },
          { id: 2, nom: 'Pharmacie de la Sablière', adresse: 'Av. des Cocotiers', distance: '1.4 km', ouvert: true },
          { id: 3, nom: 'Pharmacie Louis', adresse: 'Quartier Glass', distance: '2.1 km', ouvert: false },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await medicamentsAPI.search(text);
      setSearchResults(res.data);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Header vert */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Médicaments</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un médicament..."
            placeholderTextColor="rgba(255,255,255,0.55)"
            value={query}
            onChangeText={handleSearch}
          />
          {searching && <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />}
        </View>
      </View>

      <View style={styles.content}>
        {/* Résultats recherche */}
        {searchResults.length > 0 && (
          <>
            <Text style={styles.section}>Résultats de recherche</Text>
            <View style={styles.card}>
              {searchResults.map((m, i) => (
                <View key={m.id} style={[styles.medRow, i === searchResults.length - 1 && { borderBottomWidth: 0 }]}>
                  <Ionicons name="medkit-outline" size={16} color={COLORS.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medNom}>{m.nom}</Text>
                    <Text style={styles.medSub}>{m.categorie}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Ordonnances */}
        <Text style={styles.section}>Ordonnances actives</Text>
        <View style={styles.card}>
          {ordonnances.map((o, i) => {
            const s = STOCK_STYLE[o.stock] || STOCK_STYLE.ok;
            return (
              <View key={o.id} style={[styles.medRow, i === ordonnances.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.dot, { backgroundColor: DOT_COLORS[i % DOT_COLORS.length] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.medNom}>{o.nom}</Text>
                  <Text style={styles.medSub}>{o.posologie}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: s.bg }]}>
                  <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Pharmacies */}
        <Text style={styles.section}>Pharmacies proches — Libreville</Text>
        <View style={styles.card}>
          {pharmacies.map((p, i) => (
            <View key={p.id} style={[styles.pharmaRow, i === pharmacies.length - 1 && { borderBottomWidth: 0 }]}>
              <Ionicons name="location-outline" size={16} color={COLORS.primary} style={{ flexShrink: 0 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.medNom}>{p.nom}</Text>
                <Text style={styles.medSub}>{p.adresse} — {p.distance}</Text>
              </View>
              <View style={[styles.badge, p.ouvert
                ? { backgroundColor: COLORS.successLight }
                : { backgroundColor: COLORS.dangerLight }]}>
                <Text style={[styles.badgeText, { color: p.ouvert ? '#065F46' : COLORS.danger }]}>
                  {p.ouvert ? 'Ouvert' : 'Fermé'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: '#065F46', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 18, ...FONTS.extrabold, color: COLORS.white, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 13 },
  content: { padding: 14 },
  section: { fontSize: 11, ...FONTS.extrabold, color: COLORS.primary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 14, marginBottom: 16, ...SHADOW.card },
  medRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  pharmaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  medNom: { fontSize: 13, ...FONTS.bold, color: COLORS.gray800 },
  medSub: { fontSize: 11, color: COLORS.gray600, marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  badgeText: { fontSize: 10, ...FONTS.bold },
});

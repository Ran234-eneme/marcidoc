// src/screens/ExamensScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { examensAPI } from '../services/api';
import { COLORS, RADIUS, FONTS, SHADOW } from '../theme';

const FILTERS = ['Tous', 'Biologie', 'Imagerie', 'Autre'];

const STATUS_STYLE = {
  normal: { bg: COLORS.successLight, color: '#065F46', label: 'Normal' },
  nouveau: { bg: COLORS.danger, color: COLORS.white, label: 'Nouveau' },
  surveiller: { bg: COLORS.warningLight, color: '#92400E', label: 'Surveiller' },
  anormal: { bg: COLORS.dangerLight, color: COLORS.danger, label: 'Anormal' },
};

export default function ExamensScreen() {
  const [examens, setExamens] = useState([]);
  const [filter, setFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamens();
  }, [filter]);

  const fetchExamens = async () => {
    setLoading(true);
    try {
      const type = filter === 'Tous' ? null : filter.toLowerCase();
      const res = await examensAPI.list(type);
      setExamens(res.data);
    } catch {
      // Données de démo
      setExamens([
        { id: 1, titre: 'Bilan sanguin complet', laboratoire: 'Labo Santé Plus', date: '20 mai 2026', type: 'biologie', statut: 'nouveau' },
        { id: 2, titre: 'Radiographie thoracique', laboratoire: 'Clinique El Rapha', date: '10 avr. 2026', type: 'imagerie', statut: 'normal' },
        { id: 3, titre: 'Glycémie à jeun', laboratoire: 'Pharmacie Centrale', date: '2 mars 2026', type: 'biologie', statut: 'surveiller' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoir = (examen) => {
    Alert.alert('Ouverture', `Chargement du résultat : ${examen.titre}`);
    // TODO: ouvrir PDF avec expo-document-picker ou afficher dans un WebView
  };

  const handlePartager = (examen) => {
    Alert.alert('Partager', `Partage de : ${examen.titre}`);
    // TODO: Share API de React Native
  };

  const displayed = filter === 'Tous'
    ? examens
    : examens.filter(e => e.type === filter.toLowerCase());

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header rouge */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Résultats d'examens</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, filter === f && styles.filterBtnOn]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextOn]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.content}>
        {loading
          ? <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          : displayed.length === 0
            ? <Text style={styles.empty}>Aucun résultat pour ce filtre.</Text>
            : displayed.map(ex => {
                const s = STATUS_STYLE[ex.statut] || STATUS_STYLE.normal;
                const isNew = ex.statut === 'nouveau';
                return (
                  <View key={ex.id} style={[styles.card, isNew && styles.cardNew]}>
                    <View style={styles.cardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{ex.titre}</Text>
                        <Text style={styles.cardSub}>{ex.laboratoire} — {ex.date}</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: s.bg }]}>
                        <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                      </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.btnRow}>
                      <TouchableOpacity style={[styles.btn, { backgroundColor: isNew ? COLORS.dangerLight : COLORS.gray100 }]} onPress={() => handleVoir(ex)}>
                        <Ionicons name="eye-outline" size={14} color={isNew ? COLORS.danger : COLORS.gray600} />
                        <Text style={[styles.btnText, { color: isNew ? COLORS.danger : COLORS.gray600 }]}>Voir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.primaryLight }]} onPress={() => Alert.alert('IA', 'Analyse IA à venir')}>
                        <Ionicons name="sparkles-outline" size={14} color={COLORS.primary} />
                        <Text style={[styles.btnText, { color: COLORS.primary }]}>Analyser</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btn, { backgroundColor: COLORS.gray100 }]} onPress={() => handlePartager(ex)}>
                        <Ionicons name="share-outline" size={14} color={COLORS.gray600} />
                        <Text style={[styles.btnText, { color: COLORS.gray600 }]}>Partager</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  header: { backgroundColor: COLORS.danger, paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 18, ...FONTS.extrabold, color: COLORS.white, marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)' },
  filterBtnOn: { backgroundColor: COLORS.white, borderColor: COLORS.white },
  filterText: { fontSize: 12, ...FONTS.bold, color: 'rgba(255,255,255,0.85)' },
  filterTextOn: { color: COLORS.danger },
  content: { padding: 14 },
  empty: { textAlign: 'center', color: COLORS.gray400, marginTop: 40, fontSize: 14 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 14, marginBottom: 12, ...SHADOW.card },
  cardNew: { borderLeftWidth: 3, borderLeftColor: COLORS.danger, borderRadius: RADIUS.lg },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  cardTitle: { fontSize: 13, ...FONTS.bold, color: COLORS.gray800 },
  cardSub: { fontSize: 11, color: COLORS.gray600, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  badgeText: { fontSize: 10, ...FONTS.bold },
  divider: { height: 1, backgroundColor: COLORS.gray100, marginBottom: 10 },
  btnRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, borderRadius: RADIUS.md },
  btnText: { fontSize: 11, ...FONTS.bold },
});

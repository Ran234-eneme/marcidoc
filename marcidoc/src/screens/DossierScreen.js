// src/screens/DossierScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dossierAPI } from '../services/api';
import { COLORS, RADIUS, FONTS, SHADOW } from '../theme';

const BADGE_MAP = {
  allergie: { bg: COLORS.warningLight, color: '#92400E' },
  chronique: { bg: COLORS.primaryLight, color: '#5B21B6' },
  chirurgie: { bg: COLORS.successLight, color: '#065F46' },
  vaccination: { bg: '#EFF6FF', color: '#1E40AF' },
};

export default function DossierScreen() {
  const [dossier, setDossier] = useState(null);
  const [antecedents, setAntecedents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dossierAPI.get(), dossierAPI.getAntecedents()])
      .then(([d, a]) => {
        setDossier(d.data);
        setAntecedents(a.data);
      })
      .catch(() => {
        // Données de démo si API indisponible
        setDossier({
          groupe_sanguin: 'A+', poids: '68 kg', taille: '1m65',
          date_naissance: '15 mars 1998', age: 27,
          contact_urgence: { nom: 'Jean Abessolo', tel: '+241 07 XX XX XX' },
          medecin: { nom: 'Dr. Ondo', ville: 'Libreville' },
        });
        setAntecedents([
          { type: 'allergie', libelle: 'Pénicilline' },
          { type: 'chronique', libelle: 'Hypertension légère' },
          { type: 'chirurgie', libelle: 'Appendicite — 2019' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header sombre */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dossier médical</Text>
        <View style={styles.statsRow}>
          {[
            ['Groupe sanguin', dossier?.groupe_sanguin],
            ['Poids', dossier?.poids],
            ['Taille', dossier?.taille],
          ].map(([l, v]) => (
            <View key={l} style={styles.statBox}>
              <Text style={styles.statVal}>{v}</Text>
              <Text style={styles.statLbl}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {/* Infos générales */}
        <Text style={styles.section}>Informations générales</Text>
        <View style={styles.card}>
          <InfoRow icon="calendar-outline" label="Date de naissance" value={`${dossier?.date_naissance} — ${dossier?.age} ans`} />
          <InfoRow icon="call-outline" label="Contact urgence" value={`${dossier?.contact_urgence?.nom} — ${dossier?.contact_urgence?.tel}`} />
          <InfoRow icon="medical-outline" label="Médecin traitant" value={`${dossier?.medecin?.nom} — ${dossier?.medecin?.ville}`} last />
        </View>

        {/* Antécédents */}
        <Text style={styles.section}>Antécédents & Allergies</Text>
        <View style={styles.card}>
          {antecedents.map((a, i) => {
            const style = BADGE_MAP[a.type] || BADGE_MAP.chirurgie;
            return (
              <View key={i} style={[styles.antRow, i === antecedents.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.badge, { backgroundColor: style.bg }]}>
                  <Text style={[styles.badgeText, { color: style.color }]}>{a.type}</Text>
                </View>
                <Text style={styles.antLabel}>{a.libelle}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          <Text style={styles.editBtnText}>Modifier le dossier</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Ionicons name={icon} size={16} color={COLORS.primary} style={{ marginRight: 10, flexShrink: 0 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray100 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { backgroundColor: COLORS.primaryDark, paddingTop: 60, paddingHorizontal: 18, paddingBottom: 24 },
  headerTitle: { fontSize: 18, ...FONTS.extrabold, color: COLORS.white, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.md, padding: 10, alignItems: 'center' },
  statVal: { fontSize: 17, ...FONTS.extrabold, color: COLORS.white },
  statLbl: { fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 2, textAlign: 'center' },
  content: { padding: 16 },
  section: { fontSize: 11, ...FONTS.extrabold, color: COLORS.primary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10, marginTop: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 14, marginBottom: 16, ...SHADOW.card },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  infoLabel: { fontSize: 11, color: COLORS.gray600 },
  infoValue: { fontSize: 13, ...FONTS.semibold, color: COLORS.gray800, marginTop: 2 },
  antRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  badgeText: { fontSize: 10, ...FONTS.bold, textTransform: 'capitalize' },
  antLabel: { fontSize: 13, color: COLORS.gray800, flex: 1 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.md, padding: 12, marginBottom: 30 },
  editBtnText: { color: COLORS.primary, fontSize: 13, ...FONTS.bold },
});

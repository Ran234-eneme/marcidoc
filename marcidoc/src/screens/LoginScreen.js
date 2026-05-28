// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../services/api';
import { COLORS, RADIUS, FONTS } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      setLoading(true);
      const res = await authAPI.login(email, password);
      await SecureStore.setItemAsync('token', res.data.access_token);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.detail || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Header violet */}
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Ionicons name="heart" size={32} color={COLORS.danger} />
          </View>
          <Text style={styles.appName}>MARCI-DOC</Text>
          <Text style={styles.tagline}>VOTRE SANTÉ, NOTRE ENGAGEMENT</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Connexion</Text>

          <Text style={styles.label}>Téléphone / Email</Text>
          <TextInput
            style={styles.input}
            placeholder="+241 07 XX XX XX"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
            <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '600' }}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnPrimaryText}>Se connecter</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.btnOutlineText}>Créer un compte</Text>
          </TouchableOpacity>

          {/* Urgence */}
          <TouchableOpacity style={styles.urgenceBar}>
            <Ionicons name="qr-code-outline" size={20} color={COLORS.danger} />
            <Text style={styles.urgenceText}>Accès urgence sans connexion</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.danger} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.primary,
    paddingTop: 80,
    paddingBottom: 50,
    alignItems: 'center',
  },
  logoBox: {
    width: 64, height: 64,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  appName: { fontSize: 24, ...FONTS.extrabold, color: COLORS.white, letterSpacing: 1 },
  tagline: { fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 2.5, marginTop: 4 },
  form: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginTop: -20,
    padding: 24,
  },
  formTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.gray800, marginBottom: 20 },
  label: { fontSize: 10, ...FONTS.bold, color: COLORS.primary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: COLORS.gray200,
    borderRadius: RADIUS.md, padding: 12,
    fontSize: 14, color: COLORS.gray800,
    backgroundColor: COLORS.gray50, marginBottom: 14,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  eyeBtn: { position: 'absolute', right: 12, top: 12 },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md, padding: 14,
    alignItems: 'center', marginBottom: 10,
  },
  btnPrimaryText: { color: COLORS.white, fontSize: 14, ...FONTS.bold },
  btnOutline: {
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: RADIUS.md, padding: 13,
    alignItems: 'center', marginBottom: 20,
  },
  btnOutlineText: { color: COLORS.primary, fontSize: 13, ...FONTS.bold },
  urgenceBar: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.md, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  urgenceText: { fontSize: 12, color: '#991B1B', ...FONTS.semibold },
});

// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import 'moment/locale/pt-br';
import { colors } from '@/src/styles/colors';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      // signOut deve redirecionar; se não, você pode router.replace('/login') aqui
    } catch (err) {
      console.error('Erro ao deslogar', err);
      Alert.alert('Erro', 'Não foi possível deslogar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d?: string | null) => {
    if (!d) return '-';
    const m = moment(d);
    if (!m.isValid()) return d;
    return m.format('DD [de] MMM YYYY');
  };

  const initials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || '').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Ionicons name="flash" size={26} color="#fff" />
        <Text style={styles.headerTitle}>USUÁRIO</Text>
        <TouchableOpacity onPress={() => router.push('/screens/create')}>
          <Ionicons name="add-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <LinearGradient colors={['#121212', '#0e0e0e']} style={styles.bg}>
        <View style={styles.container}>

          <Text style={styles.headerSubTitle}>Perfil</Text>

          <View style={styles.cardTouch}>
            <LinearGradient
              colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.card}
            >
              <View style={[styles.accentStripe, { backgroundColor: colors.blue[300] }]} />

              <View style={styles.content}>
                <View style={styles.topRow}>
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>{initials(user?.nome)}</Text>
                  </View>

                  <View style={styles.nameBlock}>
                    <Text style={styles.nameText}>{user?.nome ?? '-'}</Text>
                    <Text style={styles.emailText}>{user?.email ?? '-'}</Text>
                  </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nascimento</Text>
                  <Text style={styles.infoValue}>{formatDate(user?.nascimento)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  <Text style={styles.infoValue}>{user?.telefone ?? '-'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Instagram</Text>
                  <View style={styles.rowRight}>
                    <Text style={styles.infoValue}>{user?.instagram_username ?? '-'}</Text>
                  </View>
                </View>

                <View style={styles.footerRow}>
                  <TouchableOpacity
                    style={styles.logoutTouch}
                    onPress={handleSignOut}
                    activeOpacity={0.85}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={['#ff6b6b', '#e53935']}
                      start={[0, 0]}
                      end={[1, 0]}
                      style={styles.logoutBtn}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.logoutText}>Sair</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryAction}
                    onPress={() => router.push('/screens/create')}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={[colors.blue[300], colors.blue[400]]}
                      start={[0, 0]}
                      end={[1, 0]}
                      style={styles.primaryInner}
                    >
                      <MaterialIcons name="note-add" size={18} color="#fff" />
                      <Text style={styles.primaryText}>Nova ideia</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>MyIdeas • {new Date().getFullYear()}</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#07070A' 
  },
  bg: { 
    flex: 1 
  },
  container: {
    flex: 1, 
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    height: 56,
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700' 
  },

  headerSubTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  /* Card wrapper */
  cardTouch: {
    borderRadius: 16,
    overflow: 'hidden',
    // sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
  },
  accentStripe: {
    width: 8,
    borderRadius: 6,
    marginRight: 14,
    alignSelf: 'stretch',
  },

  content: { flex: 1 },

  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },

  nameBlock: { flex: 1 },
  nameText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  emailText: { color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.03)', marginVertical: 12, borderRadius: 2 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  infoLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },
  infoValue: { color: '#fff', fontSize: 15, fontWeight: '600' },

  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  smallIconBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  footerRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },

  logoutTouch: { flex: 1 },
  logoutBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  primaryAction: { marginLeft: 12, width: 160, borderRadius: 12, overflow: 'hidden' },
  primaryInner: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  primaryText: { color: '#fff', fontWeight: '700', marginLeft: 8 },

  footer: { marginTop: 18, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.25)', fontSize: 12 },
});

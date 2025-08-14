// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInputProps,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/styles/colors';
import { useAuth } from '@/src/contexts/AuthContext';

type AuthResult = { ok: boolean; error?: string };
type UseAuthType = {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  isLoading: boolean;
};

const Input: React.FC<TextInputProps & { icon?: React.ReactNode }> = ({ icon, ...props }) => (
  <View style={styles.inputWrapper}>
    {icon ? <View style={styles.inputIcon}>{icon}</View> : null}
    <TextInput
      placeholderTextColor="rgba(255,255,255,0.6)"
      style={styles.input}
      {...props}
    />
  </View>
);

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { signIn, isLoading: authLoading } = useAuth() as UseAuthType;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Informe email e senha');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(email.trim(), password);
      if (!res.ok) {
        Alert.alert('Erro', res.error || 'Falha ao autenticar');
        return;
      }
      // signIn redireciona para /tabs
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro inesperado ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.blue[300]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#07070A', '#0D0F14']}
        style={styles.bg}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.brand}>MyIdeas</Text>
            <Text style={styles.subtitle}>Organize suas ideias virais!</Text>
          </View>

          <View style={styles.cardTouch}>
            <LinearGradient
              colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.card}
            >
              <View style={[styles.accentStripe, { backgroundColor: colors.blue[300] }]} />

              <View style={styles.form}>
                <Text style={styles.cardTitle}>Entrar</Text>

                <Input
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Email"
                  icon={<Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.7)" />}
                />

                <Input
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Senha"
                  icon={<Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.7)" />}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[colors.blue[300], colors.blue[400]]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={styles.buttonInner}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Entrar</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupRow}>
                  <Text style={styles.link}>Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text></Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Protegido por MyIdeas • {new Date().getFullYear()}</Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07070A' },
  bg: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  center: { alignItems: 'center', justifyContent: 'center' },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
    fontSize: 13,
  },

  /* Card (glass) */
  cardTouch: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    borderRadius: 16,
    overflow: 'hidden',
    // shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    // elevation Android
    elevation: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  accentStripe: {
    width: 8,
    borderRadius: 6,
    marginRight: 14,
  },
  form: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },

  /* Inputs */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },

  /* Button */
  button: {
    marginTop: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonInner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  signupRow: { marginTop: 12, alignItems: 'center' },
  link: { color: 'rgba(255,255,255,0.75)' },
  linkBold: { color: '#fff', fontWeight: '700' },

  footer: { marginTop: 28, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.25)', fontSize: 12 },
});

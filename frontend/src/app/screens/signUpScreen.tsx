// src/screens/SignUpScreen.tsx
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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/styles/colors';
import { useAuth } from '@/src/contexts/AuthContext';

type AuthResult = { ok: boolean; error?: string };
type UseAuthType = {
  signUp: (data: {
    nome: string;
    email: string;
    password: string;
    nascimento?: string | null;
    telefone?: string | null;
    instagram_username?: string | null;
  }) => Promise<AuthResult>;
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

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const { signUp, isLoading: authLoading } = useAuth() as UseAuthType;

  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nascimento, setNascimento] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (!nome || !email || !password) {
      Alert.alert('Erro', 'Nome, email e senha são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const res = await signUp({
        nome,
        email: email.trim(),
        password,
        nascimento: nascimento || null,
        telefone: telefone || null,
        instagram_username: instagram || null,
      });

      if (!res.ok) {
        Alert.alert('Erro', res.error || 'Falha ao cadastrar');
        return;
      }

      Alert.alert('Sucesso', 'Conta criada! Faça login.');
      router.replace('/login');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro inesperado ao cadastrar');
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
      <LinearGradient colors={['#07070A', '#0D0F14']} style={styles.bg}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.brand}>MyIdeas</Text>
            <Text style={styles.subtitle}>Crie sua conta e comece a organizar</Text>
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
                <Text style={styles.cardTitle}>Criar conta</Text>

                <Input
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Nome"
                  icon={<Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.7)" />}
                  autoCapitalize="words"
                />

                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  icon={<Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.7)" />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Senha"
                  icon={<Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.7)" />}
                  secureTextEntry
                />

                <Input
                  value={nascimento}
                  onChangeText={setNascimento}
                  placeholder="Data de nascimento (YYYY-MM-DD)"
                  icon={<Ionicons name="calendar-outline" size={18} color="rgba(255,255,255,0.7)" />}
                />

                <Input
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="Telefone"
                  icon={<Ionicons name="call-outline" size={18} color="rgba(255,255,255,0.7)" />}
                  keyboardType="phone-pad"
                />

                <Input
                  value={instagram}
                  onChangeText={setInstagram}
                  placeholder="Instagram (username)"
                  icon={<Ionicons name="logo-instagram" size={18} color="rgba(255,255,255,0.7)" />}
                  autoCapitalize="none"
                />

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading} activeOpacity={0.85}>
                  <LinearGradient colors={[colors.blue[300], colors.blue[400]]} start={[0, 0]} end={[1, 0]} style={styles.buttonInner}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login')} style={styles.signupRow}>
                  <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Entrar</Text></Text>
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

export default SignUpScreen;

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
    marginBottom: 18,
  },
  brand: {
    color: '#fff',
    fontSize: 26,
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
    maxWidth: 640,
    borderRadius: 16,
    overflow: 'hidden',
    // shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    // elevation Android
    elevation: 10,
    marginBottom: 12,
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

  footer: { marginTop: 18, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.25)', fontSize: 12 },
});

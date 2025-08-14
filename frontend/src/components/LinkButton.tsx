import React from 'react'
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'

export type LinkButtonProps = {
  label: string
  url?: string
  colors: [string, string]
  onPress?: (event: GestureResponderEvent) => void
}

const LinkButton: React.FC<LinkButtonProps> = ({ label, url, colors, onPress }) => {
  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) return onPress(event)
    if (url) {
      // dynamic import to avoid SSR issues
      import('react-native').then(({ Linking }) => {
        Linking.openURL(url)
      })
    }
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} style={styles.container}>
      <LinearGradient colors={colors} start={[0, 0]} end={[1, 1]} style={styles.gradient}>
        <View style={styles.icon}>
            <MaterialIcons name="open-in-new" size={28} color="#fff"/>
        </View>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
};

export default LinkButton
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    marginRight: 12,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
})

// File: src/components/ButtonComponent.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonComponentProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'bordered'; 
  style?: object;
  textStyle?: object;
  icon?: string
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  onPress,
  type = 'primary', 
  style,
  textStyle,
  icon
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[type], style]} 
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {icon && (
          <MaterialIcons name={icon} size={20} color={'#fff'}/>
        )}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  primary: {
    backgroundColor: colors.blue[300],
  },
  secondary: {
    backgroundColor: '#242424',
  },
  bordered: {
    borderWidth: 2,
    borderColor: colors.blue[300],
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  borderedText: {
    color: colors.blue[300], 
  },
});

export default ButtonComponent;

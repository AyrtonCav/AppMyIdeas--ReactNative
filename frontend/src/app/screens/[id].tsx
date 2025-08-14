import { useIdeas } from '@/src/contexts/IdeasContext';
import DetailSection from '@/src/components/DetailsSection';
import LinkButton from '@/src/components/LinkButton';
import ButtonComponent from '@/src/components/ButtonsComponent';
import { colors } from '@/src/styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

export default function IdeaDetails() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { ideas, deleteIdea } = useIdeas();

  const idea = ideas.find((i) => i.id === Number(params.id));

  if (!idea) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Ideia não encontrada</Text>
          <Button title="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
  Alert.alert(
    'Confirmar Exclusão',
    'Tem certeza de que deseja excluir esta ideia?',
    [
      {
        text: 'Cancelar',
        onPress: () => console.log('Ação de exclusão cancelada'),
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: () => {
          deleteIdea(idea.id);
          router.back();
        },
        style: 'destructive',
      },
    ],
    { cancelable: false }
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <DetailSection idea={idea}/>

      <LinearGradient colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.03)']} start={[0, 0]} end={[1, 1]}style={styles.sectionLinks}>
          <View style={{ flexDirection: 'row', gap: 4}}>
            <MaterialIcons name="link" size={28} color={'#fff'}/>
            <Text style={styles.titleLinks}>Links de Referência</Text>
          </View>
          <LinkButton 
            label='Vídeo de Referência' 
            url={idea.videoUrl}
            colors={['#8E2DE2', '#4A00E0']}
          />
      
          <LinkButton 
            label='Música de Referência' 
            url={idea.musicaUrl}
            colors={['#11998E', '#38EF7D']}
          />
      </LinearGradient>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
        <ButtonComponent 
          title="Editar Ideia" 
          type="primary" 
          onPress={() => router.push(`/screens/EditIdea?id=${params.id}`)}
          icon='edit'
          style={{paddingHorizontal: 24}}
        />
        
        <ButtonComponent
          title='Excluir Ideia'
          onPress={handleDelete}
          type= 'primary'
          style={[styles.buttonBack, {paddingHorizontal: 24}]}
          icon='delete'
        />
      </View>
      <ButtonComponent 
        title='Voltar'
        type='bordered'
        textStyle={styles.backText}
        onPress={() => router.back()}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#101010' 
  },
  content: { 
    padding: 12,
    gap: 22,
  },

  title: {

  },

  sectionLinks: {
    width: '99%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 26,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  titleLinks: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 18
  },

  buttonBack: {
    backgroundColor: colors.secondary.error,
  },

  backText: {
    fontSize: 18,
    color: colors.blue[300],
    fontWeight: '500'
  },

  
});

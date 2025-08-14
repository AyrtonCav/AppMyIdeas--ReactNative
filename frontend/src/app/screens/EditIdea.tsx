// File: src/app/(tabs)/ideaDetails/edit.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/styles/colors';
import ButtonsComponent from '@/src/components/ButtonsComponent';
import { useIdeas } from '@/src/contexts/IdeasContext';

export default function EditIdea() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { ideas, updateIdea } = useIdeas();
  const [titulo, setTitulo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [musicaUrl, setMusicaUrl] = useState('');
  const [categoria, setCategoria] = useState<'Legendado' | 'Matéria' | 'Meme'>('Legendado');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Concluída'>('Pendente');
  const [favorito, setFavorito] = useState(false);
  const [publicidade, setPublicidade] = useState(false);
  const [dataPostagem, setDataPostagem] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const idea = ideas.find((i) => i.id === Number(params.id));
  console.log('Updating idea with id:', params.id); 

  useEffect(() => {
    if (idea) {
      setTitulo(idea.titulo ?? '');
      setVideoUrl(idea.videoUrl ?? '');
      setMusicaUrl(idea.musicaUrl ?? '');
      setCategoria(idea.categoria ?? 'Legendado');
      setDescricao(idea.descricao ?? '');
      setStatus(idea.status ?? 'Pendente');

      setFavorito(!!idea.favorito);
      setPublicidade(!!idea.publicidade);

      const parsedDate = idea.data ? new Date(idea.data) : new Date();
      setDataPostagem(parsedDate);

      setShowDatePicker(false);
    }
  }, [idea]);

  const handleSave = async () => {
    if (!titulo || !videoUrl || !musicaUrl || !categoria || !descricao || !status) {
      alert('Por favor, preencha todos os campos.');
      return; 
    }

    
    Alert.alert(
      'Confirmar Alterações', 
      'Você tem certeza de que deseja salvar as alterações?',
      [
        {
          text: 'Cancelar', // Botão para cancelar
          onPress: () => console.log('Alterações não foram salvas'), 
          style: 'destructive',
        },
        {
          text: 'Salvar',
          onPress: () => {
            const updatedIdea = {
              id: Number(params.id),
              titulo,
              videoUrl,
              musicaUrl,
              categoria,
              descricao,
              status,
              favorito: !!favorito,
              publicidade: !!publicidade,
              data: dataPostagem,
            };

            console.log('Updated Idea:', updatedIdea);

            try {
              updateIdea(Number(params.id), updatedIdea);
              router.back();  
            } catch (error) {
              console.error('Erro ao atualizar a ideia:', error);
              alert('Erro ao atualizar a ideia. Tente novamente.');
            }
          },
          style: 'default', 
        },
      ],
      { cancelable: false } 
    );
  };

  const handleBack = () => {
    Alert.alert(
      'Cancelar alterações', 
      'Você tem certeza de que deseja cancelar as alterações? As alterações não salvas serão perdidas.', 
      [
        {
          text: 'Continuar editando', 
          onPress: () => console.log('Alterações não foram canceladas'), 
          style: 'cancel',
        },
        {
          text: 'Cancelar edição', 
          onPress: () => {
            router.back();  
          },
          style: 'destructive', 
        },
      ],
      { cancelable: false } 
    );
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dataPostagem;
    setShowDatePicker(false);
    setDataPostagem(currentDate);
  };

  const categoryBorder =
    categoria === 'Legendado'
      ? { borderColor: colors.secondary.legendadoCategory.solid }
      : categoria === 'Matéria'
      ? { borderColor: colors.secondary.materiaCategory.solid }
      : { borderColor: colors.secondary.memeCategory.solid }


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Editar Ideia</Text>
          
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='lightbulb-outline' size={20} color={'#fff'}/>
            <Text style={styles.label}>Título da ideia</Text>
          </View>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder='Insira um título' />

          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='description' size={20} color={'#fff'}/>
            <Text style={styles.label}>Descrição</Text>
          </View>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder='Descreva sua ideia em detalhes...'
            multiline
          />

          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='add-link' size={20} color={'#fff'}/>
            <Text style={styles.label}>URL do vídeo</Text>
          </View>
          <TextInput style={styles.input} value={videoUrl} onChangeText={setVideoUrl} placeholder='Cole a URL do vídeo' />

          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='add-link' size={20} color={'#fff'}/>
            <Text style={styles.label}>URL da música</Text>
          </View>
          <TextInput style={styles.input} value={musicaUrl} onChangeText={setMusicaUrl} placeholder='Cole a URL da música'/>

          {/* Categoria */}
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='label' size={20} color={'#fff'}/>
            <Text style={styles.label}>Categoria</Text>
          </View>
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[styles.categoryButton, categoria === 'Matéria' && styles.categoryMateria]}
              onPress={() => setCategoria('Matéria')}
            >
              <View style={[styles.categoryCircle, categoria === 'Matéria' && categoryBorder]} />
              <Text style={styles.categoryText}>Matéria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryButton, categoria === 'Legendado' && styles.categoryLegendado]}
              onPress={() => setCategoria('Legendado')}
            >
              <View style={[styles.categoryCircle, categoria === 'Legendado' && categoryBorder]} />
              <Text style={styles.categoryText}>Legendado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryButton, categoria === 'Meme' && styles.categoryMeme]}
              onPress={() => setCategoria('Meme')}
            >
              <View style={[styles.categoryCircle, categoria === 'Meme' && categoryBorder]} />
              <Text style={styles.categoryText}>Meme</Text>
            </TouchableOpacity>
          </View>

          {/* Status */}
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='radio-button-checked' size={20} color={'#fff'}/>
            <Text style={styles.label}>Status</Text>
          </View>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[styles.statusButton, status === 'Pendente' && styles.statusPendente]}
              onPress={() => setStatus('Pendente')}
            >
              <MaterialIcons name='error' color={'#fff'} size={20}/>
              <Text style={styles.statusText}>Pendente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, status === 'Concluída' && styles.statusConcluido]}
              onPress={() => setStatus('Concluída')}
            >
              <MaterialIcons name='check-circle' color={'#fff'} size={20}/>
              <Text style={styles.statusText}>Concluída</Text>
            </TouchableOpacity>
          </View>

          {/* Data de Postagem */}
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='calendar-month' size={20} color={'#fff'}/>
            <Text style={styles.label}>Data de Postagem</Text>
          </View>
          <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{dataPostagem.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dataPostagem}
              mode="date"
              display="inline"
              onChange={onChangeDate}
            />
          )}

          {/* Favorito e Publicidade */}
          <View style={styles.switchContainer}>
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='star' size={20} color={'#fff'}/>
            <Text style={styles.label}>Favorito</Text>
          </View>
            <Switch value={!!favorito} onValueChange={setFavorito} />
          </View>

          <View style={styles.switchContainer}>
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='campaign' size={20} color={'#fff'}/>
            <Text style={styles.label}>Publicidade</Text>
          </View>
            <Switch value={!!publicidade} onValueChange={setPublicidade} />
          </View>


          {/* Buttons */}
          <ButtonsComponent title="Salvar Alterações" onPress={handleSave} type="primary" icon='save' />

          <ButtonsComponent title="Cancelar" onPress={handleBack} type="secondary"/>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  form: { 
    padding: 16,
    gap: 8, 
  },
  title: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 20 
  },
  label: { 
    color: '#fff', 
    marginBottom: 8,
    marginTop: 6,
    fontWeight: '600',
    fontSize: 15
  },
  input: {
    backgroundColor: '#242424',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#242424',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.gray[200]
  },

  categoryMateria: {
    backgroundColor: colors.secondary.materiaCategory.translucid,
    borderWidth: 1,
    borderColor: colors.secondary.materiaCategory.solid
  },

  categoryLegendado: {
    backgroundColor: colors.secondary.legendadoCategory.translucid,
    borderWidth: 1,
    borderColor: colors.secondary.legendadoCategory.solid
  },

  categoryMeme: {
    backgroundColor: colors.secondary.memeCategory.translucid,
    borderWidth: 1,
    borderColor: colors.secondary.memeCategory.solid
  },

  categoryCircle: {
    backgroundColor: 'transparent',
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#fff'
  },

  categoryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: '#242424',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },

  statusPendente: {
    backgroundColor: '#ffbb00ff'
  },

  statusConcluido: {
    backgroundColor: colors.secondary.success
  },

  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: '#242424',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  backButtonText: {
    color: colors.blue[300],
    fontSize: 18,
    fontWeight: '600',
  },
});

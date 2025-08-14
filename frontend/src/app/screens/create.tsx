// File: src/app/(tabs)/IdeaBank/create.tsx
import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import ButtonsComponent from '@/src/components/ButtonsComponent';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/styles/colors';
import api from '@/src/api';
import { useIdeas } from '@/src/contexts/IdeasContext';

export default function CreateIdea() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [musicaUrl, setMusicaUrl] = useState('');
  const [categoria, setCategoria] = useState<'Legendado' | 'Matéria' | 'Meme'>();
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<'Pendente' | 'Concluída'>('Pendente');
  const [favorito, setFavorito] = useState(false);
  const [publicidade, setPublicidade] = useState(false);
  const [dataPostagem, setDataPostagem] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    try {
      const newIdea = {
        titulo,
        videoUrl,
        musicaUrl,
        categoria,
        descricao,
        status,
        favorito,
        publicidade,
        data: dataPostagem, 
      };

      const response = await api.post('/ideias', newIdea); 
      console.log(response);  

      if (response.status === 201) {
        alert('Ideia criada com sucesso!');
        
        const createdIdea = { ...newIdea, id: response.data.id };
        console.log('Nova ideia criada:', createdIdea);

        router.back();
      }
    } catch (error) {
      console.error('Erro ao criar a ideia:', error);
      alert('Erro ao criar a ideia. Tente novamente!');
    }
  };

  function handleBack() {
    router.back();
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dataPostagem;
    setShowDatePicker(false);
    setDataPostagem(currentDate);
  };

  const categoryStyle =
    categoria === 'Legendado'
      ? styles.categoryLegendado
      : categoria === 'Matéria'
      ? styles.categoryMateria
      : styles.categoryMeme

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
          <Text style={styles.title}>Adicionar Ideia</Text>
          
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

          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='label' size={20} color={'#fff'}/>
            <Text style={styles.label}>Categoria</Text>
          </View>

          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[styles.categoryButton, categoria === 'Matéria' && categoryStyle]}
              onPress={() => setCategoria('Matéria')}
            > 
              <View style={[styles.categoryCircle, categoria === 'Matéria' && categoryBorder]} />
              <Text style={styles.categoryText}>Matéria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, categoria === 'Legendado' && categoryStyle]}
              onPress={() => setCategoria('Legendado')}
            >
              <View style={[styles.categoryCircle, categoria === 'Legendado' && categoryBorder]} />
              <Text style={styles.categoryText}>Legendado</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, categoria === 'Meme' && categoryStyle]}
              onPress={() => setCategoria('Meme')}
            >
              <View style={[styles.categoryCircle, categoria === 'Meme' && categoryBorder]} />
              <Text style={styles.categoryText}>Meme</Text>
            </TouchableOpacity>
          </View>

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

          <View style={styles.switchContainer}>
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='star' size={20} color={'#fff'}/>
            <Text style={styles.label}>Favorito</Text>
          </View>
            <Switch value={favorito} onValueChange={setFavorito} />
          </View>

          <View style={styles.switchContainer}>
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <MaterialIcons name='campaign' size={20} color={'#fff'}/>
            <Text style={styles.label}>Publicidade</Text>
          </View>
            <Switch value={publicidade} onValueChange={setPublicidade} />
          </View>

          <ButtonsComponent title="Criar Ideia" onPress={handleSave} type="primary" icon='add-circle' />

          <ButtonsComponent title="Voltar" onPress={handleBack} type="bordered" textStyle={styles.backButtonText}/>
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

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import  { colors } from '../styles/colors';

export type DetailSectionProps = {
  data: Date;
  favorito: boolean;
  titulo: string;
  categoria: 'Legendado' | 'Matéria' | 'Meme';
  publicidade: boolean;
  status: 'Concluída' | 'Pendente';
  descricao: string;
}

const DetailSection: React.FC<{ idea: DetailSectionProps }> = ({ idea }) => {
  // Map categoria to style
  const categoryStyle =
    idea.categoria === 'Legendado'
      ? styles.categoryLegendado
      : idea.categoria === 'Matéria'
      ? styles.categoryMateria
      : styles.categoryMeme

  const categoryBorder =
    idea.categoria === 'Legendado'
      ? { borderColor: colors.secondary.legendadoCategory.solid }
      : idea.categoria === 'Matéria'
      ? { borderColor: colors.secondary.materiaCategory.solid }
      : { borderColor: colors.secondary.memeCategory.solid }

  const statusStyle =
    idea.status === 'Concluída' ? styles.statusDone : styles.statusPending

  return (
    <LinearGradient colors={['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.01)']}  start={[0, 0]} end={[1, 1]} style={styles.sectionTitle}>
      <View style={styles.row}>
        <Text style={styles.dateBadge}>{new Date(idea.data).toLocaleDateString()}</Text>
        <View style={styles.favorite}>
          {idea.favorito && <Ionicons name="star" size={24} color={colors.secondary.favorite} />}
        </View>
      </View>

      <View style={styles.titleContainer}>
        <MaterialIcons name="video-collection" size={34} color="#fff" />
        <Text style={styles.cardTitle}>{idea.titulo}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.categoryBadge, categoryStyle, categoryBorder]}>
          <View style={[styles.categoryCircle, categoryBorder]} />
          <Text style={styles.categoryText}>{idea.categoria}</Text>
        </View>

        <View style={styles.publicidadeContainer}>
          {idea.publicidade && (
            <>
              <MaterialIcons name="campaign" size={20} color="#fff" />
              <Text style={styles.publicidadeText}>Publicidade</Text>
            </>
          )}
        </View>
      </View>

      <View style={[styles.statusBadge, statusStyle]}>
        {idea.status === 'Concluída' ? (
          <MaterialIcons name="check-circle" size={20} color={colors.secondary.success} />
        ) : (
          <MaterialIcons name="error" size={20} color={colors.secondary.favorite} />
        )}
        <Text style={styles.statusText}> - Edição {idea.status}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.sectionDescription}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
          <MaterialIcons name='description' size={26} color={'#fff'}/>
          <Text style={styles.titleDescription}>Descrição Completa:</Text>
        </View>
        <Text style={styles.description}>{idea.descricao}</Text>
      </View>
    </LinearGradient>
  )
}

export default DetailSection

const styles = StyleSheet.create({
  sectionTitle: {
    width: '99%',
    overflow: 'hidden',
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateBadge: {
    backgroundColor: colors.blue[300],
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    overflow: 'hidden',
  },

  favorite: {
    padding: 8,
    backgroundColor: '#ffffff1c',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 16,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },

  categoryCircle: {
    backgroundColor: 'transparent',
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 4,
  },

  categoryLegendado: {
    backgroundColor: colors.secondary.legendadoCategory.translucid,
    borderWidth: 1,
  },

  categoryMateria: {
    backgroundColor: colors.secondary.materiaCategory.translucid,
    borderWidth: 1,
  },

  categoryMeme: {
    backgroundColor: colors.secondary.memeCategory.translucid,
    borderWidth: 1,
  },

  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  publicidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 0,
    gap: 6,
  },

  publicidadeText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#fff',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 165,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 40,
    marginTop: 12,
  },

  statusDone: {
    backgroundColor: colors.gray[200],
    borderWidth: 1,
    borderColor: colors.secondary.success,
  },

  statusPending: {
    backgroundColor: colors.gray[200],
    borderWidth: 1,
    borderColor: colors.secondary.favorite,
  },

  statusText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 13,
  },

  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 24,
  },

  sectionDescription: {
    marginTop: 10,
    gap: 12,
  },
  
  titleDescription: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },

  description: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 27,
    color: '#fff',
    textAlign: 'left',
    padding: 8,
    backgroundColor: '#ffffff1c',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
})

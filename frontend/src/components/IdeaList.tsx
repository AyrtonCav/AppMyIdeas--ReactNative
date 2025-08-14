import React from 'react';
import { FlatList, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Idea } from '../types/Idea';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  ideas: Idea[];
};

const IdeaList: React.FC<Props> = ({ ideas }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Idea }) => {
    const videoIdMatch = item.musicaUrl?.match(/(?:v=|\.be\/)([\w-]+)/);
    const thumbnail = videoIdMatch
      ? { uri: `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` }
      : require('../../assets/images/icon.png');

    const stripeColor =
      item.categoria === 'Legendado'
        ? colors.secondary.legendadoCategory.solid
        : item.categoria === 'Matéria'
        ? colors.secondary.materiaCategory.solid
        : colors.secondary.memeCategory.solid;

    return (
      <TouchableOpacity
        style={styles.cardTouch}
        onPress={() => router.push(`/screens/${item.id}`)}
        activeOpacity={0.86}
      >
        <View style={styles.card}>
          <View style={styles.thumbWrap}>
            <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.55)']}
              style={styles.thumbOverlay}
            />
            <View style={styles.titleOverlay}>
              <View style={[styles.accentStripe, { backgroundColor: stripeColor }]} />
              <MaterialIcons name="video-collection" size={28} color="#fff" style={{ marginRight: 2 }} />
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.titulo}
              </Text>
            </View>

            <View style={styles.topRight}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>
                  {new Date(item.data).toLocaleDateString()}
                </Text>
              </View>
              {item.favorito && <Ionicons name="star" size={21} color="#FFD700" style={{ marginLeft: 8 }} />}
            </View>
          </View>

          {/* Conteúdo abaixo do thumbnail */}
          <View style={styles.content}>
            <View style={styles.badgesRow}>
              <View style={styles.leftBadges}>
                <View style={[styles.categoryBadgeCompact, { borderColor: stripeColor }]}>
                  <View style={[styles.categoryCircle, { borderColor: stripeColor }]} />
                  <Text style={styles.categoryTextCompact}>{item.categoria}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadgeCompact,
                    item.status === 'Concluída' ? styles.statusDoneCompact : styles.statusPendingCompact,
                  ]}
                >
                  {item.status === 'Concluída' ? (
                    <MaterialIcons name="check-circle" size={17} color={colors.secondary.success} />
                  ) : (
                    <MaterialIcons name="error" size={17} color={colors.secondary.favorite} />
                  )}
                  <Text style={styles.statusTextCompact}>{item.status}</Text>
                </View>
              </View>

              {item.publicidade && (
                <View style={styles.publicidadeCompact}>
                  <MaterialIcons name="campaign" size={20} color="#fff" />
                  <Text style={styles.publicidadeTextCompact}>Publicidade</Text>
                </View>
              )}
            </View>

            <Text style={styles.cardDesc} numberOfLines={2}>
              {item.descricao}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={ideas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, paddingBottom: 56 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  cardTouch: {
    marginBottom: 16,
    borderRadius: 12,
    // sombra (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // elevation Android
    elevation: 6,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },

  /* Thumbnail */
  thumbWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#111',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.75,
  },
  thumbOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },

  titleOverlay: {
    position: 'absolute',
    left: 12,
    bottom: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
  },
  accentStripe: {
    width: 6,
    height: 28,
    borderRadius: 4,
  },

  topRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: 'rgba(13,40,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  /* Conteúdo */
  content: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },

  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leftBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },

  categoryBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginRight: 8,
    marginBottom: 6,
  },
  categoryCircle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 3,
    marginRight: 8,
  },
  categoryTextCompact: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  publicidadeCompact: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  publicidadeTextCompact: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  statusBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginLeft: 0,
    marginRight: 8,
    marginBottom: 6,
  },
  statusDoneCompact: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: colors.secondary.success,
  },
  statusPendingCompact: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: colors.secondary.favorite,
  },
  statusTextCompact: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 13, 
  },

  cardDesc: {
    color: '#CFCFCF',
    fontSize: 15,
    lineHeight: 20,
  },
});

export default IdeaList;

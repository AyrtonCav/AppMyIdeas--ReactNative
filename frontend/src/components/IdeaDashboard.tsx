import React from 'react';
import { FlatList, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Idea } from '../types/Idea';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  ideas: Idea[];
};

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.45); // duas colunas por tela aproximadamente
const CARD_HEIGHT = 300;

const IdeaDashboard: React.FC<Props> = ({ ideas }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Idea }) => {
    const videoIdMatch = item.musicaUrl?.match(/(?:v=|\.be\/)([\w-]+)/);
    const thumbnail = videoIdMatch
      ? { uri: `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg` }
      : require('../../assets/images/icon.png'); // ajuste caminho conforme necessário

    const stripeColor =
      item.categoria === 'Legendado'
        ? colors.secondary.legendadoCategory.solid
        : item.categoria === 'Matéria'
        ? colors.secondary.materiaCategory.solid
        : colors.secondary.memeCategory.solid;

    return (
      <TouchableOpacity
        style={[styles.cardTouch, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
        onPress={() => router.push(`/screens/${item.id}`)}
        activeOpacity={0.86}
      >
        <View style={styles.card}>
          {/* Thumbnail */}
          <View style={styles.thumbWrap}>
            <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.thumbOverlay} />
            <View style={styles.titleOverlay}>
              <View style={[styles.accentStripe, { backgroundColor: stripeColor }]} />
              <MaterialIcons name="video-collection" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.titulo}
              </Text>
            </View>

            <View style={styles.topRight}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>
                  {new Date(item.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </Text>
              </View>
              {item.favorito && <Ionicons name="star" size={19} color="#FFD700" style={{ marginLeft: 8 }} />}
            </View>
          </View>

          {/* Content / badges */}
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
                    <MaterialIcons name="check-circle" size={16} color={colors.secondary.success} />
                  ) : (
                    <MaterialIcons name="error" size={16} color={colors.secondary.favorite} />
                  )}
                  <Text style={styles.statusTextCompact}>{item.status}</Text>
                </View>
              </View>

              {item.publicidade && (
                <View style={styles.publicidadeCompact}>
                  <MaterialIcons name="campaign" size={16} color="#fff" />
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
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      showsHorizontalScrollIndicator={false}
      horizontal
      snapToInterval={CARD_WIDTH + 16}
      decelerationRate="fast"
    />
  );
};

const styles = StyleSheet.create({
  cardTouch: {
    marginRight: 16,
    borderRadius: 12,
    // shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // elevation Android
    elevation: 6,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    overflow: 'hidden',
  },

  thumbWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#111',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
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
    left: 10,
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  accentStripe: {
    width: 6,
    height: 24,
    borderRadius: 4,
    marginRight: 4,
  },

  topRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateBadge: {
    backgroundColor: 'rgba(13,40,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12.5,
  },

  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 6,
  },
  categoryCircle: {
    width: 14.5,
    height: 14.5,
    borderRadius: 8,
    borderWidth: 3,
    marginRight: 8,
  },
  categoryTextCompact: {
    color: '#fff',
    fontSize: 13.5,
    fontWeight: '700',
  },

  statusBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
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
    fontSize: 12.2,
  },

  publicidadeCompact: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignSelf: 'flex-start',
  },

  cardDesc: {
    color: '#CFCFCF',
    fontSize: 14.5,
    lineHeight: 19,
  },
});

export default IdeaDashboard;

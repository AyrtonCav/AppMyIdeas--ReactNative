import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import 'moment/locale/pt-br';
import { colors } from '../styles/colors';
import type { Idea } from '../types/Idea';
import { ptBR } from '@/src/utils/localeCalendarConfig';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';
moment.locale('pt-br');

type Props = {
  ideas: Idea[];
};

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const CalendarDashboard: React.FC<Props> = ({ ideas }) => {
  const [weekStart, setWeekStart] = useState<string>(moment().startOf('isoWeek').format('YYYY-MM-DD'));
  const [weekEnd, setWeekEnd] = useState<string>(moment().startOf('isoWeek').add(6, 'days').format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const router = useRouter();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ideasListRef = useRef<FlatList<Idea> | null>(null);
  const [activeIdeaIndex, setActiveIdeaIndex] = useState(0);

  const SPACING = 22;
  const CARD_WIDTH = Math.round(WINDOW_WIDTH * 0.9);

  const updateWeekToCurrent = () => {
    const ws = moment().startOf('isoWeek').format('YYYY-MM-DD');
    const we = moment(ws).add(6, 'days').format('YYYY-MM-DD');
    setWeekStart(ws);
    setWeekEnd(we);
    setSelectedDate(moment().format('YYYY-MM-DD'));
  };

  const scheduleNextWeekUpdate = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const now = moment();
    const nextWeekStart = moment().startOf('isoWeek').add(1, 'week').startOf('day'); 
    const ms = nextWeekStart.diff(now);

    if (ms <= 0) {
      updateWeekToCurrent();
      scheduleNextWeekUpdate();
      return;
    }

    timerRef.current = setTimeout(() => {
      updateWeekToCurrent();
      scheduleNextWeekUpdate();
    }, ms);
  };

  useEffect(() => {
    updateWeekToCurrent();
    scheduleNextWeekUpdate();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
   
  }, []);

  useEffect(() => {
    scheduleNextWeekUpdate();
  }, [weekStart]);

  useEffect(() => {
    const filtered = ideas.filter((idea) => {
      const ideaDate = moment(idea.data).format('YYYY-MM-DD');
      return ideaDate === selectedDate;
    });
    setFilteredIdeas(filtered);
    setActiveIdeaIndex(0); 
    ideasListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [selectedDate, ideas]);

  const weekDays = useMemo(() => {
    const start = moment(weekStart);
    return Array.from({ length: 7 }).map((_, i) => {
      const m = start.clone().add(i, 'day');
      const key = m.format('YYYY-MM-DD');
      const count = ideas.reduce((acc, idea) => {
        const ideaDate = moment(idea.data).format('YYYY-MM-DD');
        return acc + (ideaDate === key ? 1 : 0);
      }, 0);
      return {
        key,
        dayName: m.format('ddd').replace('.', ''),
        dayNumber: m.format('DD'),
        fullLabel: m.format('DD [de] MMM'),
        count,
      };
    });
  }, [weekStart, ideas]);

  const renderDay = ({ item }: { item: { key: string; dayName: string; dayNumber: string; fullLabel: string; count: number } }) => {
    const isSelected = item.key === selectedDate;
    const isToday = item.key === moment().format('YYYY-MM-DD');
    const showBadge = item.count > 0;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedDate(item.key)}
        style={[styles.dayContainer, isSelected && styles.dayContainerSelected]}
      >
        <View style={styles.dayTopRow}>
          <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>
            {item.dayName.toUpperCase()}
          </Text>

          {showBadge && (
            <View style={styles.countBadgeContainer}>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {item.count > 9 ? '9+' : String(item.count)}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={[styles.dayNumberWrapper, isSelected && styles.dayNumberWrapperSelected]}>
          <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
            {item.dayNumber}
          </Text>
        </View>

        {isToday && <View style={styles.todayDot} />}
      </TouchableOpacity>
    );
  };

  const headerLabel = `${moment(weekStart).format('DD')} — ${moment(weekEnd).format('DD MMM YYYY')}`;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && typeof viewableItems[0].index === 'number') {
      setActiveIdeaIndex(viewableItems[0].index);
    }
  }).current;

  const renderIdeaItem = ({ item, index }: { item: Idea; index: number }) => {
      const badgeColor = item.status === 'Concluída' ? colors.secondary.success : colors.secondary.favorite;
      const stripeColor =
        item.categoria === 'Legendado'
          ? colors.secondary.legendadoCategory.solid
          : item.categoria === 'Matéria'
          ? colors.secondary.materiaCategory.solid
          : colors.secondary.memeCategory.solid;

      return (
        <TouchableOpacity
          style={[styles.cardTouch, { width: CARD_WIDTH, marginRight: SPACING }]}
          onPress={() => router.push(`/screens/${item.id}`)}
          activeOpacity={0.85}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.01)']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.cardInnerGradient}
          >
            {/* Left accent stripe */}
            <View style={[styles.accentStripe, { backgroundColor: stripeColor }]} />

            {/* Main content */}
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <View style={styles.iconWrap}>
                  <MaterialIcons name="video-collection" size={28} color="#fff" />
                </View>

                <View style={styles.titleBlock}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                    {item.titulo}
                  </Text>
                </View>

                {/* status badge + favorite */}
                <View style={styles.rightActions}>
                  <View style={[styles.smallBadge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.smallBadgeText}>{item.status === 'Concluída' ? 'OK' : '!'}</Text>
                  </View>

                  {item.favorito && (
                    <Ionicons style={{ marginLeft: 8 }} name="star" size={18} color="#FFD700" />
                  )}
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{item.categoria}</Text>
                </View>

                {item.publicidade && (
                  <View style={styles.adPill}>
                    <MaterialIcons name="campaign" size={14} color="#fff" />
                    <Text style={styles.adPillText}>Anúncio</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{headerLabel}</Text>

      <View style={{ paddingVertical: 8 }}>
        <FlatList
          data={weekDays}
          keyExtractor={(d) => d.key}
          renderItem={renderDay}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        />
      </View>
      <View style={styles.divider} />

      <View style={styles.ideasContainer}>
        <Text style={styles.dateText}>Ideias para {selectedDate}</Text>
        <FlatList<Idea>
          ref={ideasListRef}
          data={filteredIdeas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderIdeaItem}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          snapToAlignment="start"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          ListEmptyComponent={
            <View style={{ width: WINDOW_WIDTH - 32, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}>
              <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
                Nenhuma ideia encontrada para esta data.
              </Text>
            </View>
          }
        />

        {/* Dots de paginação do carrossel */}
        <View style={styles.dotsContainer}>
          {filteredIdeas.map((_, i) => (
            <View
              key={`dot-${i}`}
              style={[
                styles.dot,
                i === activeIdeaIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#777',
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center'
  },
  headerTitle: {
    color: '#777',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8
  },
  ideasContainer: {
    marginTop: 8,
    marginBottom: 36,
    flex: 1,
  },
  dateText: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginBottom: 6,
    paddingHorizontal: 12,
    color: '#fff'
  },

  /* Day list */
  dayContainer: {
    width: 78,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  dayContainerSelected: {
    backgroundColor: colors.blue[300],
    borderRadius: 10,
  },
  dayTopRow: {
    width: '100%',
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    color: '#E8E8E8',
    fontWeight: '700',
    marginBottom: 6,
  },
  dayTextSelected: {
    color: '#fff',
  },
  dayNumberWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  dayNumberWrapperSelected: {
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  dayNumber: {
    fontSize: 16,
    color: '#E8E8E8',
    fontWeight: '700'
  },
  dayNumberSelected: {
    color: '#fff'
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary.legendadoCategory.solid,
    marginTop: 6
  },

  /* badge count */
  countBadgeContainer: {
    position: 'absolute',
    right: 4,
    top: -2,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary.legendadoCategory.solid,
    borderWidth: 1,
    borderColor: '#fff'
  },
  countBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700'
  },

  cardTouch: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    // shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // elevation Android
    elevation: 6,
  },
  cardInnerGradient: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 12,
    borderRadius: 14,
  },
  accentStripe: {
    width: 8,
    borderRadius: 6,
    marginRight: 12,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    color: '#DADADA',
    fontSize: 13.5,
    fontWeight: '500',
  },
  rightActions: {
    marginLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  smallBadge: {
    minWidth: 34,
    paddingHorizontal: 8,
    height: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  smallBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  categoryPillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  adPill: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adPillText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },

  /* Dots */
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 24
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  dotActive: { backgroundColor: '#fff' },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.35)' },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10
  },
  categoryLegendado: {
    backgroundColor: colors.secondary.legendadoCategory.translucid,
    borderWidth: 1,
    borderColor: colors.secondary.legendadoCategory.solid
  },
  categoryMateria: {
    backgroundColor: colors.secondary.materiaCategory.translucid,
    borderWidth: 1,
    borderColor: colors.secondary.materiaCategory.solid
  },
  categoryMeme: {
    backgroundColor: colors.secondary.memeCategory.translucid,
    borderWidth: 1,
    borderColor: colors.secondary.memeCategory.solid
  },
  categoryCircle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 4
  },
  publicidadeContainer: {
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff'
  },
  cardDesc: {
    color: '#ccc',
    fontSize: 14.5,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 2,
  },
});

export default CalendarDashboard;

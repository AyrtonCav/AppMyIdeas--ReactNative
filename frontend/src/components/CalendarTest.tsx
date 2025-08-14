import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import 'moment/locale/pt-br';
import { colors } from '../styles/colors';
import type { Idea } from '../types/Idea';
import { ptBR } from '@/src/utils/localeCalendarConfig';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';
moment.locale('pt-br');

type Props = { ideas: Idea[] };

const CalendarComponent: React.FC<Props> = ({ ideas }) => {
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [filter, setFilter] = useState<'Todas' | 'Pendente' | 'Concluída'>('Todas');
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const router = useRouter();

  // Contagem de ideias por data (YYYY-MM-DD)
  const dateCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const idea of ideas) {
      const key = moment(idea.data).format('YYYY-MM-DD');
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [ideas]);

  useEffect(() => {
    const filtered = ideas.filter((idea) => {
      const ideaDate = moment(idea.data).format('YYYY-MM-DD');
      const matchesDate = ideaDate === selectedDate;
      if (filter === 'Todas') return matchesDate;
      return matchesDate && idea.status === filter;
    });
    setFilteredIdeas(filtered);
  }, [selectedDate, filter, ideas]);

  const handleDateChange = (date: { dateString: string } | string) => {
    const dateString = typeof date === 'string' ? date : date.dateString;
    setSelectedDate(dateString);
  };

  const markedDates = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: colors.blue[300],
        selectedTextColor: '#fff',
      },
    };
  }, [selectedDate]);

  const DayComponent = ({ date, state }: { date?: DateData; state?: string }) => {
    if (!date) {
      return <View style={styles.dayWrapper} />;
    }
    const key = date.dateString; // YYYY-MM-DD
    const isSelected = key === selectedDate;
    const isToday = key === moment().format('YYYY-MM-DD');
    const isDisabled = state === 'disabled';
    const count = dateCounts[key] || 0;

    const dayNameStyle = [
      styles.dayNameSmall,
      isSelected && styles.dayNameSelected,
      isDisabled && styles.dayTextDisabled,
    ];

    const dayNumberTextStyle = [
      styles.dayNumberText,
      isSelected && styles.dayNumberTextSelected,
      isDisabled && styles.dayTextDisabled,
    ];

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleDateChange(date)}
        disabled={isDisabled}
        style={[
          styles.dayWrapper,
          isSelected && styles.dayWrapperSelected,
          isDisabled && styles.dayWrapperDisabled,
        ]}
      >
        <View style={[styles.dayNumberBox, isSelected && styles.dayNumberBoxSelected]}>
          <Text style={dayNumberTextStyle}>{date.day}</Text>
        </View>

        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : String(count)}</Text>
          </View>
        )}

        {isToday && <View style={styles.todayDot} />}
      </TouchableOpacity>
    );
  };
  
  const renderItem = ({ item }: { item: Idea }) => {
    const badgeColor = item.status === 'Concluída' ? colors.secondary.success : colors.secondary.favorite;
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
      activeOpacity={0.85}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.01)']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.card}
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

          {/* meta row: categoria, publicidade */}
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
};

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        headerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: '#e8e8e8',
          paddingBottom: 10,
          marginBottom: 10,
        }}
        theme={{
          textMonthFontSize: 18,
          monthTextColor: '#E8E8E8',
          todayTextColor: colors.blue[300],
          selectedDayBackgroundColor: colors.blue[300],
          selectedDayTextColor: '#E8E8E8',
          arrowColor: '#E8E8E8',
          calendarBackground: 'transparent',
          textDayStyle: { color: '#E8E8E8', fontWeight: '600' },
          textDisabledColor: '#717171',
          arrowStyle: { padding: 8, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8 },
        }}
        onDayPress={(d) => handleDateChange(d)}
        markedDates={markedDates}
        dayComponent={(props) => <DayComponent {...props} />}
      />

      {/* Filtros */}
      <View style={styles.divider} />
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Todas' && styles.activeFilter]}
          onPress={() => setFilter('Todas')}
        >
          <Text style={styles.filterText}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Pendente' && styles.activeFilter]}
          onPress={() => setFilter('Pendente')}
        >
          <Text style={styles.filterText}>Pendentes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'Concluída' && styles.activeFilter]}
          onPress={() => setFilter('Concluída')}
        >
          <Text style={styles.filterText}>Concluídas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Ideias */}
      <View style={styles.ideasContainer}>
        <Text style={styles.dateText}>Ideias para {selectedDate}</Text>

        <FlatList
          data={filteredIdeas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
              Nenhuma ideia encontrada para esta data.
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 8 
  },
  calendar: { 
    backgroundColor: 'transparent' 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#777', 
    marginVertical: 6, 
    width: '95%', 
    justifyContent: 'center', 
    alignSelf: 'center' 
  },
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 12, 
    marginVertical: 8 
  },
  filterButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    backgroundColor: '#1E1E1E', 
    borderRadius: 20 
  },
  activeFilter: { 
    backgroundColor: '#0D28FF' 
  },
  filterText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '500' 
  },
  ideasContainer: { 
    marginTop: 12, 
    paddingBottom: 36 
  },
  dateText: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    marginBottom: 6, 
    marginHorizontal: 10, 
    color: '#fff' 
  },

  dayWrapper: { 
    width: 56, 
    height: 70, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 8, 
    marginHorizontal: 4, 
  },
  dayWrapperSelected: { 
    backgroundColor: colors.blue[300] 
  },
  dayWrapperDisabled: { 
    opacity: 0.55 
  },
  dayNameSmall: { 
    fontSize: 11, 
    color: '#E8E8E8', 
    marginBottom: 6, 
    fontWeight: '700' 
  },
  dayNameSelected: { 
    color: '#fff' 
  },
  dayNumberBox: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'transparent' 
  },
  dayNumberBoxSelected: { 
    backgroundColor: 'rgba(255,255,255,0.08)' 
  },
  dayNumberText: { 
    color: '#E8E8E8', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  dayNumberTextSelected: { 
    color: '#fff' 
  },
  dayTextDisabled: { 
    color: '#717171' 
  },

  /* badge */
  badge: { 
    position: 'absolute', 
    right: 18, 
    top: 3, 
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
  badgeText: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: '700' 
  },

  todayDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: colors.secondary.legendadoCategory.solid, 
    position: 'absolute', 
    bottom: 8 
  },

  /* card */
  cardTouch: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    // shadow iOS
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    // elevation Android
    elevation: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 12,
  },
  accentStripe: {
    width: 6,
    borderRadius: 6,
    marginRight: 12,
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
});

export default CalendarComponent;

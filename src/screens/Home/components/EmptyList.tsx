import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, Card} from 'react-native-paper';
import {TodoFilter} from '../../../types/appTypes';
import {useAppSelector} from '../../../hooks/reduxHooks';

interface EmptyListProps {
  filter?: TodoFilter;
  hasSearch?: boolean;
  onClearFilters?: () => void;
}

const EmptyList: React.FC<EmptyListProps> = ({
  filter = 'all',
  hasSearch = false,
  onClearFilters,
}) => {
  const prefsState = useAppSelector(state => state.preferences);

  const getEmptyMessage = () => {
    if (hasSearch) {
      return {
        title: 'No todos found',
        subtitle: 'Try adjusting your search terms or clearing filters to see more results.',
        icon: '🔍',
      };
    }

    switch (filter) {
      case 'completed':
        return {
          title: 'No completed todos',
          subtitle: 'Complete some todos to see them here.',
          icon: '✅',
        };
      case 'pending':
        return {
          title: 'All caught up!',
          subtitle: 'You have no pending todos. Great job staying on top of things!',
          icon: '🎉',
        };
      case 'high':
        return {
          title: 'No high priority todos',
          subtitle: 'You don\'t have any high priority tasks right now.',
          icon: '🔥',
        };
      case 'medium':
        return {
          title: 'No medium priority todos',
          subtitle: 'You don\'t have any medium priority tasks right now.',
          icon: '📋',
        };
      case 'low':
        return {
          title: 'No low priority todos',
          subtitle: 'You don\'t have any low priority tasks right now.',
          icon: '📝',
        };
      default:
        return {
          title: 'No todos yet',
          subtitle: 'Tap the + button below to create your first todo and start organizing your tasks!',
          icon: '📝',
        };
    }
  };

  const message = getEmptyMessage();

  return (
    <View style={styles.container}>
      <Card style={styles.card} elevation={2}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.icon}>{message.icon}</Text>
          
          <Text
            variant="headlineSmall"
            style={styles.title}>
            {message.title}
          </Text>
          
          <Text
            variant="bodyLarge"
            style={styles.subtitle}>
            {message.subtitle}
          </Text>

          {(hasSearch || filter !== 'all') && onClearFilters && (
            <Button
              mode="outlined"
              onPress={onClearFilters}
              style={styles.clearButton}
              icon="filter-remove">
              Clear Filters
            </Button>
          )}
        </Card.Content>
      </Card>

      {filter === 'all' && !hasSearch && (
        <Card style={[styles.card, styles.tipsCard]} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <Text
              variant="titleMedium"
              style={styles.tipsTitle}>
              Quick Tips:
            </Text>
            
            <View style={styles.tips}>
              <Text
                variant="bodyMedium"
                style={styles.tip}>
                • Set priorities to organize your tasks
              </Text>
              <Text
                variant="bodyMedium"
                style={styles.tip}>
                • Add due dates to stay on track
              </Text>
              <Text
                variant="bodyMedium"
                style={styles.tip}>
                • Use tags and categories to group related tasks
              </Text>
              <Text
                variant="bodyMedium"
                style={styles.tip}>
                • Search and filter to find specific todos quickly
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    marginBottom: 16,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    opacity: 0.8,
  },
  clearButton: {
    marginTop: 8,
  },
  tipsCard: {
    marginTop: 0,
  },
  tipsTitle: {
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  tips: {
    gap: 8,
    width: '100%',
  },
  tip: {
    lineHeight: 20,
    paddingLeft: 8,
    textAlign: 'left',
  },
});

export default EmptyList;
import React, {useState, useEffect} from 'react';
import {useFormik} from 'formik';
import {Alert, StyleSheet, View} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  Text,
  SegmentedButtons,
  Chip,
  IconButton,
  Divider,
  HelperText,
  Dialog,
  Portal,
} from 'react-native-paper';
import {TodoFormData, TodoPriority, TaskItem} from '../../../../types/appTypes';
import {todoFormScheme} from './formSchemes';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../../../../hooks/reduxHooks';
import {createTodo, updateTodo} from '../../../../redux/tasks/tasksSlice';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {
  TaskScreenProps,
  RootStackParamList,
} from '../../../../navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TaskFormProps {
  todo?: TaskItem;
  onSubmit?: (todo: TaskItem) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({todo, onSubmit}) => {
  const navigation = useNavigation<TaskScreenProps['navigation']>();
  const route = useRoute<RouteProp<RootStackParamList, 'Task'>>();
  const dispatch = useAppDispatch();
  const {loading, error} = useAppSelector(state => state.todos);
  const {defaultPriority} = useAppSelector(state => state.preferences);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isEditMode = todo || route.params?.todo;
  const todoToEdit = todo || route.params?.todo;

  const formik = useFormik<TodoFormData>({
    validationSchema: todoFormScheme,
    initialValues: {
      title: todoToEdit?.title || '',
      description: todoToEdit?.description || '',
      priority: (todoToEdit?.priority as TodoPriority) || defaultPriority,
      dueDate: (todoToEdit?.dueDate as any)?.toDate ? (todoToEdit?.dueDate as any).toDate() : 
              todoToEdit?.dueDate instanceof Date ? todoToEdit.dueDate : 
              typeof todoToEdit?.dueDate === 'string' ? new Date(todoToEdit.dueDate) : undefined,
      tags: todoToEdit?.tags || [],
      category: todoToEdit?.category || '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async values => {
      try {
        if (isEditMode && todoToEdit) {
          await dispatch(
            updateTodo({
              id: todoToEdit.id,
              updates: {
                title: values.title,
                description: values.description,
                priority: values.priority,
                dueDate: values.dueDate
                  ? require('@react-native-firebase/firestore').default.Timestamp.fromDate(
                      values.dueDate,
                    )
                  : undefined,
                tags: values.tags,
                category: values.category,
              },
            }),
          ).unwrap();

          setSuccessMessage('Todo updated successfully!');
        } else {
          const newTodo = await dispatch(createTodo(values)).unwrap();
          if (onSubmit) {
            onSubmit(newTodo);
          }
          setSuccessMessage('Todo created successfully!');
        }

        setSuccessDialogVisible(true);
      } catch (error) {
        console.error('Error saving todo:', error);
        Alert.alert('Error', 'Failed to save todo. Please try again.');
      }
    },
  });

  const insets = useSafeAreaInsets();

  const priorityOptions = [
    {value: 'low', label: 'Low', icon: 'flag-outline'},
    {value: 'medium', label: 'Medium', icon: 'flag'},
    {value: 'high', label: 'High', icon: 'flag-variant'},
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !formik.values.tags?.includes(tagInput.trim())) {
      formik.setFieldValue('tags', [
        ...(formik.values.tags || []),
        tagInput.trim(),
      ]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags?.filter(tag => tag !== tagToRemove) || [],
    );
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      formik.setFieldValue('dueDate', selectedDate);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditMode ? 'Edit Todo' : 'New Todo',
    });
  }, [navigation, isEditMode]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {/* Title Input */}
          <TextInput
            error={!!(formik.touched.title && formik.errors.title)}
            onChangeText={formik.handleChange('title')}
            onBlur={formik.handleBlur('title')}
            value={formik.values.title}
            style={styles.input}
            mode="outlined"
            placeholder="Enter task title"
            label="Task Title *"
            left={<TextInput.Icon icon="format-title" />}
          />
          <HelperText
            type="error"
            visible={!!(formik.touched.title && formik.errors.title)}>
            {formik.errors.title}
          </HelperText>

          {/* Description Input */}
          <TextInput
            error={!!(formik.touched.description && formik.errors.description)}
            onChangeText={formik.handleChange('description')}
            onBlur={formik.handleBlur('description')}
            value={formik.values.description}
            style={[styles.input, styles.descriptionInput]}
            mode="outlined"
            placeholder="Enter task description"
            label="Description *"
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon="text" />}
          />
          <HelperText
            type="error"
            visible={
              !!(formik.touched.description && formik.errors.description)
            }>
            {formik.errors.description}
          </HelperText>

          <Divider style={styles.divider} />

          {/* Priority Selection */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Priority
          </Text>
          <SegmentedButtons
            value={formik.values.priority}
            onValueChange={value => formik.setFieldValue('priority', value)}
            buttons={priorityOptions}
            style={styles.segmentedButtons}
          />

          <Divider style={styles.divider} />

          {/* Due Date */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Due Date
          </Text>
          <View style={styles.dateContainer}>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              icon="calendar"
              style={styles.dateButton}
              contentStyle={styles.dateButtonContent}>
              {formik.values.dueDate
                ? formik.values.dueDate.toLocaleDateString()
                : 'Set due date (optional)'}
            </Button>
            {formik.values.dueDate && (
              <IconButton
                icon="close"
                size={20}
                onPress={() => formik.setFieldValue('dueDate', undefined)}
              />
            )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formik.values.dueDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <Divider style={styles.divider} />

          {/* Category */}
          <TextInput
            onChangeText={formik.handleChange('category')}
            onBlur={formik.handleBlur('category')}
            value={formik.values.category || ''}
            style={styles.input}
            mode="outlined"
            placeholder="e.g., Work, Personal, Shopping"
            label="Category (optional)"
            left={<TextInput.Icon icon="folder" />}
          />

          <Divider style={styles.divider} />

          {/* Tags */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Tags
          </Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              style={styles.tagInput}
              mode="outlined"
              placeholder="Add a tag"
              dense
              right={
                <TextInput.Icon
                  icon="plus"
                  onPress={handleAddTag}
                  disabled={!tagInput.trim()}
                />
              }
              onSubmitEditing={handleAddTag}
            />
          </View>

          {formik.values.tags && formik.values.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {formik.values.tags.map((tag, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  style={styles.tag}
                  onClose={() => handleRemoveTag(tag)}>
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Error Display */}
      {error && (
        <Card style={[styles.card, styles.errorCard]}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.errorText}>
              {error}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onPress={() => formik.handleSubmit()}
        style={[styles.submitBtn, {marginBottom: insets.bottom + 20}]}
        mode="contained"
        loading={loading}
        disabled={loading}
        icon={isEditMode ? 'content-save' : 'plus'}>
        {isEditMode ? 'Update Todo' : 'Create Todo'}
      </Button>

      {/* Success Dialog */}
      <Portal>
        <Dialog 
          visible={successDialogVisible} 
          onDismiss={() => {
            setSuccessDialogVisible(false);
            navigation.goBack();
          }}>
          <Dialog.Icon icon="check-circle" />
          <Dialog.Title style={{textAlign: 'center'}}>Success!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{textAlign: 'center'}}>
              {successMessage}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => {
                setSuccessDialogVisible(false);
                navigation.goBack();
              }}
              mode="contained">
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  card: {
    width: '100%',
    marginVertical: 16,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 20,
  },
  input: {
    marginBottom: 8,
  },
  descriptionInput: {
    minHeight: 100,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateButton: {
    flex: 1,
    marginRight: 8,
  },
  dateButtonContent: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 12,
  },
  tagInputContainer: {
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    marginBottom: 4,
  },
  submitBtn: {
    marginTop: 16,
    width: '100%',
  },
  errorCard: {
    marginTop: 8,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
});

export default TaskForm;

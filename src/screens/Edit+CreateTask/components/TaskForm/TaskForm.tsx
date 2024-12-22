import {useFormik} from 'formik';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Todo} from '../../../../types/appTypes';
import {todoFormScheme} from './formSchemes';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch} from '../../../../hooks/reduxHooks';
import {addTask} from '../../../../redux/tasks/tasksSlice';
import {useNavigation} from '@react-navigation/native';
import {TaskScreenProps} from '../../../../navigation/types';

const TaskForm: React.FC = () => {
  const navigation = useNavigation<TaskScreenProps['navigation']>();
  const dispatch = useAppDispatch();
  const formik = useFormik<Todo>({
    validationSchema: todoFormScheme,
    initialValues: {desc: '', title: ''},
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit(values, formikHelpers) {
      dispatch(addTask(values));
      navigation.navigate('Tabs', {
        screen: 'Home',
      });
    },
  });
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <TextInput
          error={!!formik.errors.title}
          id="task_title_input"
          onChangeText={formik.handleChange('title')}
          value={formik.values.title}
          style={styles.titleInput}
          mode="outlined"
          placeholder="Enter task title"
          label="Task Title"
        />
        <TextInput
          error={!!formik.errors.desc}
          id="task_desc_input"
          onChangeText={formik.handleChange('desc')}
          value={formik.values.desc}
          style={styles.descInput}
          mode="outlined"
          placeholder="Enter task details"
          label="Task Description"
        />
      </View>
      <Button
        onPress={() => formik.handleSubmit()}
        style={[styles.submitBtn, {marginBottom: insets.bottom}]}
        mode="contained">
        Add Task
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  inputsContainer: {
    width: '100%',
    gap: 16,
  },
  titleInput: {
    width: '100%',
    marginTop: 16,
  },
  descInput: {
    width: '100%',
  },
  submitBtn: {
    marginVertical: 16,
    width: '100%',
  },
});

export default TaskForm;

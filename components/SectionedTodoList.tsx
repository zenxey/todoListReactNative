import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, SectionList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalSelector from 'react-native-modal-selector';

type Todo = {
  id: string;
  task: string;
  completed: boolean;
};

type SectionedTodoListProps = {
  navigation: any;
};

const SectionedTodoList: React.FC<SectionedTodoListProps> = ({ navigation }) => {
  const [todos, setTodos] = useState<Todo[]>([]); // Define state as Todo[] (array of Todo objects)
  const [newTask, setNewTask] = useState<string>(''); // State for the new task input
  const [status, setStatus] = useState<string>('Pending'); // Status for new task

  // Load todos from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTodos = async () => {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    };
    loadTodos();
  }, []);

  // Save todos to AsyncStorage
  const saveTodos = async (todos: Todo[]) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos', error);
    }
  };

  // Add new task to todos list
  const addTodo = () => {
    if (newTask.trim().length === 0) return;
    const newTodo: Todo = {
      id: Math.random().toString(),
      task: newTask,
      completed: status === 'Completed',
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setNewTask('');
  };

  // Delete a todo by id
  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Group todos by their completion status
  const groupedTodos = [
    {
      title: "Pending Tasks",
      data: todos.filter(todo => !todo.completed),
    },
    {
      title: "Completed Tasks",
      data: todos.filter(todo => todo.completed),
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sectioned Todo List</Text>

      {/* Input field for adding a new task */}
      <TextInput
        style={styles.input}
        value={newTask}
        onChangeText={setNewTask}
        placeholder="Enter a new task"
      />

      {/* ModalSelector dropdown for selecting task status */}
      <ModalSelector
        style={styles.input}
        data={[
          { key: 1, label: "Pending", value: "Pending" },
          { key: 2, label: "Completed", value: "Completed" }
        ]}
        initValue="Pending"
        onChange={(option) => setStatus(option.value)} // Set the selected status
      />

      {/* Button to add the new task */}
      <Button title="Add Task" onPress={addTodo} />

      {/* SectionList to render tasks grouped by status */}
      <SectionList
        sections={groupedTodos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.task}</Text>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Ionicons name="trash-bin" size={24} color="red" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => item.id} // Ensure each todo has a unique key
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  todoText: {
    fontSize: 18,
    flex: 1,
  },
  deleteText: {
    color: 'red',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
  },
});

export default SectionedTodoList;

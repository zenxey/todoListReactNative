import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Todo = {
  id: string;
  task: string;
};

const TodoList = ({navigation}: any) => {
  // state to hold list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

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

  // Function to save todos to AsyncStorage
  const saveTodos = async (todos: Todo[]) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos', error);
    }
  };

  // function to add new todo
  const addTodo = () => {
    if (newTask.trim().length === 0) return;
    const newTodo: Todo = {
      id: Math.random().toString(),
      task: newTask
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos); // save todo to async storage
    setNewTask('');
  };

  // function to delete todos
  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos); // save updated todos to async storage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>

      <TextInput
        style={styles.input}
        value={newTask}
        onChangeText={setNewTask}
        placeholder="Enter a new task"
      />

      <Button title="Add Task" onPress={addTodo} />

      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.task}</Text>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Ionicons name="trash-bin" size={24} color="red" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}
      />

        {/* <Button title="Go to Sectioned Todo List" onPress={() => navigation.navigate('SectionedTodoList')} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    flatListContent: {
      flexGrow: 1,
      paddingBottom: 50,
      minHeight: 500,
    },
  });
  

export default TodoList;

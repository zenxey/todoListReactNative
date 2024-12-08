import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TodoList from './components/TodoList';
import SectionedTodoList from './components/SectionedTodoList';
import BottomNavigation from './components/BottomNavigation'; // Assuming you have a BottomNavigation component

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="TodoList"
        screenOptions={{
          tabBarStyle: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'gray' },
          headerShown: false, // Hide default header if you're using bottom tab navigation
        }}
      >
        <Tab.Screen
          name="TodoList"
          component={TodoList}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="list" color={color} size={size} />
            ),
            tabBarLabel: () => <Text>Todo List</Text>,
          }}
        />
        <Tab.Screen
          name="SectionedTodoList"
          component={SectionedTodoList}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="folder" color={color} size={size} />
            ),
            tabBarLabel: () => <Text>Sectioned Todo List</Text>,
          }}
        />
      </Tab.Navigator>
      <BottomNavigation /> {/* Bottom navigation bar */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
});

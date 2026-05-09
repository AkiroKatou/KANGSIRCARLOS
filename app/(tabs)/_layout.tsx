import { Tabs } from 'expo-router';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-task"
        options={{
          title: 'Add-Task',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}

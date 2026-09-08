import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View, StyleSheet } from 'react-native';

import { initializeLocale, t, getLocale } from './src/i18n';
import { loadLocale } from './src/store';
import { colors } from './src/theme';
import {
  HomeScreen,
  DoctorViewScreen,
  EditRecordScreen,
  SettingsScreen,
} from './src/screens';

type RootStackParamList = {
  Main: undefined;
  DoctorView: undefined;
  EditRecord: undefined;
};

type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: '📋',
    settings: '⚙️',
  };
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icons[name] || '•'}
    </Text>
  );
}

function MainTabs({ onLocaleChange }: { onLocaleChange: () => void }) {
  const [key, setKey] = useState(0);

  const handleLocaleChange = useCallback(() => {
    setKey((k) => k + 1);
    onLocaleChange();
  }, [onLocaleChange]);

  return (
    <Tab.Navigator
      key={key}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bg,
        },
        headerTintColor: colors.ink,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.line,
        },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('home'),
          headerTitle: 'Confidence',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          tabBarLabel: t('home'),
        }}
      />
      <Tab.Screen
        name="Settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="settings" focused={focused} />
          ),
          tabBarLabel: t('settings'),
        }}
      >
        {() => <SettingsScreen onLocaleChange={handleLocaleChange} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [navKey, setNavKey] = useState(0);

  useEffect(() => {
    async function prepare() {
      const savedLocale = await loadLocale();
      initializeLocale(savedLocale);
      setIsReady(true);
    }
    prepare();
  }, []);

  const handleLocaleChange = useCallback(() => {
    setNavKey((k) => k + 1);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Confidence</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer key={navKey}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.bg,
            },
            headerTintColor: colors.ink,
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerBackTitle: t('done'),
          }}
        >
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => <MainTabs onLocaleChange={handleLocaleChange} />}
          </Stack.Screen>
          <Stack.Screen
            name="DoctorView"
            component={DoctorViewScreen}
            options={{
              title: t('showDoctor'),
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="EditRecord"
            component={EditRecordScreen}
            options={{
              title: t('editTitle'),
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});

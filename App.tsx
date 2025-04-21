// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import AddBillScreen from './screens/AddBillScreen';
import CategoryScreen from './screens/CategoryScreen';
import SettingsScreen from './screens/SettingScreen';
import { RootStackParamList } from './types/type';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons'

const Tab = createBottomTabNavigator<RootStackParamList>();

// const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '账单首页' }} />
        <Stack.Screen name="AddBill" component={AddBillScreen} options={{ title: '添加账单' }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ title: '分类管理' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '设置' }} />
      </Stack.Navigator> */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = 'home-outline';
                break;
              case 'AddBill':
                iconName = 'add-circle-outline';
                break;
              case 'Category':
                iconName = 'list-outline';
                break;
              case 'Settings':
                iconName = 'settings-outline';
                break;
              default:
                iconName = 'ellipse-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: '账单首页', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} />
        <Tab.Screen name="AddBill" component={AddBillScreen} options={{ title: '添加账单', tabBarIcon: ({color}) => <Ionicons name="add-circle" size={24} color={color} /> }} />
        <Tab.Screen name="Category" component={CategoryScreen} options={{ title: '分类管理', tabBarIcon: ({color}) => <Ionicons name="list" size={24} color={color} /> }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: '设置', tabBarIcon: ({color}) => <Ionicons name="settings" size={24} color={color} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

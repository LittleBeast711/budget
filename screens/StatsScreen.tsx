import React,{useCallback, useEffect,useState} from 'react';
// import { RouteProp, useRoute } from '@react-navigation/native';
import { Text, StyleSheet, Dimensions, ScrollView, View, TouchableOpacity } from 'react-native';
import { Bill, BILL_KEY } from '../types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  // const route = useRoute<RouteProp<RootStackParamList,'Stats'>>()
  const [bills,setBills] = useState<Bill[]>([])
  const [chartType,setChartType] = useState<'income' | 'expense'>('income')

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(BILL_KEY).then((res) => {
        if (res) setBills(JSON.parse(res));
      });
    }, [])
  );

  const income = bills.filter(bill => bill.type === 'income')
  const expense = bills.filter(bill => bill.type === 'expense')

  const totalIncome = income.reduce((acc, bill) => acc + bill.amount, 0)
  const totalExpense = expense.reduce((acc, bill) => acc + bill.amount, 0)

  const filtered = bills.filter(bill => bill.type === chartType)
  const categoryMap: Record<string,number> = {}

  filtered.forEach(bill => {
    categoryMap[bill.category] = (categoryMap[bill.category] || 0) + Math.abs(bill.amount)
  })

  const chartData = Object.entries(categoryMap).map(([category, value],index) => ({
    name:category,
    amount:value,
    color: `hsl(${(index * 60) % 360}, 70%, 60%)`,
    legendFontColor: '#333',
    legendFontSize: 14
  }))


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.title}>统计信息</Text>
      <Text style={styles.totalText}>本月收入:{totalIncome.toFixed(2)}</Text>
      <Text style={styles.totalText}>本月支出:{totalExpense.toFixed(2)}</Text>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.switchButton, chartType === 'income' && styles.activeButton]}
          onPress={() => setChartType('income')}
        >
          <Text style={styles.switchText}>收入</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, chartType === 'expense' && styles.activeButton]}
          onPress={() => setChartType('expense')}
        >
          <Text style={styles.switchText}>支出</Text>
        </TouchableOpacity>
      </View>

      {chartData.length > 0 && (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}
    </ScrollView>
  );
}

export default StatsScreen



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  switchButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#007aff',
  },
  switchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
})
import React,{ useEffect, useState} from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert,SectionList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/type'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Bill,BILL_KEY } from '../types/type'


const groupByMonth = (billList: Bill[]) => {
  return billList.reduce((acc, bill) => {
    let date: Date

    if (bill.date) {
      date = new Date(bill.date)
    } else if (!isNaN(Number(bill.id))) {
      date = new Date(Number(bill.id)) // 作为时间戳处理
    } else {
      console.error('Invalid date:', bill.date, bill.id)
      return acc
    }

    if (isNaN(date.getTime())) {
      console.error('Invalid parsed date:', bill.date, bill.id)
      return acc
    }

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(bill)

    return acc
  }, {} as Record<string, Bill[]>)
}



const HomeScreen = ()=> {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList,'Home'>>()
  const [bills,setBills] = useState<Bill[]>([])
  const [filterDate,setFilterDate] = useState<Date | null>(null)
  const [showPicker,setShowPicker] = useState(false)

  useEffect(() => {
    const loadBills = async () => {
      const json  = await AsyncStorage.getItem(BILL_KEY)
      if(json ){
        setBills(JSON.parse(json))
      }
    }
    loadBills()
  },[])

  useEffect(() => {
    const saveNewBill = async () => {
      const newBill = route.params?.newBill      
      if (!newBill) return
  
      const stored = await AsyncStorage.getItem(BILL_KEY)
      const prev = stored ? JSON.parse(stored) : []
      const newList = [newBill, ...prev]
  
      await AsyncStorage.setItem(BILL_KEY, JSON.stringify(newList))
      setBills(newList)
      navigation.setParams({ newBill: null })
      
    }
  
    saveNewBill()
  }, [route.params?.newBill])

  
  const renderItem  = ({item}:{item: Bill}) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={[styles.amount,item.amount >=0 ? styles.income : styles.expense]}>
      {item.amount >= 0 ? '+' : ''}
      {item.amount} 元
      </Text>
      <TouchableOpacity onPress={() => deleteBill(item.id)}>
        <Text style={{ color: 'gray', fontSize: 20 }}>❌</Text>
      </TouchableOpacity>
    </View>
  )

  const clearBills = () => {
    console.log('clearBills');
    Alert.alert(
      '清空账单', 
      '是否清空所有账单？',
      [
        {
          text:'取消',
          style:'cancel'
        },
        {
          text:'清空',
          style:'destructive',
          onPress: () => {
            (async ()=> {
              await AsyncStorage.removeItem(BILL_KEY)
              setBills([])
            })()
            AsyncStorage.removeItem(BILL_KEY)
            .then(() => {
              setBills([])              
            })
            .catch(err => {
              console.error('❌ 清空失败:', err)
            })
          }
        }
      ],
      {cancelable:true}
    )
  }

  const deleteBill = async (id:string) => {
    const stored = await AsyncStorage.getItem(BILL_KEY)
    const list = stored ? JSON.parse(stored) : []

    const newList = list.filter((item:Bill) => item.id !== id)
    await AsyncStorage.setItem(BILL_KEY,JSON.stringify(newList))
    setBills(newList)
  }

  const handleDateChange = (event:any,selectedDate?:Date) => {
    setShowPicker(false)
    if(selectedDate) setFilterDate(selectedDate)
  }

  const filteredBills = filterDate ? bills.filter(bill => {
    const billDate = new Date(bill.date)
    return (
      billDate.getFullYear() === filterDate.getFullYear() &&
      billDate.getMonth() === filterDate.getMonth()
    )
  }) : bills

  const grouped = groupByMonth(filteredBills)  
  const sections = Object.entries(grouped).map(([date, data]) => ({
    title: date,
    data
  }))

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
      >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
        <Text style={styles.title}>欢迎使用记账本</Text>
        <Text style={styles.subTitle}>您的个人理财助理</Text>
        {/* <FlatList
          data={bills}
          renderItem={renderItem}
          keyExtractor={(item: Bill) => item.id}
          contentContainerStyle={styles.list}
        /> */}
        <View style={styles.filterRow}>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.filterButton, { marginRight: 8 }]}>
            <Text style={styles.filterButtonText}>📅 筛选月份</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterDate(null)} style={styles.filterButton}>
            <Text style={styles.filterButtonText}>🔄 重置筛选</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={filterDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <SectionList 
          sections={sections}
          keyExtractor={(item: Bill) => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity 
          style={[styles.button,{backgroundColor: 'red', bottom: 100}]} 
          onPress={clearBills}
        >
          <Text style={styles.buttonText}>🗑️ 清空账单</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddBill')}>
          <Text style={styles.buttonText}>➕ 添加账单</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle:{
    fontSize: 16,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 18,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
  income: {
    color: 'green',
  },
  expense: {
    color: 'red',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 6,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
})
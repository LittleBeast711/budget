import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/type'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Category } from '../types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const AddBillScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    AsyncStorage.getItem('categories').then((res) => {
      if(res) setCategories(JSON.parse(res))
    })
  },[])


  const handleSubmit = () => {
    if (!title || !amount) {
      Alert.alert('请填写完整信息')
      return
    }

    const parsedAmount = parseFloat(amount)
    if(isNaN(parsedAmount)) {
      Alert.alert('金额格式不正确')
      return
    }

    const newBill = {
      id: Date.now().toString(),
      title,
      amount: type === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
      category: selectedCategory,
      Date: new Date().toISOString(),
    }
    navigation.navigate('Home', { newBill })
    setTitle('')
    setAmount('')
    setSelectedCategory('')
  }

  const handleDateChange = (event:any,date?:Date)=> {
    setShowDatePicker(false)
    if(date) setSelectedDate(date)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>添加账单</Text>
      <TextInput 
        style={styles.input} 
        value={title} 
        onChangeText={setTitle} 
        placeholder="标题" 
        placeholderTextColor={'#999'}
      />
      <TextInput 
        style={styles.input} 
        value={amount} 
        onChangeText={setAmount} 
        placeholder="金额" 
        placeholderTextColor={'#999'} 
        keyboardType="numeric" 
      />


      {/* 分类选择 */}
      <Text style={styles.label}>选择分类</Text>
      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue:string) => setSelectedCategory(itemValue)}
      >
        {categories.map((category) => (
          <Picker.Item key = {category.id} label={category.name} value={category.name}/> 
        ))}
      </Picker>

      {/* 日期选择 */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}  
          style={styles.dateButton}
        >
          <Text style={styles.label}>选择日期: {selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {
          showDatePicker && (
            <DateTimePicker 
              value={selectedDate} 
              mode='date'
              disabled={undefined}
              onChange={handleDateChange}
            />
          )
        }

      {/* 类型选择 */}
      <View style={styles.typeContainer}>
        <TouchableOpacity onPress={() => setType('expense')} style={[styles.typeButton, type === 'expense' && styles.active]}>
          <Text style={styles.typeText}>支出</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setType('income')} style={[styles.typeButton, type === 'income' && styles.active]}>
          <Text style={styles.typeText}>收入</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>提交账单</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AddBillScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#f9f9f9' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  input: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#ccc' 
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  dateButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  typeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 20 
  },
  typeButton: { 
    padding: 10, 
    backgroundColor: '#eee', 
    borderRadius: 6 
  },
  active: { 
    backgroundColor: '#007aff' 
  },
  typeText: { 
    width:  50,
    textAlign: 'center',
    color: '#bfbfbf' 
  },
  submitButton: { 
    backgroundColor: '#28c167', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  submitText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
})
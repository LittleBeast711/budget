import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, TouchableWithoutFeedback,  Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/type';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, CATEGORY_KEY } from '../types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBillScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CATEGORY_KEY).then((res) => {
      if (res) setCategories(JSON.parse(res));
    });
  }, []);

  const handleSubmit = () => {
    if (!title || !amount) {
      Alert.alert('请填写完整信息');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      Alert.alert('金额格式不正确');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('请选择分类');
      return;
    }
    

    const newBill = {
      id: Date.now().toString(),
      title,
      amount: type === 'expense' ? -parsedAmount : parsedAmount,
      category: selectedCategory,
      date: selectedDate.toISOString(),
    };
    navigation.navigate('Home', { newBill });
    setTitle('');
    setAmount('');
    setSelectedCategory('');
    setSelectedDate(new Date());
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category.name);
    setModalVisible(false); // Close modal after selection
  };

  return (


    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.header}>添加账单</Text>

        {/* 日期选择 */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.label}>选择日期: {selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={handleDateChange}
            style={{ marginBottom: 20 }}
          />
        )}

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
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}        
          placeholder="金额"
          placeholderTextColor={'#999'}
          keyboardType="numeric"
        />

        {/* 分类选择 */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
          <Text style={styles.label}>
            {selectedCategory ? selectedCategory : '选择分类'}
          </Text>
        </TouchableOpacity>

        {/* 类型选择 */}
        <View style={styles.typeContainer}>
          <TouchableOpacity
            onPress={() => setType('expense')}
            style={[styles.typeButton, type === 'expense' && styles.active]}
          >
            <Text style={styles.typeText}>支出</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('income')}
            style={[styles.typeButton, type === 'income' && styles.active]}
          >
            <Text style={styles.typeText}>收入</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>提交账单</Text>
        </TouchableOpacity>

        {/* 分类选择 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>选择分类</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleCategorySelect(item)}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>关闭</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddBillScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
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
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  active: {
    backgroundColor: '#007aff',
  },
  typeText: {
    width: 50,
    textAlign: 'center',
    color: '#bfbfbf',
  },
  submitButton: {
    backgroundColor: '#28c167',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

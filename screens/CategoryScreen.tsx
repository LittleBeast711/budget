import React, { useEffect, useState } from 'react';
import { View,Text,StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { Category,CATEGORY_KEY } from '../types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryScreen = () => {
  const [categoryName,setCategoryName] = useState('')
  const [categories,setCategories] = useState<Category[]>([])

  useEffect(() => {
    AsyncStorage.getItem(CATEGORY_KEY).then((res) => {
      if(res) setCategories(JSON.parse(res))
    })
  },[])

  const addCategory = async () => {
    const name = categoryName.trim();
    if (!name) {
      Alert.alert('请输入分类名称');
      return;
    }

    const exists = categories.some(c => c.name === name);
    if (exists) {
      Alert.alert('该分类已存在');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name
    }

    const updated = [...categories, newCategory]
    await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updated))
    setCategories(updated)
    setCategoryName('')
  }

  const deleteCategory = async (id: string) => {
    const updated = categories.filter(c => c.id !== id)
    await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updated))
    setCategories(updated)
  }


  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onLongPress={() => {
        Alert.alert('确认删除', `确定要删除分类 "${item.name}" 吗？`, [
          { text: '取消', style: 'cancel' },
          { text: '删除', onPress: () => deleteCategory(item.id), style: 'destructive' },
        ]);
      }}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>分类管理</Text>

      <TextInput
        style={styles.input}
        placeholder="请输入分类名称"
        value={categoryName}
        onChangeText={setCategoryName}
      />

      <TouchableOpacity style={styles.button} onPress={addCategory}>
        <Text style={styles.buttonText}>➕ 添加分类</Text>
      </TouchableOpacity>

      <Text style={{fontSize:14,marginBottom:5,color:'#bfbfbf'}}>长按删除分类</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  )

}

export default CategoryScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    paddingBottom: 40,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryText: {
    fontSize: 16,
  },
})
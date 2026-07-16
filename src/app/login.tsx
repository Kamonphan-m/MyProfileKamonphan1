import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // ระบบการจำลองตรวจสอบสิทธิ์แบบง่าย
    if (username === 'admin' && password === '1234') {
      router.push('/dashboard');
    } else {
      Alert.alert('Access Denied', 'Invalid terminal credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginCard}>
        {/* 🛠️ เปลี่ยนชื่อแบรนด์ใหม่ พร้อมจัดสไตล์ตัวอักษรให้ดูเฉี่ยวขึ้น */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>LUMEN<Text style={styles.brandDot}>.OS</Text></Text>
          <Text style={styles.brandSub}>INVENTORY TERMINAL</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>OPERATOR USERNAME</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter terminal username" 
            placeholderTextColor="#4B5563" 
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>SECURITY PASSWORD</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter authorization key" 
            placeholderTextColor="#4B5563" 
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>

        {/* ปุ่มกดสไตล์นีออนม่วงสว่าง */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>INITIALIZE SESSION</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B0F19', // พื้นหลังมืดเข้าชุดกับหน้าอื่นๆ
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loginCard: { 
    backgroundColor: '#151F32', // ตัวกล่องสีกรมท่าเข้มมีมิติ
    width: '85%', 
    padding: 30, 
    borderRadius: 28, 
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#6366F1',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandText: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#FFF', 
    letterSpacing: 2 
  },
  brandDot: {
    color: '#6366F1', // จุดสีม่วงนีออนเรืองแสง
  },
  brandSub: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 4
  },
  inputGroup: { 
    marginBottom: 18 
  },
  label: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: '#6366F1', 
    marginBottom: 8,
    letterSpacing: 1
  },
  input: { 
    backgroundColor: '#0B0F19', 
    padding: 14, 
    borderRadius: 12, 
    fontSize: 14, 
    color: '#FFF', 
    borderWidth: 1, 
    borderColor: '#374151' 
  },
  loginButton: { 
    backgroundColor: '#6366F1', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 12 
  },
  loginButtonText: { 
    color: '#FFF', 
    fontSize: 13, 
    fontWeight: '800', 
    letterSpacing: 1.5 
  }
});
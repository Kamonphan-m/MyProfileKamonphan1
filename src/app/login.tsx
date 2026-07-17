import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      router.push('/dashboard');
    } else {
      Alert.alert('Access Denied', 'Invalid terminal credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* การ์ดล็อกอินสีขาวนวล ขอบมนนุ่มฟู */}
      <View style={styles.loginCard}>
        
        {/* โลโก้แบรนด์สไตล์มินิมอลสุดหรู */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>LUMEN<Text style={styles.brandDot}>.OS</Text></Text>
          <Text style={styles.brandSub}>INVENTORY TERMINAL</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>OPERATOR USERNAME</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter terminal username" 
            placeholderTextColor="#A19288" 
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
            placeholderTextColor="#A19288" 
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
        </View>

        {/* ปุ่ม Initialize สีน้ำตาลช็อกโกแลตเข้มพรีเมียม */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>INITIALIZE SESSION</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // พื้นหลังครีมนวลอบอุ่น สบายสายตา
  container: { 
    flex: 1, 
    backgroundColor: '#F7F4F0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  // การ์ดสีขาวโค้งมนน่ารัก พร้อมเงาจางๆ สไตล์ Luxury Cozy
  loginCard: { 
    backgroundColor: '#FFFFFF', 
    width: '85%', 
    padding: 30, 
    borderRadius: 28, 
    borderWidth: 1,
    borderColor: '#EDE9E2',
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandText: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#3E2723', // สีน้ำตาลเข้ม
    letterSpacing: 2 
  },
  brandDot: {
    color: '#8D6E63', // จุดสีน้ำตาลละมุน
  },
  brandSub: {
    fontSize: 9,
    color: '#A19288',
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 6
  },
  inputGroup: { 
    marginBottom: 18 
  },
  label: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: '#8A7A71', 
    marginBottom: 8,
    letterSpacing: 1
  },
  // ช่องกรอกข้อมูลโทนครีม สะอาดคลีน
  input: { 
    backgroundColor: '#F9F8F6', 
    padding: 14, 
    borderRadius: 14, 
    fontSize: 14, 
    color: '#3E2723', 
    borderWidth: 1, 
    borderColor: '#EDE9E2' 
  },
  // ปุ่มกดสีน้ำตาลหรูหรา
  loginButton: { 
    backgroundColor: '#4A3525', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 12,
    shadowColor: '#4A3525',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3
  },
  loginButtonText: { 
    color: '#FFF', 
    fontSize: 13, 
    fontWeight: '800', 
    letterSpacing: 1.5 
  }
});
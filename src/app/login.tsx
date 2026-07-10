import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
export default function LoginScreen() {
 const router = useRouter();
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const handleLogin = () => {
   // เมื่อกดปุ่มจะทำการเปลี่ยนหน้าไปที่หน้า dashboard ทันที
   router.replace('/dashboard');
 };
 return (
<SafeAreaView style={styles.container}>
<View style={styles.card}>
       {/* หัวข้อโลโก้แอป */}
<Text style={styles.logoText}>Inventor.io</Text>
       {/* ช่องกรอก Username */}
<View style={styles.inputContainer}>
<Text style={styles.inputLabel}>Username</Text>
<TextInput
           style={styles.input}
           placeholder="Enter your username"
           placeholderTextColor="#9CA3AF"
           value={username}
           onChangeText={setUsername}
         />
</View>
       {/* ช่องกรอก Password */}
<View style={styles.inputContainer}>
<Text style={styles.inputLabel}>Password</Text>
<TextInput
           style={styles.input}
           placeholder="Enter your password"
           placeholderTextColor="#9CA3AF"
           secureTextEntry
           value={password}
           onChangeText={setPassword}
         />
</View>
       {/* ปุ่ม Log in */}
<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
<Text style={styles.loginButtonText}>Log in</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
 );
}
const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#F3F4F6', // พื้นหลังเทาอ่อนเหมือนหน้าแดชบอร์ด
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 card: {
   backgroundColor: '#1E1B4B', // สีน้ำเงิน/ม่วงเข้ม ตามดีไซน์รูปแรกของอาจารย์
   width: '100%',
   maxWidth: 360,
   borderRadius: 24,
   padding: 30,
   shadowColor: '#000',
   shadowOpacity: 0.2,
   shadowRadius: 10,
   elevation: 5,
 },
 logoText: {
   fontSize: 32,
   fontWeight: 'bold',
   color: '#FFFFFF',
   textAlign: 'center',
   marginBottom: 40,
   marginTop: 10,
 },
 inputContainer: {
   marginBottom: 20,
 },
 inputLabel: {
   color: '#FFFFFF',
   fontSize: 14,
   marginBottom: 8,
 },
 input: {
   backgroundColor: '#FFFFFF',
   borderRadius: 8,
   paddingHorizontal: 16,
   paddingVertical: 12,
   fontSize: 16,
   color: '#1E1B4B',
 },
 loginButton: {
   backgroundColor: '#FFFFFF',
   borderRadius: 8,
   paddingVertical: 14,
   alignItems: 'center',
   marginTop: 20,
   marginBottom: 10,
 },
 loginButtonText: {
   color: '#1E1B4B',
   fontSize: 16,
   fontWeight: 'bold',
 },
});
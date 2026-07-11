import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileSettingsScreen() {
  const router = useRouter();

  // 🛠️ ข้อมูลเริ่มต้นเป็นชื่อและอีเมลของหนูเรียบร้อยค่ะ
  const [name, setName] = useState('กมลพรรณ');
  const [email, setEmail] = useState('kamonphan.m@ku.th');
  const [password, setPassword] = useState('••••••••••••');
  const [store, setStore] = useState('VANTA Projector Shop'); 
  const [code, setCode] = useState('94-K-6764-LEI');
  const [role, setRole] = useState('Manager');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header สไตล์ VANTA มืดหรู */}
      <View style={styles.vantaHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={18} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.vantaTitle}>VANTA</Text>
        <View style={styles.vantaAvatar}>
          <Text style={styles.avatarText}>V</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Personal Settings</Text>

        {/* การ์ดสีขาวครอบกล่องอินพุตทั้งหมด */}
        <View style={styles.formCard}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name*</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Company email*</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Account password*</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store</Text>
            <TextInput style={styles.input} value={store} onChangeText={setStore} />
          </View>

          {/* 🛠️ แก้ไขจุด Error บรรทัดนี้: ลบ style={styles.input} อันแรกที่เกินออกแล้วค่ะ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Employee code</Text>
            <TextInput value={code} editable={false} style={[styles.input, styles.disabledInput]} />
          </View>

          {/* 🛠️ แก้ไขจุด Error บรรทัดนี้ด้วยเช่นกันค่ะ */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current role</Text>
            <TextInput value={role} editable={false} style={[styles.input, styles.disabledInput]} />
          </View>

          {/* ปุ่มเซฟการตั้งค่า */}
          <TouchableOpacity style={styles.saveButton} onPress={() => alert('บันทึกการตั้งค่าเรียบร้อยแล้วค่ะ!')}>
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDF1F7' },
  vantaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0B0F19', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { backgroundColor: '#3B82F6', padding: 6, borderRadius: 6 },
  vantaTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  vantaAvatar: { backgroundColor: '#FFF', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', color: '#0B0F19', fontSize: 14 },
  
  contentBody: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0B0F19', marginBottom: 15 },
  
  formCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1F2937' },
  disabledInput: { backgroundColor: '#F3F4F6', color: '#6B7280' },
  
  saveButton: { backgroundColor: '#0B0F19', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
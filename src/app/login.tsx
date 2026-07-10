import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username.trim() === "" || password.trim() === "") {
      Alert.alert("แจ้งเตือน", "กรุณากรอก Username และ Password");
      return;
    }

    Alert.alert("สำเร็จ", "เข้าสู่ระบบเรียบร้อย");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.logo}>Inventor.io</Text>

          <View>
            <Text style={styles.label}>Username</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "88%",
    height: "88%",
    backgroundColor: "#5B08B4",
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: "space-between",
    elevation: 8,
  },

  logo: {
    textAlign: "center",
    fontSize: 42,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 10,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 18,
  },

  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  button: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#4B00B5",
    fontSize: 24,
    fontWeight: "bold",
  },
});
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>

      <Text style={styles.logo}>Inventor.io</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/dashboard")}
      >
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#5A00D1",
    justifyContent: "center",
    padding: 25,
  },

  logo: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
  },

  buttonText: {
    textAlign: "center",
    color: "#5A00D1",
    fontWeight: "bold",
  },
});
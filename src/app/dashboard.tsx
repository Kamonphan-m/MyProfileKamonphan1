import { StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Dashboard
      </Text>

      <View style={styles.card}>
        <Text>Recent Activity</Text>
      </View>

      <View style={styles.card}>
        <Text>Sales</Text>
      </View>

      <View style={styles.card}>
        <Text>Top Categories</Text>
      </View>

      <View style={styles.card}>
        <Text>Stores</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
});
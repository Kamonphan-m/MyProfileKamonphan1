import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="add-product" />
      <Stack.Screen name="stock" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="product-detail" />
      <Stack.Screen name="profile-settings" />
    </Stack>
  );
}
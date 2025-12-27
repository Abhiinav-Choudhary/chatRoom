import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useState } from "react";

export default function AddLeadScreen({ navigation, route }) {
  const { addLead } = route.params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
  if (!name.trim() || !email.trim() || !course.trim() || !phone.trim()) {
    Alert.alert("Validation Error", "All fields are required");
    return;
  }

  if (!email.includes("@")) {
    Alert.alert("Validation Error", "Enter a valid email");
    return;
  }

  if (phone.length !== 10) {
    Alert.alert("Validation Error", "Phone must be 10 digits");
    return;
  }

  const newLead = {
    id: Date.now().toString(),
    name,
    email,
    course,
    phone,
  };

  addLead(newLead);
  navigation.goBack();
};


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Lead</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Course"
        value={course}
        onChangeText={setCourse}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
        maxLength={10}
      />

      <Button title="Save Lead" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
});

import { View, Text, Button, StyleSheet, Alert } from "react-native";

export default function LeadDetailScreen({ route, navigation }) {
  const { lead, deleteLead } = route.params;

  const handleDelete = () => {
    Alert.alert(
      "Delete Lead",
      "Are you sure you want to delete this lead?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteLead(lead.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Lead Details</Text>

      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{lead.name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{lead.email || "N/A"}</Text>

      <Text style={styles.label}>Course:</Text>
      <Text style={styles.value}>{lead.course}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{lead.phone || "N/A"}</Text>

      <Button title="Delete Lead" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
  },
});

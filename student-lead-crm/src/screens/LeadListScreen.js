import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";



export default function LeadListScreen({ navigation }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
  loadLeads();
}, []);





const loadLeads = async () => {
  try {
    const storedLeads = await AsyncStorage.getItem("leads");
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    }
  } catch (error) {
    console.log("Failed to load leads", error);
  }
};

useEffect(() => {
  AsyncStorage.setItem("leads", JSON.stringify(leads));
}, [leads]);


  return (
    <View style={styles.container}>
      <Button
  title="Add Lead"
  onPress={() =>
    navigation.navigate("Add Lead", {
      addLead: (lead) => setLeads((prev) => [...prev, lead]),
    })
  }
/>


      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.leadItem}
            onPress={() =>
         navigation.navigate("Lead Details", {
               lead: item,
            deleteLead: (id) =>
              setLeads((prev) => prev.filter((l) => l.id !== id)),
           })
         }

          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.course}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  leadItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

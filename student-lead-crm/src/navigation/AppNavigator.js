import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LeadListScreen from "../screens/LeadListScreen";
import AddLeadScreen from "../screens/AddLeadScreen";
import LeadDetailScreen from "../screens/LeadDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Leads" component={LeadListScreen} />
        <Stack.Screen name="Add Lead" component={AddLeadScreen} />
        <Stack.Screen name="Lead Details" component={LeadDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

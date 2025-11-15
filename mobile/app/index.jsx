import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";   
import { COLORS } from "../constants/color";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/about"}>About</Link>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "purple",
    },
    heading: {
      fontSize: 40,
      fontWeight: "bold",
      color: COLORS.white,
    },       
})

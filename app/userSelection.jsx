import { fonts } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import homeIcon from "../assets/images/icons/home-icon.png";
import ngoIcon from "../assets/images/icons/NGO-icon.png";
import restaurantIcon from "../assets/images/icons/restaurant-icon.png";
import studentIcon from "../assets/images/icons/student-icon.png";
import volunteerIcon from "../assets/images/icons/volunteer-icon.png";

const DATA = [
  {
    id: "1",
    title: "NGO",
    icon: ngoIcon,
    route: "#",
  },
  {
    id: "2",
    title: "Restaurant",
    icon: restaurantIcon,
    route: "#",
  },
  {
    id: "3",
    title: "Volunteer",
    icon: volunteerIcon,
    route: "#",
  },
  {
    id: "4",
    title: "Student",
    icon: studentIcon,
    route: "#",
  },
  {
    id: "5",
    title: "Home",
    icon: homeIcon,
    route: "#",
  },
];

/* Component for rendering each user type item */
const Item = ({ id, title, icon, isSelected, onSelect }) => {
  //manage dynamic styles based on selection
  const containerStyles = [
    style.userTypeContainer,
    isSelected && style.itemContainerSelected, // Apply selected style if true
  ];

  return (
    <TouchableOpacity onPress={() => onSelect(id)}>
      <View style={containerStyles}>
        <Image source={icon} style={style.icon} />
        <Text style={style.userTypeText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const userSelection = () => {
  // State to keep track of the selected item
  const [selectedId, setSelectedId] = useState(null);

  // Function to handle item selection
  const handleSelect = (id) => {
    setSelectedId(id);
  };

  // Function to handle next button press
  const handleNext = () => {
    // Navigate to the next screen or perform an action
    // ----To be implemented----
  };

  return (
    <SafeAreaProvider style={style.container}>
      {/* Header */}
      <View style={style.headerContainer}>
        <Text style={style.title}>Who Are You ?</Text>
      </View>

      {/* FlatList of user types */}
      <SafeAreaView style={style.flatListContainer}>
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              icon={item.icon}
              id={item.id}
              isSelected={item.id === selectedId} // Check if the item's ID matches the state ID
              onSelect={handleSelect}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>

      {/* Next Button */}
      <TouchableOpacity style={style.button}>
        <Text style={style.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
};

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: Colors.default.background,
  },
  headerContainer: {
    display: "flex",
    backgroundColor: Colors.default.background,
    marginTop: 30,
  },
  flatListContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: Colors.default.background,
  },

  title: {
    fontFamily: fonts.semiBold,
    fontSize: 50,
    textAlign: "left",
    marginLeft: 5,
  },

  userTypeContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderColor: "#e0e0e0",
    borderWidth: 4,
    borderRadius: 10,
  },
  itemContainerSelected: {
    borderColor: "#6a48d4",
    backgroundColor: "#f9f6ff",
  },
  icon: {
    flex: 0,
    width: 70,
    height: 70,
  },
  userTypeText: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 25,
    marginLeft: 30,
    alignSelf: "center",
    textAlign: "left",
  },

  button: {
    backgroundColor: Colors.default.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 35,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});

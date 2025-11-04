import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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

export default function Index() {

    const router = useRouter()

  // State to keep track of the selected item
  const [selectedId, setSelectedId] = useState(null);

  // Function to handle item selection
  const handleSelect = (id) => {
    setSelectedId(id);
  };

  // Function to handle next button press
  const handleNext = () => {
    router.navigate("/(auth)/(student)/signUp")
  };

  return (
    <View style={globalStyles.container}>
        <Text style={globalStyles.headingText}>Who Are You ?</Text>
        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <Item
              title={item.title}
              icon={item.icon}
              id={item.id}
              isSelected={item.id === selectedId}
              onSelect={handleSelect}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      <TouchableOpacity style={globalStyles.button} onPress={handleNext}>
        <Text style={globalStyles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
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
    borderColor: Colors.default.primary,
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
});

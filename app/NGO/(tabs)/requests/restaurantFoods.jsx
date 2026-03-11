import { fonts } from "@/constants/fonts";
import { globalStyles } from "@/constants/globalStyle";
import { Colors } from "@/constants/theme";
import { db } from "@/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function restuarantFoods() {
  const router = useRouter();

  const {
    requestId,
    restuarantId,
    restuarantName,
    restuarantImage,
    suitableFoods,
  } = useLocalSearchParams();

  const [selectedFood, setSelectedFood] = useState(null);

  const foods = suitableFoods ? JSON.parse(suitableFoods) : [];

  // 🔹 Select Only One Food
  const toggleSelect = (food) => {
        if (selectedFood?.id === food.id) {
        setSelectedFood(null);
        } else {
        setSelectedFood(food);
        }
    };

    // 🔹 Send Request to Firebase
    const handleRequest = async () => {
        if (!selectedFood) {
            Alert.alert("Please select a food first");
            return;
        }

        try {
            console.log("helsfadf: ", requestId)
            // Save request
            await updateDoc(doc(db, "requests", requestId), {
              status: "n-requested",
              restaurantDetails: {
                  id: restuarantId,
                  name: restuarantName,
                  image: restuarantImage,
              },
              selectedFood: selectedFood,
            });

            Alert.alert("Restaurant Requested Successfully ✅");

            setSelectedFood(null);

            router.replace("/NGO/(tabs)/requests")
            
        } catch (error) {
            console.log(error);
            Alert.alert("Something went wrong ❌");
        }
    };

  // 🔹 Render Food Items
  const renderFoodItems = ({ item }) => {
    const isSelected = selectedFood?.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item)}
        activeOpacity={0.8}
        style={{ marginBottom: 15 }}
      >
        <View
          style={[
            {
              flexDirection: "row",
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#fff",
              elevation: 2,
            },
            isSelected && {
              borderColor: Colors.default.primary,
              borderWidth: 2,
            },
          ]}
        >
          {/* Image */}
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 100, height: 90, resizeMode: "cover" }}
          />

          {/* Details */}
          <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ fontFamily: fonts.semiBold }}>
              {item.name}
            </Text>

            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                marginTop: 5,
              }}
            >
              {item.vegNonVeg}
            </Text>
          </View>

          {/* Radio Indicator */}
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor: Colors.default.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 15,
              alignSelf: "center",
            }}
          >
            {isSelected && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: Colors.default.primary,
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Restaurant Image */}
      <Image
        source={{ uri: restuarantImage }}
        style={{ width: "100%", height: 150 }}
      />

      {/* Restaurant Name */}
      <Text
        style={[
          globalStyles.titleText,
          { textAlign: "center", marginVertical: 10 },
        ]}
      >
        {restuarantName}
      </Text>

      {/* Food List */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text style={globalStyles.subTitleText}>
          Available Foods
        </Text>

        <FlatList
          data={foods}
          renderItem={renderFoodItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {/* Bottom Button */}
      {selectedFood && (
        <TouchableOpacity
          onPress={handleRequest}
          activeOpacity={0.8}
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: Colors.default.primary,
            paddingVertical: 15,
            borderRadius: 12,
            alignItems: "center",
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: fonts.semiBold,
              fontSize: 16,
            }}
          >
            Request Restaurant
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
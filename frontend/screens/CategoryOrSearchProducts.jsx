import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { backendUrl, colors } from "../utils";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

const CategoryOrSearchProducts = () => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);
  const focused = useIsFocused();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const getProductsRelatedSearch = async () => {
        try {
          const res = await axios.post(`${backendUrl}search-items`, {
            searchValue,
            page,
          });

          setProducts(res.data.items);
        } catch (error) {
          console.log(error.message);
        }
      };

      getProductsRelatedSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, focused]);

  const addToCart = (item) => {
    // Logic to add the item to the cart
    console.log("Adding to cart:", item.name);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchContainer}>
        <Ionicons name="search" size={24} color={colors.secondary} />
        <TextInput
          onChangeText={(t) => setSearchValue(t)}
          placeholder="Search 'pizza' 'burger' 'desert' ..."
          style={styles.searchInput}
        />
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${item.price}</Text>
                {item.estimateprice && (
                  <Text style={styles.estimatePrice}>
                    Est. ${item.estimateprice}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => addToCart(item)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 8,
    width: "95%",
    height: 40,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 6,
    shadowColor: colors.secondary,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    color: "#666",
    marginTop: 5,
  },
  priceContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontWeight: "bold",
    color: colors.secondary,
    fontSize: 16,
  },
  estimatePrice: {
    color: "#999",
    marginLeft: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CategoryOrSearchProducts;

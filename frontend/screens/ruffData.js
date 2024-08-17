//  directions this is working
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import axios from "axios";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DirectionsMap = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState({
    latitude: 19.076, // Example coordinates for Mumbai
    longitude: 72.8777,
  });
  const [error, setError] = useState("");

  const accessToken =
    "pk.eyJ1Ijoic2hpdmFtMTF6eHp4IiwiYSI6ImNsejl3N21yczBoOXkyanNhdjJ5d2JnOHgifQ.END6njULKdbF_Wnkh7QcQQ";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const getDirections = async () => {
    if (!origin) return;
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`,
        {
          params: {
            access_token: accessToken,
            geometries: "polyline",
          },
        }
      );

      if (response.data.code !== "Ok") {
        throw new Error(`API Response Code: ${response.data.code}`);
      }

      const points = polyline.decode(response.data.routes[0].geometry);
      const coords = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      setCoordinates(coords);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin ? origin.latitude : 28.7041,
          longitude: origin ? origin.longitude : 77.1025,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {origin && <Marker coordinate={origin} title="Origin" />}
        {destination && <Marker coordinate={destination} title="Destination" />}
        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>
      <Button title="Get Directions" onPress={getDirections} />
      {error && <Text style={styles.error}>Error: {error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  error: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "red",
    fontSize: 18,
  },
});

export default DirectionsMap;

// find distance and time and step components
// import React, { useEffect } from "react";
// import axios from "axios";
// import polyline from "@mapbox/polyline";

// const DirectionsLogger = () => {
//   const accessToken =
//     "pk.eyJ1Ijoic2hpdmFtMTF6eHp4IiwiYSI6ImNsejl3N21yczBoOXkyanNhdjJ5d2JnOHgifQ.END6njULKdbF_Wnkh7QcQQ"; // Replace with your Mapbox access token

//   // Static Coordinates
//   const origin = {
//     latitude: 40.7128, // New York City
//     longitude: -74.006,
//   };
//   const destination = {
//     latitude: 34.0522, // Los Angeles
//     longitude: -118.2437,
//   };

//   useEffect(() => {
//     const fetchDirections = async () => {
//       try {
//         const response = await axios.get(
//           `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`,
//           {
//             params: {
//               access_token: accessToken,
//               geometries: "polyline",
//               overview: "full",
//               steps: true,

//             },
//           }
//         );

//         if (response.data.code !== "Ok") {
//           console.error(`API Response Code: ${response.data.code}`);
//           return;
//         }
//         const route = response.data.routes[0];
//         const distance = route.distance / 1000; // Convert to kilometers
//         const duration = route.duration / 60; // Convert to minutes
//         const steps = route.legs[0].steps.map(
//           (step) => step.maneuver.instruction
//         );
//         console.log("Distance:", distance.toFixed(2), "km");
//         console.log("Duration:", duration.toFixed(2), "minutes");
//         console.log("Steps:");
//         steps.forEach((step, index) => {
//           console.log(`${index + 1}. ${step}`);
//         });
//       } catch (error) {
//         console.error("Error fetching directions:", error.message);
//       }
//     };

//     fetchDirections();
//   }, []);
//   return null; // This component does not render anything
// };
// export default DirectionsLogger;

// direction with map api but require billing

// import React, { useState } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import axios from "axios";

// const DistanceCalculator = () => {
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");
//   const [error, setError] = useState("");

//   const apiKey = "AIzaSyAyKbSrz_OaiAyHl8HgCO-mBaaFIokPViU";
//   const baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";

//   const origin = "28.7041,77.1025"; // Example coordinates for New Delhi
//   const destination = "19.0760,72.8777"; // Example coordinates for Mumbai

//   const getDistanceDetails = async () => {
//     try {
//       console.log("Sending request to Google Maps API...");
//       const response = await axios.get(baseUrl, {
//         params: {
//           origins: origin,
//           destinations: destination,
//           key: apiKey,
//         },
//       });

//       console.log("API Response:", response.data);

//       if (response.data.status !== "OK") {
//         throw new Error(`API Response Status: ${response.data.status}`);
//       }

//       const result = response.data.rows[0].elements[0];

//       if (result.status !== "OK") {
//         throw new Error(`Result Status: ${result.status}`);
//       }

//       setDistance(result.distance.text);
//       setDuration(result.duration.text);
//       setError(""); // Clear any previous error
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Distance Calculator</Text>
//       <Button title="Calculate Distance" onPress={getDistanceDetails} />
//       {distance && (
//         <View>
//           <Text style={styles.result}>Distance: {distance}</Text>
//           <Text style={styles.result}>Duration: {duration}</Text>
//         </View>
//       )}
//       {error && <Text style={styles.error}>Error: {error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   result: {
//     fontSize: 18,
//     marginVertical: 10,
//   },
//   error: {
//     fontSize: 18,
//     color: "red",
//     marginVertical: 10,
//   },
// });

// export default DistanceCalculator;

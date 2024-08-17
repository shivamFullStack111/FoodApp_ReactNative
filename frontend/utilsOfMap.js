import * as Location from "expo-location";
import haversine from "haversine";

export const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access location was denied");
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location;
};

const getWithinArea = () => {
  const distancer = haversine(
    {
      latitude: 12.9715987,
      longitude: 77.5945627,
    },
    {
      latitude: 13.0826802,
      longitude: 80.2707184,
    }
  );

  console.log(distancer * 1000 + " meter");
};

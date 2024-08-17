import axios from "axios";

export const colors = {
  primary: "#abd1ff",
  // secondary: "#e54b22",
  background: "#ECECEC",
  secondary: "#ef0e55",
};

export const headings = {
  fontSize: 10,
  fontWeight: "600",
};

export const buttons = {
  width: 200,
  height: 40,
  fontSize: 16,
  justifyContent: "center",
  alignItems: "center",
};

//key of mapbox website
export const accessToken =
  "pk.eyJ1Ijoic2hpdmFtMTF6eHp4IiwiYSI6ImNsejl3N21yczBoOXkyanNhdjJ5d2JnOHgifQ.END6njULKdbF_Wnkh7QcQQ";

export const fonts = {
  Roboto_100Thin: "Roboto_100Thin",
  Roboto_100Thin_Italic: "Roboto_100Thin_Italic",
  Roboto_300Light: "Roboto_300Light",
  Roboto_300Light_Italic: "Roboto_300Light_Italic",
  Roboto_400Regular: "Roboto_400Regular",
  Roboto_400Regular_Italic: "Roboto_400Regular_Italic",
  Roboto_500Medium: "Roboto_500Medium",
  Roboto_500Medium_Italic: "Roboto_500Medium_Italic",
  Roboto_700Bold: "Roboto_700Bold",
  Roboto_700Bold_Italic: "Roboto_700Bold_Italic",
  Roboto_900Black: "Roboto_900Black",
  Roboto_900Black_Italic: "Roboto_900Black_Italic",
};

// key of opencagedata.com

export const mapApiKey = "66f06600013d4a60840aaa775be5fc3f";

export const getUserLocationUsingLonLat = async (data) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${data?.latitude}+${data?.longitude}&key=${mapApiKey}`
    );

    // console.log(response);

    if (response.data.results.length > 0) {
      const result = response.data.results[0];
      const components = result.components;

      const addressDetails = {
        formattedAddress: result.formatted,
        country: components.country,
        state: components.state,
        city: components.city || components.town || components.village,
        suburb: components.suburb || components.neighbourhood,
        postcode: components.postcode,
        road: components.road,
      };

      // console.log(`Formatted Address: ${addressDetails.formattedAddress}`);
      // console.log(`Country: ${addressDetails.country}`);
      // console.log(`State: ${addressDetails.state}`);
      // console.log(`City: ${addressDetails.city}`);
      // console.log(`Suburb: ${addressDetails.suburb}`);
      // console.log(`Postcode: ${addressDetails.postcode}`);
      // console.log(`Road: ${addressDetails.road}`);

      const loc = {};

      return {
        country: addressDetails?.country,
        city: addressDetails?.city,
        road: addressDetails?.road,
        state: addressDetails?.state,
        postcode: addressDetails?.postcode,
      };

      // return addressDetails;
    } else {
      console.log("No results found");
    }
  } catch (error) {
    console.log("Error: " + error);
  }
};

export const sliderData = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPC67oeHZnh9kFcnYdClZWDqY-lu4W-2kE7w&s",
  },

  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPC67oeHZnh9kFcnYdClZWDqY-lu4W-2kE7w&s",
  },

  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPC67oeHZnh9kFcnYdClZWDqY-lu4W-2kE7w&s",
  },

  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPC67oeHZnh9kFcnYdClZWDqY-lu4W-2kE7w&s",
  },
];

export const backendUrl = "http://192.168.41.216:9000/";

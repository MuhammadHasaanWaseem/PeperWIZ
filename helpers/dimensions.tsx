import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = (percentage: number) => {
  const width = deviceWidth;
  return (percentage * width) / 100;
}

export const hp = (percentage: number) => {
  const height = deviceHeight;
  return (percentage * height) / 100;
}
export const getcoloumncount = () => {
  const width = deviceWidth;
  if (width >= 1200) {
    return 4; // Large screens
  } else if (width >= 760) {
    return 3; // Medium screens
  } else {
    return 2; // Extra small screens
  }
}
export const getimageheight = (height: number, width: number) => {
 if(width>height){
  return 250;

 }
 else if(width<height){
  return 400;
 }
 else {
  return 200;
  // return (height * width) / 2; // Adjust this formula as needed
 }
}
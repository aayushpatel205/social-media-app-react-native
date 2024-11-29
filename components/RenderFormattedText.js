import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

const RenderFormattedText = ({ htmlContent }) => {
  const { width } = useWindowDimensions();
  return <RenderHTML contentWidth={width} source={{ html: htmlContent }} />;
};

export default RenderFormattedText;

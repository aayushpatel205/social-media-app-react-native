import React from "react";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions, View } from "react-native";

const RenderFormattedText = ({ htmlContent }) => {
  const contentWidth = useWindowDimensions().width - 60;
  const tagsStyles = React.useMemo(
    () => ({
      div: { maxWidth: contentWidth, fontSize: 17 },
    }),
    [contentWidth]
  );

  return (
    <View>
      <View
        style={{
          maxWidth: contentWidth,
          maxHeight: "100%",
          overflow: "hidden",
        }}
      >
        <RenderHTML
          contentWidth={contentWidth}
          source={{ html: htmlContent ? htmlContent : "" }}
          tagsStyles={tagsStyles}
        />
      </View>
    </View>
  );
};

export default RenderFormattedText;
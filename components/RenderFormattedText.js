import React, { useState } from "react";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions, View, Text } from "react-native";

const RenderFormattedText = ({ htmlContent}) => {
  const contentWidth = useWindowDimensions().width - 60;

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
          source={{ html: htmlContent }}
          tagsStyles={{
            div: { maxWidth: contentWidth, fontSize: 17 },
          }}
        />
      </View>
    </View>
  );
};

export default RenderFormattedText;
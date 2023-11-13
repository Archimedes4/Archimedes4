import { View } from 'react-native';
import React from 'react';

export default function SVGXml({
  xml,
  height,
  width,
}: {
  xml: string;
  width: number;
  height: number;
}) {
  return (
    <View style={{ height, width }}>
      <div dangerouslySetInnerHTML={{ __html: xml }} />
    </View>
  );
}

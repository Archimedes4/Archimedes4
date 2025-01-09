import React from 'react';
import { View } from 'react-native';

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

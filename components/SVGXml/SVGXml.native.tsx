import React from 'react';
import { SvgXml } from 'react-native-svg';

export default function SVGXml({
  xml,
  height,
  width,
}: {
  xml: string;
  width: number;
  height: number;
}) {
  return <SvgXml style={{ height, width }} xml={xml} />;
}

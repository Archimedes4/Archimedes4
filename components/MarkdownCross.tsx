import { View, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import * as commonmark from "commonmark";

export default function MarkdownCross({markdown}:{markdown: string}) {
  const [html, setHtml] = useState<string>("")
  function convertToHtml() {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(markdown); // parsed is a 'Node' tree
    // transform parsed if you like...
    var result = writer.render(parsed); // result is a String
    setHtml(result)
  }
  useEffect(() => {
    convertToHtml()
  }, [markdown])
  if (Platform.OS === 'web') {
    return (
      <div dangerouslySetInnerHTML={{__html: html}} />
    )
  }
  return (
    <WebView
      source={{html: html}}
      style={{width: 100, height:100}}
    />
  )
}
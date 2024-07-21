import { View, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { WebView } from 'react-native-webview';
import * as commonmark from "commonmark";
import { getMarkdownFromAssets } from '../ulti/storageFunctions';
import { convertToMarkdown } from '../ulti/createMarkdown';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function MarkdownCross({markdown, assests}:{markdown: string, assests: postAsset[];}) {
  const { height, width } = useSelector((state: RootState) => state.dimentions);
  const [html, setHtml] = useState<string>("")

  async function getMarkdown() {
    const assetResult = await getMarkdownFromAssets(assests)
    let markdownArray = markdown.split('<img src="')
    let markdownResult = markdown + assetResult
    setHtml(await convertToMarkdown(markdownResult))
  }

  useEffect(() => {
    getMarkdown()
  }, [markdown, assests])

  if (Platform.OS === 'web') {
    return (
      <div dangerouslySetInnerHTML={{__html: `
      <html lang="en">
      <body>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/github-markdown.css">
        <style>
          .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
            height: ${height}px;
          }
      
          @media (max-width: 767px) {
            .markdown-body {
              padding: 15px;
            }
          }
        </style>
        <div class="markdown-body">
          ${html}          
        </div>
      </body>
      </html>
      `}} />
    )
  }
  return (
    <WebView
      source={{html: `
        <html lang="en">
      <body>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/github-markdown.css">
        <style>
          .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
            height: ${height}px;
          }
      
          @media (max-width: 767px) {
            .markdown-body {
              padding: 15px;
            }
          }
        </style>
        <div class="markdown-body">
          ${html}          
        </div>
      </body>
      </html>
        `}}
      style={{width: width, height:height}}
    />
  )
}
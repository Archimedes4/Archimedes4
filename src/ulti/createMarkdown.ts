export async function convertToMarkdown(input: string) {
  const result = await fetch("https://api.github.com/markdown?mode=gfm", {
    method: "POST",
    body: JSON.stringify({text: input}),
    headers: {
      "Accept":"application/vnd.github+json",
      "X-GitHub-Api-Version":"2022-11-28"
    }
  })
  if (result.ok) {
    const data = await result.text()
    return data
  }
}
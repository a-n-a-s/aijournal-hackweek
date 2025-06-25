export const analyzeMood = async (text) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
        import.meta.env.VITE_GEMINI_API_KEY
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the mood of the following text and return ONLY a valid JSON object (no additional text, no markdown, no code fences) with these exact fields: 
                  "mood" (the dominant emotion), 
                  "hexcolor" (a color that represents this mood), 
                  "summary" (a short 1-2 sentence summary of the content). 
                  Do not include any explanations or additional text, just the JSON object.
                  Text to analyze: ${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;

    // Clean up the response text to extract JSON
    let jsonString = responseText;

    // Handle cases where response includes markdown code fences
    if (jsonString.includes("```json")) {
      jsonString = jsonString.replace(/```json/g, "");
    }
    if (jsonString.includes("```")) {
      jsonString = jsonString.replace(/```/g, "");
    }

    // Remove any leading/trailing whitespace or newlines
    jsonString = jsonString.trim();

    // Parse the cleaned JSON
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error("Error analyzing mood:", error);
    return {
      mood: "error",
      hexcolor: "#FF0000",
      summary: "Error analyzing mood",
    };
  }
};

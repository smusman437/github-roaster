import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { repos, followers, following, created_at, bio } = body;

    const completion = await openai.chat.completions.create({
      store: true,
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a witty roast generator that creates playful, funny roasts based on GitHub profiles. Keep it light-hearted and fun, not mean-spirited.",
        },
        {
          role: "user",
          content: `Roast this GitHub profile: They have ${repos} public repos, ${followers} followers, following ${following} people. Account created on ${created_at}. Bio: ${bio}`,
        },
      ],
      max_tokens: 150,
    });

    return NextResponse.json({ roast: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to generate roast" },
      { status: error.status || 500 }
    );
  }
}

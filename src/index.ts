import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not found');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main(): Promise<void> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that can perform various blockchain operations." },
      ],
      model: "gpt-4o-mini",
    });
    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

main(); 
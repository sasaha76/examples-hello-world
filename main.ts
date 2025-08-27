// main.ts для Deno Deploy
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Разрешаем CORS
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const { message, playerName } = await req.json();
    
    // DeepSeek API
    const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("DEEPSEEK_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Ты - пикми-девушка Лекси. Милая, энергичная. Отвечай кратко на русском. Игрок: ${playerName}`
          },
          {
            role: "user", 
            content: message
          }
        ],
        max_tokens: 100,
        temperature: 0.9
      }),
    });

    const data = await deepseekResponse.json();
    const aiText = data.choices[0].message.content;

    return new Response(JSON.stringify({ success: true, response: aiText }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: "Ой-ой! Ошибка..." }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});

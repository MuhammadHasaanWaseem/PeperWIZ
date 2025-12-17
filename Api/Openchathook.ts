import axios from "axios";
import { Text1, Text2 } from "./OpenAIkeys";

export const openChatHook = async (messages: Array<{ role: string; content: string }>) => {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
    }, {
        headers: {
            "Authorization": `Bearer ${Text1}`,
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });
    return response.data.choices[0].message.content;
}

export const openChatHook2 = async (messages: Array<{ role: string; content: string }>) => {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
    }, {
        headers: {
            "Authorization": `Bearer ${Text2}`,
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });
    return response.data.choices[0].message.content;
}
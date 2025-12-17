import axios from "axios";
import { image1, image2, image3 } from "./OpenAIkeys";

export const openImageHook = async (prompt: string) => {
    const response = await axios.post("https://api.openai.com/v1/images/generations", {
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "512x512",
    }, {
        headers: {
            "Authorization": `Bearer ${image1}`,
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });
    return response.data.data[0].url;
}

export const openImageHook2 = async (prompt: string) => {
    const response = await axios.post("https://api.openai.com/v1/images/generations", {
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "512x512",
    }, {
        headers: {
            "Authorization": `Bearer ${image2}`,
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });
    return response.data.data[0].url;
}

export const openImageHook3 = async (prompt: string) => {
    const response = await axios.post("https://api.openai.com/v1/images/generations", {
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "512x512",
    }, {
        headers: {
            "Authorization": `Bearer ${image3}`,
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });
    return response.data.data[0].url;
}
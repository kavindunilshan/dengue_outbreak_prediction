import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const fetchImage = async (path) => {
    try {
        const response = await axios.get(`${BASE_URL}${path}`, {
            responseType: 'arraybuffer', // important for binary data
        });
        // Convert binary data to base64 string
        return `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    } catch (error) {
        console.error("Error fetching image", error);
    }
};
import { useGenerateJwtTokenForExpiredMutation } from "../api/accountApi";
import axios from "axios";
import { baseUrl } from "../api/Base/baseApiModel";

export async function generateJwtTokenForExpired(refreshToken) {


    try {
        // Sunucuya refreshToken ile bir istek gönder
        // const response = generatedToken({refreshToken});
        const response = await axios.post(baseUrl+`/User/Refresh-Token`,{refreshToken})
        // Sunucudan başarılı bir yanıt alındığında yeni JWT token döndür
    } catch (error) {
        // Hata durumunda, uygun bir hata nesnesi döndür
        console.error("Error refreshing token:", error);
        return {
            isSuccess: false,
            error: error.response ? error.response.data : 'Unknown error'
        };
    }
}
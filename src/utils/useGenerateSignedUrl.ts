import { useMutation } from "react-query";
import axios from "axios";
import API_PATHS from "../constants/apiPaths";

export function useGenerateSignedUrl() {
  return useMutation(async (fileName: string) => {
    // Retrieve the authorization token from localStorage
    const authorization_token = localStorage.getItem('authorization_token');
    // Call the API Gateway endpoint to generate the signed URL
    const res = await axios.get<{ signedUrl: string }>(`${API_PATHS.import}`, {
      params: { name: fileName },
      headers: {
        Authorization: `Basic ${authorization_token}`,
      },
    });

    // The response will contain the signed URL
    return res.data.signedUrl;
  });
}
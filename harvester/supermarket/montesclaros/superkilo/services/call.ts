import axios from 'axios';
import { decryptBody } from './decrypt';

// const decryptedResponse = opensslDecrypt(response.data.encrypted, ENCRYPTION_KEY); This decrypt the payload

const API_BASE_URL = 'https://elb.regexsolutions.com.br';

interface ApiConfig {
    uid: string;
    uidsecao: string;
    authorization: string | null;
}

export class ApiClient {
    private config: ApiConfig;
    private tokenExpiry: number | null = null;

    constructor(config: ApiConfig) {
        this.config = config;
    }

    private isTokenValid(): boolean {
        if (!this.tokenExpiry) return false;
        return Date.now() < this.tokenExpiry;
    }

    setAuthorization(token: string) {
        this.config.authorization = token;
        // Set expiry to 1 hour and 55 minutes (giving 5 min buffer)
        this.tokenExpiry = Date.now() + (115 * 60 * 1000);
    }

    private getHeaders() {
        return {
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'aud': 'lojaonlinte',
            'authorization': this.config.authorization,
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'encrypt-response': 'true',
            'origem': 'site',
            'origin': 'https://www.superkilo.com.br',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'referer': 'https://www.superkilo.com.br/',
            'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'uid': this.config.uid,
            'uidsecao': this.config.uidsecao,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
        };
    }

    async login(encryptedPayload: string): Promise<any> {
        if (this.config.authorization) {
            return { hardcoded: true, token: this.config.authorization };
        }

        // Check if we have a valid cached token
        if (this.isTokenValid()) {
            return { token: this.config.authorization };
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/usuarioFidelidade/loginSite`,
                { encrypted: encryptedPayload },
                { headers: this.getHeaders() }
            );

            if (response.data.encrypted) {
                const decryptedResponse = decryptBody(response.data.encrypted);
                const result = JSON.parse(decryptedResponse);
                this.setAuthorization(result.token);
                return result;
            }

            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async getProductList(encryptedPayload: string): Promise<any> {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/produto/lista`,
                { encrypted: encryptedPayload },
                { headers: this.getHeaders() }
            );

            // Decrypt the response if it's encrypted
            if (response.data.encrypted) {
                const decryptedResponse = decryptBody(response.data.encrypted);
                return JSON.parse(decryptedResponse);
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching product list:', error?.message);
            throw error;
        }
    }
}
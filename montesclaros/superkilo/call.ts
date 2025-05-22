import axios from 'axios';
import { opensslDecrypt } from './decrypt';

const API_BASE_URL = 'https://elb.regexsolutions.com.br';
const ENCRYPTION_KEY = ')Kzdm[Ruh4B-SA!?fyCNt1ci=)9a&)2^EtmEIxt[q`a5Y58(qNf-_oZdbz(o41,';

interface ApiConfig {
    uid: string;
    uidsecao: string;
    authorization: string;
}

export class ApiClient {
    private config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = config;
    }

    private getHeaders() {
        return {
            'accept': 'application/json, text/plain, */*',
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

    async getProductList(encryptedPayload: string): Promise<any> {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/produto/lista`,
                { encrypted: encryptedPayload },
                { headers: this.getHeaders() }
            );

            // Decrypt the response if it's encrypted
            if (response.data.encrypted) {
                const decryptedResponse = opensslDecrypt(response.data.encrypted, ENCRYPTION_KEY);
                return JSON.parse(decryptedResponse);
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching product list:', error);
            throw error;
        }
    }
}
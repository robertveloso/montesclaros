import { ApiClient } from "./call";

// Need to map uidsecao:

// 605c6bb8-f87d-44fc-ac3f-42d9e1e471d8
// dcde73f2-d0b9-4ccd-9ce4-a6dcfd1b0999

// Create an instance of the API client
const client = new ApiClient({
    uid: '8cb902e7-8193-437e-b322-95c7d60d4d80',
    uidsecao: 'dcde73f2-d0b9-4ccd-9ce4-a6dcfd1b0999',
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4Y2I5MDJlNy04MTkzLTQzN2UtYjMyMi05NWM3ZDYwZDRkODAiLCJhdWQiOiJzaXRlQW5vbmltbyIsImlhdCI6MTc0NzkyMTkxOCwiZXhwIjoxNzQ3OTI1NTE4fQ.8kdY6JK-svgR86kdqI7X7ZSTeNA3A80uta-bD8cSEmA',
});

export class Scraper {
    private client: ApiClient;

    constructor() {
        this.client = client;
    }

    static async login() {
        const encryptedPayload = "U2FsdGVkX1+0bbnUjKW2b1n0ecQxM4Wx7gZ7eEhffJs7DJtKJhNzbeGGKs6IDkDXFwjAK5n0gv8LCKVNpGv90UAsOgJpbhKHPPweLrR2gzHv1qEIm3mZx7BAmQrcmOJd";
        const loginResult = await client.login(encryptedPayload);
        console.log('Login successful:', loginResult);
    }

    static async getProductList() {
        const encryptedPayload = "U2FsdGVkX19//lL1IXbgf3PggeJO6AS0lp1aSt+gCQhKXiL5wc3DKXv+y26bOkWYfzSo288euXXCKeXHoOTG0I9krzJ4gG4aBMW73zV3cU9md3mMTkwcA81Fn5sjp+Yqf5LYTRN+H9Tq7ievFnFhbJyqfXITg7ZHnkek9e7SgW9ALIT0z9yaKgc+J5vA8TJcqpbcDRu5WREHviZDL7yPhtdA57xqqLGMbaA76s6MCR8=";
        const result = await client.getProductList(encryptedPayload);
        console.log(result);
        return result
    }
}
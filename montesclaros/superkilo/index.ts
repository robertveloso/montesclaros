import { ApiClient } from "./call";

// Create an instance of the API client
const client = new ApiClient({
    uid: '8cb902e7-8193-437e-b322-95c7d60d4d80',
    uidsecao: '2f416a91-a4c7-4e54-bb3a-d2821039fc88',
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4Y2I5MDJlNy04MTkzLTQzN2UtYjMyMi05NWM3ZDYwZDRkODAiLCJhdWQiOiJzaXRlQW5vbmltbyIsImlhdCI6MTc0Nzg3MTE2NiwiZXhwIjoxNzQ3ODc0NzY2fQ.Bq2jP0QE8nWwpDsW3HZxCl2wuSISOKfwAjFX98JqL38'
});

// Use the encrypted payload from your curl command
const encryptedPayload = 'U2FsdGVkX1+kZMQnGSYKhT34uMx0p3kghKMuUv078c+86E4XpnaKlAXMDefszTfe2dCXXy4aZP/32sY4NMRBpj4q4QhJ3YzNSYhyh0YKKTmFUhVx3/y6lQwS/wcqircS';

// Make the API call
const result = await client.getProductList(encryptedPayload);
console.log(result);

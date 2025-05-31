const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default {
    async createMidtransTransaction(data) {
        const response = await fetch(`${API_URL}/api/payments/midtrans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create transaction');
        }

        return await response.json();
    }
};


export abstract class ApiBase {
    protected readonly baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    }

    protected async makeRequest(
        path: string, 
        options: {
            method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
            data?: any;
            headers?: Record<string, string>;
            params?: Record<string, string>;
        } = {}
    ) {
        const {
            method = 'GET',
            data,
            headers = {},
            params
        } = options;

        // Build URL with query parameters
        let url = `${this.baseUrl}${path}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        // Prepare request configuration
        const requestConfig: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        // Add body for methods that support it
        if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
            requestConfig.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, requestConfig);
            
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Try to parse JSON, fallback to text
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
}

// Legacy export for backward compatibility
export default ApiBase;
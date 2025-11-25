export interface QueryRequest {
    content: string;
}

export interface QueryResponse {
    query: string;
    processed?: boolean;
    timestamp?: string;
}

export interface ExecResponse {
    processed?: boolean;
    result?: string;
    timestamp?: string;
}


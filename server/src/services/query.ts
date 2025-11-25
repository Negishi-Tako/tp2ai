import { ElasticsearchService } from './elasticsearch.js';

export class QueryService {
    /**
     * Process a query string and execute it
     */
    static async handleQuery(query: string): Promise<string> {
        try {
            // Convert string query to Elasticsearch query format
            const esQuery = {
                size: 100,
                query: {
                    match: {
                        message: query
                    }
                }
            };
            return await ElasticsearchService.executeQuery(esQuery);
        } catch (error) {
            console.error('Query processing error:', error);
            throw error;
        }
    }
}


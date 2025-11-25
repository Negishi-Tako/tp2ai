import { Agent } from 'https';
import { env } from '../config/env.js';

const httpsAgent = new Agent({
    rejectUnauthorized: false
});

export class ElasticsearchService {
    /**
     * Execute Elasticsearch query
     */
    static async executeQuery(query: object): Promise<string> {
        try {
            console.log('Executing query:', JSON.stringify(query));
            
            const username = env.KIBANA_USERNAME;
            const password = env.KIBANA_PASSWD;
            
            if (!username || !password) {
                throw new Error('Kibana credentials not configured');
            }
            
            const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');
            const url = `${env.KIBANA_URL}/kibana/api/console/proxy?path=logstash-%2A%2F_search&method=POST`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'kbn-xsrf': 'true',
                    'Authorization': `Basic ${basicAuth}`
                },
                body: JSON.stringify(query),
                // @ts-ignore - Node.js fetch with agent
                agent: httpsAgent
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            return JSON.stringify(data);
        } catch (error) {
            console.error('Elasticsearch execution error:', error);
            throw error;
        }
    }
}


import { Anthropic } from '@anthropic-ai/sdk/client.js';
import { Prompts } from '../prompts.js';
import { env } from '../config/env.js';
import { CLAUDE_CONFIG } from '../config/constants.js';
import { formatDate } from '../utils/date.js';
import { formatTarget } from '../utils/validation.js';
import { extractJsonBlocks, hasJsonBlocks, normalizeJsonMarkers } from '../utils/dsl.js';
import { QueryService } from './query.js';

export class ClaudeService {
    private static anthropic = new Anthropic({
        apiKey: env.CLAUDE_API_KEY,
    });

    /**
     * Initialize Claude with a message
     */
    static async handleClaudeInit(msg: string, contextMsg: string[] = []): Promise<[string, string]> {
        let response: string, thinking: string;
        
        if (contextMsg.length === 0) {
            // msg is already a fully replaced prompt from buildInitPrompt
            [thinking, response] = await this.handleClaudeRequest(msg, true, msg);
        } else {
            const prompt = await this.buildChatPrompt(msg, contextMsg);
            [thinking, response] = await this.handleClaudeRequest(prompt, false, "");
        }
        
        console.log('Claude response:', response);
        response = normalizeJsonMarkers(response);
        
        if (hasJsonBlocks(response)) {
            console.log('Detected DSL in response, processing further...');
            return await this.handleDSLResponse(response);
        }
        
        console.log('No DSL detected, returning response directly.');
        return [response, thinking];
    }

    /**
     * Build chat prompt with context
     */
    static async buildChatPrompt(msg: string, contextMsg: string[]): Promise<string> {
        return this.replacePlaceholders(Prompts['chatPrompt'], {
            contextMsg: contextMsg.join('\n'),
            msg: msg
        });
    }

    /**
     * Build initialization prompt with form data
     */
    static async buildInitPrompt(
        start: Date | string,
        end: Date | string,
        target: string | string[],
        malware: 'enable' | 'disable',
        exploit: 'enable' | 'disable',
        audience: string,
        language: string
    ): Promise<string> {
        console.log(start, end, target, malware, exploit, audience, language);

        const startStr = formatDate(start);
        const endStr = formatDate(end);
        const targetStr = formatTarget(target);

        return this.replacePlaceholders(Prompts['initPrompt'], {
            start: startStr,
            end: endStr,
            target: targetStr,
            malware: malware,
            exploit: exploit,
            audience: audience,
            language: language
        });
    }

    /**
     * Build DSL prompt with results
     */
    static async buildDSLPrompt(resultsForClaude: string): Promise<string> {
        return this.replacePlaceholders(Prompts['dslPrompt'], {
            resultsForClaude: resultsForClaude
        });
    }

    /**
     * Replace placeholders in a template string with provided values
     * Uses global replacement and validates all placeholders are replaced
     */
    private static replacePlaceholders(template: string, replacements: Record<string, string | number | boolean>): string {
        let result = template;
        const placeholderPattern = /\{(\w+)\}/g;
        const foundPlaceholders = new Set<string>();
        
        // Find all placeholders in the template
        let match;
        while ((match = placeholderPattern.exec(template)) !== null) {
            foundPlaceholders.add(match[1]);
        }
        
        // Replace all placeholders
        for (const [key, value] of Object.entries(replacements)) {
            if (value === null || value === undefined) {
                throw new Error(`Placeholder {${key}} has null or undefined value`);
            }
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            result = result.replace(regex, String(value));
            foundPlaceholders.delete(key);
        }
        
        // Check for unreplaced placeholders
        if (foundPlaceholders.size > 0) {
            const missing = Array.from(foundPlaceholders).join(', ');
            throw new Error(`Missing replacements for placeholders: {${missing}}`);
        }
        
        return result;
    }

    /**
     * Handle Claude API request
     */
    static async handleClaudeRequest(
        msg: string,
        initial: boolean,
        claude_prompt: string
    ): Promise<[string, string]> {
        let response;

        if (initial) {
            if (!env.CLAUDE_API_FILE_1 || !env.CLAUDE_API_FILE_3) {
                throw new Error('Claude API file IDs not configured');
            }
            response = await this.anthropic.beta.messages.create({
                model: CLAUDE_CONFIG.MODEL,
                max_tokens: CLAUDE_CONFIG.MAX_TOKENS,
                thinking: {
                    type: 'enabled',
                    budget_tokens: CLAUDE_CONFIG.THINKING_BUDGET_TOKENS
                },
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: claude_prompt },
                            {
                                type: 'document',
                                source: {
                                    type: 'file',
                                    file_id: env.CLAUDE_API_FILE_1,
                                }
                            },
                            {
                                type: 'document',
                                source: {
                                    type: 'file',
                                    file_id: env.CLAUDE_API_FILE_3,
                                }
                            }
                        ],
                    }
                ],
                betas: [...CLAUDE_CONFIG.BETA_FEATURES],
            });
        } else {
            response = await this.anthropic.beta.messages.create({
                model: CLAUDE_CONFIG.MODEL,
                max_tokens: CLAUDE_CONFIG.MAX_TOKENS,
                thinking: {
                    type: 'enabled',
                    budget_tokens: CLAUDE_CONFIG.THINKING_BUDGET_TOKENS
                },
                messages: [
                    { role: 'user', content: [{ type: 'text', text: msg }] }
                ],
            });
        }

        // Handle response content
        const firstContent = response.content[0];
        const secondContent = response.content[1];

        if (firstContent && 'thinking' in firstContent && secondContent && 'text' in secondContent) {
            return [firstContent.thinking || '', secondContent.text || ''];
        } else if (firstContent && 'text' in firstContent) {
            return [firstContent.text || '', ''];
        } else {
            console.error('Claude response is error:', response);
            throw new Error('Claude response is error');
        }
    }

    /**
     * Handle DSL response by executing queries and getting results
     */
    static async handleDSLResponse(msg: string): Promise<[string, string]> {
        const jsonBlocks = extractJsonBlocks(msg);
        
        if (jsonBlocks.length === 0) {
            throw new Error('No valid Elasticsearch DSL found in the response.');
        }

        let resultsForClaude = '';
        for (const block of jsonBlocks) {
            const result = await QueryService.handleQuery(block);
            resultsForClaude += result;
        }
        
        console.log('Results for Claude:', resultsForClaude);
        const dslPrompt = await this.buildDSLPrompt(resultsForClaude);
        return await this.handleClaudeRequest(dslPrompt, false, "");
    }
}


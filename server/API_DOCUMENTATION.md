# T-Pot AI Security Report API

This document outlines the API endpoints for the T-Pot AI Security Report chat service.

## Base URL

All endpoints are relative to the server's base URL. When using the client's development server, requests are proxied from `/api`.

## Endpoints

### 1. Send a Chat Message

-   **Endpoint:** `/chat/msg`
-   **Method:** `POST`
-   **Description:** Sends a message to the chat. If `chatId` is not provided, a new chat session is created.
-   **Request Body:**
    ```json
    {
      "message": "string",
      "chatId": "string" // Optional
    }
    ```
-   **Response Body:**
    A JSON object containing the response from the AI assistant, plus the `chatId`.
    ```json
    {
      "id": "string", // Message ID from AI
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "string" // AI's response
        }
      ],
      "model": "string",
      "stop_reason": "string",
      "usage": {
        "input_tokens": "number",
        "output_tokens": "number"
      },
      "chatId": "string" // The ID of the chat session
    }
    ```

### 2. Get Chat History

-   **Endpoint:** `/chat/:chatId`
-   **Method:** `GET`
-   **Description:** Retrieves the message history for a specific chat session.
-   **URL Parameters:**
    -   `chatId` (string, required): The ID of the chat session.
-   **Response Body:**
    ```json
    {
      "chatId": "string",
      "history": [
        {
          "id": "string",
          "role": "user | assistant | system",
          "content": "string",
          "createdAt": "string", // ISO 8601 datetime string
          "chatId": "string"
        }
      ]
    }
    ```

### 3. Get Chat Stats

-   **Endpoint:** `/chat/stats`
-   **Method:** `GET`
-   **Description:** Retrieves statistics about the chat service. (Currently returns `true`).
-   **Response Body:**
    ```json
    true
    ```

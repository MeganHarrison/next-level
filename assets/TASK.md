# TASK.md

## AI Agent Development Checklist

- [ ] Install dependencies: `pnpm add ai @ai-sdk/openai @ai-sdk/react`
- [ ] Set up environment variables: Add `OPENAI_API_KEY` to `.env`
- [ ] Implement core agent logic using `generateText` or `streamText` with OpenAI
- [ ] Create API endpoint (e.g., `/api/chat/route.ts`) for chat/agent requests
- [ ] Build UI components using `useChat` from `@ai-sdk/react`
- [ ] Display messages and handle user input in the UI
- [ ] Fix the sidebar so it appears on all relevant pages
- [ ] Write unit and integration tests for agent logic and endpoints
- [ ] Test the full agent workflow (API + UI)
- [ ] Deploy the application (e.g., to Vercel)
- [ ] Monitor, iterate, and improve agent capabilities 

## AI Agents

- [ ] Crawl4ai MCP + RAG
- [ ] RAG for business expert agent
- [ ] Digital Ocean version
- [ ] N8N version: Create a page with a modern and sleek chat ui that triggers an n98n workflow by sening a webhook. the chat will then stream back the response from n8n.This is the webhook:
https://agents.nextlevelaiagents.com/webhook/trigger-expert-chat

- [ ] Streamline table page creation
- [ ] After testing, add the ability for users to log in and enter their .env file keys. 

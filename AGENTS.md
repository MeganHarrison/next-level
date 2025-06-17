# [AGENTS.md](http://agents.md/)

## Project Overview

Create an ai agent that integrates with the current repo. The repo is a supabase starter template with authorization configured.

## Tasks

### **Develop an AI Agent using LangChain with the following functionality:**

1. Perform Retrieval-Augmented Generation, connected to Supabase `documents` table for vector embeddings and data storage.
2. Orchestrating sub-agents
3. Tool calling
4. Long-term memory
5. Chat history

### **Integrate agent with frontend page**

- Chat interface connected to backend agent
- Chat history displayed
- Display uploaded documents in the `documents` Supabase table using the infinite query hook, https://supabase.com/ui/docs/infinite-query-hook (already installed)
- Upload documents
  - Use supabase dropzone component (already installed).

### **Merge and Configure**

- Consolidate package.json dependencies and ensure that the RAG agent’s backend services are properly connected to the frontend.
- Update the tsconfig.json and next.config.js as needed.

### **Test the RAG Agent**

- Run the integrated project locally and ensure the RAG agent responds correctly in the chat interface.
- Debug any issues that arise to ensure a smooth, functional example.

### **Documentation**

Document each step to ensure clarity and maintainability.

### Testing

- Run pytest tests/ before finalizing a PR.
- All commits must pass lint checks via flake8.

### PR Instructions

- Title format: [Fix] Short description
- Include a one-line summary and a "Testing Done" section

### Resources

AI SDK

AI SDK Agent Examples: https://github.com/langchain-ai/langchain-nextjs-template.git

LangChain: https://js.langchain.com/docs/introduction/

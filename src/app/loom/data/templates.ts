import type { WorkflowTemplate } from '@/types/loom';

export const exampleTemplates: WorkflowTemplate[] = [
  {
    name: "Basic Web Summary",
    description: "A simple linear workflow that takes a URL, summarizes the content, and prepares a prompt to reformat it as a tweet.",
    nodes: [
      {
        localId: 'start-summarize',
        title: "Summarize Webpage",
        type: 'web-summarizer',
        description: "Fetches content from a given URL and generates a summary.",
        position: { x: 50, y: 50 },
        config: { url: "https://www.theverge.com/2023/11/21/23971273/google-bard-youtube-videos-ai-chatbot" },
      },
      {
        localId: 'prompt-tweet',
        title: "Format as Tweet",
        type: 'prompt',
        description: "Takes the summary and turns it into a short, engaging tweet.",
        position: { x: 350, y: 50 },
        config: { promptText: "Using the summary from the previous step, write a tweet (max 280 chars) that includes the main point and a relevant hashtag." },
      }
    ],
    connections: [
      { fromLocalId: 'start-summarize', toLocalId: 'prompt-tweet' }
    ]
  },
  {
    name: "Conditional Content Analysis",
    description: "Analyzes text from a prompt, decides if it's positive, and then calls different agents based on the result.",
    nodes: [
      {
        localId: 'start-prompt',
        title: "Initial Analysis Prompt",
        type: 'prompt',
        description: "A prompt to analyze the sentiment of a customer review.",
        position: { x: 50, y: 150 },
        config: { promptText: "Analyze the following customer review and determine if its sentiment is positive, negative, or neutral: 'The new Quantum Entangler is revolutionary! It completely changed my workflow.' Return only 'positive', 'negative', or 'neutral'." },
      },
      {
        localId: 'decision-node',
        title: "Check Sentiment",
        type: 'conditional',
        description: "Checks if the output of the analysis is 'positive'.",
        position: { x: 350, y: 150 },
        config: { condition: "{{input.result}} === 'positive'" }
      },
      {
        localId: 'positive-agent-call',
        title: "Draft Marketing Tweet",
        type: 'agent-call',
        description: "If sentiment is positive, ask a marketing agent to draft a promotional tweet.",
        position: { x: 650, y: 50 },
        config: { agentName: "MarketingAgent" }
      },
      {
        localId: 'negative-agent-call',
        title: "Create Support Ticket",
        type: 'agent-call',
        description: "If sentiment is not positive, ask a support agent to create a follow-up ticket.",
        position: { x: 650, y: 250 },
        config: { agentName: "SupportAgent" }
      }
    ],
    connections: [
      { fromLocalId: 'start-prompt', toLocalId: 'decision-node' },
      { fromLocalId: 'decision-node', toLocalId: 'positive-agent-call' }, // True path
      { fromLocalId: 'decision-node', toLocalId: 'negative-agent-call' } // False path
    ]
  },
  {
    name: "Data Transformation Flow",
    description: "Takes raw data, transforms it, and then waits for a specified duration before the next step.",
    nodes: [
      {
        localId: 'trigger-data',
        title: "Trigger with Raw Data",
        type: 'trigger',
        description: "Starts the flow with a sample of raw, unstructured data.",
        position: { x: 50, y: 50 },
        config: { data: "User: John Doe, Plan: Pro, Status: Active" }
      },
      {
        localId: 'transform-data',
        title: "Convert to JSON",
        type: 'data-transform',
        description: "Parses the raw string data and converts it into a structured JSON object.",
        position: { x: 350, y: 50 },
        config: { transformationLogic: "Parse the input string and create a JSON object with keys 'user', 'plan', and 'status'."}
      },
      {
        localId: 'wait-node',
        title: "Wait 5 Seconds",
        type: 'wait',
        description: "Pauses the workflow for 5 seconds before proceeding.",
        position: { x: 650, y: 50 },
        config: { duration: 5000 }
      }
    ],
    connections: [
      { fromLocalId: 'trigger-data', toLocalId: 'transform-data' },
      { fromLocalId: 'transform-data', toLocalId: 'wait-node' }
    ]
  }
];

# Claude Certified Developer – Foundations (CCDV-F) — 180 Practice Questions

**Independent study resource — not affiliated with or endorsed by Anthropic.** Questions are original and written to match the scope and style of Anthropic's official *Claude Certified Developer – Foundations Exam Guide, v1.0 (effective July 2026, exam code CCDV-F)*. They are **not** drawn from the live exam item bank (confidential under Anthropic's NDA). Use this to check your understanding of the blueprint, not as a source of leaked content.

**Exam facts (from the official guide):** 53 items, 120 minutes, multiple-choice and multiple-response (each item states how many answers to pick), scaled score 100–1,000, passing score 720, $125 fee, 12-month validity. Audience: AI/ML engineers, technical leads, and senior software engineers with 1–5 years of software engineering experience and 6+ months hands-on with Claude/comparable LLM systems, proficient in Python and/or TypeScript.

**Domain and skill weights this bank mirrors (180 questions, proportional to the blueprint):**

| # | Domain | Weight | Questions |
|---|--------|--------|-----------|
| 1 | Agents and Workflows | 14.7% | 26 (Q1–Q26) |
| 2 | Applications and Integration | 33.1% | 59 (Q27–Q85) |
| 3 | Claude Code | 3.1% | 6 (Q86–Q91) |
| 4 | Eval, Testing, and Debugging | 2.6% | 5 (Q92–Q96) |
| 5 | Model Selection and Optimization | 16.8% | 30 (Q97–Q126) |
| 6 | Prompt and Context Engineering | 11.0% | 20 (Q127–Q146) |
| 7 | Security and Safety | 8.1% | 15 (Q147–Q161) |
| 8 | Tools and MCPs | 10.6% | 19 (Q162–Q180) |

Domain 2 (Applications and Integration) and Domain 5 (Model Selection and Optimization) together make up half the exam — prioritize study time there. Items marked **(Select TWO)** are multiple-response, mirroring the real exam's item format. The full answer key with rationale is in a separate section at the end so you can self-test first.

---

## Domain 1: Agents and Workflows (Q1–Q26)

### Agent Architecture

**Q1.** A task always follows the same fixed sequence of steps with predictable branching. Which architectural choice best fits, per standard workflow-vs-agent decision criteria?
A. A fully autonomous agent that decides its own steps at runtime
B. A predefined workflow, since the steps and branching are known in advance
C. A manager/supervisor hierarchy with five subagents
D. No structure at all — send one large prompt and hope for the best

**Q2.** A task requires the model to decide, at runtime, which of several unpredictable paths to take based on intermediate results. This favors:
A. A fixed, linear workflow with no branching logic
B. An agent architecture, since the control flow cannot be fully predetermined
C. Removing all tools from the system
D. A single synchronous API call with no tool use

**Q3.** In a manager/supervisor architecture, what is the primary role of the supervisor?
A. To perform every subtask itself
B. To decompose the overall goal, delegate subtasks to subagents, and integrate their results
C. To disable all subagents once one fails
D. To act only as a logging mechanism with no decision-making role

**Q4.** Which is the strongest justification for introducing subagents into an agent architecture?
A. Subagents make debugging strictly impossible
B. Subagents can isolate context and specialize in a subtask, improving task execution and avoiding a single agent being overloaded with unrelated context
C. Subagents eliminate the need for any orchestration
D. Subagents always reduce total token usage to zero

**Q5.** A developer is deciding between a rigid workflow and a more autonomous agent for a customer-support triage task with many edge cases. Which factor most strongly favors the agent approach?
A. The task has exactly one possible outcome
B. The variety and unpredictability of incoming cases exceeds what a fixed branching structure can reasonably enumerate
C. The task must run in under 50 milliseconds
D. The task requires no model reasoning at all

**Q6.** What is a key tradeoff of choosing an autonomous agent over a fixed workflow?
A. Agents are always cheaper and faster than workflows
B. Agents gain flexibility for unpredictable tasks but sacrifice some of the predictability and easier debuggability of a fixed workflow
C. There is no tradeoff; agents strictly dominate workflows in every case
D. Workflows cannot call tools, while agents can

**Q7.** Which scenario best illustrates appropriate use of a manager/supervisor hierarchy rather than a single flat agent?
A. Answering a single, simple factual question
B. Coordinating research, drafting, and review as distinct specialized subtasks toward one larger deliverable
C. Returning a static string with no processing
D. A task with exactly one tool call and no branching

**Q8.** A team initially built a fixed workflow for invoice processing, but new invoice types have started arriving with formats that don't fit the original branching logic. What is the most appropriate architectural response?
A. Keep the fixed workflow unchanged and reject any invoice that doesn't fit
B. Reconsider the architecture and introduce agent-based decision-making (or a hybrid) for the portions of the task that now have unpredictable branching
C. Increase the number of parallel API calls with no architectural change
D. Switch exclusively to synchronous API calls

### Agent Construction with Claude

**Q9.** What is the primary purpose of the Claude Agent SDK?
A. To replace the need for the Claude API entirely
B. To provide building blocks (agent loop, tool orchestration, session/state handling) so developers don't have to construct an agent harness from scratch
C. To restrict developers to a single fixed workflow with no customization
D. To provide a graphical interface with no programmatic access

**Q10.** A developer builds a custom agent loop instead of using an existing SDK. What is the most likely justification?
A. Custom loops are always faster to build than using an SDK
B. The application has requirements (e.g., a very specific orchestration pattern) not well served by existing SDK abstractions
C. Custom loops eliminate the need for tool definitions
D. Custom loops are required to call the Messages API at all

**Q11.** What distinguishes a self-hosted agent deployment from an Anthropic-hosted managed deployment model?
A. There is no meaningful difference
B. Self-hosted deployments run the agent harness on infrastructure the developer operates and maintains, while a managed model shifts more of that operational responsibility to the platform
C. Self-hosted deployments cannot call the Claude API
D. Managed deployments cannot use tools

**Q12.** What is the primary purpose of hooks in agent construction?
A. To increase the model's creativity
B. To trigger deterministic, code-level actions at defined points in the agent's execution (e.g., before a sensitive tool call), independent of model judgment
C. To replace the system prompt entirely
D. To make agent behavior fully non-deterministic

**Q13.** A developer is designing the termination condition for a custom agent loop. Which is the most robust approach?
A. Let the loop run indefinitely with no termination logic
B. Define explicit conditions (e.g., task-completion signal, max iteration count, or error state) that stop the loop deterministically
C. Terminate only when the API returns an error
D. Never terminate; rely on the user to manually stop it every time

**Q14.** Why might a developer choose an SDK-based agent construction approach over building directly against the raw Messages API for a moderately complex agent?
A. The SDK removes the ability to define custom tools
B. The SDK provides tested abstractions for the agent loop, tool orchestration, and state handling, reducing boilerplate and common failure modes
C. The raw API cannot support multi-turn conversations
D. SDKs are only usable for single-turn completions

**Q15.** Managing agent state across multiple turns primarily requires:
A. Ignoring all prior turns and treating each call independently
B. Persisting and passing forward the relevant conversation/task state (e.g., message history, intermediate results) between agent loop iterations
C. Randomizing state on every turn
D. Storing state exclusively in the model's weights

**Q16.** What is a key risk of an agent construction approach that gives an agent broad tool access with no deterministic guardrails?
A. There is no risk; broader tool access is always safer
B. The agent may take unintended or destructive actions since tool invocation is ultimately governed by model judgment rather than fixed logic
C. Broad tool access always slows down response time significantly
D. Tool access has no bearing on agent safety

**Q17.** A developer wants an agent to always log a specific event to an external system every time a particular tool is called, regardless of the model's behavior. What best accomplishes this reliably?
A. Adding a note to the system prompt asking the model to remember to log
B. Implementing a hook tied to that tool call that deterministically performs the logging action
C. Hoping the model logs it consistently based on training
D. Removing the tool entirely to avoid the need for logging

### Agent Patterns and Frameworks

**Q18.** Which best describes the "tool-use loop" agent pattern?
A. The agent never calls tools and only generates text
B. The agent iteratively calls tools, observes results, and reasons over those results to decide the next action, repeating until the task is complete
C. The agent calls every available tool exactly once regardless of relevance
D. The agent pattern only applies to workflows, never agents

**Q19.** What problem does a "memory" pattern in agent design primarily address?
A. Reducing the number of available tools
B. Retaining relevant information across turns or sessions so the agent doesn't lose important context or have to rediscover it
C. Increasing model temperature
D. Preventing the agent from calling any tools

**Q20.** Why is context-window management considered an agent design pattern rather than just an implementation detail?
A. Context windows are unlimited, so no management is needed
B. Deliberately managing what stays in context (and what gets pruned or summarized) directly affects whether a long-running agent remains coherent and effective
C. Context window size never affects agent behavior
D. It only matters for single-turn, non-agentic calls

**Q21.** Which is a common motivation for a sub-agent pattern that runs multiple subagents in parallel?
A. To slow down task completion intentionally
B. To parallelize independent subtasks (e.g., researching several sources at once) and isolate their context from the main agent's context
C. To ensure every subagent shares identical, unfiltered context
D. Parallel subagents are never useful for agentic tasks

**Q22.** What role do agentic abstraction frameworks (e.g., LangGraph, PydanticAI, Strands) typically play?
A. They replace the need for any LLM
B. They provide higher-level constructs (graphs, typed agents, orchestration primitives) for building multi-step agent and workflow logic without hand-rolling every mechanism
C. They are exclusively for non-LLM software
D. They eliminate the need for tool definitions entirely

**Q23.** When might a developer choose a custom agent loop over an existing agentic framework?
A. Whenever any agent is being built, without exception
B. When the framework's abstractions don't fit a specific orchestration need or introduce more complexity/overhead than a purpose-built loop
C. Custom loops are illegal to use with Claude
D. Frameworks can never be combined with the Claude Agent SDK

**Q24.** An orchestrator-worker pattern, where one agent delegates subtasks to specialized worker agents, is best suited to:
A. A single, trivial, single-step task
B. A complex, multi-step task that decomposes naturally into distinct specialized subtasks
C. Tasks that must never use tools
D. Tasks with no possibility of failure

**Q25.** **(Select TWO)** Which two are legitimate reasons to evaluate an agentic pattern (e.g., subagents, memory) for a given multi-step task, rather than a single flat prompt-response?
A. The task benefits from isolating context across distinct subtasks
B. The task requires retaining and reusing information across multiple steps or turns
C. The task is a single, one-shot factual lookup with no follow-up
D. The developer wants to avoid ever calling more than one tool

---

**Q26.** An agent needs to remember a user's stated preferences across many separate sessions spread over weeks, not just within a single long conversation. Which pattern most directly addresses this?
A. Increasing the context window size for a single session only
B. A persistent memory pattern that stores and retrieves relevant information across sessions, rather than relying solely on in-session context
C. Re-sending the entire conversation history from every prior session on every new request
D. Disabling all tools to save context space

## Domain 2: Applications and Integration (Q27–Q85)

### Understanding Requirements

**Q27.** A stakeholder says "the system should feel fast." What is the most useful next step in requirements gathering?
A. Proceed without further clarification
B. Translate the vague expectation into a measurable functional or infrastructure requirement, such as a target response-time threshold
C. Assume "fast" means using the cheapest possible model
D. Ignore performance requirements entirely

**Q28.** Which best distinguishes a functional requirement from an infrastructure requirement in a Claude-based application?
A. There is no distinction; they are the same thing
B. A functional requirement describes what the system must do (e.g., summarize a document); an infrastructure requirement describes the operating conditions it must meet (e.g., latency, uptime, scaling)
C. Functional requirements only apply to UI design
D. Infrastructure requirements only apply to non-AI systems

**Q29.** A business requirement states the application must handle sensitive customer data. What is the appropriate translation into a technical requirement?
A. Ignore the sensitivity and proceed with default settings
B. Define specific data-handling, access-control, and retention requirements that satisfy the sensitivity constraint
C. Translate it into a requirement to use the largest available model
D. Treat it purely as a marketing requirement with no technical implication

**Q30.** Why is requirement traceability (linking architecture decisions back to specific requirements) valuable in a Claude application build?
A. It has no practical value
B. It ensures each design decision (e.g., model tier, batch vs. realtime, tool set) can be justified against an actual business or infrastructure need
C. It is only relevant for non-technical stakeholders
D. It replaces the need for testing

**Q31.** A requirement specifies a hard 2-second response-time budget for an interactive chat feature. Which solution architecture consideration follows most directly?
A. Use the Message Batches API for every request
B. Favor a lower-latency model tier and/or streaming responses to meet the interactive time budget
C. Ignore the requirement since all models respond equally fast
D. Increase the number of sequential tool calls per turn

**Q32.** During requirements gathering, two stakeholders give conflicting expectations for how a Claude feature should behave in an edge case. What is the most appropriate next step before design begins?
A. Proceed with whichever requirement was mentioned first
B. Clarify and reconcile the conflicting requirements with the stakeholders before committing to a design approach
C. Implement both conflicting behaviors simultaneously with no resolution
D. Ignore both requirements and let the model decide at runtime

### Systems Life Cycle

**Q33.** Which best reflects applying systems life cycle thinking to a Claude-powered application?
A. Treating deployment as the final step with no further activity
B. Planning for development, implementation, ongoing operation, and maintenance, including how the application will be updated as models and requirements evolve
C. Skipping the maintenance phase since LLM applications never need updates
D. Only considering the initial build phase

**Q34.** During the "operate and maintain" phase of a Claude application's life cycle, which activity is most relevant?
A. Initial requirements gathering
B. Monitoring production quality, updating configurations as needed, and responding to model or dependency changes
C. Writing the very first line of code
D. Choosing the company name for the product

**Q35.** Why does an iterative development life cycle suit many Claude-powered applications well?
A. Because LLM behavior and requirements often benefit from repeated cycles of building, evaluating, and refining based on real output quality
B. Because iteration is legally required for AI systems
C. Because a single build phase always produces a perfect result
D. Because iteration eliminates the need for any evaluation

**Q36.** Which best reflects a systems life cycle framework's value for a team maintaining a Claude application over time?
A. It provides a repeatable structure for managing change (new model versions, new requirements) without ad hoc, undocumented changes
B. It guarantees the application will never need modification
C. It is only useful during the initial prototype
D. It replaces the need for version control

**Q37.** A new version of a Claude-powered feature is being rolled out. Applying systems life cycle discipline, what should be in place before full rollout?
A. No rollback plan, since the new version is assumed to work
B. A staged rollout and rollback plan so issues discovered post-deployment can be addressed without full-scale disruption
C. Immediate full rollout to all users with no monitoring
D. Skipping testing since the previous version was successful

### Claude API Mechanics

**Q38.** A developer needs Claude to process 10,000 documents overnight for a non-urgent report, where cost matters more than turnaround speed. Which approach best fits?
A. Send every request synchronously in parallel to finish as fast as possible
B. Use the Message Batches API, designed for large asynchronous workloads within a defined processing window at reduced cost
C. Lower max output tokens on synchronous calls to cut cost
D. Use the smallest available model regardless of output quality

**Q39.** Which scenario most clearly favors the realtime (synchronous) Messages API over a batch approach?
A. An overnight, non-urgent bulk report
B. An interactive chat interface where the user is waiting for an immediate response
C. A weekly archival summarization job with no time pressure
D. A one-time historical data migration with no user waiting

**Q40.** What is the primary benefit of streaming responses from the Claude API?
A. It reduces the total number of tokens generated
B. It allows the application to begin displaying or processing output incrementally as it's generated, improving perceived latency for interactive use cases
C. It guarantees lower cost than non-streaming calls
D. It eliminates the need for error handling

**Q41.** A developer wants Claude to analyze an uploaded image alongside a text question. Which capability of the API is being used?
A. The Message Batches API
B. Vision input, allowing multimodal (image plus text) requests
C. Extended thinking
D. Prompt caching

**Q42.** What is the purpose of extended/adaptive thinking modes in the API?
A. To reduce token usage to zero
B. To allow the model to allocate additional internal reasoning effort for more complex tasks, trading latency/cost for improved reasoning quality
C. To disable tool use entirely
D. To force every response into a fixed short length

**Q43.** Prompt caching is primarily used to:
A. Permanently store user data outside the application
B. Reduce cost and latency on repeated calls that share a large, unchanged prefix (e.g., system prompt or reference document) by avoiding reprocessing that prefix each time
C. Guarantee identical output on every call
D. Replace the need for a knowledge base entirely

**Q44.** A developer is deploying a Claude application through a third-party cloud vendor rather than directly against Anthropic's API. What is the most important integration consideration?
A. Third-party vendors never support tool use
B. Confirming feature parity, authentication mechanism, and any vendor-specific request/response differences compared to direct API access
C. Assuming the API is identical in every respect with zero verification
D. Third-party access always requires abandoning batch processing

**Q45.** Which best describes an appropriate use of the Messages API's data access patterns for a Retrieval-Augmented Generation (RAG)-style application?
A. Embedding an entire multi-gigabyte dataset directly in every request regardless of relevance
B. Retrieving only the relevant subset of data for a given query and passing that targeted content into the request
C. Never passing any external data into requests
D. Always using the Batch API regardless of interactivity needs

**Q46.** What is the main tradeoff between choosing the batch API and the realtime API for a given workload?
A. There is no tradeoff; they are functionally identical
B. Batch processing trades immediacy for lower cost and higher throughput on latency-tolerant workloads, while realtime processing prioritizes low latency at typically higher per-request cost
C. Batch processing is always faster than realtime processing
D. Realtime processing cannot handle high volumes under any circumstances

**Q47.** A developer needs to handle both a text prompt and a PDF document in a single request. This requirement is best addressed by:
A. Ignoring the PDF and processing only the text
B. Using the API's support for multi-format input so both the text and document content can be included in the same request
C. Manually retyping the PDF's contents as a separate, disconnected request
D. Converting the PDF into an unsupported binary blob with no extraction

**Q48.** A developer building multi-turn chat notices that each call to the Messages API requires the full conversation history to be included, since the API itself does not retain state between calls. What does this reflect?
A. A bug in the API that should be worked around by ignoring history
B. The stateless nature of the API, meaning the calling application is responsible for managing and resending relevant conversation state
C. The Messages API requires no input at all beyond the newest message
D. The API automatically retains unlimited history with no action needed by the developer

### Software Engineering Foundations

**Q49.** Which best reflects sound REST API design when building a Claude-powered backend service?
A. Ignoring HTTP status codes entirely
B. Using appropriate resource-oriented endpoints, correct HTTP methods, and meaningful status codes so the API behaves predictably for consumers
C. Returning identical responses regardless of the request
D. Avoiding any structured response format

**Q50.** Why is asynchronous programming often preferred when integrating Claude API calls into an application handling many concurrent users?
A. Async programming makes the model more accurate
B. Non-blocking I/O lets the application handle other work while waiting on network-bound API calls, improving throughput
C. Async programming eliminates the need for error handling
D. Async programming guarantees lower token usage

**Q51.** Which is a sound version-control practice specific to a Claude-integrated codebase that also manages prompts?
A. Never tracking prompt changes since they are "just text"
B. Versioning prompts and system instructions alongside code so changes can be reviewed, tested, and rolled back like any other code change
C. Editing prompts directly in production with no history
D. Storing prompts only in a developer's local, untracked notes

**Q52.** What is the primary purpose of code review in the context of Claude application development?
A. To slow down delivery with no benefit
B. To catch integration issues, security gaps (e.g., unsanitized input reaching the model or a tool), and design problems before they reach production
C. To eliminate the need for testing entirely
D. To replace version control

**Q53.** A team wants to migrate a large, monolithic prompt-handling module into smaller, testable components without changing external behavior. This is best described as:
A. A rewrite from scratch with new functionality
B. Refactoring — improving internal structure while preserving observable behavior
C. A requirements change
D. A security patch

**Q54.** Which best illustrates using Claude Code to support large-scale refactoring across a codebase?
A. Manually rewriting every file by hand with no tool assistance
B. Using Claude Code to analyze patterns across the codebase and apply consistent, reviewed structural changes at scale
C. Refactoring one file and leaving the rest inconsistent with no plan to reconcile
D. Avoiding any AI assistance in refactoring work by policy

**Q55.** What is the primary purpose of designing idempotent operations when integrating Claude-driven actions with external systems?
A. To make every request produce a different result each time
B. To ensure that retrying a request (e.g., after a timeout) does not cause unintended duplicate side effects
C. Idempotency is irrelevant to LLM-integrated systems
D. To prevent the application from ever handling errors

**Q56.** A production integration occasionally receives malformed JSON from a downstream tool response. What software engineering practice best addresses this?
A. Assuming the JSON is always well-formed and skipping validation
B. Implementing structured error handling and validation around the parsing step so malformed responses fail gracefully rather than crashing the application
C. Removing all error handling to simplify the code
D. Silently ignoring all tool responses going forward

**Q57.** Why integrate Claude API calls into a standard SDLC (requirements, design, implementation, testing, deployment, maintenance) rather than treating them as a special, ungoverned case?
A. LLM-integrated features benefit from the same rigor (testing, review, staged rollout) as any other production software component
B. LLM features should bypass testing since output is inherently unpredictable
C. SDLC only applies to non-AI software
D. There is no benefit to applying SDLC discipline to AI features

**Q58.** Which best describes an appropriate small-scale refactor when a function handling Claude API calls has grown to mix request-building, error handling, and business logic together?
A. Leave it unchanged since it currently works
B. Separate concerns into distinct functions (e.g., request construction, error handling, business logic) to improve readability and testability
C. Add more unrelated logic to the same function
D. Delete the function and remove the feature

**Q59.** A team using dependency management for their Claude application wants to avoid unpredictable behavior from an updated SDK version. What is the most appropriate practice?
A. Always auto-upgrade every dependency in production with no testing
B. Pin dependency versions and test upgrades deliberately before rolling them into production
C. Avoid ever updating dependencies, even for security patches
D. Ignore dependency versioning entirely

**Q60.** **(Select TWO)** Which two are core software engineering practices directly relevant to building a maintainable Claude-integrated application?
A. Structured error handling around API and tool calls
B. Version control for both code and prompt/instruction changes
C. Hard-coding all configuration values with no way to change them
D. Avoiding code review to move faster

**Q61.** Which best reflects sound JSON schema design when requesting structured output from Claude for downstream processing?
A. Leaving the schema undefined and accepting whatever format is returned
B. Defining a clear, explicit schema with expected fields and types so downstream code can reliably parse the response
C. Using a schema only for internal documentation, never enforced
D. Avoiding structured output entirely in favor of free-form prose

**Q62.** A developer wants to write automated tests for a feature whose output depends on a Claude model call, where exact output text may vary between runs. What is the most appropriate testing approach?
A. Asserting on an exact string match of the model's full response every time
B. Asserting on structural or semantic properties of the output (e.g., presence of required fields, adherence to constraints) rather than exact text match
C. Skipping automated testing entirely since the feature involves an LLM
D. Testing only the parts of the application that don't call Claude

### Claude Application Design

**Q63.** A developer notices that instructions given through the system prompt behave somewhat differently than the same instructions given through a tool description. What does this reflect about Claude application design?
A. Instructions behave identically everywhere with no need to consider placement
B. Different interfaces and instruction locations (system prompt, tool description, user message) can carry different weight and context, so placement is a deliberate design decision
C. Tool descriptions are never read by the model
D. System prompts are ignored once a tool is defined

**Q64.** Why is establishing clear content boundaries (what the model should and shouldn't act on) an important application design consideration?
A. Content boundaries have no effect on application behavior
B. Without clear boundaries, the model may treat untrusted or irrelevant content as instructions, leading to unintended behavior
C. Content boundaries only matter for image inputs
D. Content boundaries are enforced automatically with no design effort required

**Q65.** What does "session hygiene" refer to in Claude application design?
A. Ignoring conversation state entirely
B. Deliberate practices for managing conversation/session state — such as resetting, trimming, or isolating sessions — to keep interactions coherent and prevent unwanted carryover
C. Only a UI cosmetic concern with no technical impact
D. A requirement to use the largest possible context window at all times

**Q66.** A Claude application is available through Claude Code, a custom web app using the API, and claude.ai. Why might instruction-following behavior differ slightly across these interfaces?
A. It never differs; all interfaces behave identically
B. Each interface has its own surrounding context, defaults, and interaction model, which can influence how instructions are interpreted
C. Only claude.ai supports instructions at all
D. The API ignores all instructions by design

**Q67.** What is the purpose of plugin management in Claude application design?
A. Plugins have no effect on application behavior
B. Managing which extensions/capabilities are enabled, their versions, and their dependencies to keep the application's capability surface predictable and maintainable
C. Plugin management only applies to unrelated, non-Claude software
D. To prevent the application from ever being extended

**Q68.** Which is the best design practice for handling a long input document that exceeds a comfortable single-request size?
A. Truncate silently with no strategy and hope nothing important is lost
B. Deliberately chunk, summarize, or selectively retrieve the most relevant portions before sending them to the model
C. Always reject any document longer than one page
D. Send the entire document repeatedly in every subsequent turn regardless of relevance

**Q69.** Why should an application design a fallback path for when a tool call fails or times out?
A. Tool calls never fail in production
B. Without a fallback, a single failed tool call could cause the whole interaction to break or produce an unhelpful result, so graceful degradation should be designed in
C. Fallback paths are only relevant for non-agentic applications
D. Fallbacks should always terminate the entire session immediately with no explanation

**Q70.** A developer is deciding whether a given interaction should be synchronous or asynchronous in application architecture. Which factor matters most?
A. Whether the user is actively waiting for an immediate response versus whether the work can be processed in the background
B. The alphabetical order of the function names
C. Whether the application uses TypeScript or Python
D. The number of words in the system prompt

**Q71.** Which best describes designing a clear boundary between trusted (developer-authored) content and untrusted (user- or externally-supplied) content in an application?
A. Treating all content, regardless of source, as equally trusted instructions
B. Structurally separating trusted instructions from untrusted input (e.g., retrieved web content, user-uploaded files) so untrusted content cannot silently override intended behavior
C. Removing all user input from the application
D. Only a concern for non-agentic applications

**Q72.** What is a key design consideration when an application must support both single-turn and multi-turn conversations?
A. Treating every request as fully stateless with no consideration for context carryover
B. Deciding what conversation state (if any) needs to persist between turns and designing the request structure accordingly
C. Always resending the entire chat history regardless of relevance or cost
D. There is no meaningful difference between single-turn and multi-turn design

**Q73.** A developer is designing schema for structured output that a downstream billing system will consume automatically. What is the most important design goal?
A. Making the schema as flexible and undefined as possible
B. Making the schema precise, strict, and well-documented so the model's output can be reliably parsed without ambiguity
C. Avoiding any validation on the receiving end
D. Changing the schema unpredictably between requests

**Q74.** **(Select TWO)** Which two are legitimate Claude application design concerns when the same underlying logic is exposed across multiple interfaces (API, Claude Code, a custom app)?
A. Ensuring content boundaries and instruction placement are considered consistently across interfaces
B. Managing session state appropriately for each interface's interaction model
C. Assuming behavior will be identical everywhere with no verification
D. Ignoring interface differences since they never matter

**Q75.** An application's Claude API calls occasionally fail due to upstream unavailability. What is the most appropriate design response?
A. Let the entire application crash without any fallback behavior
B. Design a graceful degradation path (e.g., a clear user-facing message, cached response, or retry) so a temporary outage doesn't fully break the user experience
C. Silently return fabricated content indistinguishable from real output
D. Remove the feature permanently after the first failure
**Q76.** A team supports both streaming and non-streaming response modes in the same application. What design consideration is most important for consistency?
A. Assuming both modes will always be used identically with no special handling
B. Ensuring downstream logic (e.g., parsing, validation) correctly handles both the incremental nature of streamed output and the complete nature of non-streamed output
C. Disabling streaming entirely to avoid any design consideration
D. Treating streaming output as already fully validated with no further checks
**Q77.** A Claude-powered support agent hits a query it cannot confidently resolve. From an application design perspective, what should happen?
A. The application should have no defined path for this case, and the user is left without a response
B. The application should have a designed handoff path that transfers the interaction, with relevant context, to a human agent
C. The application should always fabricate a confident-sounding answer regardless of certainty
D. The application should terminate the session with no explanation

### Configuration Management

**Q78.** What is the primary purpose of a CLAUDE.md file in a Claude Code project?
A. To store compiled binary output
B. To provide persistent, project-level context and instructions that Claude Code reads to understand the codebase and conventions
C. To replace the need for a README entirely with no other purpose
D. To store API keys in plaintext

**Q79.** What is the role of a settings.json-style configuration file in a Claude Code / Claude application setup?
A. It has no functional role and is purely decorative
B. It defines configurable behavior (such as permissions, defaults, or integration settings) in a structured, version-controllable format
C. It stores the entire conversation history
D. It is only used for image assets

**Q80.** Why would a team choose to pin a specific Claude model version rather than always using the latest available version?
A. Pinning has no practical benefit
B. Pinning avoids unexpected behavior changes from model updates disrupting a production application until the team has tested and adopted the new version deliberately
C. Pinning is required by the API and cannot be avoided
D. Pinning always improves output quality regardless of task

**Q81.** What is the benefit of prompt versioning as a configuration management practice?
A. It prevents prompts from ever being changed
B. It allows teams to track, test, and roll back changes to prompts and system instructions the same way they manage code changes
C. It is only relevant for non-production experiments
D. It replaces the need for evaluation

**Q82.** A Claude Code project relies on several plugins with interdependencies. What configuration management risk should the team plan for?
A. Plugins never have dependencies or version conflicts
B. Plugin version mismatches or missing dependencies could break expected functionality, so dependency versions should be tracked and managed deliberately
C. Plugins cannot be tracked in version control
D. There is no risk since plugins are optional

**Q83.** Which best reflects a mature configuration management practice for a Claude application deployed across dev, staging, and production environments?
A. Using identical, hard-coded configuration values across all environments regardless of differences
B. Maintaining environment-specific configuration (e.g., model versions, endpoints, permissions) in a structured, auditable way
C. Manually editing production configuration with no record of changes
D. Avoiding any environment separation

**Q84.** What risk does "configuration drift" pose to a Claude application over time?
A. No risk; configuration never changes unexpectedly
B. Untracked, ad hoc changes across environments can cause inconsistent behavior that's hard to reproduce or debug
C. Configuration drift only affects unrelated, non-AI systems
D. Configuration drift is automatically prevented by the platform with no developer effort

**Q85.** A team wants new engineers to quickly understand a Claude Code repository's structure, conventions, and key context. Which practice most directly supports this?
A. Providing no documentation and relying on tribal knowledge
B. Maintaining an up-to-date CLAUDE.md hierarchy and clear settings configuration that reflects the current state of the project
C. Requiring every new engineer to read the entire model's training data
D. Disabling all configuration files

---

## Domain 3: Claude Code (Q86–Q91)

**Q86.** In Claude Code, what is the primary purpose of the CLAUDE.md hierarchy across a repository?
A. To store build artifacts
B. To layer project-level, directory-level, and other scoped context/instructions so Claude Code has the right guidance depending on where it's working in the repo
C. To disable version control
D. To replace settings.json entirely

**Q87.** Which best describes the purpose of custom slash commands in Claude Code?
A. They have no functional effect and are purely cosmetic
B. They let developers define reusable, named shortcuts for common multi-step actions or prompts within Claude Code
C. They can only be used to change the terminal's color scheme
D. They disable all built-in commands once defined

**Q88.** What is headless mode in Claude Code primarily used for?
A. Interactive, conversational coding sessions with a visible UI
B. Running Claude Code non-interactively (e.g., in scripts, CI pipelines) without a live interactive session
C. Disabling all tool use
D. Rendering 3D graphics

**Q89.** Why might a developer initialize a new repository specifically with Claude Code's setup rather than an empty repository?
A. To ensure baseline configuration (such as CLAUDE.md and settings) is in place from the start, giving Claude Code useful project context immediately
B. Initialization has no effect on subsequent Claude Code behavior
C. It disables the ability to use version control
D. It forces the exclusive use of one specific programming language

**Q90.** Which best distinguishes Claude Code's "Skills" from its "Commands," at a foundational level?
A. They are identical concepts with different names
B. Skills typically package broader, reusable capability/knowledge for a class of tasks, while commands are more direct, named shortcuts for specific actions
C. Commands can only be used once per session, while Skills can be reused indefinitely
D. Skills disable all other Claude Code components when active

---

**Q91.** What is the purpose of Claude Code's Agent Memory feature?
A. To permanently delete all context after each session
B. To let Claude Code retain and reuse relevant information across sessions within a project, rather than starting from zero context every time
C. To disable all Rules and Skills in the project
D. To store only binary build artifacts

## Domain 4: Eval, Testing, and Debugging (Q92–Q96)

**Q92.** A Claude application returns an unexpected result. The developer needs to determine whether the problem originates in the integration code or in the model's output itself. What is the most effective first step?
A. Assume it's always a model problem and request a different model
B. Analyze the trace of the interaction (request, model output, tool calls, post-processing) to isolate where the unexpected behavior first appears
C. Rewrite the entire application without investigating
D. Ignore the issue if it happens infrequently

**Q93.** A tool call within an agent fails intermittently. What is the most appropriate debugging approach?
A. Remove the tool entirely without further investigation
B. Review error logs and traces for that tool call to identify the failure pattern (e.g., timeout, malformed input, downstream outage) before choosing a fix
C. Assume it's unfixable and disable the whole agent
D. Increase the model's temperature to see if that helps

**Q94.** Which is the most appropriate recovery strategy for a transient network error when calling the Claude API?
A. Immediately fail the entire user session with no retry
B. Implement a retry with backoff for the transient failure, while distinguishing it from non-retryable errors (e.g., invalid request)
C. Retry indefinitely with no limit regardless of error type
D. Silently return a fabricated result instead of an error

**Q95.** A developer notices a recurring pattern where malformed output only happens when a specific upstream data source contains missing fields. What does this suggest for debugging?
A. The Claude model is entirely at fault with no other cause worth investigating
B. The root cause may originate upstream (bad input data) rather than in the model itself, so the input pipeline should be investigated and validated
C. This pattern is unrelated to debugging and can be ignored
D. Switching models will definitely fix a data-quality issue

---

**Q96.** A developer observes that a specific failure occurs on every single run with the same input, while another issue only occurs occasionally under the same conditions. What does this distinction suggest for debugging?
A. Both should be treated identically with the same fix
B. The consistent failure likely points to a deterministic root cause (e.g., a logic or integration bug), while the intermittent one may point to non-determinism, timing, or an external dependency issue — each warranting a different investigation approach
C. Neither failure is worth investigating unless it happens 100% of the time
D. Intermittent failures should always be ignored

## Domain 5: Model Selection and Optimization (Q97–Q126)

### LLM Fundamentals

**Q97.** What is a token, in the context of how a Claude model processes text?
A. A synonym for an entire sentence
B. A unit of text (which can be a word, part of a word, or punctuation) that the model processes and generates sequentially
C. A unique identifier for each user's account
D. A measurement of the model's confidence

**Q98.** What does the "context window" refer to?
A. The visual size of the chat interface window
B. The maximum amount of text (in tokens) the model can consider at once, including input and generated output
C. The number of tools available to an agent
D. The time limit for a single API call

**Q99.** Why can two calls to Claude with the exact same prompt sometimes produce slightly different outputs?
A. This should never happen under any circumstances
B. Sampling introduces controlled randomness into next-token selection, so outputs are not fully deterministic by default
C. It only happens due to network errors
D. It only happens when using the Batch API

**Q100.** Which best describes "next-token generation" as the fundamental mechanism behind model output?
A. The model generates the entire response as one atomic unit with no sequential process
B. The model predicts and generates output one token at a time, each new token conditioned on everything generated so far
C. The model retrieves pre-written responses from a lookup table
D. Next-token generation only applies to code generation, not natural language

**Q101.** When would a developer choose "fast mode" over extended/adaptive thinking for a given request?
A. When the task requires maximum reasoning depth regardless of latency
B. When the task is straightforward and low-latency response matters more than deep multi-step reasoning
C. Fast mode is only usable for image inputs
D. Fast mode disables tool use entirely

**Q102.** What does an "effort level" setting generally control in model configuration?
A. The visual font size of the output
B. How much computational/reasoning effort the model applies to a task, trading off latency and cost against potential response depth
C. The number of API keys required
D. Whether streaming is enabled

**Q103.** Which best describes the difference between zero-shot, single-shot, and multi-shot prompting?
A. They are unrelated concepts with no meaningful distinction
B. Zero-shot provides no examples, single-shot provides one example, and multi-shot provides several examples to guide the model's output format or style
C. Zero-shot always produces better results than multi-shot in every case
D. Multi-shot prompting disables the model's reasoning ability

**Q104.** A developer is deciding whether to use multi-shot prompting for a task requiring a very specific, consistent output structure. What is the strongest reason to do so?
A. Multi-shot prompting guarantees zero cost
B. Providing multiple representative examples helps anchor the model's output to the desired structure and style more reliably than instructions alone
C. Multi-shot prompting is required for the API to function
D. Multi-shot prompting eliminates the need for any instructions

**Q105.** A developer wants more variety across multiple generated options for the same prompt (e.g., several tagline variations), without necessarily needing deeper reasoning. Which lever is most directly relevant?
A. Increasing the effort/thinking level, which primarily affects reasoning depth rather than output variety
B. Adjusting sampling-related settings, which influence the variability of generated output
C. Switching to the Batch API, which has no effect on output variety
D. Enabling vision input, which is unrelated to text variety

### Technical Fundamentals

**Q106.** Why do many official and community SDKs for the Claude API exist as wrappers around REST calls?
A. To hide the API entirely from the developer with no way to inspect requests
B. To simplify common tasks (auth, retries, serialization) over the underlying REST interface while still ultimately communicating over HTTP
C. SDKs replace the need for the API entirely
D. SDKs are unrelated to REST APIs

**Q107.** When would a websocket-based connection be more appropriate than simple request/response HTTP calls for a Claude-powered feature?
A. When no real-time or continuous bidirectional communication is needed
B. When the application needs persistent, low-latency, bidirectional communication, such as certain real-time streaming interaction patterns
C. Websockets are never appropriate for AI applications
D. Websockets eliminate the need for authentication

**Q108.** Which is a sound engineering practice when integrating with any external API, including Claude's?
A. Assuming the network call will always succeed
B. Implementing timeouts, retries with backoff for transient errors, and clear handling for non-retryable errors
C. Never setting a timeout so calls can run indefinitely
D. Ignoring HTTP status codes

**Q109.** What is the purpose of implementing rate-limit handling in a production Claude integration?
A. Rate limits never apply to production applications
B. To gracefully handle throttling (e.g., backoff and retry) rather than failing outright when request volume exceeds allowed limits
C. To intentionally exceed limits as fast as possible
D. Rate limits only apply to the Batch API

**Q110.** Why is idempotency important when a Claude-driven workflow triggers a side effect (like a database write) that might be retried after a timeout?
A. Idempotency has no relevance here
B. Without idempotent design, a retried request could cause the same side effect to happen more than once, leading to duplicated or inconsistent data
C. Idempotency guarantees the model's output will be identical every time
D. Idempotency is only relevant to synchronous, non-networked code

**Q111.** A developer building pagination into a Claude-powered search feature over a large dataset should primarily consider:
A. Returning the entire dataset in a single request regardless of size
B. Retrieving and presenting results in manageable pages to control response size, latency, and relevance
C. Pagination is irrelevant to LLM-powered features
D. Disabling any use of external data sources

**Q112.** Why might a developer choose asynchronous request handling over synchronous handling for a Claude-powered backend service under high concurrent load?
A. Synchronous handling is always faster under any load
B. Asynchronous, non-blocking handling allows the service to manage many concurrent, network-bound requests more efficiently than blocking on each one sequentially
C. Asynchronous handling eliminates the need for error handling
D. There is no functional difference between the two approaches

**Q113.** An application's Claude API calls sometimes appear to fail even though the request eventually would have succeeded, because the client-side timeout is shorter than the time some complex requests legitimately take. What is the most appropriate fix?
A. Ignore the issue since timeouts should never be adjusted
B. Set a client-side timeout appropriate to the expected response time for the task's complexity, rather than one too short for legitimate longer-running requests
C. Remove all timeout handling entirely
D. Always retry immediately with no backoff regardless of cause

### Model Selection and Tradeoffs

**Q114.** A developer is choosing between Opus-, Sonnet-, and Haiku-class models for a nuanced, multi-step reasoning task where quality matters more than raw speed. Which is the most appropriate general guidance?
A. Always choose the fastest, lightest tier regardless of task complexity
B. Favor a more capable tier suited to complex reasoning, accepting a corresponding cost/latency tradeoff
C. Tier choice has no effect on output quality
D. Always choose the tier used most recently, regardless of fit

**Q115.** Which best reflects the general capability/cost/latency tradeoff across Claude model tiers?
A. All tiers are functionally identical in cost, latency, and capability
B. More capable tiers generally trade higher cost and/or latency for stronger reasoning performance on complex tasks, while lighter tiers optimize for speed and cost on simpler tasks
C. Lighter tiers always outperform heavier tiers on every task
D. Cost has no relationship to model capability

**Q116.** A new model release changes default behavior in a way that alters output formatting from a previous version. What is the most responsible way to handle this in a production system?
A. Immediately switch to the new default in production with no testing
B. Test the new version against representative production cases, and use version pinning to control the timing of the migration
C. Ignore the change since model releases never affect application behavior
D. Permanently avoid ever updating the model version

**Q117.** Which model characteristic should most directly influence tier selection for a high-volume, low-complexity classification task (e.g., tagging short support tickets)?
A. The model's support for extended, deep multi-step reasoning
B. A lighter, faster, lower-cost tier suited to high-volume, straightforward tasks
C. The model's maximum context window size, regardless of task simplicity
D. The model's visual design capabilities

**Q118.** A developer assumes a lighter model tier will be sufficient for a moderately complex summarization task but hasn't verified this. What is the most appropriate way to validate that assumption?
A. Trust the assumption with no testing
B. Evaluate the lighter tier's output quality on representative examples of the actual task before committing to it in production
C. Always default to the most expensive tier to avoid any evaluation
D. Assume tier choice has no measurable effect on quality

### Cost and Token Management

**Q119.** What is the most direct way to track and manage cost exposure for a Claude-powered application at scale?
A. Ignoring token usage entirely
B. Monitoring token usage (input and output) per request and in aggregate, and modeling cost against expected volume
C. Assuming cost is fixed regardless of usage patterns
D. Disabling logging to reduce overhead

**Q120.** Which technique most directly reduces cost for requests that repeatedly reuse a large, unchanged prefix (such as a lengthy system prompt or reference document)?
A. Sending the full prefix fresh on every single call with no reuse
B. Prompt caching, which avoids reprocessing an unchanged prefix on subsequent calls
C. Reducing the number of tools available
D. Switching to the Batch API regardless of interactivity needs

**Q121.** What is the purpose of cache checkpointing within a prompt-caching strategy?
A. To disable caching entirely
B. To mark specific points in a prompt where cached content can be reused across requests, maximizing the benefit of caching for structured, multi-part prompts
C. To store the entire conversation permanently with no expiration
D. To increase token usage intentionally

**Q122.** A team wants to budget tokens for a long-running agentic conversation that risks growing unbounded. Which practice most directly addresses this?
A. Allowing the conversation history to grow indefinitely with no limit
B. Establishing a token budget and strategy (e.g., summarization, pruning) to keep the conversation within a manageable and cost-effective size
C. Ignoring token growth since it has no cost implication
D. Disabling all logging of token usage

**Q123.** Which best reflects responsible cost modeling before launching a new Claude-powered feature at scale?
A. Launching first and considering cost only if a problem arises
B. Estimating expected token volume per request and total request volume to project cost before committing to a model tier and architecture
C. Assuming cost is negligible regardless of feature design
D. Avoiding any monitoring of production cost after launch

**Q124.** **(Select TWO)** Which two techniques directly help control cost in a high-volume Claude application?
A. Prompt caching for repeated, unchanged prefixes
B. Selecting a model tier matched to task complexity rather than always using the most capable tier
C. Sending the maximum possible context on every single request regardless of relevance
D. Disabling all monitoring of token usage

**Q125.** A developer notices token usage is unexpectedly high for a simple task. What is the most likely area to investigate first?
A. The user's internet connection speed
B. Whether excessive or irrelevant context (e.g., unpruned tool outputs, unnecessary history) is being included in each request
C. The color scheme of the application's UI
D. The version-control system in use

**Q126.** Why might a team choose a mid-tier model over the most capable available tier for a cost-sensitive, moderately complex production workload?
A. Mid-tier models are always strictly superior for every task
B. It can offer an acceptable quality/latency/cost balance for tasks that don't require the deepest available reasoning, at meaningfully lower cost than the top tier
C. Mid-tier models cannot be used in production
D. There is no cost difference between tiers

---

## Domain 6: Prompt and Context Engineering (Q127–Q146)

### Context Engineering

**Q127.** What is "context drift" in a long-running agentic conversation?
A. A deliberate feature that improves output quality
B. The gradual accumulation of irrelevant, outdated, or conflicting information in context that degrades the model's focus and output quality over time
C. A synonym for prompt caching
D. A property only relevant to image inputs

**Q128.** What does "context bloat" refer to, and why is it a problem?
A. It refers to overly short prompts, which are never a problem
B. Context growing unnecessarily large with low-value content, increasing cost/latency and potentially diluting the model's attention on what matters
C. It only affects the visual appearance of a chat UI
D. It is beneficial and should be maximized

**Q129.** Why would a developer prune tool output before adding it back into an agent's context?
A. Pruning is never beneficial; full tool output should always be kept
B. Raw tool output can be verbose or contain irrelevant detail; pruning keeps only what's useful, reducing context bloat and cost
C. Pruning always removes necessary information with no benefit
D. Pruning is only relevant to image-based tools

**Q130.** What is "compaction" as a context management technique?
A. Deleting a conversation entirely with no summary
B. Condensing prior context (e.g., via summarization) into a smaller, information-dense form to preserve important information while freeing up context space
C. Increasing the raw size of context indiscriminately
D. A technique exclusive to the Batch API

**Q131.** How does context isolation through subagents help manage context in a complex, multi-step workflow?
A. It forces all subagents to share one unified, unfiltered context
B. It lets each subagent operate with only the context relevant to its subtask, preventing an overloaded, unfocused shared context in the main agent
C. Context isolation always increases total cost with no benefit
D. It disables tool use for all subagents

**Q132.** A long research agent's context has become cluttered with dozens of raw search results, most no longer relevant. What is the most appropriate context engineering response?
A. Leave everything in context indefinitely
B. Summarize or prune outdated/irrelevant results, retaining only what's still useful for the remaining task
C. Start over from a completely blank context with no summary of progress
D. Add the exact same results again to reinforce them

**Q133.** A long-running agentic session has accumulated so much context that relevant early information is effectively being crowded out. Which context engineering response is most appropriate?
A. Continue adding more content indefinitely with no management
B. Apply a context management strategy — such as summarizing and starting a fresh session with the condensed summary carried forward — to restore focus
C. Immediately terminate the task rather than manage context
D. Disable all tools until the session ends

### Prompt Engineering

**Q134.** Which best reflects the principle of instruction clarity in prompt engineering?
A. Vague, ambiguous instructions consistently produce the most reliable output
B. Clear, specific, unambiguous instructions reduce the chance of the model misinterpreting the task
C. Instruction clarity has no measurable effect on output quality
D. Clarity only matters for creative writing tasks

**Q135.** What is the primary purpose of few-shot examples in a prompt?
A. To increase token cost with no functional benefit
B. To demonstrate the desired input/output pattern so the model can more reliably match the expected format or style
C. Few-shot examples disable the model's ability to generalize
D. Few-shot examples are only usable in system prompts, never elsewhere

**Q136.** Why does the placement of an instruction (system prompt versus user message) matter in prompt engineering?
A. Placement has no effect on how instructions are weighted or interpreted
B. System-level and user-level placement can carry different precedence and persistence, so deliberate placement affects how reliably an instruction is followed across a conversation
C. User messages are always ignored by the model
D. System prompts can only contain a single word

**Q137.** What is the purpose of specifying output constraints (e.g., format, length, allowed values) in a prompt?
A. To make output less predictable
B. To reduce ambiguity in what a valid response looks like, making downstream parsing and use more reliable
C. Output constraints are ignored by the model by design
D. To eliminate the need for any evaluation

**Q138.** A developer is deciding where to place an instruction: in the system prompt, in a tool description, or in the user message. What should primarily guide this decision?
A. Random choice, since placement never matters
B. The instruction's purpose and scope — persistent behavior often belongs in the system prompt, tool-specific guidance in the tool description, and task-specific detail in the user message
C. Always placing every instruction in the user message regardless of purpose
D. Avoiding system prompts entirely

**Q139.** What does "iterative refinement" mean in the context of prompt engineering?
A. Writing a single prompt once and never revisiting it
B. Repeatedly testing and adjusting a prompt based on observed output quality until it reliably produces the desired result
C. Randomly changing prompts with no evaluation of the effect
D. A technique that only applies to system prompts

**Q140.** A prompt reliably fails on a specific edge case. What is the most effective prompt adjustment strategy?
A. Abandon prompting entirely and switch to a different product
B. Analyze the failure pattern and adjust the prompt (e.g., add clarifying instructions or an example) specifically targeting that edge case, then re-test
C. Rewrite the entire prompt randomly with no analysis of the failure
D. Ignore the edge case since it happened only once

**Q141.** Why is input sanitization relevant to prompt engineering when incorporating user-supplied text into a prompt?
A. Sanitization is irrelevant since all user input is inherently safe
B. Unsanitized user input could contain content designed to manipulate the model's behavior (e.g., injected instructions), so it should be handled carefully and kept distinct from trusted instructions
C. Sanitization only applies to image inputs
D. Sanitization eliminates the need for any output validation

**Q142.** **(Select TWO)** Which two are core prompt engineering techniques for improving reliability of a model's output on a repeated production task?
A. Providing clear instructions and, where useful, representative examples
B. Iteratively refining the prompt based on observed failure patterns
C. Randomizing the prompt's wording on every single call
D. Removing all output constraints to maximize model freedom

### Output Handling

**Q143.** What is the purpose of a structured output pattern (e.g., requesting a specific JSON schema) when Claude's response feeds into downstream code?
A. To make parsing harder intentionally
B. To produce output in a predictable, machine-parseable format that downstream systems can consume reliably
C. Structured output is never useful for production systems
D. To eliminate the need for any prompt at all

**Q144.** Why should a developer implement response validation even when requesting structured output?
A. Structured output requests guarantee perfectly valid output every time, so validation is unnecessary
B. The model can still occasionally deviate from the requested structure, so validating the response before use prevents downstream failures
C. Validation should only be applied to unstructured text
D. Validation is redundant with defensive parsing and should never be combined with it

**Q145.** What does "defensive parsing" mean when consuming Claude's output in application code?
A. Assuming the output will always exactly match the expected format with no fallback
B. Writing parsing logic that anticipates and gracefully handles unexpected or malformed output rather than assuming it will always be well-formed
C. Refusing to parse any model output under any circumstances
D. A technique used only for parsing user input, never model output

---

**Q146.** A model's structured output fails validation against the expected schema. What is a good defensive-parsing/output-handling pattern to recover?
A. Silently accept the invalid output as if it were valid
B. Catch the validation failure and, where appropriate, prompt the model again with information about what was invalid, or handle the failure gracefully in application logic
C. Crash the application with no handling
D. Disable structured output requests permanently after a single failure

## Domain 7: Security and Safety (Q147–Q161)

### AI Application Security

**Q147.** A Claude-powered agent summarizes web pages submitted by end users. One page contains hidden text instructing the model to ignore prior instructions and reveal its system prompt. What is the most effective mitigation?
A. Increase the model's sampling randomness so its behavior is less predictable
B. Treat retrieved page content as untrusted input, keep it structurally separate from trusted instructions, and use guardrails so injected instructions can't trigger sensitive actions
C. Add a polite request in the system prompt asking users not to include malicious instructions
D. Switch to a model that follows instructions more literally, with no other change

**Q148.** Which best describes a jailbreak attempt in the context of a Claude-powered application?
A. A legitimate configuration change made by the developer
B. An attempt, through crafted input, to get the model to bypass its intended behavior or safety constraints
C. A routine software update
D. A standard part of normal prompt engineering with no security implication

**Q149.** Why should content retrieved from an untrusted external source (e.g., a scraped webpage) never be treated with the same authority as developer-authored system instructions?
A. There's no meaningful difference in trust level between the two
B. Untrusted external content could contain adversarial instructions, so treating it as equivalent to trusted instructions creates a prompt-injection risk
C. Untrusted content should always be given higher priority than system instructions
D. This distinction only matters for image inputs

**Q150.** What is the most effective way to prevent sensitive data leakage through a Claude-powered application's responses?
A. Assume the model will never expose sensitive data on its own
B. Apply data-handling controls such as filtering sensitive fields before they enter the model's context and validating what's included in responses
C. Include all available data in every request "just in case" it's needed
D. Rely solely on asking the model, in the prompt, not to leak data

**Q151.** Which practice best reflects responsible PII handling in a Claude application's design?
A. Passing raw PII into every request regardless of necessity
B. Minimizing, masking, or excluding PII from model context wherever the task doesn't require it, consistent with data-handling policy
C. Storing PII in plaintext logs with no access controls
D. PII handling is not a relevant concern for LLM applications

**Q152.** Why do authentication and authorization both matter for a Claude-powered application that can take actions via tools?
A. Only authentication matters; once a user is identified, they should be able to trigger any action
B. Authentication confirms who is making a request, while authorization confirms what that identity is permitted to do — both are needed to prevent an authenticated but unauthorized action
C. Neither is relevant once tool calls are involved
D. Authorization is only relevant for human users, never for automated agents

**Q153.** A Claude-powered application lets users upload documents for analysis. A malicious user uploads a document containing embedded text instructing the model to exfiltrate other users' data. What is the most effective security posture?
A. Trust all uploaded document content as if it were a trusted instruction
B. Treat uploaded document content as untrusted input, isolate it from trusted instructions, and apply guardrails so it cannot trigger sensitive actions across users
C. Disable file uploads for every user permanently as the only possible mitigation
D. Rely solely on asking the model not to follow embedded instructions

### Guardrails and Safe Deployment

**Q154.** What does "guardrail layering" mean in a safe deployment strategy?
A. Relying on a single control point with no redundancy
B. Combining multiple independent safety controls (e.g., input validation, content policy checks, hooks, monitoring) so a failure in one layer doesn't leave the system fully exposed
C. Removing all controls to simplify deployment
D. A term unrelated to AI application security

**Q155.** Which best describes the principle of least privilege as applied to a Claude agent's tool access?
A. Granting the agent access to every available tool and system by default
B. Granting the agent only the specific tool access and permissions necessary to accomplish its intended task, nothing more
C. Least privilege only applies to human user accounts
D. Removing all tool access entirely regardless of task requirements

**Q156.** Why is a defined content policy relevant to safely deploying a Claude-powered application?
A. Content policy has no bearing on production deployment decisions
B. It establishes clear boundaries for acceptable inputs/outputs so the application can be designed and monitored to stay within intended, appropriate use
C. Content policy is only relevant to marketing materials
D. Content policy replaces the need for any technical guardrails

**Q157.** Which best reflects "secure-by-design" thinking applied to a Claude application's identity and access management?
A. Adding access controls only after a security incident occurs
B. Designing access boundaries, permissions, and identity checks into the system from the start, rather than bolting them on afterward
C. Assuming security is solely the model provider's responsibility
D. Avoiding any access control to simplify development

### Claude Hooks

**Q158.** How can hooks serve as a guardrail against destructive actions in a Claude application?
A. Hooks have no relationship to guardrails or safety
B. A hook can deterministically intercept a risky action (e.g., a delete or payment operation) and enforce a check or require approval before it proceeds, independent of model judgment alone
C. Hooks can only be used to log successful, harmless actions
D. Hooks disable all tool use entirely

**Q159.** Why might a developer prefer a hook-based guardrail over relying solely on a system-prompt instruction to prevent a destructive action?
A. System-prompt instructions are always perfectly reliable, so hooks are never needed
B. A hook enforces the check deterministically in code, whereas a prompt instruction depends on model judgment and could be missed or overridden
C. Hooks and prompt instructions are functionally identical
D. Hooks cannot intercept tool calls

### Identity, Secrets, and Key Management

**Q160.** **(Select TWO)** Which two are appropriate practices for managing API keys and secrets in a Claude application's development and production environments?
A. Storing secrets in a secure secrets manager rather than hard-coding them in source code
B. Using different, appropriately scoped credentials for development versus production environments
C. Committing API keys directly into a public source code repository for convenience
D. Sharing the same production key across all developers with no individual tracking

---

**Q161.** Beyond securely storing API keys, what additional identity/secrets practice helps detect misuse after the fact?
A. No further practice is needed once keys are stored securely
B. Monitoring and auditing access/usage patterns for credentials so unusual or unauthorized activity can be detected
C. Sharing the same key across all environments to simplify monitoring
D. Disabling all logging to reduce noise

## Domain 8: Tools and MCPs (Q162–Q180)

### Tool Implementation

**Q162.** What is the fundamental mechanism by which Claude interacts with external systems through "tool use"?
A. The model directly executes code on the developer's infrastructure with no intermediary
B. The model requests a defined tool call with structured parameters; the application executes the actual action and returns the result to the model
C. Tool use bypasses the API entirely
D. Tool use only works with image inputs

**Q163.** Why does the quality of a tool's description matter for reliable tool use?
A. Tool descriptions have no effect on whether or how the model chooses to use a tool
B. A clear, accurate description helps the model understand when and how to correctly invoke the tool, reducing misuse or missed opportunities to use it
C. Tool descriptions are only used for internal documentation, never seen by the model
D. Longer descriptions always perform worse regardless of clarity

**Q164.** A tool occasionally returns an error from a downstream service. What is the best practice for handling this in the tool's implementation?
A. Let the application crash so the issue is obvious
B. Return a clear, structured error result to the model so it can reason about the failure and decide how to proceed (e.g., retry, fall back, or inform the user)
C. Silently return an empty success response regardless of the actual error
D. Disable the tool permanently after any single failure

**Q165.** What does "agentic harness dispatch" refer to in the context of tool implementation patterns?
A. A pattern where the model itself directly executes tool code with no application involvement
B. The mechanism by which the surrounding application/harness receives the model's tool-call request and routes it to the correct implementation for execution
C. A deprecated pattern with no modern use
D. A pattern exclusive to image-processing tools

**Q166.** What is the key difference between a client-side tool and a server-side tool?
A. There is no meaningful difference
B. A client-side tool's execution is handled by the calling application/client, while a server-side tool's execution happens within the provider's or a remote service's environment
C. Client-side tools cannot return results to the model
D. Server-side tools are always slower than client-side tools with no exceptions

**Q167.** Why might a sensitive tool action (e.g., issuing a refund) require an approval pattern before execution?
A. Approval patterns are unnecessary since the model's judgment alone is always sufficient for high-stakes actions
B. Requiring explicit approval (human or policy-based) before executing high-impact actions adds a safety checkpoint against unintended or incorrect actions
C. Approval patterns only apply to read-only tools
D. Approval patterns eliminate the need for any tool description

**Q168.** Which best describes a sound practice for constructing a tool set for a given agent?
A. Including every available tool regardless of relevance to the agent's task
B. Including only the tools relevant and necessary for the agent's intended scope, each with a clear, distinct purpose
C. Avoiding any overlap analysis between tools
D. Tool set design has no effect on agent reliability

**Q169.** **(Select TWO)** Which two practices improve the reliability of tool use in a production Claude application?
A. Writing clear, specific tool descriptions that indicate when and how to use each tool
B. Implementing structured error handling for tool execution failures
C. Giving every agent unrestricted access to all available tools by default
D. Avoiding any description of a tool's expected parameters

**Q170.** A tool frequently receives malformed or missing parameters from the model's calls. What is the most effective implementation fix?
A. Accepting any parameter format with no validation
B. Defining a precise, well-typed parameter schema for the tool and validating incoming calls against it, so malformed calls can be caught and handled clearly
C. Removing the tool entirely rather than refining its schema
D. Ignoring malformed calls silently with no error feedback to the model

### MCP Server Development

**Q171.** What is the primary purpose of building an MCP (Model Context Protocol) server for an internal service?
A. To hard-code the service's logic separately into every application that needs it
B. To expose the service's capabilities (as tools, resources, and/or prompts) in a standardized way that multiple Claude applications can connect to and reuse
C. MCP servers can only be used by a single application at a time with no reuse
D. To replace the need for any API authentication

**Q172.** In MCP, what do "resources" typically represent, as distinct from "tools"?
A. Resources and tools are exactly the same concept
B. Resources typically expose readable data/context the model can reference, while tools represent actions the model can invoke
C. Resources can only be images
D. Tools cannot be invoked by an MCP client

**Q173.** Which best describes the difference between stdio and socket-based communication patterns for an MCP server?
A. They are functionally identical with no practical difference
B. stdio typically suits local, process-based communication, while socket-based (e.g., network) communication suits remote or distributed deployments
C. Socket-based communication cannot be used with MCP
D. stdio is exclusively used for image data

**Q174.** Why would a team choose to build a dedicated MCP server rather than embedding an integration's logic directly into a single application's codebase?
A. To make the integration usable only by that one application
B. To make the integration reusable and independently maintainable across multiple Claude applications, rather than duplicating logic in each one
C. MCP servers cannot expose more than one tool
D. Embedding logic directly is always the better practice with no tradeoffs

**Q175.** Multiple independent applications depend on a shared MCP server. The team wants to update the server's tool interface without breaking existing consumers. What is the most appropriate practice?
A. Change the interface immediately with no versioning or communication
B. Apply versioning and backward-compatible changes (or a clear migration path) so existing consuming applications aren't broken by the update
C. Assume all consuming applications will automatically adapt with no coordination
D. Shut down the server during business hours with no notice

### Agentic Customization

**Q176.** A team needs Claude to call an internal inventory service as a reusable capability shared and independently maintained across several separate applications. Which approach best fits?
A. Hard-coding the inventory logic into each application's system prompt
B. Building an MCP server that exposes the inventory operations as tools so multiple applications can connect to it
C. Pasting the current inventory data into the context window on every request
D. Relying on a generic built-in tool, assuming it can reach any internal API automatically

**Q177.** When is a built-in tool generally preferable to a custom tool or MCP server?
A. Never; built-in tools should always be avoided
B. When the built-in tool already covers the exact capability needed, avoiding the extra development and maintenance cost of building something custom
C. Built-in tools are always technically incapable of solving any real task
D. Built-in tools require more implementation effort than custom tools in every case

**Q178.** A capability is needed only within a single Claude Code project and doesn't need to be shared with other applications or reused as a network service. Which approach is typically the most proportionate?
A. Building a full MCP server for a single, project-local use case regardless of complexity
B. A project-scoped Skill or custom tool suited to that single project's needs, reserving MCP server development for capabilities meant to be shared more broadly
C. Refusing to implement the capability at all
D. Always defaulting to the heaviest possible integration approach regardless of scope

**Q179.** Which factor should most influence the choice between a custom tool and an MCP server for a new integration?
A. The personal preference of whichever developer is available that day, with no other consideration
B. Whether the capability needs to be reused and independently maintained across multiple applications (favoring MCP) versus used within a single application (where a custom tool may suffice)
C. Custom tools and MCP servers are functionally identical in every respect
D. Whether the integration involves any text at all

**Q180.** **(Select TWO)** Which two are legitimate considerations when weighing built-in tools, custom tools, Skills, and MCP servers for a given use case?
A. Whether the needed capability is already covered by an existing built-in tool
B. Whether the capability needs to be shared and reused across multiple applications versus scoped to one
C. Choosing MCP server development by default regardless of reuse needs or complexity
D. Ignoring maintenance burden entirely when selecting an approach

---

## Answer Key & Rationale

### Domain 1: Agents and Workflows
1. **B** — Fixed, predictable steps and branching fit a workflow; no need for open-ended autonomy.
2. **B** — Unpredictable, runtime-dependent branching is exactly what favors an agent over a fixed workflow.
3. **B** — The supervisor decomposes and delegates work to subagents, then integrates their outputs.
4. **B** — Subagents isolate context and specialize, improving execution on complex, multi-part tasks.
5. **B** — High variety/unpredictability that can't be fully enumerated favors agent autonomy over rigid branching.
6. **B** — Agents trade some predictability/debuggability for flexibility on unpredictable tasks — a real tradeoff, not a strict dominance.
7. **B** — Coordinating distinct specialized subtasks toward one goal is the classic manager/supervisor use case.
8. **B** — Growing unpredictability in branching is a signal to introduce agent-based decision-making for the affected portion of the task, not to keep force-fitting rigid workflow logic.
9. **B** — The Agent SDK supplies reusable building blocks so developers don't hand-build the harness from scratch.
10. **B** — Custom loops are justified when the app has orchestration needs the SDK's abstractions don't fit well.
11. **B** — Self-hosted vs. managed differs in who operates/maintains the harness infrastructure.
12. **B** — Hooks trigger deterministic, code-level actions at defined points, independent of model judgment.
13. **B** — Explicit, deterministic termination conditions (completion signal, iteration cap, error state) make loops robust.
14. **B** — SDKs reduce boilerplate and common failure modes via tested agent-loop/orchestration abstractions.
15. **B** — State management means deliberately persisting and passing forward relevant state across loop iterations.
16. **B** — Broad tool access without deterministic guardrails risks unintended/destructive actions driven by model judgment alone.
17. **B** — A hook tied to the tool call guarantees the logging action happens regardless of model behavior.
18. **B** — The tool-use loop iterates: call tool, observe result, reason, decide next action, repeat.
19. **B** — Memory retains relevant information across turns/sessions so it isn't lost or rediscovered repeatedly.
20. **B** — Deliberate context management (pruning/summarizing) directly affects long-running agent coherence and effectiveness.
21. **B** — Parallel subagents parallelize independent work and isolate context per subtask.
22. **B** — Frameworks like LangGraph/PydanticAI/Strands provide higher-level orchestration constructs so developers avoid hand-rolling every mechanism.
23. **B** — Custom loops make sense when a framework's abstractions don't fit or add unnecessary complexity/overhead.
24. **B** — Orchestrator-worker fits complex, multi-step tasks that decompose naturally into specialized subtasks.
25. **A, B** — Context isolation and cross-step information retention are the legitimate drivers for using agentic patterns over a flat single prompt.
26. **B** — Cross-session recall requires a persistent memory pattern, not just a larger single-session context window.

### Domain 2: Applications and Integration
27. **B** — Vague expectations need translation into a measurable requirement (e.g., a latency target).
28. **B** — Functional requirements define "what," infrastructure requirements define the operating conditions ("how well/under what constraints").
29. **B** — Sensitivity constraints should be translated into concrete data-handling/access-control/retention requirements.
30. **B** — Traceability justifies each architectural decision against an actual documented need.
31. **B** — A hard latency budget points toward a lower-latency tier and/or streaming to meet the interactive requirement.
32. **B** — Conflicting stakeholder requirements should be reconciled before design commits to one interpretation.
33. **B** — Life cycle thinking spans development, implementation, operation, and maintenance — not just launch.
34. **B** — The operate/maintain phase focuses on monitoring, updates, and responding to change post-launch.
35. **A** — Iteration suits LLM applications because output quality often benefits from repeated build-evaluate-refine cycles.
36. **A** — A life cycle framework gives structure for managing change deliberately rather than through ad hoc edits.
37. **B** — A staged rollout with a rollback plan lets issues be addressed without full-scale disruption.
38. **B** — The Batch API fits large, latency-tolerant, cost-sensitive overnight workloads.
39. **B** — Interactive, user-waiting scenarios favor realtime (synchronous) calls over batch processing.
40. **B** — Streaming improves perceived latency by delivering output incrementally as it's generated.
41. **B** — Multimodal image-plus-text input is what vision capability enables.
42. **B** — Extended/adaptive thinking trades latency/cost for deeper internal reasoning on complex tasks.
43. **B** — Prompt caching avoids reprocessing an unchanged large prefix on repeated calls, cutting cost/latency.
44. **B** — Third-party vendor integration requires verifying feature parity, auth, and any request/response differences.
45. **B** — RAG-style access should retrieve only the relevant subset, not embed entire datasets indiscriminately.
46. **B** — Batch trades immediacy for cost/throughput; realtime trades cost for low latency — a genuine tradeoff.
47. **B** — Multi-format input support lets text and document content be combined in a single request.
48. **B** — The Messages API is stateless; the calling application must manage and resend relevant conversation state itself.
49. **B** — Predictable, resource-oriented endpoints with correct methods/status codes reflect sound REST design.
50. **B** — Non-blocking I/O improves throughput while waiting on network-bound calls under concurrency.
51. **B** — Versioning prompts alongside code enables review, testing, and rollback like any other code change.
52. **B** — Code review catches integration/security/design issues (e.g., unsanitized input) before production.
53. **B** — Preserving behavior while restructuring internals is the definition of refactoring.
54. **B** — Claude Code can apply consistent, reviewed structural changes at scale across a codebase.
55. **B** — Idempotency prevents a retried request from causing duplicate unintended side effects.
56. **B** — Structured error handling/validation around parsing lets malformed responses fail gracefully.
57. **A** — LLM-integrated features benefit from the same SDLC rigor (testing, review, staged rollout) as other software.
58. **B** — Separating concerns (request-building, error handling, business logic) improves readability/testability.
59. **B** — Pinning dependencies and testing upgrades deliberately avoids unpredictable behavior from silent updates.
60. **A, B** — Structured error handling and version control (code + prompts) are core maintainability practices.
61. **B** — A clear, explicit schema with defined fields/types supports reliable downstream parsing.
62. **B** — Asserting on structural/semantic properties handles legitimate output variability better than exact string matching.
63. **B** — Placement across system prompt, tool description, and user message is a deliberate design decision affecting weight/interpretation.
64. **B** — Clear content boundaries prevent the model from mistaking untrusted/irrelevant content for instructions.
65. **B** — Session hygiene covers deliberate state management (reset/trim/isolate) to keep interactions coherent.
66. **B** — Each interface's surrounding context/defaults can influence instruction interpretation, even with the same underlying model.
67. **B** — Plugin management keeps enabled capabilities, versions, and dependencies predictable and maintainable.
68. **B** — Deliberate chunking/summarizing/selective retrieval is the sound approach to oversized documents.
69. **B** — A fallback path prevents a single failed/timed-out tool call from breaking the whole interaction.
70. **A** — Whether the user is actively waiting (sync) vs. background-processable (async) is the deciding factor.
71. **B** — Structurally separating trusted instructions from untrusted content prevents silent override of intended behavior.
72. **B** — The key design question is what state (if any) must persist between turns, shaping the request structure.
73. **B** — Precise, strict, well-documented schema is critical when a downstream system parses output automatically.
74. **A, B** — Consistent handling of content boundaries/instruction placement and appropriate per-interface session state are the legitimate cross-interface concerns.
75. **B** — A graceful degradation path prevents a temporary upstream outage from fully breaking the user experience.
76. **B** — Downstream logic must correctly handle both the incremental nature of streaming and the complete nature of non-streaming output for consistent behavior.
77. **B** — A designed handoff path ensures a low-confidence case is routed to a human with context, rather than left unresolved or answered with false confidence.
78. **B** — CLAUDE.md provides persistent, project-level context/instructions Claude Code reads to understand the codebase.
79. **B** — A settings-style file defines configurable behavior in a structured, version-controllable format.
80. **B** — Pinning avoids unexpected behavior changes disrupting production until the team deliberately adopts an update.
81. **B** — Prompt versioning enables tracking, testing, and rollback of prompt/instruction changes like code.
82. **B** — Plugin interdependencies create a real risk of version mismatches breaking functionality if not managed.
83. **B** — Mature configuration management maintains structured, auditable, environment-specific configuration.
84. **B** — Configuration drift causes inconsistent, hard-to-reproduce behavior from untracked ad hoc changes.
85. **B** — An up-to-date CLAUDE.md hierarchy and clear settings help new engineers understand the project quickly.

### Domain 3: Claude Code
86. **B** — The CLAUDE.md hierarchy layers scoped context/instructions appropriate to where Claude Code is working in the repo.
87. **B** — Custom slash commands are reusable, named shortcuts for common multi-step actions or prompts.
88. **B** — Headless mode runs Claude Code non-interactively, suited to scripts and CI pipelines.
89. **A** — Proper initialization establishes baseline configuration (CLAUDE.md, settings) so Claude Code has useful context from the start.
90. **B** — Skills package broader reusable capability/knowledge; commands are more direct, named action shortcuts.
91. **B** — Agent Memory lets Claude Code retain and reuse relevant information across sessions within a project instead of starting from zero each time.

### Domain 4: Eval, Testing, and Debugging
92. **B** — Trace analysis across the full interaction isolates where the unexpected behavior first appears (integration layer vs. model output).
93. **B** — Reviewing logs/traces for the failure pattern is the right first step before choosing a fix.
94. **B** — Retry-with-backoff fits transient errors, while non-retryable errors (like invalid requests) should be handled differently.
95. **B** — A pattern tied to missing upstream fields points to the input pipeline as the root cause, not the model.
96. **B** — A failure that's 100% reproducible points to a deterministic root cause; an intermittent one points to non-determinism, timing, or an external dependency — each needs a different investigation approach.

### Domain 5: Model Selection and Optimization
97. **B** — A token is a unit of text the model processes/generates sequentially, not necessarily a whole word.
98. **B** — The context window is the max amount of text (input + output) the model can consider at once.
99. **B** — Sampling introduces controlled randomness into next-token selection, producing non-deterministic output by default.
100. **B** — Next-token generation means predicting each token sequentially, conditioned on everything generated so far.
101. **B** — Fast mode fits straightforward tasks where low latency matters more than deep reasoning.
102. **B** — Effort level controls how much reasoning effort is applied, trading latency/cost against potential depth.
103. **B** — Zero/single/multi-shot differ by how many examples are provided to guide output format/style.
104. **B** — Multiple representative examples anchor output structure/style more reliably than instructions alone.
105. **B** — Sampling-related settings influence output variability; effort/thinking level primarily affects reasoning depth, not variety.
106. **B** — SDKs wrap REST calls to simplify auth/retries/serialization while still communicating over HTTP underneath.
107. **B** — Websockets suit persistent, low-latency, bidirectional real-time interaction patterns.
108. **B** — Timeouts, backoff retries for transient errors, and clear handling of non-retryable errors are sound integration practice.
109. **B** — Rate-limit handling gracefully manages throttling instead of failing outright under high volume.
110. **B** — Idempotent design prevents a retried request from duplicating a side effect like a database write.
111. **B** — Pagination keeps result sets manageable in size, latency, and relevance.
112. **B** — Async, non-blocking handling manages many concurrent network-bound requests more efficiently under load.
113. **B** — The timeout should match the expected response time for the task's complexity, not be shorter than legitimate longer-running requests.
114. **B** — Complex, nuanced reasoning tasks favor a more capable tier despite the cost/latency tradeoff.
115. **B** — More capable tiers generally trade cost/latency for stronger reasoning; lighter tiers optimize speed/cost.
116. **B** — Testing against representative cases and using version pinning is the responsible way to manage a behavior-changing release.
117. **B** — High-volume, low-complexity tasks are best matched to a lighter, faster, cheaper tier.
118. **B** — An unverified tier assumption should be validated by evaluating output quality on representative examples before production use.
119. **B** — Monitoring token usage per-request and in aggregate, then modeling against volume, is the direct way to track cost.
120. **B** — Prompt caching avoids reprocessing an unchanged large prefix on repeated calls.
121. **B** — Cache checkpointing marks reusable points in a prompt to maximize caching benefit on structured, multi-part prompts.
122. **B** — A defined token budget plus summarization/pruning keeps a growing agentic conversation manageable and cost-effective.
123. **B** — Estimating token volume × request volume before launch is responsible cost modeling.
124. **A, B** — Prompt caching and tier-matching to task complexity are the two direct, standard cost-control techniques listed.
125. **B** — Unexpectedly high token usage on a simple task usually traces to excessive/irrelevant context being included.
126. **B** — A mid-tier model can offer an acceptable quality/latency/cost balance for tasks below the top tier's necessity threshold.

### Domain 6: Prompt and Context Engineering
127. **B** — Context drift is the gradual buildup of irrelevant/outdated/conflicting information degrading focus and quality.
128. **B** — Context bloat means unnecessarily large, low-value context that raises cost/latency and dilutes attention.
129. **B** — Pruning keeps only useful tool output, reducing bloat and cost versus keeping everything verbatim.
130. **B** — Compaction condenses prior context (e.g., via summarization) to preserve key information in less space.
131. **B** — Context isolation via subagents keeps each subagent focused on only what's relevant to its subtask.
132. **B** — Summarizing/pruning outdated results is the appropriate response to context clutter in a long research agent.
133. **B** — Summarizing and carrying forward a condensed summary into a fresh session restores focus when relevant early context is being crowded out.
134. **B** — Clear, specific, unambiguous instructions reduce the chance of misinterpretation.
135. **B** — Few-shot examples demonstrate the desired input/output pattern to anchor format/style.
136. **B** — System vs. user placement can carry different precedence/persistence, affecting reliability of instruction-following.
137. **B** — Output constraints reduce ambiguity about what a valid response looks like, aiding downstream use.
138. **B** — Placement should follow purpose/scope: persistent behavior → system prompt; tool-specific → tool description; task-specific → user message.
139. **B** — Iterative refinement means repeatedly testing/adjusting a prompt based on observed output quality.
140. **B** — Targeted analysis of the specific failure pattern, followed by a focused adjustment and re-test, is the effective strategy.
141. **B** — Unsanitized user input can carry injected instructions, so it must be handled carefully and kept distinct from trusted instructions.
142. **A, B** — Clear instructions/examples and iterative refinement based on failures are core reliability-improving techniques.
143. **B** — Structured output (e.g., a defined JSON schema) produces predictable, machine-parseable results for downstream code.
144. **B** — The model can still deviate from the requested structure occasionally, so validation is still necessary.
145. **B** — Defensive parsing anticipates and gracefully handles unexpected or malformed output rather than assuming perfection.
146. **B** — Catching the validation failure and re-prompting with what was invalid (or handling it gracefully) is the appropriate recovery pattern, rather than accepting or crashing.

### Domain 7: Security and Safety
147. **B** — Treating retrieved content as untrusted, isolating it from instructions, and using guardrails is the effective prompt-injection mitigation.
148. **B** — A jailbreak attempt is crafted input aimed at bypassing intended model behavior or safety constraints.
149. **B** — Untrusted external content could carry adversarial instructions, so it shouldn't be treated as equivalent to trusted instructions.
150. **B** — Data-handling controls (filtering sensitive fields, validating response content) are the effective way to prevent leakage.
151. **B** — Minimizing/masking/excluding PII where not needed, per policy, reflects responsible PII handling.
152. **B** — Authentication (who) and authorization (what they're allowed to do) are both needed to prevent unauthorized actions.
153. **B** — Uploaded content should be treated as untrusted input, isolated from trusted instructions, with guardrails preventing it from triggering sensitive cross-user actions.
154. **B** — Guardrail layering combines multiple independent controls so a single-layer failure doesn't fully expose the system.
155. **B** — Least privilege means granting only the specific access/permissions necessary for the task, nothing more.
156. **B** — A defined content policy establishes boundaries for acceptable inputs/outputs to design and monitor against.
157. **B** — Secure-by-design means building access boundaries/permissions/identity checks in from the start.
158. **B** — Hooks can deterministically intercept a risky action and require a check/approval before it proceeds.
159. **B** — Hooks enforce checks deterministically in code, unlike a prompt instruction that depends on model judgment.
160. **A, B** — Using a secrets manager and scoping credentials per environment are the correct secret-management practices.
161. **B** — Monitoring and auditing credential access/usage helps detect unusual or unauthorized activity after secure storage is already in place.

### Domain 8: Tools and MCPs
162. **B** — The model requests a structured tool call; the application executes the real action and returns the result.
163. **B** — A clear, accurate tool description helps the model correctly decide when/how to invoke the tool.
164. **B** — Returning a clear, structured error lets the model reason about the failure and decide how to proceed.
165. **B** — Agentic harness dispatch is the mechanism routing the model's tool-call request to the correct implementation.
166. **B** — Client-side tools execute in the calling application/client; server-side tools execute in the provider's/remote environment.
167. **B** — Approval patterns add a safety checkpoint before high-impact actions, guarding against unintended execution.
168. **B** — A tool set should include only relevant, necessary tools, each with a clear, distinct purpose.
169. **A, B** — Clear tool descriptions and structured error handling both directly improve tool-use reliability in production.
170. **B** — A precise, well-typed parameter schema with validation catches and clearly handles malformed tool calls.
171. **B** — An MCP server exposes a service's capabilities in a standardized, reusable way multiple applications can connect to.
172. **B** — Resources expose readable data/context; tools represent invokable actions — a key MCP distinction.
173. **B** — stdio suits local/process-based communication; sockets suit remote/distributed deployments.
174. **B** — A dedicated MCP server makes an integration reusable and independently maintainable across multiple applications.
175. **B** — Versioning and backward-compatible changes (or a clear migration path) protect existing consumers of a shared MCP server from breaking changes.
176. **B** — A shared, independently maintained capability across multiple applications is the classic MCP server use case.
177. **B** — A built-in tool is preferable when it already covers the needed capability, avoiding unnecessary custom development.
178. **B** — A project-scoped Skill or custom tool fits a single-project need better than a full MCP server built for broader reuse.
179. **B** — Reuse/independent maintenance across multiple applications favors MCP; single-application use may only need a custom tool.
180. **A, B** — Checking for existing built-in coverage and weighing reuse-across-apps vs. single-app scope are the legitimate selection considerations.

---

### Notes on using this bank
- This is a **practice** resource for self-assessment against the published blueprint, not a copy of live exam items.
- Domain 2 (Applications and Integration, 33.1%) and Domain 5 (Model Selection and Optimization, 16.8%) together make up exactly half the exam — budget study time accordingly.
- Domains 3 and 4 (Claude Code; Eval, Testing, and Debugging) are narrow but still scored — don't skip them just because they're small.
- Hands-on practice matters more than memorization here: build a small Claude application that calls the API, uses at least one tool, and applies basic prompt/context engineering and security practices, per the official guide's own preparation advice.
- Always check Anthropic's current, official exam guide before scheduling, since the blueprint is versioned and "subject to change without notice."

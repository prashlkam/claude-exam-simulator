# Claude Certified Architect – Foundations (CCAR-F) — 200 Practice Questions

**Independent study resource — not affiliated with or endorsed by Anthropic.** Questions are original and written to match the scope, depth, and style of Anthropic's official *Claude Certified Architect – Foundations Exam Guide, v1.0 (effective July 2026, exam code CCAR-F)*. They are **not** drawn from the live exam item bank or the guide's own sample questions (both confidential/illustrative under Anthropic's NDA). Use this to check your understanding of the blueprint, not as a source of leaked content.

**Exam facts (from the official guide):** 60 items, 120 minutes, multiple-choice and multiple-response (each item states how many responses to select), questions are scenario-based — the live exam presents 4 scenarios drawn from a published bank of 6 (Customer Support Resolution Agent, Code Generation with Claude Code, Multi-Agent Research System, Developer Productivity with Claude, Claude Code for CI/CD, Structured Data Extraction). Scaled score 100–1,000, passing score 720, $125 fee, 12-month validity.

**Audience:** Solution architects with hands-on experience building agentic applications with the Claude Agent SDK, configuring Claude Code for teams, designing MCP tool/resource interfaces, engineering prompts for structured output, managing context across long-running and multi-agent systems, and integrating Claude Code into CI/CD. Typically 6+ months of hands-on experience with Claude, the Agent SDK, Claude Code, and MCP.

**Domain weights this bank mirrors (200 questions, proportional to the blueprint):**

| # | Domain | Weight | Questions |
|---|--------|--------|-----------|
| 1 | Agentic Architecture & Orchestration | 27% | 54 (Q1–Q54) |
| 2 | Tool Design & MCP Integration | 18% | 36 (Q55–Q90) |
| 3 | Claude Code Configuration & Workflows | 20% | 40 (Q91–Q130) |
| 4 | Prompt Engineering & Structured Output | 20% | 40 (Q131–Q170) |
| 5 | Context Management & Reliability | 15% | 30 (Q171–Q200) |

Domain 1 (Agentic Architecture & Orchestration) is the single heaviest domain at 27% — prioritize study time there, followed by Domains 3 and 4 (20% each). Every item below is single-answer (choose the one best option) for straightforward self-testing; the real exam also includes multiple-response items that state how many answers to select, so don't be thrown if you see one of those on exam day. The full answer key with rationale is in a separate section at the end so you can self-test first.

---

## Domain 1: Agentic Architecture & Orchestration (Q1–Q54)

### Task 1.1: Design and implement agentic loops for autonomous task execution

**Q1.** What should determine whether an agentic loop continues calling tools or returns a final response?
A. A fixed iteration count set as the primary stopping mechanism
B. The stop_reason returned by the API — continuing when it is "tool_use" and stopping when it is "end_turn"
C. Whether the response includes markdown formatting
D. Whether the assistant's response contains any plain-text sentence

**Q2.** After a tool executes within an agentic loop, what must be done before sending the next request to Claude?
A. The tool result should only be included if the tool call failed
B. The tool result should be discarded once it is logged
C. The tool result should be summarized by a separate, unrelated model before being shown to Claude
D. The tool result must be appended to the conversation history so Claude can reason about it in the next turn

**Q3.** A developer's agentic loop treats any text content in Claude's response as a signal that the task is complete. What is the flaw in this design?
A. Text content should always trigger an automatic retry rather than termination
B. There is no flaw; text content is the documented completion signal
C. This design only fails when extended thinking is enabled
D. Text content can appear alongside a tool_use block in the same response, so treating any text as completion can end the loop while a tool call is still pending

**Q4.** What distinguishes model-driven decision-making in an agentic loop from a pre-configured decision tree?
A. Model-driven decision-making requires disabling all but one tool
B. Claude reasons about which tool to call next based on context at each step, rather than following a fixed, pre-determined sequence
C. A pre-configured decision tree always produces better results than model-driven reasoning
D. There is no functional difference between the two approaches

**Q5.** A team sets a hard cap on loop iterations as the primary mechanism for deciding when an agentic loop stops. What risk does this introduce?
A. The loop may be cut off mid-task while stop_reason still indicates "tool_use," producing an incomplete result instead of relying on the model's own completion signal
B. Iteration caps eliminate any need to check stop_reason at all
C. Iteration caps guarantee every tool call executes exactly twice
D. No risk — iteration caps are the documented primary stopping mechanism

**Q6.** A support-agent loop parses the assistant's natural-language text for phrases like "all done" to decide when to stop calling tools, instead of checking the API's own signal. What is the most accurate criticism of this approach?
A. It works correctly in all cases because Claude always uses consistent completion phrasing
B. It only fails when the agent has no tools configured
C. It relies on a probabilistic, non-guaranteed signal (specific wording in generated text) instead of the deterministic stop_reason field the API already provides
D. It is the officially recommended approach for loop termination

**Q7.** In an agentic loop, why is it important to inspect stop_reason after every single API response rather than only at the end of a session?
A. stop_reason is only meaningful on the final response of a session
B. stop_reason reflects token usage rather than tool-calling state
C. Each response's stop_reason determines whether that specific turn requires executing a requested tool and continuing, or whether the task is genuinely finished
D. stop_reason is a static configuration value set once at session start

**Q8.** Which loop design correctly reflects the agentic loop lifecycle for building autonomous task execution with Claude?
A. Send a request, wait for a fixed timeout, then always terminate regardless of the response
B. Send requests in a fixed sequence determined entirely in advance, ignoring stop_reason
C. Send a single request, and treat any response at all as final regardless of stop_reason
D. Send a request, inspect stop_reason, execute any requested tool if stop_reason is "tool_use," append the result to history, and repeat until stop_reason is "end_turn"

### Task 1.2: Orchestrate multi-agent systems with coordinator-subagent patterns

**Q9.** In a hub-and-spoke multi-agent architecture, what is the coordinator agent's core responsibility regarding inter-subagent communication?
A. Delegating error handling entirely to whichever subagent encounters the error
B. Allowing subagents to communicate directly with each other to reduce latency
C. Managing all inter-subagent communication, error handling, and information routing, rather than letting subagents communicate directly with each other
D. Remaining passive once subagents have been spawned

**Q10.** Do subagents in a coordinator-subagent architecture automatically inherit the coordinator's full conversation history?
A. No — subagents operate with isolated context and do not automatically inherit the coordinator's conversation history
B. Yes — subagents always receive the coordinator's complete conversation history automatically
C. Yes, but only the most recent message is inherited automatically
D. Subagents inherit history only if extended thinking is enabled

**Q11.** A multi-agent research system's coordinator decomposes 'impact of AI on creative industries' into only three subtasks about visual arts, and the final report omits music, writing, and film. What is the most likely root cause?
A. The web search subagent's queries were not broad enough within its assigned narrow subtask
B. The synthesis agent failed to include material the subagents never researched
C. The coordinator's task decomposition was too narrow, so subagents were never assigned the missing domains in the first place
D. The document analysis agent applied overly strict relevance filtering

**Q12.** Which coordinator design choice best supports handling both simple and complex user queries efficiently in a multi-agent system?
A. The coordinator always invokes every available subagent regardless of query complexity
B. The coordinator delegates the decision of which subagents to invoke to the first subagent it calls
C. The coordinator never invokes more than one subagent per query
D. The coordinator dynamically analyzes query requirements and selects only the subagents needed, rather than always routing every query through the full pipeline

**Q13.** How should research scope typically be partitioned across subagents in a multi-agent research system to minimize duplicated work?
A. By assigning subtopics randomly with no regard for overlap
B. By assigning distinct subtopics or distinct source types to each subagent so their work does not overlap
C. By having only one subagent handle all research regardless of topic breadth
D. By having every subagent independently research the entire topic for redundancy

**Q14.** A synthesis subagent's output has clear coverage gaps compared to the original research question. What is the most appropriate coordinator behavior?
A. Evaluate the synthesis output for gaps, re-delegate to search/analysis subagents with targeted follow-up queries, and re-invoke synthesis until coverage is sufficient
B. Have the synthesis subagent silently fill gaps with assumptions rather than re-researching
C. Accept the synthesis output as final regardless of gaps, since subagents already ran once
D. Discard all subagent output and restart the entire pipeline from scratch every time a gap appears

**Q15.** Why should all subagent communication in a hub-and-spoke architecture be routed through the coordinator rather than peer-to-peer between subagents?
A. Routing through the coordinator is only relevant when fewer than two subagents are used
B. Peer-to-peer communication is faster and should always be preferred over routing through a coordinator
C. Peer-to-peer communication eliminates the need for any error handling
D. Routing through the coordinator preserves observability, consistent error handling, and controlled information flow across the system

**Q16.** What decomposition risk is specifically associated with a coordinator that breaks a broad research topic into subtasks that are too narrowly scoped?
A. Guaranteed faster completion time regardless of topic breadth
B. Automatic detection and correction of coverage gaps by the API itself
C. Excessive duplication of effort across subagents researching identical subtopics
D. Incomplete coverage of the broader topic, since entire relevant subdomains may never be assigned to any subagent

### Task 1.3: Configure subagent invocation, context passing, and spawning

**Q17.** What must a coordinator's allowedTools configuration include for the coordinator to be able to spawn subagents?
A. "Task" — the Task tool is the mechanism for spawning subagents
B. No specific tool is required; any configured tool can spawn subagents
C. "Spawn" — a dedicated spawning tool distinct from Task
D. "Delegate" — a delegation-specific tool name

**Q18.** Do subagents automatically inherit the parent coordinator's context, or share memory between separate invocations, by default?
A. Subagents inherit context only for their first invocation, but not afterward
B. Yes — subagents share a common memory store across all invocations by default
C. Yes — subagents automatically inherit the full parent context by default
D. No — subagent context must be explicitly provided in the prompt; subagents do not automatically inherit parent context or share memory between invocations

**Q19.** When passing prior findings (e.g., web search results and document analysis) into a synthesis subagent's prompt, what practice best preserves source attribution?
A. Using structured data formats that separate content from metadata (source URLs, document names, page numbers)
B. Omitting source metadata entirely to keep the prompt shorter
C. Concatenating all prior findings into a single unstructured paragraph with no metadata
D. Referring to sources only by a generic label like "Source 1" with no further detail

**Q20.** How should a coordinator spawn multiple subagents to run in parallel rather than sequentially?
A. By emitting multiple Task tool calls within a single coordinator response, rather than issuing them across separate turns
B. By setting a special "parallel: true" flag on the coordinator's system prompt
C. Parallel subagent execution is not possible with the Task tool
D. By issuing one Task tool call per turn across multiple sequential turns

**Q21.** What configuration defines a subagent's description, system prompt, and tool restrictions in an agentic architecture?
A. The Task tool's built-in default configuration, with no per-subagent customization
B. The coordinator's own system prompt, which subagents inherit verbatim
C. A single shared AgentDefinition applied identically to every subagent
D. The AgentDefinition configuration for that subagent type

**Q22.** What is fork_session used for in agent architecture?
A. Renaming an existing session without changing its content
B. Creating independent branches from a shared analysis baseline to explore divergent approaches
C. Permanently merging two unrelated sessions into one
D. Deleting a session's history to free up context

**Q23.** A coordinator's prompt to a subagent lists exact step-by-step procedural instructions for every action the subagent should take. What tradeoff does this design choice make compared to specifying research goals and quality criteria instead?
A. It reduces the subagent's ability to adapt its approach to what it actually discovers, compared to a prompt that specifies goals and quality criteria
B. It has no tradeoff; step-by-step instructions are always strictly superior for subagent prompts
C. It automatically improves parallel execution speed regardless of task
D. It removes the need for the AgentDefinition's system prompt entirely

**Q24.** Why is it important to pass complete prior findings directly into a subagent's prompt rather than assuming the subagent will retrieve them itself?
A. Subagents don't automatically inherit the coordinator's conversation or other agents' outputs, so needed information must be explicitly included
B. Subagents can access the coordinator's full context window without any explicit passing
C. Passing prior findings directly is only necessary for the first subagent invoked
D. Subagents automatically retrieve any information they need from a shared memory store

### Task 1.4: Implement multi-step workflows with enforcement and handoff patterns

**Q25.** A customer support agent's system prompt instructs that identity must be verified via get_customer before process_refund is called, but production data shows the agent still skips this step in some cases. What is the most effective fix?
A. Add a programmatic prerequisite that blocks process_refund until get_customer has returned a verified customer ID
B. Rely on strengthening the system-prompt wording further, since prompt instructions should eventually become fully reliable
C. Add more few-shot examples showing the correct order as the only fix needed
D. Remove process_refund entirely so the issue cannot occur

**Q26.** When should deterministic, programmatic enforcement of a workflow step generally be preferred over prompt-based guidance alone?
A. Programmatic enforcement should be used for every workflow step regardless of consequence, since it is always strictly better
B. Programmatic enforcement is unnecessary whenever a system prompt clearly states the required order
C. When compliance failures have real consequences (e.g., identity verification before financial operations), since prompt instructions alone have a non-zero failure rate
D. Prompt-based guidance is always sufficient for financial operations

**Q27.** A customer submits a message that raises three separate, unrelated issues at once. What is the most effective way for the agent to handle this?
A. Escalate automatically any time more than one issue appears in a single message
B. Ask the customer to resubmit each issue as a separate message before proceeding
C. Respond only to the first issue mentioned and ignore the rest
D. Decompose the request into distinct items, investigate each in parallel using shared context, then synthesize a unified resolution

**Q28.** What should a structured handoff summary to a human agent typically include when escalating mid-process?
A. A verbatim copy of the entire raw conversation transcript with no synthesis
B. Customer details, root cause analysis, and recommended actions, since the human agent lacks access to the conversation transcript
C. Nothing beyond a generic "escalated" flag, since details would be redundant
D. Only the customer's name, since the human agent can look up everything else themselves

**Q29.** Why is a programmatic gate (blocking a downstream tool call until a prerequisite tool has completed) considered a stronger enforcement mechanism than a prompt instruction stating the same requirement?
A. A prompt instruction is always more reliable than a programmatic gate for ordering
B. Programmatic gates eliminate the need for any prompt instructions at all
C. A programmatic gate and a prompt instruction provide identical reliability guarantees
D. A programmatic gate provides a deterministic guarantee, whereas an LLM following a prompt instruction has a non-zero chance of skipping the step

**Q30.** A workflow requires that a refund can only be processed after identity verification. Which implementation most reliably enforces this ordering?
A. A system-prompt sentence instructing the agent to always verify identity first
B. A code-level check that blocks the refund tool call until the identity-verification tool has returned a successful, verified result
C. A few-shot example demonstrating the correct order, used as the sole safeguard
D. Trusting the model's general training to apply sensible ordering

**Q31.** When decomposing a multi-concern customer message, why investigate each concern using shared context rather than fully separate, isolated investigations?
A. Shared context lets the agent synthesize a coherent, unified resolution across concerns rather than producing disconnected, potentially inconsistent responses
B. Shared context prevents the agent from decomposing the request at all
C. Shared context is required by the API and has no bearing on response quality
D. Fully isolated investigations always produce faster results with no downside

**Q32.** Which scenario most clearly calls for deterministic workflow enforcement rather than relying on prompt guidance alone?
A. A step that has no bearing on any other part of the workflow
B. A step involving purely cosmetic formatting of the final response
C. A step where skipping it only affects the tone of an internal, non-customer-facing log message
D. A step where skipping it (e.g., identity verification before a financial transaction) could cause real financial or compliance harm

### Task 1.5: Apply Agent SDK hooks for tool call interception and data normalization

**Q33.** Different MCP tools return timestamps in inconsistent formats (Unix timestamps, ISO 8601, etc.) before the agent processes them. What hook pattern addresses this?
A. There is no hook mechanism for this; normalization must happen inside the system prompt
B. A PostToolUse hook that normalizes the heterogeneous data formats into a consistent format before the model processes the tool result
C. A PreToolUse hook that blocks any tool returning a non-standard timestamp format
D. A hook that deletes any field with an unrecognized timestamp format

**Q34.** A business rule requires blocking any refund above $500 and redirecting to human escalation instead. Which mechanism most reliably enforces this?
A. A hook that intercepts the outgoing tool call, blocks refunds exceeding the threshold, and redirects to the escalation workflow
B. Increasing the agent's reasoning effort so it is less likely to make the mistake
C. A system-prompt instruction asking the agent to check the amount before calling the refund tool
D. A few-shot example showing a refund being denied above the threshold

**Q35.** What is the key distinction between using hooks versus relying on prompt instructions for enforcing business compliance rules?
A. Hooks provide deterministic guarantees at the code level, while prompt instructions represent probabilistic compliance that can fail
B. Prompt instructions are always more reliable than hooks for enforcing rules
C. Hooks can only be used for logging and have no enforcement capability
D. Hooks and prompt instructions provide identical reliability guarantees for compliance

**Q36.** Which hook pattern is designed to intercept tool results for transformation before the model processes them?
A. PreModelCall
B. PostToolUse
C. FinalResponse
D. OnSessionStart

**Q37.** A team wants a business rule guaranteed to hold rather than merely 'usually followed.' What should guide their choice between hook-based enforcement and a prompt-based instruction?
A. They should choose a more detailed prompt instruction, since prompts can also guarantee compliance if worded carefully enough
B. They should avoid both and rely solely on human review after the fact
C. They should choose hooks, since business rules requiring guaranteed compliance need deterministic enforcement rather than probabilistic LLM compliance
D. The choice makes no practical difference to reliability

**Q38.** What is the primary benefit of intercepting tool calls (rather than tool results) with a hook, in the context of enforcing compliance rules?
A. It changes the model's system prompt at runtime
B. It can only log the tool call after it has already executed, with no ability to block it
C. It has no effect on whether the tool call proceeds
D. It can block a policy-violating action before it executes, redirecting to an alternative workflow such as escalation

**Q39.** An agent receives numeric status codes from one MCP tool and human-readable status strings from another, and both must be reasoned about consistently. What is the most appropriate hook-based fix?
A. A PostToolUse hook that normalizes both formats into a single consistent representation before the model sees them
B. Ignoring the inconsistency, since the model can reliably infer meaning from mixed formats
C. Instructing the model, via the system prompt, to mentally reconcile the two formats every time
D. Disabling one of the two MCP tools so only one format is ever returned

### Task 1.6: Design task decomposition strategies for complex workflows

**Q40.** A code review task involves reviewing a predictable set of concerns (style, security, performance) across each file in a pull request, followed by a final cross-file consistency check. Which decomposition pattern best fits?
A. Fully dynamic, adaptive decomposition with no predefined structure
B. A single unstructured pass reviewing the entire PR at once
C. Random task assignment with no defined sequence
D. Prompt chaining — a fixed sequential pipeline of predictable steps

**Q41.** An open-ended task like 'add comprehensive tests to a legacy codebase' has no fully predictable set of steps in advance. Which decomposition approach fits best?
A. Dynamic, adaptive decomposition that generates subtasks based on what is discovered at each step
B. A decomposition plan copied unchanged from an unrelated prior project
C. A fixed sequential pipeline defined entirely before any exploration begins
D. No decomposition at all — handle the entire task in a single pass

**Q42.** Why split a large multi-file code review into per-file local analysis passes plus a separate cross-file integration pass, rather than reviewing everything in one pass?
A. Because per-file passes are always faster in wall-clock time than a single pass
B. Because cross-file issues cannot be detected under any decomposition strategy
C. Because a single pass is technically incapable of processing more than one file
D. To avoid attention dilution across many files, which can cause inconsistent depth and contradictory findings

**Q43.** When decomposing 'add comprehensive tests to a legacy codebase,' what is a reasonable first step before generating a full task plan?
A. Assigning test-writing randomly across files with no prioritization
B. Mapping the codebase's structure and identifying high-impact areas before creating a prioritized, adaptive plan
C. Skipping structural investigation entirely, since legacy codebases are assumed uniform
D. Immediately generating tests for every file simultaneously with no prior investigation

**Q44.** Which factor should most influence the choice between prompt chaining and dynamic decomposition for a given workflow?
A. Whether the task is customer-facing or internal-only
B. Whether the workflow's steps and structure are predictable in advance (favoring chaining) or must adapt to what is discovered (favoring dynamic decomposition)
C. The total number of files involved, regardless of predictability
D. Whether the workflow involves any tool calls at all

**Q45.** A reviewer notices that reviewing 14 files together in one pass produces contradictory feedback — a pattern flagged as an issue in one file but approved in another identical instance. What decomposition change most directly addresses this?
A. Switch to a model with a larger context window while keeping the single-pass structure
B. Split into focused per-file passes for local issues plus a separate integration pass for cross-file consistency
C. Require the reviewer to memorize prior findings manually across files
D. Run the same single pass three times and average the results

**Q46.** What risk does splitting a large investigation into an adaptive plan (rather than a fixed one) help mitigate?
A. The risk of the model refusing to call any tools
B. The risk of the task taking any time at all to complete
C. The risk of a fixed plan missing dependencies or complications that are only discovered once work begins
D. The risk of the task requiring more than one agent

**Q47.** For a workflow with predictable, well-understood sequential steps (e.g., 'analyze each file individually, then run a cross-file pass'), what is the main advantage of prompt chaining over dynamic decomposition?
A. It guarantees zero false positives regardless of prompt quality
B. It provides a clear, structured pipeline suited to the workflow's already-known steps, without the added complexity of runtime plan generation
C. It removes the need to ever review more than one file
D. It eliminates the need for any cross-file pass

### Task 1.7: Manage session state, resumption, and forking

**Q48.** A developer wants to continue a specific, named prior investigation session in Claude Code across multiple work sessions. What is the appropriate mechanism?
A. Starting an entirely new session and manually re-pasting the full prior transcript each time
B. There is no way to resume a named session; every session must start fresh
C. Renaming the CLAUDE.md file to match the session name
D. Named session resumption using --resume <session-name>

**Q49.** A developer wants to explore two different refactoring strategies starting from the same completed codebase analysis, without one exploration affecting the other. Which mechanism fits best?
A. fork_session — creating independent branches from a shared analysis baseline
B. --resume, used twice in immediate succession on the same session
C. Running both strategies in the exact same session sequentially with no separation
D. Deleting and recreating the session for each strategy

**Q50.** A developer resumes a prior session after making significant changes to files that were previously analyzed. What is the most important thing to do when resuming?
A. Assume the agent automatically detects any file changes with no need to mention them
B. Avoid resuming altogether and always start from a completely blank session
C. Rename the session so the agent treats it as entirely unrelated to the prior work
D. Inform the agent about the specific file changes so it can perform targeted re-analysis rather than relying on stale conclusions

**Q51.** When is starting a new session with a structured summary generally more reliable than resuming a prior session directly?
A. Starting fresh is always more reliable than resuming, regardless of whether prior context is still valid
B. There is no meaningful difference between the two approaches in any situation
C. When the prior session's tool results are stale (e.g., the codebase has changed significantly), making a fresh, injected summary more trustworthy than resumed but outdated context
D. Resuming is always more reliable than starting fresh, regardless of staleness

**Q52.** What is the main use case for fork_session as opposed to simply continuing a single ongoing session?
A. Renaming a session without altering any of its content
B. Exploring divergent approaches (e.g., comparing two testing strategies) from a shared baseline without one path contaminating the other
C. Merging two previously unrelated sessions into a single combined session
D. Permanently deleting all prior context to save storage

**Q53.** A developer resumes a named session to continue a multi-day investigation. Why might resuming still fail to produce reliable results if the developer says nothing about what changed?
A. If underlying files have changed since the session's prior analysis, the resumed context may reflect stale, now-inaccurate conclusions
B. Resumed sessions automatically re-verify every prior finding against the current file state with no developer input required
C. Session resumption is unaffected by any file changes under any circumstances
D. Resuming always ignores all previous context regardless of relevance

**Q54.** Which is the better choice when a prior session's tool results are still substantially valid and only a small amount of new work is needed: resuming the session, or starting fresh with an injected summary?
A. Neither — a brand-new, completely un-contextualized session should always be used
B. It makes no difference; both approaches produce identical results
C. Resuming the session, since the mostly-valid prior context can be built upon directly
D. Starting fresh with a summary, since summaries are always superior to resumed context in every case

---

## Domain 2: Tool Design & MCP Integration (Q55–Q90)

### Task 2.1: Design effective tool interfaces with clear descriptions and boundaries

**Q55.** Two tools, get_customer ('Retrieves customer information') and lookup_order ('Retrieves order details'), have minimal descriptions and accept similar identifier formats. Production logs show the agent frequently calls the wrong one. What is the most effective first step?
A. Merge both tools into a single tool with no distinguishing description, letting internal logic decide
B. Add 5-8 few-shot examples to the system prompt as the primary fix, without touching the descriptions
C. Expand each tool's description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus the similar tool
D. Build a separate keyword-based routing layer that pre-selects the tool before the model sees the request

**Q56.** Why are tool descriptions considered the primary mechanism for LLM tool selection?
A. Tool descriptions only matter when a system prompt is empty
B. Tool descriptions are purely cosmetic and have no effect on which tool the model selects
C. Tool selection is determined entirely by the order in which tools are listed, not their descriptions
D. The model relies on the description's content to understand a tool's purpose and differentiate it from similar tools when deciding which to call

**Q57.** Two tools, analyze_content and analyze_document, have near-identical descriptions. What problem does this most directly cause?
A. No problem, since near-identical descriptions guarantee consistent behavior
B. Misrouting — the model struggles to reliably differentiate which tool to call for a given request
C. It causes the API to reject one of the two tool definitions automatically
D. It only matters if the tools have different required parameters

**Q58.** A team renames a generic analyze_content tool to extract_web_results and updates its description to be web-specific. What problem does this most directly address?
A. The renaming is required to satisfy MCP protocol syntax
B. Functional overlap with a similarly named/described tool, which was causing unreliable tool selection
C. The renaming automatically changes the tool's underlying implementation logic
D. The renaming primarily reduces the tool's average response latency

**Q59.** A generic analyze_document tool is split into extract_data_points, summarize_content, and verify_claim_against_source, each with defined input/output contracts. What is the main benefit of this change?
A. Each tool becomes purpose-specific with a clearer scope, improving the model's ability to select the correct one for a given need
B. It removes the need for any tool description at all going forward
C. It reduces the total number of API calls required for any task to exactly one
D. It guarantees the tools will never return an error

**Q60.** A system prompt contains wording that happens to share keywords with one particular tool's name, causing the model to over-select that tool even when a better-suited tool exists. What does this illustrate?
A. System prompt wording can create unintended tool associations that override otherwise well-written tool descriptions
B. This can only happen if the tool has no description at all
C. This is a sign the tool must be removed permanently rather than the prompt reviewed
D. System prompt wording has no influence on tool selection under any circumstances

**Q61.** Which element is LEAST likely to help an LLM correctly differentiate between two similar tools if included in each tool's description?
A. Example queries that should route to this tool versus a similar alternative
B. The expected input format the tool accepts
C. An unrelated marketing tagline for the service the tool wraps
D. Explicit boundary conditions describing when NOT to use this tool

**Q62.** Before investing in a more complex fix such as a routing layer or tool consolidation, what should typically be tried first when two similar tools are frequently confused?
A. Immediately building a custom classifier model to pre-select tools
B. Immediately removing one of the two tools without further investigation
C. Improving the clarity and specificity of each tool's description, since this is a low-effort, high-leverage first step
D. Immediately merging the tools into one with no distinguishing detail

### Task 2.2: Implement structured error responses for MCP tools

**Q63.** A set of MCP tools all return a generic 'Operation failed' message on any failure. What problem does this cause for the agent?
A. It only affects logging, not agent behavior
B. The agent cannot make an appropriate recovery decision, since it has no information about the type or cause of the failure
C. It causes the API to automatically retry the call three times before giving up
D. No problem — generic messages are the recommended pattern for all MCP tool errors

**Q64.** What does the MCP isError flag communicate to the agent?
A. That the tool is permanently disabled and should never be called again
B. That the tool call resulted in a failure, distinct from a valid successful (even if empty) result
C. That the agent must immediately terminate the entire session
D. That the model should stop using any tools for the remainder of the conversation

**Q65.** Which structured error metadata helps an agent avoid wasting a retry attempt on an error that will never succeed on retry?
A. The total number of tools configured for the agent
B. The HTTP response time of the failed call
C. An isRetryable boolean (or equivalent errorCategory distinguishing transient from validation/permission/business errors)
D. A randomly generated error ID with no categorization

**Q66.** A tool call fails because the customer violated a business policy (e.g., requesting a refund outside the return window). How should this be communicated back to the agent?
A. By terminating the entire agent session immediately
B. By silently returning an empty success result
C. As a generic 'Operation failed' message identical to a network timeout
D. As a structured business error with retriable: false and a customer-friendly explanation the agent can relay appropriately

**Q67.** What is the key difference between a valid empty result and an access failure (e.g., a timeout) in MCP tool error design?
A. A valid empty result should always be treated as a fatal error
B. A valid empty result represents a successful query that simply found no matches, while an access failure represents an inability to complete the query and may warrant a retry decision
C. An access failure should always be silently converted into an empty result
D. There is no meaningful difference; both should be treated identically by the agent

**Q68.** A subagent encounters a transient error calling an external service. What is the recommended handling before propagating anything to the coordinator?
A. Immediately propagate every error, transient or not, straight to the coordinator with no local handling
B. Terminate the entire multi-agent system on any transient error
C. Silently suppress the error and return a fabricated successful result
D. Attempt local error recovery within the subagent for transient failures, propagating to the coordinator only errors that cannot be resolved locally

**Q69.** Which error categories are useful to distinguish in structured MCP tool error responses?
A. Errors that occurred in the morning versus errors that occurred in the afternoon
B. Only a single universal error category, since further categorization adds no value
C. Transient errors, validation errors, business/policy errors, and permission errors
D. Errors caused by the model versus errors caused by the network, with no other distinctions

### Task 2.3: Distribute tools appropriately across agents and configure tool choice

**Q70.** A synthesis subagent is given all 18 available tools in the system, including web search tools intended for the search subagent. What problem does this most likely cause?
A. The synthesis agent may misuse tools outside its specialization, such as attempting web searches itself, since giving an agent too many tools degrades tool selection reliability
B. It has no effect on tool selection reliability, only on token cost
C. It guarantees faster task completion regardless of tool count
D. No problem — giving every agent every tool is the recommended default configuration

**Q71.** What is the recommended approach for distributing tools across specialized subagents in a multi-agent system?
A. Scoped tool access — giving each agent only the tools needed for its role, with limited cross-role tools reserved for specific high-frequency needs
B. Giving each agent exactly one tool regardless of role complexity
C. Giving every agent access to every tool to maximize flexibility
D. Randomly assigning tools to agents at each invocation

**Q72.** A synthesis agent frequently needs simple fact verification, and 85% of these needs are simple lookups. What is a proportionate way to reduce coordinator round-trips for this common case?
A. Give the synthesis agent a scoped verify_fact tool for the common case, while still routing complex verifications through the coordinator to the search agent
B. Give the synthesis agent unrestricted access to all web search tools so it never needs the coordinator
C. Have the web search agent speculatively pre-cache everything it might ever be asked to verify
D. Remove verification entirely from the synthesis agent's responsibilities

**Q73.** What does setting tool_choice to "any" guarantee about the model's next response?
A. The model must call every available tool in a single response
B. The model is prevented from calling any tool at all
C. The model must call some tool, though it can choose which one, rather than returning plain conversational text
D. The model must call a tool named "any"

**Q74.** A developer wants to guarantee that a specific extraction tool runs before any enrichment tools are called, in a fixed first step. Which tool_choice configuration achieves this?
A. tool_choice: "auto", since auto mode guarantees a specific tool runs first
B. There is no way to force a specific tool to run first
C. Forced tool selection specifying the exact tool name (e.g., {"type": "tool", "name": "extract_metadata"})
D. tool_choice: "any", since any mode guarantees the exact same tool every time

**Q75.** With tool_choice set to "auto," what is the model free to do that it cannot do when tool_choice is "any"?
A. Ignore the system prompt entirely
B. Bypass stop_reason handling
C. Return plain conversational text instead of calling a tool
D. Call more than one tool in the same turn, which is impossible under "any"

**Q76.** A team notices a synthesis agent occasionally attempts to call a raw web-search tool it was never meant to use, causing unpredictable behavior. What is the most direct architectural fix?
A. Increase the synthesis agent's reasoning effort so it stops making the mistake despite retaining the tool
B. Rename the web-search tool so it is harder for the synthesis agent to find
C. Add a comment in the code (not the tool definition) noting the tool shouldn't be used by synthesis
D. Restrict the synthesis agent's tool set to exclude tools outside its role, providing only scoped, relevant tools instead

### Task 2.4: Integrate MCP servers into Claude Code and agent workflows

**Q77.** A team wants an MCP server configuration to be shared with every developer on the project via version control. Where should it be configured?
A. A .env file with no relation to MCP configuration
B. It cannot be shared; each developer must configure it individually with no shared file
C. User-level ~/.claude.json, since user-level settings are automatically shared via version control
D. Project-level .mcp.json

**Q78.** A developer wants to experiment with a personal MCP server without affecting teammates or committing it to the shared project configuration. Where should this go?
A. There is no way to configure a personal, non-shared MCP server
B. User-level ~/.claude.json
C. The root CLAUDE.md file
D. Project-level .mcp.json, committed directly to the shared repository

**Q79.** How should credentials like API tokens typically be referenced in a project-scoped .mcp.json without committing secrets to version control?
A. Using environment variable expansion (e.g., ${GITHUB_TOKEN}) rather than hard-coding the raw secret value
B. Storing the token in the CLAUDE.md file as plain text
C. Committing the token to a separate, still-tracked secrets.json file
D. Hard-coding the raw token value directly in .mcp.json for simplicity

**Q80.** If both a project-level MCP server and a personal user-level MCP server are configured at the same time, what happens to the tools they expose?
A. The two configurations conflict and neither server's tools become available
B. Only the most recently configured server's tools are available
C. Tools from all configured MCP servers are discovered at connection time and made available to the agent simultaneously
D. Only the project-level server's tools are ever available; user-level servers are ignored when a project-level config exists

**Q81.** An agent keeps preferring a built-in Grep-style search over a more capable MCP tool that could answer the same question more effectively. What is the most likely fix?
A. Enhance the MCP tool's description to more clearly explain its capabilities and outputs, so the model understands when it is the better choice
B. Disable the built-in Grep tool entirely so the agent has no alternative
C. Nothing can be done; agents always prefer built-in tools over MCP tools regardless of description
D. Rename the MCP server itself, since server names (not tool descriptions) drive tool preference

**Q82.** A team needs a standard Jira integration for their agent. What is generally the recommended approach compared to building a custom MCP server from scratch?
A. Use a community MCP server only if no team-specific workflow will ever be needed, otherwise avoid MCP entirely
B. Always build a fully custom MCP server for every integration, regardless of how standard it is
C. Use an existing community MCP server for the standard integration, reserving custom server development for team-specific workflows
D. Avoid MCP entirely and hard-code the Jira API calls directly into the agent's tool-use loop

**Q83.** A team wants to expose their internal documentation hierarchy to an agent so it can see what's available without needing exploratory tool calls to discover the structure. What MCP mechanism best fits this?
A. MCP tools, since resources cannot expose any content to the agent
B. MCP resources, used to expose a content catalog
C. A hook that intercepts every tool call to inject the catalog manually each time
D. There is no MCP mechanism for this; it must be handled entirely in the system prompt

### Task 2.5: Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively

**Q84.** A developer needs to find every place in a codebase that calls a specific function by name. Which built-in tool is best suited to this?
A. Grep — for searching file contents for patterns like function names
B. Bash — as the first choice for content search, ahead of a dedicated search tool
C. Write — for creating or overwriting file contents
D. Glob — for matching file paths by name pattern, not file contents

**Q85.** A developer needs to find all files matching the pattern **/*.test.tsx across a codebase. Which built-in tool is best suited to this?
A. Grep — for searching file contents rather than file paths
B. Read — for loading a specific file's full contents, not for pattern-based file discovery
C. Glob — for file path pattern matching
D. Edit — for making targeted content modifications, not for finding files

**Q86.** An attempt to use Edit to modify a file fails because the target text is not unique within the file. What is the recommended fallback?
A. Retry Edit repeatedly with the identical non-unique text until it succeeds
B. Use Read to load the full file, then Write to save the modified version
C. Delete the file and recreate it from a blank template
D. Switch to Bash exclusively for all future file modifications in the project

**Q87.** What is the recommended approach for building understanding of an unfamiliar codebase incrementally, rather than reading every file upfront?
A. Use only Bash for all codebase exploration, avoiding Grep and Read entirely
B. Read every file in the repository upfront before doing anything else, regardless of size
C. Use Write to annotate every file with notes before reading any of them
D. Start with Grep to find entry points, then use Read to follow imports and trace flows as needed

**Q88.** A developer wants to trace how a function is used across several wrapper modules that may re-export it under different names. What is a reasonable approach?
A. Search only for the function's original name and assume no re-exports exist
B. First identify all exported names for the function, then search for each of those names across the codebase
C. Read the entire codebase file by file with no targeted search strategy
D. Use Glob to search file contents for the function name

**Q89.** When should Edit generally be preferred over Read + Write for modifying a file?
A. Edit should never be used; Read + Write should always be preferred instead
B. When the target text to change is unique within the file, allowing a precise, targeted modification
C. Whenever the target text appears multiple times in the file, since Edit handles ambiguity automatically
D. Edit should be used only for files larger than a fixed size threshold

**Q90.** Which built-in tool is most appropriate for loading an entire file's current contents before deciding how to modify it?
A. Bash, as the first and only choice regardless of task
B. Grep, since it also returns full file contents by default
C. Read
D. Glob, since it returns file contents alongside matching paths

---

## Domain 3: Claude Code Configuration & Workflows (Q91–Q130)

### Task 3.1: Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization

**Q91.** A new team member joins a project but does not receive standard team instructions that other developers already see automatically. Investigation shows the instructions were placed in ~/.claude/CLAUDE.md rather than the project-level file. What is the root cause?
A. Project-level CLAUDE.md files only apply to the person who created them
B. CLAUDE.md files have no effect on team-wide configuration under any circumstances
C. User-level CLAUDE.md files are automatically synced to all teammates via version control
D. User-level CLAUDE.md settings apply only to that specific user and are not shared with teammates via version control

**Q92.** What does the @import syntax in CLAUDE.md allow a team to do?
A. Reference external files to keep CLAUDE.md modular, such as importing only the standards files relevant to a given package
B. Import external npm packages directly into the running agent process
C. Automatically translate CLAUDE.md content into another spoken language
D. Disable all directory-level CLAUDE.md files project-wide

**Q93.** A team's single root CLAUDE.md file has grown very large and covers many unrelated topics (testing, API conventions, deployment). What is a recommended alternative structure?
A. Split it into focused, topic-specific files in .claude/rules/ (e.g., testing.md, api-conventions.md, deployment.md)
B. Move the entire file into a single ~/.claude/CLAUDE.md so it stops applying to the whole team
C. Delete the file entirely and rely on developers to remember conventions unaided
D. Keep everything in one monolithic CLAUDE.md file regardless of size, since splitting is never recommended

**Q94.** A developer notices Claude's behavior is inconsistent across sessions and suspects a memory/configuration file issue. What command helps diagnose which memory files are actually loaded?
A. /config, which does not exist in Claude Code
B. /status, which only reports API connectivity, not loaded memory files
C. /memory
D. /reset, which only clears the current session with no diagnostic output

**Q95.** What is the correct ordering, from broadest to most specific, of the CLAUDE.md configuration hierarchy?
A. Only one CLAUDE.md file can exist per repository at any level
B. There is no hierarchy; all CLAUDE.md files everywhere apply identically to everyone
C. Directory-level, then project-level, then user-level, in that order of precedence with no overlap
D. User-level (~/.claude/CLAUDE.md), project-level (.claude/CLAUDE.md or root CLAUDE.md), directory-level (subdirectory CLAUDE.md files)

**Q96.** A monorepo has multiple packages, each maintained by a team with different domain knowledge and standards. How can @import help scope CLAUDE.md content appropriately per package?
A. @import forces every package to load every other package's full CLAUDE.md content
B. Each package's CLAUDE.md can selectively @import only the standards files relevant to that package's maintainers, rather than loading every standard globally
C. @import is unrelated to modularizing CLAUDE.md and only affects code imports
D. @import can only reference files outside the repository, never files within the same monorepo

**Q97.** Why might a team prefer .claude/rules/ topic-specific files over one large monolithic CLAUDE.md as a growing project's conventions multiply?
A. Monolithic CLAUDE.md files are technically incapable of exceeding a few lines
B. Topic-specific files are easier to maintain and reason about individually as the project's conventions grow more numerous and varied
C. Splitting files has no practical benefit over one large file regardless of project size
D. claude/rules/ files are the only way to apply any project-level configuration at all

### Task 3.2: Create and configure custom slash commands and skills

**Q98.** A team wants a custom /review slash command available to every developer automatically when they clone the repository. Where should this command be defined?
A. Inside the root CLAUDE.md file as a special command block
B. A .claude/config.json file with a commands array
C. ~/.claude/commands/ in each developer's home directory, since this is version-controlled by default
D. .claude/commands/ in the project repository, so it is version-controlled and shared

**Q99.** A developer wants a personal slash command for their own workflow that should not affect or appear for teammates. Where should this be defined?
A. The root CLAUDE.md file, which is the only place commands can be defined
B. .claude/commands/ in the project repository, since project-scoped commands are always personal by default
C. ~/.claude/commands/, since user-scoped commands are personal and not shared via version control
D. There is no way to define a personal, non-shared slash command

**Q100.** A skill produces very verbose intermediate output (e.g., detailed codebase analysis) that the team doesn't want polluting the main conversation. Which SKILL.md frontmatter option addresses this?
A. context: fork, which runs the skill in an isolated sub-agent context
B. allowed-tools, which only restricts which tools the skill may call, not where its output appears
C. argument-hint, which only affects prompting for missing parameters
D. There is no frontmatter option for isolating a skill's output

**Q101.** A skill should only be able to perform file-write operations and nothing else, to prevent destructive actions during its execution. Which SKILL.md frontmatter option enforces this?
A. argument-hint, which only affects how arguments are prompted for
B. allowed-tools, configured to restrict tool access during skill execution
C. There is no way to restrict a skill's tool access
D. context: fork, which isolates conversation context but does not restrict tool access

**Q102.** A developer invokes a skill without providing any arguments, and the skill needs specific parameters to function correctly. Which frontmatter option helps prompt the developer for the required parameters?
A. argument-hint
B. allowed-tools, which restricts tool access but does not prompt for arguments
C. There is no mechanism to prompt for missing skill arguments
D. context: fork, which isolates context but does not prompt for arguments

**Q103.** A developer wants a personalized variant of a shared team skill without affecting how teammates experience the original. What is the recommended approach?
A. Directly edit the shared skill file in the project repository so it applies to everyone including the developer
B. Personal skill customization is not possible; all skills must remain identical for every developer
C. Create a personal variant with a different name in ~/.claude/skills/
D. Delete the shared skill from the project so only the personal variant exists

**Q104.** How should a team decide between using a skill versus adding instructions to CLAUDE.md for a given piece of guidance?
A. CLAUDE.md should be used exclusively for task-specific, on-demand workflows
B. Skills should be used exclusively for universal, always-applicable standards
C. Skills and CLAUDE.md are functionally identical, so the choice never matters
D. Skills fit on-demand invocation for task-specific workflows, while CLAUDE.md fits always-loaded, universal standards

### Task 3.3: Apply path-specific rules for conditional convention loading

**Q105.** A codebase has test files spread throughout many directories (e.g., Button.test.tsx next to Button.tsx), and the team wants consistent testing conventions applied regardless of location. What is the most maintainable configuration approach?
A. A single instruction added to the root CLAUDE.md relying on Claude to infer when it applies
B. A separate CLAUDE.md file placed in every subdirectory that happens to contain a test file
C. A .claude/rules/ file with YAML frontmatter specifying a glob pattern like **/*.test.tsx so the rule applies based on file type, not directory
D. Skills, invoked manually by developers before writing each test file

**Q106.** What does the paths field in a .claude/rules/ file's YAML frontmatter control?
A. The list of teammates permitted to edit files matching that pattern
B. Glob patterns determining which files' edits trigger that rule to load
C. The order in which unrelated rule files are displayed in documentation
D. The specific model tier used for that project

**Q107.** What is the main advantage of glob-pattern path-specific rules over directory-level CLAUDE.md files for conventions that must apply across many different directories?
A. Directory-level CLAUDE.md files can match files across multiple unrelated directories, while glob patterns cannot
B. Glob patterns can match files by type or name pattern regardless of which directory they're in, while directory-level CLAUDE.md files are bound to a specific directory tree
C. Glob-pattern rules apply globally with no way to scope them, unlike directory-level CLAUDE.md files
D. There is no functional difference between the two approaches

**Q108.** Why does loading rules only when editing matching files (via path scoping) help manage context and token usage?
A. Path scoping has no effect on context or token usage, only on visual organization
B. Path scoping only affects which model tier is selected
C. Path scoping loads every rule file regardless of relevance, increasing token usage
D. It avoids loading irrelevant conventions into context for files the rule doesn't apply to, reducing unnecessary token usage

**Q109.** A team has Terraform-specific conventions that should only apply when editing files under a terraform/ directory tree. How should this be configured with path-specific rules?
A. A rule with no paths field, relying on the rule's filename alone to imply scope
B. A CLAUDE.md file placed at the repository root with no path scoping at all
C. A .claude/rules/ file with paths: ["terraform/**/*"] in its YAML frontmatter
D. A skill that must be manually invoked before every Terraform file edit

**Q110.** When should a team choose path-specific rules over a subdirectory CLAUDE.md file for a given convention?
A. Path-specific rules should always be preferred over subdirectory CLAUDE.md files in every situation, with no exceptions
B. The choice never matters since both approaches behave identically
C. When the convention must apply to files identified by type or pattern regardless of which directory they live in
D. Subdirectory CLAUDE.md files should always be preferred when files are spread across many directories

### Task 3.4: Determine when to use plan mode vs direct execution

**Q111.** A developer is assigned to restructure a monolithic application into microservices, involving changes across dozens of files and decisions about service boundaries. Which approach is most appropriate?
A. Begin in direct execution and only switch to plan mode if unexpected complexity arises
B. Use direct execution with exhaustive upfront instructions detailing the exact structure without exploring the code first
C. Start with direct execution and let the implementation reveal service boundaries incrementally
D. Enter plan mode to explore the codebase, understand dependencies, and design an approach before making changes

**Q112.** A developer needs to add a single validation check to one clearly identified function, with a well-understood scope. Which approach fits best?
A. A brand-new multi-agent research pipeline should be built first to investigate the change
B. Plan mode, since any code change should always go through a planning phase regardless of scope
C. Direct execution, since the change is simple and well-scoped
D. The task should be declined as too complex for either approach

**Q113.** What does plan mode primarily enable that direct execution does not, for tasks involving architectural decisions?
A. Plan mode allows changes to be made without any review at all
B. Safe codebase exploration and design before committing to changes, preventing costly rework from decisions made without adequate investigation
C. Plan mode disables all built-in tools during the planning phase
D. Plan mode is purely cosmetic and has no effect on how changes are made

**Q114.** During a large, multi-phase exploration task, verbose discovery output threatens to fill up the main conversation's context. What mechanism helps isolate this discovery phase?
A. Direct execution, run in parallel with plan mode simultaneously
B. Disabling all tools during discovery to reduce output volume
C. The Explore subagent, which isolates verbose discovery output and returns summaries to the main conversation
D. There is no mechanism for isolating verbose discovery output

**Q115.** A migration affects 45+ files and requires choosing between integration approaches with different infrastructure implications. Which approach is most appropriate?
A. Direct execution, since the number of files affected has no bearing on the choice
B. A single-file bug fix workflow, since file count is not actually relevant to task type
C. Neither approach; the task should be handled entirely outside Claude Code
D. Plan mode, given the scale of change and multiple valid architectural approaches involved

**Q116.** A developer plans a library migration in plan mode, then wants to actually implement the planned approach. What is the appropriate next step?
A. Discard the plan and begin the migration from scratch with no reference to what was planned
B. Start an entirely new, unrelated plan mode session with no connection to the completed plan
C. Remain in plan mode indefinitely, since plan mode alone can make the actual code changes
D. Switch to direct execution to implement the approach that was planned

**Q117.** Which factor most strongly favors plan mode over direct execution for a given task?
A. The presence of multiple valid implementation approaches and significant architectural implications
B. The task involving more than one file, regardless of whether the changes are independent and simple
C. The task being expected to take more than five minutes regardless of complexity
D. The task involving any use of the Bash tool

### Task 3.5: Apply iterative refinement techniques for progressive improvement

**Q118.** Natural-language descriptions of a required data transformation are producing inconsistent results across attempts. What is the most effective way to clarify the requirement?
A. Add more adjectives to the natural-language description to increase precision
B. Repeat the same prose description multiple times in the same prompt
C. Provide 2-3 concrete input/output examples showing the exact expected transformation
D. Switch to a completely different, unrelated task instead of clarifying the current one

**Q119.** A developer wants Claude Code to progressively improve an implementation against a well-defined set of behavioral requirements. What is an effective test-driven iteration approach?
A. Write a single vague test with no specific assertions and consider it sufficient
B. Write test suites covering expected behavior, edge cases, and performance requirements first, then iterate by sharing test failures to guide progressive improvement
C. Write the implementation first with no tests, then write tests afterward purely for documentation
D. Avoid tests entirely and rely solely on manual, ad hoc verification

**Q120.** Before implementing a solution in an unfamiliar domain (e.g., a caching layer with unclear invalidation requirements), what pattern helps surface considerations the developer may not have anticipated?
A. Immediately implementing the most obvious solution and revising only if it fails in production
B. The interview pattern — having Claude ask clarifying questions before implementation begins
C. Refusing to proceed until the developer has independently researched every edge case beforehand
D. Delegating the entire decision to a randomly selected subagent with no domain context

**Q121.** A migration script mishandles null values in a specific edge case. What is the most effective way to fix this through iteration?
A. Describe the problem only in vague, general terms without a concrete example
B. Ignore the edge case since it represents a small fraction of expected inputs
C. Provide a specific test case with example input and expected output for the null-value scenario
D. Rewrite the entire migration script from scratch with no reference to the specific failure

**Q122.** A pull request has three separate but interacting issues where fixing one affects how the others should be addressed. What is the most effective way to communicate this for iteration?
A. Address all interacting issues together in a single detailed message, since they affect each other
B. Escalate immediately to a human without attempting any iteration
C. Always fix issues strictly one at a time in separate messages, regardless of whether they interact
D. Ignore the interactions and let each fix be applied independently with no coordination

**Q123.** Two independent, non-interacting bugs are found in the same file. What is a reasonable iteration approach?
A. Address them sequentially, since they don't affect one another and sequential iteration keeps each fix focused
B. They must always be combined into a single message regardless of whether they interact
C. Neither can be fixed until the other is fixed first, even though they're independent
D. Independent bugs should never be iterated on using test failures

**Q124.** Why are concrete input/output examples generally more effective than additional prose description when a transformation's requirements are being interpreted inconsistently?
A. Concrete examples are less precise than prose and should be avoided
B. Concrete examples remove ambiguity by demonstrating the exact expected transformation, rather than relying on natural language that can be interpreted multiple ways
C. There is no difference in effectiveness between examples and prose descriptions
D. Prose descriptions are always unambiguous regardless of length

### Task 3.6: Integrate Claude Code into CI/CD pipelines

**Q125.** A CI pipeline script runs claude "Analyze this pull request for security issues" but the job hangs indefinitely, with logs showing Claude Code waiting for interactive input. What is the correct fix?
A. Add the -p (or --print) flag to run Claude Code in non-interactive mode
B. Add a --batch flag to the command
C. Redirect stdin from /dev/null as the sole fix, with no change to the command itself
D. Set a CLAUDE_HEADLESS environment variable before running the command

**Q126.** A CI-invoked Claude Code review needs to post machine-parseable findings as inline PR comments automatically. Which CLI flags support this?
A. --output-format json together with --json-schema to enforce structured, machine-parseable output
B. --interactive, to allow a human to format the output manually before posting
C. -p alone, with no structured output flags, since plain text output is trivially machine-parseable
D. There is no way to produce structured output from Claude Code in CI

**Q127.** A team wants Claude Code, when re-run in CI after new commits, to avoid duplicating comments about issues already flagged in a prior review pass. What should be included in context?
A. A random sample of unrelated past pull requests for general context
B. Only the newest commit's diff with no reference to any earlier findings
C. Nothing from prior runs, since each CI run should be treated as fully independent with no memory of past reviews
D. The prior review findings, with an instruction to report only new or still-unaddressed issues

**Q128.** Automated test generation in CI keeps suggesting test scenarios that duplicate cases already covered by the existing test suite. What context addition would most directly reduce this?
A. Disabling test generation for any file that already has some test coverage, regardless of coverage completeness
B. Providing the existing test files in context so generation can avoid suggesting already-covered scenarios
C. Increasing the number of parallel CI jobs running test generation
D. Removing all existing tests from the repository before generation runs

**Q129.** CI-generated tests are frequently low-value (e.g., testing trivial getters) despite the team having clear standards for what constitutes a valuable test. What is the most direct fix?
A. Switch to a completely different, unrelated CI tool
B. Reduce the frequency of CI test generation runs, without addressing test quality directly
C. Document testing standards, valuable test criteria, and available fixtures in CLAUDE.md so CI-invoked Claude Code has that context
D. Manually delete low-value tests after every CI run with no change to the generation process itself

**Q130.** Why is an independent Claude Code review instance generally more effective at catching issues in generated code than having the same session that generated the code review its own output?
A. There is no meaningful difference in effectiveness between the two approaches
B. The same session is always more effective, since it already has full context of what it built
C. The same session retains reasoning context from generation, making it less likely to question its own prior decisions, while an independent instance reviews without that bias
D. Independent review instances cannot access the code at all and must guess at its content

---

## Domain 4: Prompt Engineering & Structured Output (Q131–Q170)

### Task 4.1: Design prompts with explicit criteria to improve precision and reduce false positives

**Q131.** A code-review prompt instructs Claude to 'check that comments are accurate.' Reviewers report high false-positive rates on relatively subjective judgment calls. Which prompt revision would most directly improve precision?
A. Adding the instruction 'be conservative' alongside the existing vague wording
B. Adding the instruction 'only report high-confidence findings' alongside the existing vague wording
C. Removing comment-related review entirely from the prompt
D. Replacing the vague instruction with explicit criteria, such as 'flag comments only when claimed behavior contradicts actual code behavior'

**Q132.** A team tries adding 'only report high-confidence findings' to reduce a review agent's false positives, but the false-positive rate doesn't meaningfully improve. What does this suggest?
A. Confidence-based filtering with vague instructions doesn't address the underlying issue as effectively as specific, categorical criteria defining exactly what to report versus skip
B. It suggests the review task should be abandoned entirely
C. It suggests false positives are unrelated to the prompt and can only be fixed by switching models
D. It suggests the model is incapable of following any instructions about report confidence

**Q133.** One review category (e.g., minor style suggestions) has an especially high false-positive rate and is undermining developer trust in the tool overall, including in other, more accurate categories. What is a reasonable interim step while the prompt for that category is improved?
A. Permanently disable the category with no plan to ever improve or re-enable it
B. Temporarily disable that specific high-false-positive category to preserve trust in the accurate categories
C. Ignore the trust impact, since false positives in one category shouldn't affect perception of others
D. Disable the entire review tool across all categories, including the accurate ones

**Q134.** What is the main weakness of instructing a review agent to 'be conservative' when trying to reduce false positives?
A. It guarantees zero false positives regardless of task
B. It has the exact same effect as defining explicit severity criteria with examples
C. It is a vague, general instruction that doesn't define specific, actionable criteria for what should and shouldn't be flagged
D. It is a highly specific instruction that leaves no room for the model to misinterpret it

**Q135.** A team wants consistent severity classification (e.g., critical/major/minor) across many review findings. What approach best achieves this?
A. Using a single severity level for all findings to avoid inconsistency
B. Leaving severity entirely to the model's independent judgment with no defined criteria
C. Defining explicit severity criteria with concrete code examples illustrating each severity level
D. Removing severity classification from the output entirely

**Q136.** Why do high false-positive rates in one review category tend to undermine trust in other, more accurate categories from the same tool?
A. Developers who repeatedly see incorrect flags in one category tend to discount or distrust the tool's output more broadly, even where it is accurate
B. This effect only occurs if the tool has fewer than two review categories total
C. False positives in one category have no bearing on perception of unrelated categories
D. High false-positive rates always improve overall developer trust by demonstrating thoroughness

**Q137.** Which of the following is the most effective way to define what a review agent should report, given the objective of reducing false positives?
A. No criteria at all, relying entirely on the model's default judgment
B. A requirement that the agent report every possible deviation from an idealized style, regardless of severity
C. Specific criteria defining which issues to report (e.g., bugs, security) versus which to skip (e.g., minor style, local patterns)
D. A single instruction to 'flag anything that seems off'

### Task 4.2: Apply few-shot prompting to improve output consistency and quality

**Q138.** Detailed written instructions alone are producing inconsistently formatted output for a review task. What technique is most effective for achieving consistent formatting?
A. Repeating the same written instructions multiple times within the same prompt
B. Reducing the level of detail in the written instructions
C. Switching the task from a review task to a purely generative task
D. Few-shot examples demonstrating the exact desired output format

**Q139.** A tool-selection prompt struggles with ambiguous requests that could plausibly route to more than one tool. What technique helps the model generalize good judgment to similar, novel ambiguous cases?
A. Disabling all but one tool so ambiguity cannot occur
B. Removing ambiguous cases from the training data used to build the model
C. An exhaustive, hard-coded list attempting to cover every possible ambiguous case explicitly
D. Few-shot examples that demonstrate reasoning for why one action was chosen over plausible alternatives in ambiguous scenarios

**Q140.** How many targeted few-shot examples are generally recommended for clarifying an ambiguous scenario, per standard guidance?
A. Zero examples, since detailed written instructions alone are always sufficient
B. 50 or more examples, since more is always strictly better regardless of task
C. Exactly one example, since additional examples never help
D. A small, targeted set — roughly 2-4 examples

**Q141.** An extraction task frequently hallucinates values when source documents use informal measurements or unusual document structures. What technique most directly reduces this?
A. Switching to a purely rule-based, non-LLM extraction system for all documents
B. Removing informal-format documents from the pipeline entirely, with no attempt to handle them
C. Increasing the required output length to force more detail regardless of source content
D. Few-shot examples demonstrating correct extraction from documents with varied, informal formats

**Q142.** Why can few-shot examples help a model generalize better than an exhaustive list of hard-coded rules for every possible case?
A. Few-shot examples only work for cases that exactly match one of the provided examples, with no generalization
B. Few-shot examples work identically to hard-coded rules with no meaningful difference in generalization
C. Exhaustive hard-coded rule lists always generalize better than a handful of examples
D. Well-chosen examples demonstrate underlying reasoning patterns that the model can apply to novel cases not explicitly covered by any single example

**Q143.** A test-coverage review agent needs to judge branch-level test coverage gaps that are inherently somewhat subjective. What technique helps the agent apply consistent judgment across novel code patterns?
A. Randomizing which branches get flagged to avoid bias
B. Removing coverage-gap judgment from the review scope entirely
C. A single fixed numeric threshold with no examples, applied uniformly regardless of context
D. Few-shot examples showing how similar prior coverage-gap judgments were made, so the agent can extend that reasoning to new patterns

**Q144.** What is a key benefit of including few-shot examples that distinguish acceptable code patterns from genuine issues, specifically for reducing false positives?
A. It shows the model concrete examples of what should NOT be flagged, in addition to what should, sharpening the boundary between acceptable and problematic patterns
B. It only helps with true positives and cannot influence false positive rates
C. It works only if every possible acceptable pattern is explicitly enumerated as its own example
D. It has no effect on false positives, only on formatting consistency

### Task 4.3: Enforce structured output using tool use and JSON schemas

**Q145.** A team wants a guaranteed, schema-compliant structured output with no risk of JSON syntax errors. What is the most reliable approach?
A. Increasing max_tokens, which has no direct bearing on schema compliance
B. Post-processing free-form text output with a regular expression to extract JSON-like substrings
C. Using tool_use with a defined JSON schema, extracting the structured data from the tool_use response
D. Asking the model in plain-language instructions to 'always return valid JSON' with no tool_use

**Q146.** Does enforcing strict JSON schema compliance via tool_use guarantee that the extracted values are semantically correct (e.g., that line items sum to the stated total)?
A. Yes — schema-compliant structured output via tool_use guarantees full semantic correctness with no further validation needed
B. Semantic correctness is guaranteed only if max_tokens is set sufficiently high
C. Schema compliance and semantic correctness are the same concept with no distinction
D. No — tool_use with a schema eliminates JSON syntax errors but does not prevent semantic errors like incorrect totals or misplaced values

**Q147.** A document may or may not contain a specific piece of information the schema is trying to extract (e.g., a phone number). How should that schema field typically be designed to prevent the model from fabricating a value?
A. As an optional/nullable field, so the model can return null instead of inventing a plausible-looking value
B. As a field with a hard-coded default value inserted regardless of whether it appears in the source
C. The field should be removed from the schema entirely rather than made optional
D. As a required field with no null option, forcing the model to always produce some value

**Q148.** A schema field represents a category that may not cover every real-world case observed in source documents. What pattern helps handle unanticipated categories gracefully?
A. A free-text field with no enum constraint at all, discarding the benefit of categorization entirely
B. Rejecting any document that doesn't fit a predefined category
C. An enum with an "other" value paired with a free-text detail string for extensible categorization
D. A rigid enum with no "other" option, forcing every case into one of the predefined categories regardless of fit

**Q149.** Multiple extraction schemas exist for different document types, and the document type is unknown in advance. Which tool_choice setting ensures structured output is guaranteed while still letting the model choose the appropriate schema/tool?
A. There is no tool_choice setting that fits this scenario
B. A forced tool selection naming one specific schema regardless of document type
C. tool_choice: "auto", since auto guarantees a tool is always called
D. tool_choice: "any"

**Q150.** A team needs a specific extraction tool (e.g., extract_metadata) to run before any enrichment tools, deterministically, as the very first step. Which configuration achieves this?
A. tool_choice: "any", which guarantees the exact same tool is chosen every time
B. tool_choice: "auto", which guarantees a fixed calling order across all available tools
C. There is no way to force a specific tool to run first
D. Forced tool selection: tool_choice: {"type": "tool", "name": "extract_metadata"}

**Q151.** Source documents use inconsistent formatting for the same underlying data (e.g., dates written multiple different ways). Alongside a strict output schema, what should the prompt also include?
A. A requirement to always preserve the source's original inconsistent formatting verbatim in the output
B. Nothing further — the schema alone always normalizes inconsistent source formatting automatically
C. Instructions to reject any document with inconsistent formatting rather than normalize it
D. Format normalization rules describing how to handle inconsistent source formatting

### Task 4.4: Implement validation, retry, and feedback loops for extraction quality

**Q152.** A structured extraction fails schema validation. What is the most effective retry strategy?
A. Retry with a completely unrelated document to see if the schema itself is at fault
B. Send a follow-up request that includes the original document, the failed extraction, and the specific validation error, so the model can self-correct
C. Retry with the exact same prompt and no additional information about what failed
D. Abandon the document immediately without any retry attempt

**Q153.** A validation failure occurs because the required information is simply absent from the source document, not because of a formatting issue. Will a retry-with-feedback loop resolve this?
A. No — retries are ineffective when the required information isn't present in the source at all, regardless of how the error is communicated
B. Yes, but only if the retry prompt is worded more politely
C. Retries are equally effective for missing-information errors and formatting errors
D. Yes — retries always succeed eventually if enough attempts are made, regardless of whether the information exists in the source

**Q154.** A team wants to systematically understand which code constructs trigger false-positive findings that developers repeatedly dismiss. What structured output addition supports this analysis?
A. A detected_pattern field on each finding, enabling systematic analysis of dismissal patterns over time
B. Randomly sampling findings with no structured pattern tracking
C. Removing all metadata from findings to keep output minimal
D. A single boolean 'is_valid' field with no further detail

**Q155.** An invoice extraction pipeline wants to catch cases where line items don't sum to the stated total, a semantic (not syntactic) error. What design supports this kind of self-correction check?
A. Relying solely on strict JSON schema enforcement, since it also guarantees semantic totals match
B. Rejecting the schema field for totals entirely to avoid the possibility of mismatches
C. Rounding all monetary values to the nearest whole number to eliminate mismatches
D. Extracting both a calculated_total (derived from line items) and the stated_total from the document, then flagging discrepancies between them

**Q156.** Which type of validation error is most likely to be fixed successfully by a retry-with-feedback loop?
A. An error in a document written in a completely different, unsupported language with no translation possible
B. A format or structural output error, such as a malformed field, which the model can correct once shown the specific validation message
C. An error caused by information that never appeared anywhere in the source document
D. An error caused by a document that was never actually provided to the model at all

**Q157.** Two sources within the same document conflict about a customer's stated shipping preference. What structured output approach helps flag this rather than silently picking one value?
A. A conflict_detected boolean (or similar structured flag) added to the extraction output when inconsistent source data is found
B. Silently defaulting to whichever value appears first in the document with no flag
C. Omitting the field entirely whenever any conflict is detected, with no indication a conflict occurred
D. Always defaulting to the most recently mentioned value with no flag or annotation

**Q158.** What is the core difference between a semantic validation error and a schema syntax error in a structured extraction pipeline?
A. A semantic error only occurs in numeric fields, never in text fields
B. A schema syntax error can only occur when tool_use is not used at all, and using tool_use eliminates all semantic errors too
C. There is no meaningful difference; both are resolved identically by strict tool_use schemas
D. A semantic error means values are individually well-formed but incorrect or inconsistent (e.g., don't sum correctly), while a schema syntax error means the output doesn't even conform to the expected JSON structure

### Task 4.5: Design efficient batch processing strategies

**Q159.** A team needs blocking, pre-merge code review results that developers wait on before merging. Should this use the Message Batches API?
A. It doesn't matter which API is used, since both provide identical latency guarantees
B. Yes — the Batch API is always the right default for any Claude workload due to its cost savings
C. Yes, as long as polling is used frequently enough, since polling frequency guarantees fast completion
D. No — batch processing has no guaranteed latency SLA and can take up to 24 hours, making it unsuitable for a blocking, time-sensitive workflow

**Q160.** A weekly technical debt report generated overnight for review the next morning is a good candidate for which API approach?
A. Neither API; this workload should not use Claude at all
B. A blocking pre-merge check API pattern, since report generation is functionally identical to a pre-merge check
C. The synchronous, real-time Messages API, since overnight reports always require the lowest possible latency
D. The Message Batches API, since the workload is non-blocking and latency-tolerant, and batch processing offers meaningful cost savings

**Q161.** How are individual batch request/response pairs correlated with each other when using the Message Batches API?
A. By the exact order requests were submitted, with no explicit identifier needed or used
B. Using custom_id fields assigned to each request
C. Batch responses cannot be reliably correlated with their original requests
D. By timestamp alone, with no dedicated correlation identifier

**Q162.** A batch job needs to guarantee results within a 30-hour SLA, given the Batch API's up-to-24-hour processing window. How should submission frequency be planned?
A. Submit once per week regardless of the SLA, since batch processing time has no bearing on submission frequency
B. Submit continuously with no defined windows, since the Batch API has no maximum processing time to plan around
C. The SLA is irrelevant to submission frequency since the Batch API always completes within one hour
D. Submit in windows small enough (e.g., roughly every 4-6 hours) that even the worst-case 24-hour batch processing time still lands within the 30-hour SLA

**Q163.** Some documents in a large batch submission fail processing. What is the most efficient way to handle this?
A. Resubmit the entire original batch of all documents regardless of which ones failed
B. Identify the failed documents by their custom_id, and resubmit only those (with any necessary modifications, such as chunking oversized documents)
C. Discard the failed documents permanently with no attempt at resubmission
D. Switch immediately to the synchronous API for the entire remaining batch with no further batch usage

**Q164.** Before submitting a very large volume of documents to the Batch API, what practice helps maximize first-pass success and reduce costly resubmissions?
A. Refining the prompt against a smaller sample set first, before committing the full volume to batch processing
B. Submitting the full volume immediately with no sample testing, since batch processing is inherently error-free
C. Skipping prompt refinement entirely, since the Batch API automatically retries failed extractions with an improved prompt
D. Reducing the sample size to zero documents to save time before the full batch run

### Task 4.6: Design multi-instance and multi-pass review architectures

**Q165.** A model that generated a piece of code is then asked, in the same session, to review that code for bugs. Why might this self-review be less effective than an independent review?
A. There is no meaningful difference between self-review and independent review
B. Self-review is only less effective when extended thinking is disabled
C. The model retains reasoning context from generation in the same session, making it less likely to question its own prior decisions
D. Self-review in the same session is always more effective than independent review, since it retains full context

**Q166.** What is the most effective way to catch subtle issues in generated code, compared to instructing the same session to double-check its own work?
A. Enabling extended thinking within the same generating session as an equivalent substitute for independent review
B. Reducing the amount of code generated per session, with no change to the review process itself
C. Instructing the same session, in the same context, to 'review your work carefully' as the primary mitigation
D. Using a second, independent Claude instance without the generator's reasoning context to review the code

**Q167.** A 14-file pull request reviewed in a single pass produces inconsistent depth and contradictory findings across files. How should the review be restructured?
A. Split into per-file local analysis passes plus a separate integration pass examining cross-file data flow
B. Split into per-file passes only, with no cross-file integration pass at all
C. Combine the review with an unrelated task in the same pass to add more context
D. Keep the single pass structure but request the model try harder to be consistent

**Q168.** What is the purpose of having a model self-report a confidence score alongside each finding in a verification pass?
A. Confidence scores have no practical use in review architecture design
B. To determine which model tier was originally used to generate the finding
C. To enable calibrated review routing, such as prioritizing human attention on lower-confidence findings
D. To automatically eliminate the need for any independent review pass

**Q169.** Why might a per-file local analysis pass miss certain classes of issues that a separate cross-file integration pass is designed to catch?
A. Per-file passes are strictly incapable of finding any bugs of any kind
B. Local passes only apply to test files, never to production code
C. Cross-file integration passes and per-file passes always find identical sets of issues
D. Cross-file data-flow issues only become apparent when considering how multiple files interact, which a purely local, single-file pass cannot see

**Q170.** What tradeoff does splitting a review into more granular passes (per-file plus integration) generally introduce compared to a single combined pass?
A. No tradeoff at all — splitting passes has strictly zero cost of any kind
B. It eliminates the need for any human review afterward
C. It guarantees fewer total tokens used compared to a single pass, with no other effects
D. Additional orchestration and potentially more total API calls, in exchange for more consistent depth and fewer contradictory findings

---

## Domain 5: Context Management & Reliability (Q171–Q200)

### Task 5.1: Manage conversation context to preserve critical information across long interactions

**Q171.** A long customer support conversation is progressively summarized to save context space, and a specific refund percentage the customer was quoted gets lost in the process. What risk does this illustrate?
A. Progressive summarization can condense away specific numerical values, dates, and customer-stated expectations that matter for accuracy
B. This risk only applies to non-numeric information, never to numbers or dates
C. Progressive summarization always preserves every numerical detail perfectly by design
D. Summarization has no effect on which details remain accessible later in the conversation

**Q172.** A model given a very long aggregated input reliably processes information at the beginning and end but tends to omit findings buried in the middle. What is this effect called, and what mitigation helps?
A. The 'lost in the middle' effect; placing key findings summaries at the start and organizing detailed results with explicit section headers helps mitigate it
B. This effect does not exist and is not a real consideration for context management
C. The 'context collapse' effect; the only mitigation is reducing total input length to zero
D. The 'end bias' effect; the only mitigation is removing all content from the beginning of the input

**Q173.** An order-lookup tool returns 40+ fields, but only about 5 are actually relevant to the customer's return request. What is the most effective context management practice here?
A. Including all 40+ fields verbatim every time to avoid any risk of losing relevant data
B. Summarizing the entire 40+ field result into a single vague sentence with no specific fields retained
C. Trimming the verbose tool output to only the relevant fields before it accumulates in context
D. Discarding the tool result entirely rather than trimming it

**Q174.** In a multi-issue customer support session, what context management pattern helps preserve transactional facts (amounts, dates, order numbers, statuses) accurately across a long, summarized conversation?
A. Storing transactional facts only in the model's own memory with no explicit prompt inclusion
B. Extracting these facts into a persistent 'case facts' block included in each prompt, kept outside the summarized history
C. Relying entirely on the summarized conversation history with no separate persistent structure
D. Discarding transactional facts once the relevant tool call has completed

**Q175.** When making subsequent API requests within a multi-turn conversation, what is required to maintain conversational coherence given that the API itself does not retain state?
A. Passing only the single most recent message with no prior history, since the API automatically retains full state
B. Passing no history at all and relying on the model's general training to infer context
C. Passing a randomly selected subset of prior messages each time
D. Passing the complete relevant conversation history in each subsequent request

### Task 5.2: Design effective escalation and ambiguity resolution patterns

**Q176.** A customer explicitly says 'I want to speak to a human' early in the conversation, even though the issue seems straightforward. What is the appropriate agent behavior?
A. Attempt to fully resolve the issue autonomously first, and only escalate if the agent itself judges it necessary
B. Ask the customer to justify why they want a human before proceeding
C. Honor the explicit request for a human immediately, without first attempting to investigate or resolve the issue autonomously
D. Ignore the request since the issue is likely simple enough for the agent to resolve

**Q177.** A customer expresses frustration but describes an issue that is well within the agent's documented capability to resolve. What is the appropriate approach?
A. Ignore the expressed frustration entirely and proceed with a purely mechanical resolution
B. Acknowledge the frustration while offering to resolve the issue, escalating only if the customer reiterates a preference for a human
C. Refuse to engage until the customer's tone becomes neutral
D. Escalate immediately based on the detected frustration alone, regardless of the issue's actual complexity

**Q178.** Why are self-reported model confidence scores generally considered an unreliable basis for automated escalation decisions?
A. Confidence scores are reliable but too expensive to compute in practice
B. A model can be confidently wrong on genuinely hard or ambiguous cases, so its own confidence doesn't reliably track actual case complexity
C. Confidence scores are unreliable only when extended thinking is disabled
D. Self-reported confidence scores are always perfectly calibrated and should be trusted as the sole escalation trigger

**Q179.** A policy addresses price matching against the company's own past sales but says nothing about matching a competitor's price. A customer requests a competitor price match. What should the agent do?
A. Automatically deny the request, since anything not explicitly permitted must be assumed forbidden with no escalation
B. Automatically approve the competitor price match by analogy to the own-site policy, since the situations seem similar
C. Ignore the request entirely and provide no response of any kind
D. Escalate, since the policy is silent/ambiguous on this specific scenario rather than clearly permitting or denying it

**Q180.** A tool lookup returns multiple possible customer matches for the identifying information provided so far. What is the appropriate agent behavior?
A. Select the first match returned by the tool and proceed as if it were confirmed correct
B. Ask the customer for additional identifiers to narrow down the correct match, rather than heuristically guessing which one is correct
C. Refuse to proceed and escalate immediately without ever asking a clarifying question
D. Select whichever match has the most recent activity, without confirming with the customer

### Task 5.3: Implement error propagation strategies across multi-agent systems

**Q181.** A web search subagent times out. What information should be included when this failure is reported back to the coordinator?
A. A generic 'search unavailable' status with no further detail
B. Structured error context including the failure type, the attempted query, any partial results, and potential alternative approaches
C. No report at all; the coordinator should assume success by default
D. Only a raw stack trace with no interpretation of what it means for the task

**Q182.** What is the key difference between an access failure (like a timeout) and a valid empty result in error reporting design?
A. An access failure means the query couldn't be completed and may warrant a retry, while a valid empty result means the query succeeded but simply found nothing
B. There is no meaningful difference; both should always be treated as fatal errors requiring workflow termination
C. A valid empty result should always be treated identically to an access failure requiring a retry
D. An access failure should always be silently converted into a valid empty result to simplify handling

**Q183.** Why do uniform, generic error statuses (e.g., a single 'error' flag with no further detail) hurt a coordinator's ability to recover from subagent failures?
A. Generic error statuses actually improve coordinator recovery by simplifying the decision space
B. They hide the specific context (cause, what was attempted, partial results) the coordinator needs to decide whether to retry, try an alternative, or proceed with partial results
C. Generic error statuses have no effect on the coordinator's behavior at all
D. Generic error statuses are only a problem when there are more than five subagents involved

**Q184.** Which two anti-patterns should be avoided when a subagent fails during a multi-agent workflow?
A. Distinguishing access failures from valid empty results, and including partial results in error reports
B. Both are recommended, correct practices with no downside
C. Silently suppressing the error by returning empty results as if successful, and terminating the entire workflow over a single subagent failure
D. Attempting local recovery for transient failures, and reporting structured error context to the coordinator

**Q185.** A subagent experiences a transient failure that resolves itself after one local retry. Should this be propagated to the coordinator as an error?
A. Yes — every transient failure must always be propagated to the coordinator regardless of whether it was resolved locally
B. It should be propagated only if the coordinator explicitly polls for it every single turn
C. No — since the subagent resolved it locally, only errors that cannot be resolved locally need to be propagated
D. Yes, but only after the entire workflow has otherwise completed successfully

### Task 5.4: Manage context effectively in large codebase exploration

**Q186.** During an extended codebase-exploration session, the model starts giving inconsistent answers and referring to 'typical patterns' instead of the specific classes it discovered earlier in the session. What does this most likely indicate?
A. A sign that the codebase itself has become inconsistent and needs to be rewritten
B. Context degradation in the extended session, where earlier specific findings are being lost or diluted as the session grows
C. A guaranteed indicator of a bug in the underlying API with no relation to session length
D. A sign that the model has stopped using any tools at all

**Q187.** What role do scratchpad files play in managing context during long, multi-phase codebase investigations?
A. They replace the need for any tool use during the investigation
B. They are used exclusively for storing unrelated personal notes with no bearing on the investigation
C. They persist key findings across context boundaries so the agent can reference them later rather than losing or rediscovering the information
D. They automatically delete themselves after each turn, providing no persistence benefit

**Q188.** A main agent needs to answer high-level questions about a large codebase without its own context being consumed by verbose exploration details. What pattern helps?
A. Refusing to explore the codebase at all until the entire structure is manually documented by a human first
B. Delegating specific investigative questions (e.g., 'find all test files') to subagents, while the main agent preserves high-level coordination
C. Having the main agent personally read every file in the codebase directly with no delegation
D. Disabling all tools for the main agent to force it to answer from prior training alone

**Q189.** A long-running multi-agent exploration process needs to support recovery if it crashes partway through. What design supports this?
A. No recovery mechanism is possible; any crash requires restarting the entire exploration from scratch with no partial credit
B. Recovery relies solely on the developer manually re-typing everything that was previously discovered
C. Recovery is handled automatically with no explicit state export required from any agent
D. Structured state persistence, where each agent exports its state to a known location and the coordinator loads a manifest on resume

**Q190.** During an extended exploration session, context usage grows large with verbose discovery output that is no longer all needed. Which built-in mechanism helps reduce context usage in this situation?
A. /memory, which only reports loaded memory files rather than reducing context usage
B. --resume, which continues a named session but does not itself reduce accumulated context
C. There is no mechanism for reducing context usage mid-session
D. /compact

### Task 5.5: Design human review workflows and confidence calibration

**Q191.** An extraction pipeline reports 97% aggregate accuracy. Why might this figure still be insufficient to justify reducing human review across the board?
A. Aggregate accuracy can mask much lower performance on specific document types or fields, which only shows up when accuracy is measured at a more granular level
B. A 97% aggregate figure is mathematically impossible unless every segment also performs at 97%
C. Aggregate accuracy has no relationship to field-level or document-type-level performance
D. Aggregate accuracy figures are always fully representative of every document type and field with no possible masking effect

**Q192.** What technique helps measure error rates specifically within extractions the model reported as high-confidence, and helps detect novel error patterns over time?
A. A one-time review performed only at initial system launch, with no ongoing sampling
B. Relying solely on customer complaints as the only error-detection mechanism
C. Reviewing only low-confidence extractions, since high-confidence ones are assumed error-free by definition
D. Stratified random sampling of high-confidence extractions for ongoing measurement

**Q193.** How should field-level confidence scores typically be calibrated before being used to route items to human review?
A. Confidence scores require no calibration and can be used directly as raw model output with no validation
B. Calibration is unnecessary since all models produce identically calibrated confidence scores by default
C. Using labeled validation sets to calibrate what a given confidence score actually corresponds to in real accuracy
D. Calibration should be performed using entirely unlabeled data, with no ground truth involved

**Q194.** Before reducing human review for a high-confidence extraction category, what should be verified first?
A. That the aggregate accuracy number alone exceeds some threshold, with no further segmentation needed
B. That accuracy is consistently strong across all relevant document types and fields, not just in aggregate
C. That no human has ever manually reviewed any output from the pipeline
D. That the extraction pipeline has been running for at least one calendar year, regardless of measured accuracy

**Q195.** Which extractions should generally be prioritized for limited human reviewer capacity?
A. Extractions chosen entirely at random with no regard for confidence or document ambiguity
B. Extractions with the highest model confidence, since they are most likely to contain interesting edge cases
C. Only extractions that happen to be the shortest, regardless of confidence or content
D. Extractions with low model confidence or from ambiguous/contradictory source documents

### Task 5.6: Preserve information provenance and handle uncertainty in multi-source synthesis

**Q196.** During a summarization step, individual claim-to-source mappings are compressed away, and the final report can no longer show which source supports which claim. What does this illustrate?
A. Losing source attribution during summarization is not a real risk in multi-agent synthesis
B. Source attribution is automatically preserved through any summarization step with no explicit design needed
C. This only happens when fewer than two sources are used
D. Source attribution can be lost during summarization unless claim-source mappings are explicitly preserved and passed through the pipeline

**Q197.** Two credible sources report different statistics for the same figure. What is the recommended way to handle this in the synthesis output?
A. Omit the statistic entirely from the report whenever any conflict exists, with no explanation
B. Annotate the conflict, presenting both values with their source attribution rather than arbitrarily selecting one
C. Average the two conflicting values together and present the average as if it were an agreed-upon figure
D. Silently pick whichever value appears first, discarding the other with no annotation

**Q198.** Why should structured findings include a publication or data-collection date field for time-sensitive statistics?
A. Including a date field guarantees the underlying statistic will never change over time
B. Dates are only relevant for financial data and never for other types of findings
C. Dates are purely decorative metadata with no bearing on how findings should be interpreted
D. Without dates, genuinely different values that reflect different points in time could be misread as contradictory findings from the same period

**Q199.** A synthesis agent combines findings from a financial dataset, a news article, and a technical report into one uniform bulleted-list format for the final output. What consideration does this overlook?
A. All content types should always be converted into a single uniform format regardless of type, since uniformity is the top priority
B. Different content types are often better rendered in the format suited to them (e.g., financial data as tables, news as prose, technical findings as structured lists) rather than forced into one uniform format
C. News content should always be converted into a numeric table format
D. Financial data should never appear in a synthesis report under any circumstances

**Q200.** A document-analysis subagent finds two conflicting values for the same data point within a single source. What is the recommended handling before passing results to the synthesis agent?
A. Average the two values together and report only the average with no indication a conflict existed
B. Complete the analysis with both conflicting values included and explicitly annotated, letting the coordinator decide how to reconcile them
C. Halt the entire document-analysis pass immediately upon detecting any conflict, with no completed output
D. Silently discard one of the two conflicting values with no annotation before passing results onward

---

## Answer Key & Rationale

Each entry states the correct letter and restates the correct answer's core reasoning as the rationale.

### Domain 1: Agentic Architecture & Orchestration
1. **B** — The stop_reason returned by the API — continuing when it is "tool_use" and stopping when it is "end_turn".
2. **D** — The tool result must be appended to the conversation history so Claude can reason about it in the next turn.
3. **D** — Text content can appear alongside a tool_use block in the same response, so treating any text as completion can end the loop while a tool call is still pending.
4. **B** — Claude reasons about which tool to call next based on context at each step, rather than following a fixed, pre-determined sequence.
5. **A** — The loop may be cut off mid-task while stop_reason still indicates "tool_use," producing an incomplete result instead of relying on the model's own completion signal.
6. **C** — It relies on a probabilistic, non-guaranteed signal (specific wording in generated text) instead of the deterministic stop_reason field the API already provides.
7. **C** — Each response's stop_reason determines whether that specific turn requires executing a requested tool and continuing, or whether the task is genuinely finished.
8. **D** — Send a request, inspect stop_reason, execute any requested tool if stop_reason is "tool_use," append the result to history, and repeat until stop_reason is "end_turn".
9. **C** — Managing all inter-subagent communication, error handling, and information routing, rather than letting subagents communicate directly with each other.
10. **A** — No — subagents operate with isolated context and do not automatically inherit the coordinator's conversation history.
11. **C** — The coordinator's task decomposition was too narrow, so subagents were never assigned the missing domains in the first place.
12. **D** — The coordinator dynamically analyzes query requirements and selects only the subagents needed, rather than always routing every query through the full pipeline.
13. **B** — By assigning distinct subtopics or distinct source types to each subagent so their work does not overlap.
14. **A** — Evaluate the synthesis output for gaps, re-delegate to search/analysis subagents with targeted follow-up queries, and re-invoke synthesis until coverage is sufficient.
15. **D** — Routing through the coordinator preserves observability, consistent error handling, and controlled information flow across the system.
16. **D** — Incomplete coverage of the broader topic, since entire relevant subdomains may never be assigned to any subagent.
17. **A** — "Task" — the Task tool is the mechanism for spawning subagents.
18. **D** — No — subagent context must be explicitly provided in the prompt; subagents do not automatically inherit parent context or share memory between invocations.
19. **A** — Using structured data formats that separate content from metadata (source URLs, document names, page numbers).
20. **A** — By emitting multiple Task tool calls within a single coordinator response, rather than issuing them across separate turns.
21. **D** — The AgentDefinition configuration for that subagent type.
22. **B** — Creating independent branches from a shared analysis baseline to explore divergent approaches.
23. **A** — It reduces the subagent's ability to adapt its approach to what it actually discovers, compared to a prompt that specifies goals and quality criteria.
24. **A** — Subagents don't automatically inherit the coordinator's conversation or other agents' outputs, so needed information must be explicitly included.
25. **A** — Add a programmatic prerequisite that blocks process_refund until get_customer has returned a verified customer ID.
26. **C** — When compliance failures have real consequences (e.g., identity verification before financial operations), since prompt instructions alone have a non-zero failure rate.
27. **D** — Decompose the request into distinct items, investigate each in parallel using shared context, then synthesize a unified resolution.
28. **B** — Customer details, root cause analysis, and recommended actions, since the human agent lacks access to the conversation transcript.
29. **D** — A programmatic gate provides a deterministic guarantee, whereas an LLM following a prompt instruction has a non-zero chance of skipping the step.
30. **B** — A code-level check that blocks the refund tool call until the identity-verification tool has returned a successful, verified result.
31. **A** — Shared context lets the agent synthesize a coherent, unified resolution across concerns rather than producing disconnected, potentially inconsistent responses.
32. **D** — A step where skipping it (e.g., identity verification before a financial transaction) could cause real financial or compliance harm.
33. **B** — A PostToolUse hook that normalizes the heterogeneous data formats into a consistent format before the model processes the tool result.
34. **A** — A hook that intercepts the outgoing tool call, blocks refunds exceeding the threshold, and redirects to the escalation workflow.
35. **A** — Hooks provide deterministic guarantees at the code level, while prompt instructions represent probabilistic compliance that can fail.
36. **B** — PostToolUse.
37. **C** — They should choose hooks, since business rules requiring guaranteed compliance need deterministic enforcement rather than probabilistic LLM compliance.
38. **D** — It can block a policy-violating action before it executes, redirecting to an alternative workflow such as escalation.
39. **A** — A PostToolUse hook that normalizes both formats into a single consistent representation before the model sees them.
40. **D** — Prompt chaining — a fixed sequential pipeline of predictable steps.
41. **A** — Dynamic, adaptive decomposition that generates subtasks based on what is discovered at each step.
42. **D** — To avoid attention dilution across many files, which can cause inconsistent depth and contradictory findings.
43. **B** — Mapping the codebase's structure and identifying high-impact areas before creating a prioritized, adaptive plan.
44. **B** — Whether the workflow's steps and structure are predictable in advance (favoring chaining) or must adapt to what is discovered (favoring dynamic decomposition).
45. **B** — Split into focused per-file passes for local issues plus a separate integration pass for cross-file consistency.
46. **C** — The risk of a fixed plan missing dependencies or complications that are only discovered once work begins.
47. **B** — It provides a clear, structured pipeline suited to the workflow's already-known steps, without the added complexity of runtime plan generation.
48. **D** — Named session resumption using --resume <session-name>.
49. **A** — fork_session — creating independent branches from a shared analysis baseline.
50. **D** — Inform the agent about the specific file changes so it can perform targeted re-analysis rather than relying on stale conclusions.
51. **C** — When the prior session's tool results are stale (e.g., the codebase has changed significantly), making a fresh, injected summary more trustworthy than resumed but outdated context.
52. **B** — Exploring divergent approaches (e.g., comparing two testing strategies) from a shared baseline without one path contaminating the other.
53. **A** — If underlying files have changed since the session's prior analysis, the resumed context may reflect stale, now-inaccurate conclusions.
54. **C** — Resuming the session, since the mostly-valid prior context can be built upon directly.

### Domain 2: Tool Design & MCP Integration
55. **C** — Expand each tool's description to include input formats, example queries, edge cases, and boundaries explaining when to use it versus the similar tool.
56. **D** — The model relies on the description's content to understand a tool's purpose and differentiate it from similar tools when deciding which to call.
57. **B** — Misrouting — the model struggles to reliably differentiate which tool to call for a given request.
58. **B** — Functional overlap with a similarly named/described tool, which was causing unreliable tool selection.
59. **A** — Each tool becomes purpose-specific with a clearer scope, improving the model's ability to select the correct one for a given need.
60. **A** — System prompt wording can create unintended tool associations that override otherwise well-written tool descriptions.
61. **C** — An unrelated marketing tagline for the service the tool wraps.
62. **C** — Improving the clarity and specificity of each tool's description, since this is a low-effort, high-leverage first step.
63. **B** — The agent cannot make an appropriate recovery decision, since it has no information about the type or cause of the failure.
64. **B** — That the tool call resulted in a failure, distinct from a valid successful (even if empty) result.
65. **C** — An isRetryable boolean (or equivalent errorCategory distinguishing transient from validation/permission/business errors).
66. **D** — As a structured business error with retriable: false and a customer-friendly explanation the agent can relay appropriately.
67. **B** — A valid empty result represents a successful query that simply found no matches, while an access failure represents an inability to complete the query and may warrant a retry decision.
68. **D** — Attempt local error recovery within the subagent for transient failures, propagating to the coordinator only errors that cannot be resolved locally.
69. **C** — Transient errors, validation errors, business/policy errors, and permission errors.
70. **A** — The synthesis agent may misuse tools outside its specialization, such as attempting web searches itself, since giving an agent too many tools degrades tool selection reliability.
71. **A** — Scoped tool access — giving each agent only the tools needed for its role, with limited cross-role tools reserved for specific high-frequency needs.
72. **A** — Give the synthesis agent a scoped verify_fact tool for the common case, while still routing complex verifications through the coordinator to the search agent.
73. **C** — The model must call some tool, though it can choose which one, rather than returning plain conversational text.
74. **C** — Forced tool selection specifying the exact tool name (e.g., {"type": "tool", "name": "extract_metadata"}).
75. **C** — Return plain conversational text instead of calling a tool.
76. **D** — Restrict the synthesis agent's tool set to exclude tools outside its role, providing only scoped, relevant tools instead.
77. **D** — Project-level .mcp.json.
78. **B** — User-level ~/.claude.json.
79. **A** — Using environment variable expansion (e.g., ${GITHUB_TOKEN}) rather than hard-coding the raw secret value.
80. **C** — Tools from all configured MCP servers are discovered at connection time and made available to the agent simultaneously.
81. **A** — Enhance the MCP tool's description to more clearly explain its capabilities and outputs, so the model understands when it is the better choice.
82. **C** — Use an existing community MCP server for the standard integration, reserving custom server development for team-specific workflows.
83. **B** — MCP resources, used to expose a content catalog.
84. **A** — Grep — for searching file contents for patterns like function names.
85. **C** — Glob — for file path pattern matching.
86. **B** — Use Read to load the full file, then Write to save the modified version.
87. **D** — Start with Grep to find entry points, then use Read to follow imports and trace flows as needed.
88. **B** — First identify all exported names for the function, then search for each of those names across the codebase.
89. **B** — When the target text to change is unique within the file, allowing a precise, targeted modification.
90. **C** — Read.

### Domain 3: Claude Code Configuration & Workflows
91. **D** — User-level CLAUDE.md settings apply only to that specific user and are not shared with teammates via version control.
92. **A** — Reference external files to keep CLAUDE.md modular, such as importing only the standards files relevant to a given package.
93. **A** — Split it into focused, topic-specific files in .claude/rules/ (e.g., testing.md, api-conventions.md, deployment.md).
94. **C** — /memory.
95. **D** — User-level (~/.claude/CLAUDE.md), project-level (.claude/CLAUDE.md or root CLAUDE.md), directory-level (subdirectory CLAUDE.md files).
96. **B** — Each package's CLAUDE.md can selectively @import only the standards files relevant to that package's maintainers, rather than loading every standard globally.
97. **B** — Topic-specific files are easier to maintain and reason about individually as the project's conventions grow more numerous and varied.
98. **D** — .claude/commands/ in the project repository, so it is version-controlled and shared.
99. **C** — ~/.claude/commands/, since user-scoped commands are personal and not shared via version control.
100. **A** — context: fork, which runs the skill in an isolated sub-agent context.
101. **B** — allowed-tools, configured to restrict tool access during skill execution.
102. **A** — argument-hint.
103. **C** — Create a personal variant with a different name in ~/.claude/skills/.
104. **D** — Skills fit on-demand invocation for task-specific workflows, while CLAUDE.md fits always-loaded, universal standards.
105. **C** — A .claude/rules/ file with YAML frontmatter specifying a glob pattern like **/*.test.tsx so the rule applies based on file type, not directory.
106. **B** — Glob patterns determining which files' edits trigger that rule to load.
107. **B** — Glob patterns can match files by type or name pattern regardless of which directory they're in, while directory-level CLAUDE.md files are bound to a specific directory tree.
108. **D** — It avoids loading irrelevant conventions into context for files the rule doesn't apply to, reducing unnecessary token usage.
109. **C** — A .claude/rules/ file with paths: ["terraform/**/*"] in its YAML frontmatter.
110. **C** — When the convention must apply to files identified by type or pattern regardless of which directory they live in.
111. **D** — Enter plan mode to explore the codebase, understand dependencies, and design an approach before making changes.
112. **C** — Direct execution, since the change is simple and well-scoped.
113. **B** — Safe codebase exploration and design before committing to changes, preventing costly rework from decisions made without adequate investigation.
114. **C** — The Explore subagent, which isolates verbose discovery output and returns summaries to the main conversation.
115. **D** — Plan mode, given the scale of change and multiple valid architectural approaches involved.
116. **D** — Switch to direct execution to implement the approach that was planned.
117. **A** — The presence of multiple valid implementation approaches and significant architectural implications.
118. **C** — Provide 2-3 concrete input/output examples showing the exact expected transformation.
119. **B** — Write test suites covering expected behavior, edge cases, and performance requirements first, then iterate by sharing test failures to guide progressive improvement.
120. **B** — The interview pattern — having Claude ask clarifying questions before implementation begins.
121. **C** — Provide a specific test case with example input and expected output for the null-value scenario.
122. **A** — Address all interacting issues together in a single detailed message, since they affect each other.
123. **A** — Address them sequentially, since they don't affect one another and sequential iteration keeps each fix focused.
124. **B** — Concrete examples remove ambiguity by demonstrating the exact expected transformation, rather than relying on natural language that can be interpreted multiple ways.
125. **A** — Add the -p (or --print) flag to run Claude Code in non-interactive mode.
126. **A** — --output-format json together with --json-schema to enforce structured, machine-parseable output.
127. **D** — The prior review findings, with an instruction to report only new or still-unaddressed issues.
128. **B** — Providing the existing test files in context so generation can avoid suggesting already-covered scenarios.
129. **C** — Document testing standards, valuable test criteria, and available fixtures in CLAUDE.md so CI-invoked Claude Code has that context.
130. **C** — The same session retains reasoning context from generation, making it less likely to question its own prior decisions, while an independent instance reviews without that bias.

### Domain 4: Prompt Engineering & Structured Output
131. **D** — Replacing the vague instruction with explicit criteria, such as 'flag comments only when claimed behavior contradicts actual code behavior'.
132. **A** — Confidence-based filtering with vague instructions doesn't address the underlying issue as effectively as specific, categorical criteria defining exactly what to report versus skip.
133. **B** — Temporarily disable that specific high-false-positive category to preserve trust in the accurate categories.
134. **C** — It is a vague, general instruction that doesn't define specific, actionable criteria for what should and shouldn't be flagged.
135. **C** — Defining explicit severity criteria with concrete code examples illustrating each severity level.
136. **A** — Developers who repeatedly see incorrect flags in one category tend to discount or distrust the tool's output more broadly, even where it is accurate.
137. **C** — Specific criteria defining which issues to report (e.g., bugs, security) versus which to skip (e.g., minor style, local patterns).
138. **D** — Few-shot examples demonstrating the exact desired output format.
139. **D** — Few-shot examples that demonstrate reasoning for why one action was chosen over plausible alternatives in ambiguous scenarios.
140. **D** — A small, targeted set — roughly 2-4 examples.
141. **D** — Few-shot examples demonstrating correct extraction from documents with varied, informal formats.
142. **D** — Well-chosen examples demonstrate underlying reasoning patterns that the model can apply to novel cases not explicitly covered by any single example.
143. **D** — Few-shot examples showing how similar prior coverage-gap judgments were made, so the agent can extend that reasoning to new patterns.
144. **A** — It shows the model concrete examples of what should NOT be flagged, in addition to what should, sharpening the boundary between acceptable and problematic patterns.
145. **C** — Using tool_use with a defined JSON schema, extracting the structured data from the tool_use response.
146. **D** — No — tool_use with a schema eliminates JSON syntax errors but does not prevent semantic errors like incorrect totals or misplaced values.
147. **A** — As an optional/nullable field, so the model can return null instead of inventing a plausible-looking value.
148. **C** — An enum with an "other" value paired with a free-text detail string for extensible categorization.
149. **D** — tool_choice: "any".
150. **D** — Forced tool selection: tool_choice: {"type": "tool", "name": "extract_metadata"}.
151. **D** — Format normalization rules describing how to handle inconsistent source formatting.
152. **B** — Send a follow-up request that includes the original document, the failed extraction, and the specific validation error, so the model can self-correct.
153. **A** — No — retries are ineffective when the required information isn't present in the source at all, regardless of how the error is communicated.
154. **A** — A detected_pattern field on each finding, enabling systematic analysis of dismissal patterns over time.
155. **D** — Extracting both a calculated_total (derived from line items) and the stated_total from the document, then flagging discrepancies between them.
156. **B** — A format or structural output error, such as a malformed field, which the model can correct once shown the specific validation message.
157. **A** — A conflict_detected boolean (or similar structured flag) added to the extraction output when inconsistent source data is found.
158. **D** — A semantic error means values are individually well-formed but incorrect or inconsistent (e.g., don't sum correctly), while a schema syntax error means the output doesn't even conform to the expected JSON structure.
159. **D** — No — batch processing has no guaranteed latency SLA and can take up to 24 hours, making it unsuitable for a blocking, time-sensitive workflow.
160. **D** — The Message Batches API, since the workload is non-blocking and latency-tolerant, and batch processing offers meaningful cost savings.
161. **B** — Using custom_id fields assigned to each request.
162. **D** — Submit in windows small enough (e.g., roughly every 4-6 hours) that even the worst-case 24-hour batch processing time still lands within the 30-hour SLA.
163. **B** — Identify the failed documents by their custom_id, and resubmit only those (with any necessary modifications, such as chunking oversized documents).
164. **A** — Refining the prompt against a smaller sample set first, before committing the full volume to batch processing.
165. **C** — The model retains reasoning context from generation in the same session, making it less likely to question its own prior decisions.
166. **D** — Using a second, independent Claude instance without the generator's reasoning context to review the code.
167. **A** — Split into per-file local analysis passes plus a separate integration pass examining cross-file data flow.
168. **C** — To enable calibrated review routing, such as prioritizing human attention on lower-confidence findings.
169. **D** — Cross-file data-flow issues only become apparent when considering how multiple files interact, which a purely local, single-file pass cannot see.
170. **D** — Additional orchestration and potentially more total API calls, in exchange for more consistent depth and fewer contradictory findings.

### Domain 5: Context Management & Reliability
171. **A** — Progressive summarization can condense away specific numerical values, dates, and customer-stated expectations that matter for accuracy.
172. **A** — The 'lost in the middle' effect; placing key findings summaries at the start and organizing detailed results with explicit section headers helps mitigate it.
173. **C** — Trimming the verbose tool output to only the relevant fields before it accumulates in context.
174. **B** — Extracting these facts into a persistent 'case facts' block included in each prompt, kept outside the summarized history.
175. **D** — Passing the complete relevant conversation history in each subsequent request.
176. **C** — Honor the explicit request for a human immediately, without first attempting to investigate or resolve the issue autonomously.
177. **B** — Acknowledge the frustration while offering to resolve the issue, escalating only if the customer reiterates a preference for a human.
178. **B** — A model can be confidently wrong on genuinely hard or ambiguous cases, so its own confidence doesn't reliably track actual case complexity.
179. **D** — Escalate, since the policy is silent/ambiguous on this specific scenario rather than clearly permitting or denying it.
180. **B** — Ask the customer for additional identifiers to narrow down the correct match, rather than heuristically guessing which one is correct.
181. **B** — Structured error context including the failure type, the attempted query, any partial results, and potential alternative approaches.
182. **A** — An access failure means the query couldn't be completed and may warrant a retry, while a valid empty result means the query succeeded but simply found nothing.
183. **B** — They hide the specific context (cause, what was attempted, partial results) the coordinator needs to decide whether to retry, try an alternative, or proceed with partial results.
184. **C** — Silently suppressing the error by returning empty results as if successful, and terminating the entire workflow over a single subagent failure.
185. **C** — No — since the subagent resolved it locally, only errors that cannot be resolved locally need to be propagated.
186. **B** — Context degradation in the extended session, where earlier specific findings are being lost or diluted as the session grows.
187. **C** — They persist key findings across context boundaries so the agent can reference them later rather than losing or rediscovering the information.
188. **B** — Delegating specific investigative questions (e.g., 'find all test files') to subagents, while the main agent preserves high-level coordination.
189. **D** — Structured state persistence, where each agent exports its state to a known location and the coordinator loads a manifest on resume.
190. **D** — /compact.
191. **A** — Aggregate accuracy can mask much lower performance on specific document types or fields, which only shows up when accuracy is measured at a more granular level.
192. **D** — Stratified random sampling of high-confidence extractions for ongoing measurement.
193. **C** — Using labeled validation sets to calibrate what a given confidence score actually corresponds to in real accuracy.
194. **B** — That accuracy is consistently strong across all relevant document types and fields, not just in aggregate.
195. **D** — Extractions with low model confidence or from ambiguous/contradictory source documents.
196. **D** — Source attribution can be lost during summarization unless claim-source mappings are explicitly preserved and passed through the pipeline.
197. **B** — Annotate the conflict, presenting both values with their source attribution rather than arbitrarily selecting one.
198. **D** — Without dates, genuinely different values that reflect different points in time could be misread as contradictory findings from the same period.
199. **B** — Different content types are often better rendered in the format suited to them (e.g., financial data as tables, news as prose, technical findings as structured lists) rather than forced into one uniform format.
200. **B** — Complete the analysis with both conflicting values included and explicitly annotated, letting the coordinator decide how to reconcile them.

---

### Notes on using this bank
- This is a **practice** resource for self-assessment against the published blueprint, not a copy of live exam items or the guide's own illustrative sample questions.
- The real exam is scenario-based: 4 scenarios drawn from a bank of 6, each anchoring several related questions across its "primary domains." This bank instead organizes questions by domain and task statement for focused, section-by-section study — use it to build fluency in each task statement, then layer in timed scenario practice separately.
- Domain 1 (27%) and the tied Domains 3 and 4 (20% each) account for two-thirds of the exam — budget study time accordingly, but don't neglect Domain 2 (18%) or Domain 5 (15%), which are still a third of the exam combined.
- The official guide's own preparation advice is the best complement to this bank: build a real multi-tool agent with escalation logic, configure Claude Code for a real team workflow, build a structured-extraction pipeline with validation-retry loops, and design/debug a multi-agent research pipeline.
- Always check Anthropic's current, official exam guide before scheduling, since the blueprint is versioned and "subject to change without notice."
# Claude Certified Associate – Foundations (CCAO-F) — 160 Practice Questions

**Independent study resource — not affiliated with or endorsed by Anthropic.** Questions are original and written to match the scope and style of Anthropic's official *Claude Certified Associate – Foundations Exam Guide, v1.0 (effective July 2026, exam code CCAO-F)*. They are **not** drawn from the live exam item bank (which is confidential under Anthropic's NDA). Use this to check your understanding of the blueprint, not as a source of leaked content.

**Exam facts (from the official guide):** 60 items, 120 minutes, multiple-choice and multiple-response (each item states how many answers to pick), scaled score 100–1,000, passing score 720, $99 fee, 12-month validity.

**Domain weights this bank mirrors (160 questions, proportional to the blueprint):**

| # | Domain | Weight | Questions in this bank |
|---|--------|--------|------------------------|
| 1 | Prompting and Task Execution | 14% | 22 (Q1–Q22) |
| 2 | Output Evaluation and Validation | 21% | 34 (Q23–Q56) |
| 3 | Product and Model Selection | 12% | 19 (Q57–Q75) |
| 4 | Workflow Integration and Solution Design | 16% | 26 (Q76–Q101) |
| 5 | Configuration and Knowledge Management | 12% | 19 (Q102–Q120) |
| 6 | Governance, Risk, and Responsible Use | 15% | 24 (Q121–Q144) |
| 7 | Troubleshooting and Optimization | 10% | 16 (Q145–Q160) |

Most items are single-answer multiple-choice (choose one). Items marked **(Select TWO)** are multiple-response — this mirrors the real exam's item format. The full answer key with rationale is in a separate section at the end so you can self-test first.

---

## Domain 1: Prompting and Task Execution (Q1–Q22)

**Q1.** Which combination of elements is most likely to produce a high-quality first draft from Claude?
A. A single-sentence request with no additional detail
B. Clear task, relevant context, constraints, and the desired output format
C. A list of ten unrelated questions in one message
D. A request written entirely in bullet-point keywords with no sentences

**Q2.** An associate wants Claude to draft a 12-page process document. What is the best first step?
A. Ask Claude to write all 12 pages in a single pass
B. Break the request into an outline stage, then draft each section against that outline
C. Ask a different tool to write the outline, then paste it into Claude
D. Write the whole document manually and ask Claude only to proofread it

**Q3.** Claude's first draft of a competitor summary is accurate but too generic to be useful. What is the most effective next step?
A. Start over with a completely different prompt
B. Give specific feedback on what to add, cut, or sharpen, and ask for a revision
C. Accept the draft since it is technically accurate
D. Lower the reasoning effort to save time

**Q4.** Which task type benefits most from an intentionally divergent, open-ended prompt rather than a tightly constrained one?
A. Formatting a table to a fixed schema
B. Brainstorming a wide range of campaign concepts
C. Extracting specific figures from a report
D. Converting a memo into a fixed template

**Q5.** An associate provides Claude with two example emails written in the company's preferred tone before asking it to draft a third. This technique is best described as:
A. Task decomposition
B. Providing examples to anchor style and tone
C. Model selection
D. Output validation

**Q6.** A request to "summarize the report" produces a summary that is too long and misses the point the associate actually needed. What was most likely missing from the prompt?
A. The model tier
B. Constraints such as length, audience, and the specific angle needed
C. A knowledge source upload
D. A system-level instruction in a Project

**Q7.** Which is the best example of task decomposition for a complex request?
A. Asking Claude to "handle the whole project" in one message
B. Splitting a market-entry analysis into research, framework selection, draft, and review stages
C. Repeating the same prompt three times
D. Asking three different people to each try their own prompt

**Q8.** For a research-synthesis task, which prompting adjustment is most appropriate compared to a straightforward drafting task?
A. Requesting that Claude weigh and compare multiple sources rather than just generate original text
B. Removing all context to keep the prompt short
C. Asking for the most creative possible answer
D. Avoiding any mention of the intended audience

**Q9.** An associate is unsure exactly what output format their manager wants. What is the best action before running a long, complex prompt?
A. Guess the format and proceed
B. Ask a brief clarifying question or state an assumption about format before generating the full output
C. Run the prompt five different times with five different formats
D. Skip the task until the manager responds, even for a low-stakes draft

**Q10.** Which prompt best demonstrates "acceptance criteria" being built into the request itself?
A. "Write something about our Q3 results."
B. "Draft a 200-word Q3 summary for external investors that leads with revenue growth, avoids technical jargon, and ends with one forward-looking statement."
C. "Make this sound good."
D. "Use the last email as inspiration."

**Q11.** An associate needs Claude to analyze a 90-page contract that exceeds what can be reasonably reviewed in one pass. What is the most effective prompting approach?
A. Paste the entire document and ask for "any thoughts"
B. Break the review into targeted passes (e.g., payment terms, termination clauses, liability) and prompt for each in turn
C. Ask Claude to memorize the document for later use
D. Only review the first ten pages, since the rest is assumed similar

**Q12.** Role framing such as "Act as a benefits analyst reviewing this policy for compliance gaps" is primarily a technique for:
A. Reducing the cost of the request
B. Focusing the model's approach and vocabulary on a specific professional lens
C. Bypassing the need for context
D. Selecting a faster model automatically

**Q13.** When adapting a prompt for a brainstorming session versus a fact-based research task, the associate should mainly change:
A. The length of the company name mentioned
B. The framing — encouraging broad, generative ideas versus requesting verified, sourced findings
C. Nothing; identical prompts work equally well for both
D. Only the greeting used in the message

**Q14.** A first attempt at a prompt returns an answer that ignores one of three instructions given. What is the most effective revision strategy?
A. Abandon the task
B. Restate the missed instruction clearly and explicitly ask for it to be incorporated in the next revision
C. Assume Claude cannot follow multi-part instructions and reduce to one instruction going forward
D. Repeat the exact same prompt unchanged

**Q15.** Which practice best supports iterative prompt refinement over multiple turns?
A. Giving vague praise like "good job" regardless of quality
B. Pointing to specific strengths and weaknesses of the output so the next revision targets them
C. Starting a brand-new, unrelated conversation for every small edit
D. Never referencing the previous output

**Q16.** An associate wants a consistent structure across ten similar weekly status reports. What is the best prompting practice?
A. Write each report from scratch with a completely different structure each week
B. Develop a reusable prompt template with a defined structure and fill in new details each week
C. Ask a coworker to write them all manually
D. Avoid specifying structure so Claude has full creative freedom each time

**Q17.** Task decomposition is especially valuable when a request:
A. Is a single, simple factual question
B. Involves multiple interdependent steps, each with its own quality bar
C. Requires no context at all
D. Can be answered in one sentence

**Q18.** Which of the following best reflects adapting prompting strategy "by task type" as described in the blueprint?
A. Using the exact same prompt template for analysis, research, drafting, and brainstorming
B. Requesting rigor and source-grounding for research, structure and evidence for analysis, and audience/tone focus for drafting
C. Always requesting the shortest possible answer regardless of task
D. Ignoring task type since Claude adapts automatically without guidance

**Q19.** An associate's prompt says: "Write a proposal." The result is too generic to use. Which addition would most improve it?
A. Adding an emoji
B. Specifying the client, the problem being solved, the desired length, and the sections required
C. Asking for the proposal in a different language
D. Repeating the word "proposal" three times

**Q20.** What is the primary purpose of stating explicit output-format instructions (e.g., "respond in a three-column table") in a prompt?
A. To make the prompt longer
B. To reduce back-and-forth by ensuring the result is usable without reformatting
C. To force the use of a specific Claude model
D. To bypass the need for review

**Q21.** **(Select TWO)** Which two practices most directly improve the quality of a first-pass output on a complex, multi-step business request?
A. Providing relevant context and constraints up front
B. Breaking the request into logical sub-steps
C. Omitting the intended audience to keep things neutral
D. Submitting the request with no punctuation to save time

**Q22.** A marketing associate needs five variations of a tagline for A/B testing. Which instruction best supports that goal?
A. "Give me a tagline."
B. "Generate five distinct taglines under 8 words each, varying tone from playful to authoritative, for A/B testing with a 25–40 age demographic."
C. "Make something catchy."
D. "Write one long paragraph of taglines."

---

## Domain 2: Output Evaluation and Validation (Q23–Q56)

**Q23.** Claude produces a confident-sounding summary of a regulation and cites a specific subsection number. Before this is shared with a compliance team, what should the associate do?
A. Send it as-is, since Claude sounded confident
B. Verify the cited subsection against the actual regulation text before sharing
C. Ask Claude how confident it is and trust that self-rating
D. Reformat the summary to look more official and send it

**Q24.** Which of the following is the clearest sign of a potential hallucination in an output?
A. The response uses full sentences
B. A specific, plausible-looking detail (statistic, citation, quote) that cannot be located in the source material
C. The response is shorter than expected
D. The response uses bullet points

**Q25.** An associate asks Claude to compare two vendors using only an uploaded comparison sheet. Claude's answer includes a pricing detail not present anywhere in that sheet. What should the associate conclude?
A. Claude found outside information automatically, so it must be accurate
B. This is unsupported content that should be flagged, and either removed or checked against a verified source before use
C. The number is fine to keep since it "sounds reasonable"
D. The whole comparison sheet should be discarded

**Q26.** Which is the best method for validating a set of numeric figures Claude generated from a spreadsheet?
A. Assume the math is correct because Claude is generally reliable
B. Spot-check key totals and calculations against the original spreadsheet
C. Ask Claude if the numbers are correct and stop there
D. Round all the numbers to reduce the chance of error

**Q27.** An output written for a technical engineering audience needs to go to a non-technical executive committee instead. What is the appropriate action?
A. Send the technical version unchanged since the facts are correct
B. Adapt the language, level of detail, and framing for the new audience before sending
C. Ask the executives to look up the technical terms themselves
D. Shorten the document without changing any wording

**Q28.** A recommendation Claude generated appears to consistently favor options from one vendor across several unrelated prompts, despite similar merits among alternatives. This is best evaluated as:
A. A formatting issue
B. A potential bias in the output that should be investigated and corrected before the recommendation is used
C. Not a concern, since the model is objective by design
D. A sign to switch to a larger model with no further review

**Q29.** When should an associate escalate an output for additional human review rather than use it directly?
A. Never — Claude's outputs are always ready to use
B. When the content is high-stakes, sensitive, or outside the associate's ability to verify (e.g., legal, medical, regulatory implications)
C. Only if the output contains a typo
D. Only when the output is longer than one page

**Q30.** Which output format is most appropriate for a large, reusable spreadsheet-like dataset the team will keep editing?
A. A structured artifact (e.g., a table/spreadsheet-style output) rather than a wall of inline prose
B. A single unformatted paragraph
C. A voice memo
D. An image with no editable text

**Q31.** An associate is comparing two Claude-generated drafts of the same email to decide which to send. What is the best evaluation approach?
A. Pick whichever one is longer
B. Compare both against the goal, audience, and required facts, then select or merge the stronger elements
C. Flip a coin
D. Send both and let the recipient choose

**Q32.** A Claude output states a fact as certain, but the associate cannot find that fact anywhere in the source documents provided. What is the appropriate response?
A. Trust it because it reads confidently
B. Treat it as unverified, and either confirm it against an authoritative source or remove it
C. Rephrase it so it sounds like a question instead
D. Ignore it as long as the rest of the document looks fine

**Q33.** Which best describes "completeness" as an evaluation criterion for an output?
A. Whether the response uses complete sentences
B. Whether the response addresses every part of the original request without leaving gaps
C. Whether the response is the maximum possible length
D. Whether the response uses formal vocabulary

**Q34.** An associate needs to decide whether a short factual answer should be delivered inline in chat or as a saved artifact. Which factor matters most?
A. The time of day the question was asked
B. Whether the content will be reused, edited, or shared as a standalone deliverable
C. Whether the question was typed in lowercase
D. The associate's personal preference for font size

**Q35.** Claude produces a paragraph that draws two different, mutually exclusive conclusions in the same response. What evaluation issue does this represent?
A. Bias
B. An internal logical inconsistency that should be caught and resolved before use
C. Appropriate nuance that requires no action
D. A formatting error only

**Q36.** Which practice best supports catching omissions in a long generated report before it goes out?
A. Reading only the first paragraph
B. Checking the output section-by-section against the original request and source material
C. Assuming length alone indicates completeness
D. Relying solely on Claude's own summary of what it included

**Q37.** An associate asks Claude to translate a client-facing document into another language. What is the most appropriate verification step?
A. Assume fluency-level output is automatically accurate in meaning and nuance
B. Have a qualified speaker or reliable secondary check review the translation for accuracy and tone before sending
C. Skip review since translation is a mechanical task
D. Only check that the word count matches

**Q38.** A generated output includes a direct quotation attributed to a named individual. The associate cannot verify this quote exists anywhere. What should happen?
A. Publish it, since names add credibility
B. Treat the quotation as unverified and remove it or confirm its source before use
C. Slightly reword it so it is not an exact quote
D. Replace the name with "an expert" and publish it anyway

**Q39.** Which is the best reason to compare a Claude-written analysis against the original source data rather than relying on the analysis alone?
A. Comparing takes less time than doing the analysis in the first place
B. It surfaces unsupported claims, omissions, or misreadings introduced during generation
C. It is required for every single response regardless of stakes
D. It eliminates the need for any human judgment going forward

**Q40.** An associate is validating a Claude-drafted code snippet before sharing it with an engineering colleague. What is the most appropriate action?
A. Share it immediately since Claude is generally accurate at generating code
B. Test or review the logic (or have someone qualified review it) rather than assuming correctness
C. Rewrite the whole thing from scratch as a rule
D. Just check that it "looks like code"

**Q41.** Which of these best reflects appropriate skepticism toward a model's self-reported confidence in an answer?
A. Self-reported confidence is always a reliable accuracy signal and can replace verification
B. Self-reported confidence is not a substitute for independent fact-checking, especially for high-stakes content
C. Confidence statements should be deleted but the underlying claim kept unchecked
D. Confidence statements always indicate the response is fabricated

**Q42.** An associate is asked to shorten a Claude-generated report from five pages to one page for a busy stakeholder. What should guide the edit?
A. Deleting content randomly until it fits
B. Preserving the most decision-relevant points and cutting supporting detail, while keeping accuracy intact
C. Keeping the introduction and deleting everything else
D. Only removing headers and formatting

**Q43.** A dataset-heavy output that Claude generated conflicts with a figure in a source spreadsheet. What is the correct next step?
A. Use whichever number looks more "official"
B. Investigate the discrepancy against the authoritative source and correct the output before use
C. Average the two numbers
D. Delete both numbers to avoid the conflict

**Q44.** **(Select TWO)** Which two actions are appropriate parts of a rigorous output-evaluation process before sharing Claude-generated content externally?
A. Checking factual claims against authoritative sources
B. Reviewing for tone and appropriateness for the intended audience
C. Publishing immediately once the draft "reads well"
D. Assuming completeness because the response is long

**Q45.** An associate asks Claude to summarize customer feedback and notices the summary only reflects the most negative comments, even though feedback was mixed. This is best identified as:
A. A model limitation unrelated to evaluation
B. A completeness/bias issue that should be corrected by revisiting the full range of source feedback
C. Acceptable, since negative feedback is more important
D. A sign the model tier needs to be downgraded

**Q46.** When two authoritative sources genuinely disagree and Claude's output picks one without flagging the conflict, what is the best evaluation response?
A. Trust the output since it picked an answer
B. Note the discrepancy explicitly and decide how to represent or resolve it before finalizing
C. Ignore both sources
D. Ask Claude to guess which source is more popular

**Q47.** Which best describes why "edit, adapt, refine, and compare" outputs is a core skill in this domain?
A. Because the first output should always be discarded automatically
B. Because raw generated output frequently needs shaping for accuracy, audience, and format before it is fit for use
C. Because editing is only necessary for creative writing
D. Because comparison is only relevant when using multiple AI tools

**Q48.** A structured JSON output was requested for a downstream system integration, but the response includes extra explanatory prose around the JSON. What evaluation issue does this represent?
A. A content accuracy issue
B. A format-compliance issue that would break the downstream system unless corrected
C. An unavoidable limitation with no fix
D. Not an issue, since JSON with extra text is universally accepted

**Q49.** An associate needs to decide if an AI-drafted client proposal is ready to send. Which is the most complete evaluation checklist?
A. Spelling only
B. Accuracy of facts and figures, completeness against the brief, appropriate tone for the client, and no unsupported claims
C. Word count only
D. Whether it was generated quickly

**Q50.** Claude generates a chart description mentioning a trend that the underlying data does not actually show. What should the associate do?
A. Publish the description since it "sounds plausible"
B. Cross-check the described trend against the actual data and correct or remove the claim if unsupported
C. Change the chart type instead of checking the description
D. Assume the chart itself is wrong instead

**Q51.** Which scenario most clearly requires escalation beyond the associate's own review?
A. Fixing a typo in an internal memo draft
B. A Claude-drafted answer to a customer's regulatory compliance question that could carry legal liability if wrong
C. Choosing between two synonyms in a tagline
D. Adjusting the tone of an internal Slack message

**Q52.** An associate compares three different Claude drafts of a press release. What is the most defensible basis for choosing one?
A. Whichever came first
B. Which one most accurately and completely reflects the facts while fitting the audience and goal
C. Whichever uses the most adjectives
D. Whichever is closest to the original prompt in word count

**Q53.** A generated recommendation lists pros for Option A but no cons, and cons for Option B but no pros, despite both options having real trade-offs. What evaluation concern does this raise?
A. None — recommendations should always favor one option
B. A one-sided framing that should be corrected so the comparison is balanced and accurate
C. A formatting issue only
D. A sign the wrong model tier was used

**Q54.** Why is it important to check a summarization output against the original document rather than accepting it purely on readability?
A. Readability guarantees accuracy
B. A fluent, well-written summary can still omit key points or introduce claims not present in the source
C. Summaries are never evaluated once generated
D. Only grammar matters in a summary

**Q55.** **(Select TWO)** An associate is finalizing a customer-facing FAQ drafted by Claude from internal documentation. Which two checks are most important before publishing?
A. Confirming every answer matches current, accurate internal policy
B. Confirming the tone matches how the company communicates with customers
C. Confirming the document uses the associate's favorite color scheme
D. Confirming the file was saved with a short filename

**Q56.** A Claude-generated market analysis references "recent industry data" without naming a source. What is the appropriate action before using it in a client deliverable?
A. Keep the vague reference as-is
B. Request or locate the specific source, and cite or remove the claim if it cannot be substantiated
C. Replace "recent" with "very recent" for emphasis
D. Remove all data references from the entire document

---

## Domain 3: Product and Model Selection (Q57–Q75)

**Q57.** An associate needs to generate a high volume of short, straightforward customer-reply drafts where speed and cost matter more than deep reasoning. Which is the best fit?
A. The most capable, highest-cost model for every reply
B. A faster, lower-cost model suited to straightforward, high-volume tasks
C. Disabling product features to save money
D. A different, unrelated tool entirely

**Q58.** A task involves deep, multi-step strategic reasoning across a large, complex set of documents. Which is the best model choice?
A. The fastest, lowest-cost tier, regardless of complexity
B. A more capable model tier suited to complex reasoning, even at higher cost
C. No model is suitable for complex reasoning
D. Any tier, since all tiers perform identically on complex reasoning

**Q59.** Which Claude product feature is best suited to persistent, reusable instructions and a curated knowledge base for a recurring team workflow?
A. A one-off chat message
B. A Project, configured with instructions and knowledge sources
C. A single artifact with no further configuration
D. Turning off all context features

**Q60.** An associate needs to investigate a broad, evolving topic and wants Claude to actively gather and synthesize current information rather than rely solely on what it already knows. Which capability best fits?
A. A single short chat message with no additional tools
B. Research mode, suited to gathering and synthesizing information on a topic
C. Disabling all product features
D. Restarting the conversation repeatedly

**Q61.** A conversation has grown extremely long and Claude's responses are starting to lose track of earlier details. What is the most appropriate action?
A. Keep going indefinitely without changes
B. Summarize the key points and start a fresh conversation, or otherwise manage context deliberately
C. Switch to a lower-cost model tier to fix the issue
D. Delete the entire project

**Q62.** Which factor is NOT typically part of choosing between Claude model tiers for a task?
A. Required speed
B. Required reasoning depth
C. Cost budget
D. The associate's personal typing speed

**Q63.** An associate is drafting a one-off, low-stakes internal note and wants the fastest, cheapest reasonable option. Which model tier best fits this use case among Haiku, Sonnet, and Opus?
A. The fastest, most lightweight tier (e.g., Haiku-class)
B. The most capable, highest-cost tier regardless of task
C. No model, since the task is "too small" for AI
D. Whichever tier was used last, regardless of fit

**Q64.** For a nuanced task that is more demanding than a simple FAQ reply but does not require the deepest available reasoning, which approach best reflects "aligning model selection with task requirements"?
A. Always defaulting to the cheapest tier regardless of nuance
B. Choosing a balanced, mid-tier model suited to typical business tasks
C. Always defaulting to the most expensive tier regardless of need
D. Randomly alternating tiers each time

**Q65.** An associate wants a document Claude produces to be easily edited, versioned, and shared as a standalone deliverable, separate from the ongoing chat. Which feature best supports this?
A. Deleting the conversation immediately
B. Using an artifact to hold the standalone, reusable content
C. Keeping the content only inline in chat with no separate document
D. Switching to a different, unrelated software product

**Q66.** Which statement best reflects the relationship between model capability and cost across Claude's tiers?
A. All tiers cost the same regardless of capability
B. Generally, more capable tiers are suited to more complex tasks and carry a higher cost/latency trade-off than faster, lighter tiers
C. Cost has no relationship to capability
D. Faster tiers are always more expensive than capable ones

**Q67.** A team runs the same type of weekly report through Claude. Which product decision most directly supports consistency across runs?
A. Starting a brand-new, unconfigured chat every week
B. Using a Project with consistent instructions and up-to-date knowledge sources
C. Randomizing the model tier every week
D. Avoiding any saved configuration

**Q68.** When context limitations start to affect quality on a very long-running task, which is the most appropriate response?
A. Ignore the issue and continue
B. Decide whether to summarize progress, restart with condensed context, or persist key information going forward
C. Switch the topic entirely without addressing context
D. Assume there is no limit to how much context can be maintained

**Q69.** Which task is best matched to a fast, lower-cost model tier rather than the most capable tier?
A. Designing a multi-year corporate strategy from scratch
B. Categorizing a large batch of short support tickets by topic
C. Synthesizing conflicting findings across a dozen long technical reports
D. Drafting a nuanced legal risk assessment

**Q70.** An associate needs Claude to keep referring back to a stable set of reference documents (like a style guide and past reports) across many future conversations. What is the most appropriate configuration choice?
A. Re-uploading the documents into every single new chat manually with no reuse
B. Adding them as knowledge sources in a Project so they persist across relevant conversations
C. Reading them aloud to Claude each time
D. Avoiding knowledge sources to save time

**Q71.** **(Select TWO)** Which two factors should most directly influence the choice between a faster/cheaper model and a more capable/costlier model for a given task?
A. The complexity of reasoning required
B. The acceptable cost and speed trade-off for that task
C. The associate's mood that day
D. The number of words in the company's name

**Q72.** A associate is unsure whether to use plain chat or a Project for a one-time, simple question with no reuse value. What is the most efficient choice?
A. A Project, since Projects are always required
B. A simple chat interaction, since there is no ongoing configuration or reuse need
C. Neither — the question should not be asked at all
D. Research mode, regardless of complexity

**Q73.** Which best describes why matching model tier to task matters for a business team using Claude regularly?
A. It has no real effect on outcomes
B. It balances quality, speed, and cost so resources are used efficiently across different types of tasks
C. It only matters for software engineers
D. It is purely a branding decision

**Q74.** An associate is deciding whether to persist a long research thread's findings into a saved format before starting a new conversation. What is the main reason to do this?
A. To make the conversation longer
B. To avoid losing key context and conclusions once the original conversation ends or context is trimmed
C. Persisting information is never useful
D. To reduce the model tier automatically

**Q75.** Which scenario best illustrates appropriate use of artifacts over a purely inline chat response?
A. Answering "what time zone is this meeting in?"
B. Producing a structured project plan the team will keep editing and referencing over time
C. A one-word yes/no confirmation
D. A single clarifying question back to the user

---

## Domain 4: Workflow Integration and Solution Design (Q76–Q101)

**Q76.** An associate wants to identify where Claude could meaningfully improve a departmental workflow. What is the best first step?
A. Apply Claude to every task in the workflow without analysis
B. Analyze the current workflow to find repetitive, time-consuming, or bottleneck steps suited to AI assistance
C. Skip analysis and ask leadership to decide instead
D. Assume no workflow needs improvement

**Q77.** Which best describes "augmenting" versus "redesigning" a workflow with Claude?
A. They are the same thing
B. Augmenting adds Claude to support existing steps, while redesigning restructures the process itself around AI-enabled capabilities
C. Augmenting always requires new software; redesigning never does
D. Redesigning means removing all human involvement

**Q78.** An associate is proposing a new Claude-supported process to stakeholders who are skeptical about AI accuracy. What is the most effective communication approach?
A. Overstate Claude's reliability to build confidence
B. Clearly communicate both the value Claude adds and its limitations, including where human review remains necessary
C. Avoid mentioning any limitations
D. Avoid mentioning any benefits to seem neutral

**Q79.** During the planning phase of a new initiative, how can Claude best support solution design?
A. By replacing the planning process entirely with no human input
B. By helping analyze requirements, compare options, and draft planning artifacts for human review and decision-making
C. By only formatting documents after decisions are already finalized
D. By avoiding any involvement until after launch

**Q80.** A workflow currently requires an employee to manually compile data from five sources into one weekly report. Which is the strongest AI-supported redesign opportunity?
A. Leaving the manual compilation exactly as-is
B. Using Claude to help standardize and draft the compiled report from the gathered inputs, reducing manual synthesis time
C. Removing the report entirely
D. Assigning a second employee to the same manual task

**Q81.** Which is the best example of using Claude to support requirements analysis for a new internal tool?
A. Asking Claude to guess requirements with no stakeholder input
B. Using Claude to help organize and synthesize requirements gathered from stakeholder interviews and documentation
C. Skipping requirements analysis altogether
D. Asking Claude to approve the final budget

**Q82.** An associate is evaluating whether a proposed Claude-supported workflow is ready to scale from a pilot to the full team. What should be assessed first?
A. Whether the pilot generated any output at all
B. Whether the pilot met defined success criteria (quality, time saved, error rate) during a trial period
C. Whether the pilot was completed quickly, regardless of quality
D. Whether any team member liked it personally

**Q83.** Which is the clearest example of communicating Claude's value to a stakeholder, rather than just its output?
A. "Here's the document."
B. "This approach reduced report preparation time by roughly a third while keeping the same review step, so quality control is unchanged."
C. Saying nothing and letting them figure it out
D. Only describing the technology used, with no business outcome

**Q84.** A workflow step involves judgment calls with significant financial risk. How should Claude best be integrated into that step?
A. Fully automate the decision with no human review
B. Use Claude to support analysis and draft options, while keeping the final judgment call with a qualified human reviewer
C. Avoid using Claude anywhere near that step
D. Automate it, but only tell stakeholders after the fact

**Q85.** Which best reflects appropriate ownership and handoff design in a Claude-supported workflow?
A. No one is responsible for reviewing AI-assisted output before it is used
B. Clearly defined roles specify who reviews, approves, and is accountable for AI-assisted deliverables at each stage
C. Ownership is unnecessary once AI is involved
D. Ownership should rotate randomly each week

**Q86.** An operations team wants to identify the best candidate process for a first Claude pilot. Which criterion matters most?
A. Choosing the most complex, highest-risk process available
B. Choosing a process that is repetitive, time-consuming, and low-risk enough to validate value quickly
C. Choosing a process nobody currently performs
D. Choosing a process at random

**Q87.** Which is the best description of using Claude to support process optimization?
A. Asking Claude to eliminate all human steps immediately
B. Using Claude to help map current-state steps, surface inefficiencies, and draft an improved future-state process for review
C. Ignoring the current process entirely
D. Only optimizing steps that involve no AI

**Q88.** An associate is asked to define success metrics before rolling out a Claude-supported workflow change. Which metric set best supports that goal?
A. No metrics — success will be judged informally
B. Measurable indicators such as time saved, error rate, and quality of output compared to the prior process
C. Only the number of Claude conversations started
D. Only whether stakeholders attended a meeting

**Q89.** Which best illustrates cross-functional workflow integration using Claude?
A. Marketing and operations each build separate, disconnected Claude configurations with no shared standards
B. Marketing and operations align on shared instructions and knowledge sources for a process that spans both teams
C. Only one team is allowed to use Claude company-wide
D. Cross-functional work should avoid AI assistance entirely

**Q90.** An associate is designing an escalation path for a Claude-supported customer service workflow. What should trigger escalation to a human agent?
A. Every single customer interaction, regardless of complexity
B. Situations involving ambiguity, sensitive issues, or requests beyond what the AI-assisted process is scoped to handle
C. No situations — full automation is always preferable
D. Only requests submitted after 5 p.m.

**Q91.** Which best reflects avoiding "over-automation" of a judgment-heavy step in workflow design?
A. Automating every step equally regardless of risk or ambiguity
B. Keeping steps that require nuanced judgment, accountability, or ethical weighing under human decision-making, even while Claude supports analysis
C. Removing all human review to save time
D. Avoiding Claude entirely for any judgment-adjacent task

**Q92.** An associate wants to use Claude to support a competitive landscape analysis for a strategy deck. What is the most effective integration point?
A. Only using Claude at the very end, to add a cover page
B. Using Claude throughout research synthesis, comparison drafting, and iteration, with human validation of key claims
C. Using Claude only for spellcheck
D. Excluding Claude entirely from strategy work

**Q93.** Which best describes prioritizing use cases for Claude adoption across a business unit?
A. Implementing every possible use case at once with no sequencing
B. Prioritizing based on expected value and feasibility, starting with high-value, low-complexity opportunities
C. Prioritizing based only on which team asks first
D. Avoiding prioritization since all use cases are equal

**Q94.** An associate is documenting a new Claude-supported workflow for the rest of the team. What should the documentation include?
A. Nothing — the workflow is self-explanatory
B. The steps, required inputs, review/approval points, and escalation criteria
C. Only a list of prompts with no process context
D. Only the name of the model used

**Q95.** Which is the best example of change management consideration when introducing a Claude-supported workflow?
A. Rolling out the change with no communication or training
B. Communicating the change, providing guidance, and gathering feedback from the team adopting the new workflow
C. Assuming adoption will happen automatically
D. Mandating adoption with no explanation of the "why"

**Q96.** An associate is asked to identify repetitive tasks suitable for Claude across a department. Which is the strongest candidate?
A. A rare, one-time strategic decision
B. A recurring task, like drafting weekly status summaries from structured inputs, done the same way each cycle
C. A task that requires physical presence
D. A task performed only once per year with high ambiguity

**Q97.** Which best reflects using Claude to support "solution design, development, and iteration," per the blueprint's Domain 4 objectives?
A. Using Claude once at the idea stage only, with no further involvement
B. Using Claude across drafting a proposed solution, refining it based on feedback, and iterating toward a final design
C. Using Claude only after the solution has already shipped
D. Using Claude exclusively for formatting, never for substance

**Q98.** A stakeholder asks whether a proposed Claude-supported workflow will eliminate the need for the compliance review step. What is the most accurate answer?
A. Yes, AI assistance always eliminates the need for review
B. No — Claude can support drafting and analysis, but a compliance review step should remain for accountability and risk management
C. It depends entirely on which font is used in the output
D. The question is irrelevant to workflow design

**Q99.** Which best supports realistic expectation-setting when introducing Claude into a workflow?
A. Promising the workflow will never produce errors
B. Being clear about what Claude reliably improves (speed, drafting, synthesis) and where oversight is still required
C. Avoiding any discussion of limitations to maintain enthusiasm
D. Promising full automation from day one

**Q100.** An associate wants to pilot a Claude-supported research process before rolling it out company-wide. What is the most reasonable pilot design?
A. Skip piloting and roll out to everyone immediately
B. Test with a small group, define success criteria in advance, and gather structured feedback before scaling
C. Pilot with no defined criteria and decide informally later
D. Pilot indefinitely with no plan to ever scale or conclude

**Q101.** Which best reflects "leveraging Claude for research, planning, and process optimization" as described in Domain 4?
A. Using Claude solely to generate images unrelated to the workflow
B. Using Claude to gather information, structure planning documents, and identify inefficiencies to redesign a process
C. Avoiding Claude during the planning phase entirely
D. Using Claude only after a project is complete, for archival purposes

---

## Domain 5: Configuration and Knowledge Management (Q102–Q120)

**Q102.** What is the primary purpose of adding custom instructions to a Claude Project?
A. To change the product's pricing
B. To give Claude consistent, standing context and guidance so it behaves appropriately across every conversation in that Project
C. To prevent Claude from accessing any knowledge sources
D. To automatically select the fastest model tier

**Q103.** An associate uploads outdated pricing documents to a Project and never removes them after prices change. What is the most likely consequence?
A. No effect, since Claude ignores old documents automatically
B. Claude may reference outdated information as if it were current, producing inaccurate outputs
C. The Project will stop functioning
D. The outdated documents will automatically self-correct

**Q104.** Which is the best practice for keeping a Project's knowledge sources reliable over time?
A. Upload documents once and never revisit them
B. Periodically review and update or remove outdated knowledge sources as the underlying information changes
C. Add every available document regardless of relevance or currency
D. Disable knowledge sources entirely to avoid maintenance

**Q105.** An associate wants Claude to have live access to the latest files in a shared drive rather than static uploads that go stale. What is the most appropriate configuration?
A. Re-uploading files manually every day
B. Using a connector (e.g., to a shared drive) so Claude can reference current, connected content
C. Avoiding any drive integration
D. Printing the files and re-typing them into chat

**Q106.** Two knowledge sources in the same Project contain conflicting information about a company policy. What is the best way to handle this during configuration?
A. Leave both and let Claude arbitrarily choose
B. Identify and resolve the conflict — update or remove the outdated source so only accurate, current information remains
C. Delete both sources and use no knowledge base at all
D. Add a third, unrelated source to balance it out

**Q107.** Which best describes the difference between a Project's standing instructions and a single in-chat request?
A. There is no difference
B. Standing instructions apply persistently across the Project's conversations, while an in-chat request applies to that specific exchange
C. Standing instructions are only visible to administrators
D. In-chat requests always override every Project setting permanently

**Q108.** An associate is writing system-level instructions for a Project used by a customer support team. Which instruction is most effective?
A. "Be helpful."
B. "Always respond in our brand's professional-but-warm tone, reference only the uploaded support policies, and flag any question outside those policies for human review."
C. "Do whatever seems best."
D. No instructions at all, to maximize flexibility

**Q109.** Why might an organization configure separate Projects for different teams rather than one shared, general-purpose Project?
A. Separate Projects are always required by the platform
B. Each team may need distinct instructions, knowledge sources, and scope suited to its specific workflow
C. Separate Projects prevent any team from using Claude
D. There is no benefit to separating Projects by team

**Q110.** An associate notices a Project's instructions no longer match how the team actually wants Claude to behave after a process change. What should happen?
A. Leave the instructions unchanged indefinitely
B. Update the Project's instructions to reflect the current process
C. Delete the Project entirely rather than update it
D. Ignore the mismatch since instructions cannot be edited

**Q111.** Which is an appropriate use of a connector like Google Drive or Gmail within a Claude Project?
A. Giving Claude access to any personal account with no relevance to the task
B. Connecting relevant, permitted business content so Claude can reference current organizational information for a defined task
C. Connecting sources purely to increase the Project's file count
D. Avoiding connectors even when live, permitted access would improve accuracy

**Q112.** Before broadly rolling out a newly configured Project to a team, what is a reasonable validation step?
A. Skip testing and roll out immediately
B. Test the Project with representative sample tasks to confirm the instructions and knowledge sources produce the intended results
C. Only test with tasks unrelated to the Project's purpose
D. Ask no one to review the configuration before rollout

**Q113.** Which best reflects "informing, maintaining, and updating configurations" as described in Domain 5's objectives?
A. Treating a Project's setup as permanent and unchangeable once created
B. Periodically reviewing instructions and knowledge sources and updating them as processes, policies, or data change
C. Only updating a Project if it stops working entirely
D. Deleting and recreating a Project every single week regardless of need

**Q114.** An associate is deciding whether a new request warrants creating a new Project or reusing an existing one. Which factor matters most?
A. Whether the new request shares the same purpose, audience, and knowledge needs as the existing Project
B. Whether it is a Tuesday
C. Whether the existing Project has a memorable name
D. The number of past conversations in the existing Project

**Q115.** Which is the best reason to document how a Project is configured (instructions, sources, scope)?
A. Documentation has no practical benefit
B. It helps other team members understand, maintain, and correctly use the Project over time, including after handoffs
C. Documentation is required only for legal reasons
D. It replaces the need for reviewing outputs

**Q116.** An associate uploads a knowledge source containing sensitive internal data to a Project accessible by a wider group than intended. What is the most immediate concern?
A. File size limits
B. Inappropriate access to sensitive information beyond who should see it
C. Whether the file format is supported
D. Whether the Project has a description field filled in

**Q117.** **(Select TWO)** Which two actions best support strong Project knowledge management over time?
A. Removing outdated or superseded documents when new versions are available
B. Reviewing whether uploaded sources still reflect current policy or data
C. Uploading every document ever produced regardless of relevance
D. Never revisiting the Project once it is initially set up

**Q118.** Which best describes prioritization when multiple knowledge sources are available for the same topic in a Project?
A. Prioritizing the most current, authoritative source over outdated or unofficial ones
B. Prioritizing whichever file was uploaded first, regardless of accuracy
C. Prioritizing the largest file by size
D. Prioritization is unnecessary since all sources are treated as equally reliable

**Q119.** An associate wants Claude to consistently use a specific citation style and specific disclaimers in every output from a given Project. Where should this be defined?
A. Re-typed manually into every single message
B. In the Project's standing instructions, so it applies consistently across conversations
C. Nowhere — this cannot be configured
D. In the file name of an uploaded document

**Q120.** Which best reflects a responsible approach to managing connector access (e.g., Gmail, Google Drive) within a Project?
A. Granting the broadest possible access "just in case"
B. Granting access limited to what is relevant and appropriate for the Project's defined purpose
C. Avoiding any review of what a connector can access
D. Treating connector permissions as a one-time setup never revisited

---

## Domain 6: Governance, Risk, and Responsible Use (Q121–Q144)

**Q121.** A project manager wants to upload a spreadsheet containing customer names and account numbers so Claude can analyze trends, but organizational policy restricts sharing regulated personal data. What is the most appropriate action?
A. Upload the file as-is since the analysis is internal
B. Remove or anonymize the personal identifiers before uploading, consistent with policy
C. Upload the file but instruct Claude not to retain it
D. Abandon the analysis entirely

**Q122.** Which best describes an "appropriate use case" for Claude in a regulated industry such as healthcare or finance?
A. Any use case, with no regard for regulation
B. A use case that respects applicable regulatory, privacy, and data-handling requirements for that industry
C. Only use cases with no human oversight
D. Only use cases that avoid all mention of data

**Q123.** An associate is deciding whether a customer-facing use case requires disclosure that AI assistance was used. What should guide that decision?
A. Personal preference only
B. Organizational policy, applicable regulations, and standards of transparency for that context
C. Whether disclosure is inconvenient
D. Disclosure is never relevant to AI use

**Q124.** Which scenario represents the clearest ethical concern in AI usage that should prompt scrutiny before proceeding?
A. Using Claude to draft an internal meeting agenda
B. Using Claude-generated content to make an employment decision without any human review of potential bias
C. Using Claude to brainstorm blog topics
D. Using Claude to format a spreadsheet

**Q125.** An organization has an internal AI usage policy restricting certain data types from being used with third-party tools. How should an associate act when this conflicts with a convenient shortcut?
A. Follow the internal policy, even if it is less convenient
B. Ignore the policy if no one is likely to notice
C. Follow personal judgment over organizational policy
D. Ask a colleague to bypass the policy on their behalf

**Q126.** Which best reflects a responsible approach to using Claude with confidential client data?
A. Sharing client data freely across any tool without regard to confidentiality agreements
B. Handling client data according to confidentiality obligations, data-sensitivity classification, and organizational policy
C. Assuming confidentiality does not apply to AI tools
D. Only worrying about confidentiality after a problem occurs

**Q127.** An associate wants to use Claude output that closely resembles a copyrighted article without attribution in a client deliverable. What is the appropriate concern?
A. There is no concern, since AI tools handle copyright automatically
B. Potential intellectual-property and originality issues that should be reviewed before external use
C. Concern only if the client asks about it
D. Concern only if the output is longer than one page

**Q128.** Which is the best example of "following organizational AI governance standards"?
A. Using whichever workflow is fastest, regardless of company policy
B. Using Claude in ways consistent with the organization's defined policies on data handling, approved use cases, and review requirements
C. Avoiding governance standards since they slow down work
D. Only following governance standards when convenient

**Q129.** An associate is asked to use Claude to help draft performance review language for employees. What is the most responsible approach?
A. Let Claude's draft stand entirely unreviewed and finalize it automatically
B. Use Claude to help draft, but ensure a human manager reviews for fairness, accuracy, and appropriate judgment before finalizing
C. Avoid any human review since AI is considered neutral
D. Skip the review process to save time

**Q130.** Which best illustrates recognizing an "inappropriate use case" for Claude?
A. Drafting a marketing email
B. Attempting to use Claude to generate content designed to impersonate a specific real individual without consent
C. Summarizing a public report
D. Brainstorming project names

**Q131.** An associate is unsure whether a task involves regulated data (e.g., health or financial records). What is the appropriate first step?
A. Proceed without checking
B. Confirm the data classification and applicable requirements before proceeding, consulting policy or a compliance contact if unsure
C. Assume it is unregulated unless told otherwise
D. Ask Claude to decide whether the data is regulated

**Q132.** Which best reflects the risk of over-reliance on AI-generated output in high-stakes decisions?
A. There is no risk; AI output can always be trusted fully
B. Uncritical acceptance of AI output can lead to errors going unnoticed, especially where human judgment and accountability are needed
C. Over-reliance is only a risk for technical roles
D. Over-reliance is solved by using a faster model

**Q133.** An associate learns that a colleague has been uploading regulated client data to a personal, unsanctioned AI account outside company policy. What is the most appropriate action?
A. Ignore it since it is not the associate's responsibility
B. Raise the concern through the appropriate internal channel (e.g., manager, compliance, or governance contact)
C. Do the same thing since it seems convenient
D. Publicly criticize the colleague without escalating internally

**Q134.** Which best reflects data-sensitivity awareness when configuring a shared Claude Project?
A. Assuming all data is equally safe to share regardless of classification
B. Classifying data appropriately and restricting sensitive or regulated information from being uploaded where policy prohibits it
C. Avoiding any classification process
D. Sharing the broadest possible dataset "to be helpful"

**Q135.** An associate wants to understand whether using Claude for a specific customer communication task is appropriate. What should they check first?
A. Nothing — all uses are automatically appropriate
B. Organizational policy and any regulatory considerations relevant to that type of customer communication
C. Only their personal comfort level
D. Whether the task is fun to do

**Q136.** Which best describes the ethical concern around using AI-generated content to influence people without disclosure in contexts where disclosure is expected or required?
A. No concern exists in any context
B. It raises transparency and trust concerns and may violate policy or regulation depending on context
C. It is only a concern in creative writing
D. It is solved simply by making the content longer

**Q137.** **(Select TWO)** Which two considerations are most relevant when deciding whether to upload a document containing personal data to a Claude Project?
A. Whether the data is regulated or sensitive under applicable policy/law
B. Whether uploading is necessary for the specific business task at hand
C. Whether the document has a colorful cover page
D. Whether the upload will make the Project look more thorough

**Q138.** An associate is drafting external marketing content and wants to include a specific statistic Claude generated but cannot verify its source. What is the responsible action, given both accuracy and governance concerns?
A. Publish it since it strengthens the message
B. Locate a verifiable source or remove the statistic before publishing
C. Attribute it to "internal research" without verification
D. Round the number to make it seem more conservative

**Q139.** Which best reflects appropriate human-in-the-loop design for a Claude-supported hiring workflow?
A. Fully automating candidate rejection decisions with no human review
B. Using Claude to support tasks like drafting job descriptions or organizing candidate notes, while keeping evaluative and selection decisions with qualified human reviewers
C. Removing recruiters from the process entirely
D. Using Claude to make final hiring decisions to reduce bias

**Q140.** An associate is asked whether using Claude to analyze anonymized aggregate sales data (no personal identifiers) requires the same restrictions as regulated personal data. What is the most accurate answer?
A. Yes, always identical restrictions regardless of content
B. Not necessarily — properly anonymized, non-regulated aggregate data generally carries different risk than identifiable personal data, though organizational policy should still be checked
C. No restrictions ever apply to any data
D. The distinction is irrelevant to responsible use

**Q141.** Which best reflects understanding "the ethical implications of AI usage" as described in Domain 6?
A. Ethics is not relevant to day-to-day AI use
B. Recognizing how AI-assisted decisions can affect fairness, transparency, and accountability toward the people impacted by them
C. Ethics only applies to AI developers, not business users
D. Ethical implications only matter in creative content

**Q142.** An associate wants to confirm a proposed AI use case aligns with company policy before proceeding. What is the most appropriate resource to consult?
A. A general internet search with no organizational context
B. The organization's own AI usage policy or governance/compliance contact
C. A friend outside the company
D. No resource — proceed based on personal judgment alone

**Q143.** Which is the best example of applying "regulatory considerations" correctly in Domain 6's scope?
A. Ignoring industry regulations since Claude is a general-purpose tool
B. Ensuring a use case in a regulated context (e.g., financial advice, medical information) meets applicable disclosure, accuracy, and data-handling requirements
C. Assuming regulation is the vendor's responsibility, not the associate's
D. Treating all industries as equally unregulated

**Q144.** An associate is asked to summarize confidential merger discussions using Claude on a platform not approved for that sensitivity level by the organization. What is the correct action?
A. Proceed since the summary is short
B. Decline to use that unapproved platform for this sensitive matter and follow the organization's approved process instead
C. Use it but delete the conversation afterward
D. Use it and inform no one

---

## Domain 7: Troubleshooting and Optimization (Q145–Q160)

**Q145.** A prompt consistently returns vague, generic answers regardless of small wording changes. What is the most likely root cause to investigate first?
A. The model is fundamentally incapable of any useful output
B. Missing context, specificity, or constraints in the prompt itself
C. The time of day the prompt was submitted
D. The length of the associate's username

**Q146.** An output keeps ignoring one specific instruction across multiple attempts. What troubleshooting step is most effective?
A. Give up on that instruction permanently
B. Isolate and restate that instruction clearly and explicitly, separate from the rest of the request, to see if it resolves the issue
C. Add ten more unrelated instructions to the same prompt
D. Switch topics entirely without addressing the issue

**Q147.** A team's outputs vary significantly in quality and structure across different team members using Claude for the same recurring task. What is the most effective fix?
A. Accept the inconsistency as unavoidable
B. Standardize the request with a shared prompt template or Project configuration used by the whole team
C. Ask each person to work independently with no shared approach
D. Reduce the frequency of the task instead of standardizing it

**Q148.** An output was cut off before completing a long, detailed request. What is the most effective next step?
A. Discard the entire request and start over from scratch every time
B. Ask Claude to continue from where it left off, or break the request into smaller, sequential parts
C. Assume the task is impossible
D. Accept the incomplete output as final

**Q149.** A requested structured table came back as unstructured prose instead. What troubleshooting step addresses this most directly?
A. Accept the prose and manually reformat it every time
B. Make the format requirement explicit and specific (e.g., "respond only with a table with these exact columns") and try again
C. Switch to a completely different task
D. Assume structured output is not possible

**Q150.** After reviewing feedback that a report's tone was too casual for its audience, what is the best optimization for future prompts on that task?
A. Ignore the feedback and repeat the same approach
B. Incorporate the tone requirement explicitly into the prompt or Project instructions going forward
C. Stop producing that report entirely
D. Blame the audience for misunderstanding

**Q151.** A recurring weekly task takes an associate several rounds of back-and-forth to get right every single time. What is the best optimization?
A. Accept the repeated back-and-forth indefinitely as normal
B. Build a refined, reusable prompt template that incorporates lessons learned from past iterations
C. Assign the task to someone else without changing the approach
D. Stop reviewing the outputs to save time

**Q152.** An associate suspects an underperforming output is due to using a model tier mismatched to task complexity, rather than a prompting issue. What is the appropriate diagnostic step?
A. Assume it is always a prompting issue and never consider model tier
B. Test whether a more capable model tier improves quality on the same prompt, to isolate whether tier or prompt is the limiting factor
C. Give up on the task entirely
D. Randomly change unrelated settings

**Q153.** Which best reflects "adjusting approach based on feedback and results," a core Domain 7 objective?
A. Repeating the exact same unsuccessful approach indefinitely
B. Reviewing what worked and what didn't in prior outputs, then deliberately changing the prompt, context, or configuration accordingly
C. Ignoring all feedback to preserve consistency
D. Changing approach randomly with no reference to prior results

**Q154.** A Project's outputs have gradually become less accurate over several months. What should be investigated first?
A. Whether the Project's knowledge sources have become outdated and need updating
B. Whether the associate's chair is comfortable
C. Whether the Project has a long name
D. Whether the team uses too many emojis

**Q155.** Which is the most effective way to reduce the number of iteration cycles needed for a recurring content type?
A. Providing less context each time to save typing
B. Front-loading clear context, constraints, format, and examples in the initial prompt or template
C. Avoiding any format specification
D. Only providing feedback after the tenth attempt

**Q156.** An associate notices the same type of formatting error recurring across a team's outputs. What is the most efficient fix at scale?
A. Correct each individual output by hand every time with no systemic fix
B. Update the shared prompt template or Project instructions to prevent the recurring error at the source
C. Ignore the pattern since each case is "different"
D. Stop using Claude for that task type entirely

**Q157.** **(Select TWO)** Which two actions are appropriate when troubleshooting a poor-quality output?
A. Reviewing whether the prompt included sufficient context and clear constraints
B. Considering whether the chosen model tier fits the task's complexity
C. Assuming the output cannot be improved and abandoning the task
D. Randomly changing wording with no hypothesis about the cause

**Q158.** A workflow that used to take five prompts to complete now reliably takes two, after refinement. What best describes this outcome?
A. A prompting failure
B. A successful optimization of the workflow for efficiency and effectiveness
C. An accident with no repeatable cause
D. Evidence the task should be abandoned

**Q159.** An associate wants to identify whether a persistent output problem is caused by the prompt, the knowledge sources, or the model tier. What is the most systematic approach?
A. Change all three at once and hope for improvement
B. Change one variable at a time (prompt, knowledge source, or model tier) and evaluate the effect before changing another
C. Avoid testing and guess the cause
D. Assume it is always the model tier without testing

**Q160.** Which best reflects "optimizing workflows for efficiency and effectiveness," the final Domain 7 objective?
A. Adding unnecessary extra steps to make the workflow appear more thorough
B. Continuously refining prompts, configurations, and processes based on results to reduce effort while maintaining or improving quality
C. Leaving all workflows unchanged once initially set up
D. Removing all review steps to maximize speed regardless of quality impact

---

## Answer Key & Rationale

### Domain 1: Prompting and Task Execution
1. **B** — Clarity, context, constraints, and format together drive quality; any single element alone is insufficient.
2. **B** — Task decomposition (outline first) improves quality on long, complex deliverables.
3. **B** — Specific, targeted feedback drives effective iteration; starting over discards useful progress.
4. **B** — Brainstorming benefits from open, divergent framing; the others need tight constraints.
5. **B** — Providing examples anchors tone/style — a core prompting technique.
6. **B** — Missing constraints (length, audience, angle) is the most common cause of unfocused output.
7. **B** — Splitting into research/framework/draft/review stages is textbook task decomposition.
8. **A** — Research synthesis needs explicit comparison/weighing across sources, unlike straight drafting.
9. **B** — A brief clarifying question (or stated assumption) prevents wasted effort on ambiguous, high-cost requests.
10. **B** — It embeds explicit acceptance criteria: length, audience, structure, and content requirements.
11. **B** — Breaking a large document review into targeted passes is effective decomposition for scale.
12. **B** — Role framing focuses vocabulary and approach; it doesn't change cost or bypass context needs.
13. **B** — Task type should change the framing (generative vs. verified/sourced), not just wording.
14. **B** — Explicitly restating the missed instruction is the most direct, effective iteration technique.
15. **B** — Specific, targeted feedback (not vague praise) drives meaningful refinement.
16. **B** — A reusable template standardizes structure across recurring, similar tasks.
17. **B** — Decomposition adds the most value for multi-step, interdependent requests.
18. **B** — Different task types (analysis, research, drafting, brainstorming) call for different framing.
19. **B** — Concrete specifics (client, problem, length, sections) fix an overly generic result.
20. **B** — Explicit format instructions reduce rework and reformatting after the fact.
21. **A, B** — Context/constraints and decomposition are the two most direct quality levers described in the blueprint.
22. **B** — It specifies quantity, length, tone variation, and audience — a complete, actionable prompt.

### Domain 2: Output Evaluation and Validation
23. **B** — Specific-looking details (like citation numbers) can be fabricated; verify before sharing with a compliance audience.
24. **B** — Plausible but unverifiable specifics are the classic hallucination signature.
25. **B** — Content not present in the provided source should be flagged and checked, not treated as automatically valid.
26. **B** — Spot-checking key figures against the source is the practical, reliable validation method.
27. **B** — Adapting language/detail/framing for a new audience is core to output evaluation and refinement.
28. **B** — A repeated skew across similar prompts is a bias signal that needs investigation and correction.
29. **B** — High-stakes, sensitive, or hard-to-verify content is exactly when human review/escalation is warranted.
30. **A** — Reusable, editable, structured data belongs in a structured artifact rather than plain prose.
31. **B** — Comparing against goal, audience, and required facts is the defensible basis for choosing between drafts.
32. **B** — Unverifiable factual claims should be confirmed or removed, not trusted on tone alone.
33. **B** — Completeness means addressing every part of the request, not sentence structure or length.
34. **B** — Reuse/edit/share needs are the key driver for choosing an artifact over an inline answer.
35. **B** — Contradictory conclusions in one response is a logical-consistency problem to resolve before use.
36. **B** — Section-by-section checking against the original request/source catches omissions most reliably.
37. **B** — Translation accuracy and nuance need a qualified check, not an assumption of correctness.
38. **B** — Unverifiable quotations attributed to real people should be removed or confirmed before publishing.
39. **B** — Comparing against source data surfaces unsupported claims, omissions, or misreadings.
40. **B** — Code should be tested or reviewed by someone qualified rather than assumed correct.
41. **B** — Self-reported confidence isn't a reliable accuracy signal; independent verification is still needed.
42. **B** — Effective shortening preserves decision-relevant accuracy while trimming supporting detail.
43. **B** — Discrepancies with authoritative source data should be investigated and resolved, not guessed at.
44. **A, B** — Fact-checking and audience/tone review are core, non-negotiable steps before external sharing.
45. **B** — Skewed sampling of source feedback is a completeness/bias issue requiring correction.
46. **B** — Genuine source conflicts should be flagged and resolved explicitly, not silently picked for the user.
47. **B** — Editing/adapting/refining/comparing exists because raw output often needs shaping before it's usable.
48. **B** — Extra prose around required JSON breaks strict downstream parsing — a format-compliance issue.
49. **B** — A complete pre-send checklist covers accuracy, completeness, tone, and unsupported-claim checks together.
50. **B** — A described trend must be checked against the actual underlying data, not assumed plausible.
51. **B** — Legal/regulatory liability exposure is a clear escalation trigger beyond typical self-review.
52. **B** — Accuracy, completeness, audience fit, and goal alignment are the defensible selection criteria.
53. **B** — One-sided pro/con framing is a bias/completeness issue that should be corrected for balance.
54. **B** — Fluency doesn't guarantee fidelity to the source; summaries need direct comparison against the original.
55. **A, B** — Policy accuracy and appropriate customer-facing tone are the two must-check items before publishing an FAQ.
56. **B** — Vague, unsourced claims in a client deliverable need a locatable source or removal.

### Domain 3: Product and Model Selection
57. **B** — High-volume, straightforward tasks are best matched to a faster, lower-cost tier.
58. **B** — Deep, complex, multi-step reasoning is best matched to a more capable (higher-cost) tier.
59. **B** — Projects are designed for persistent instructions plus a curated knowledge base for recurring work.
60. **B** — Research mode is designed to actively gather and synthesize information on a topic.
61. **B** — Deliberately managing context (summarizing, restarting, or persisting) addresses degraded long-conversation performance.
62. **D** — Personal typing speed isn't a legitimate model-selection factor; speed, depth, and cost are.
63. **A** — A lightweight, fast tier fits low-stakes, low-complexity, cost-sensitive tasks.
64. **B** — A balanced mid-tier model fits typical business tasks between simple FAQs and the deepest reasoning needs.
65. **B** — Artifacts support standalone, editable, shareable, versionable content outside the chat stream.
66. **B** — More capable tiers generally trade higher cost/latency for greater reasoning depth.
67. **B** — A Project with consistent instructions/knowledge sources drives consistency across recurring runs.
68. **B** — Deliberately choosing to summarize, restart, or persist addresses context limitations directly.
69. **B** — Categorizing short tickets is high-volume and low-complexity — a good fit for a faster, cheaper tier.
70. **B** — Knowledge sources in a Project let reference material persist across many future conversations.
71. **A, B** — Reasoning complexity and acceptable cost/speed trade-off are the legitimate model-selection drivers.
72. **B** — A one-time, simple question doesn't need Project-level configuration or reuse setup.
73. **B** — Matching tier to task balances quality, speed, and cost across a team's varied work.
74. **B** — Persisting key findings prevents losing context/conclusions once a conversation ends or context is trimmed.
75. **B** — A structured, reusable, editable project plan is a strong candidate for an artifact rather than inline chat.

### Domain 4: Workflow Integration and Solution Design
76. **B** — Analyzing the current workflow for bottlenecks/repetition is the right starting point before applying AI.
77. **B** — Augmenting supports existing steps; redesigning restructures the process itself.
78. **B** — Balanced communication of value and limitations builds credible stakeholder trust.
79. **B** — Claude supports requirements analysis, option comparison, and drafting — with humans still deciding.
80. **B** — Using Claude to help standardize/draft the compiled report directly targets the manual synthesis bottleneck.
81. **B** — Organizing/synthesizing stakeholder-gathered requirements is an appropriate, grounded use of Claude.
82. **B** — Defined success criteria (quality, time saved, error rate) are the right basis for a scale decision.
83. **B** — Communicating a concrete business outcome (time saved, quality maintained) demonstrates value, not just output.
84. **B** — High financial-risk judgment calls should stay with a qualified human, with Claude supporting analysis.
85. **B** — Clear ownership of review, approval, and accountability at each stage is essential workflow design, not optional.
86. **B** — Repetitive, time-consuming, low-risk processes are the strongest first-pilot candidates.
87. **B** — Mapping current-state steps, surfacing inefficiencies, and drafting a future-state process for review is appropriate process optimization.
88. **B** — Time saved, error rate, and output quality are measurable, meaningful success metrics.
89. **B** — Shared instructions/knowledge sources support alignment across teams on a cross-functional process.
90. **B** — Ambiguous, sensitive, or out-of-scope requests should trigger escalation to a human agent.
91. **B** — Judgment-heavy, accountability-laden steps should stay human-led even with AI support.
92. **B** — Using Claude throughout research/drafting/iteration, with human validation of key claims, is effective integration.
93. **B** — Prioritizing high-value, low-complexity use cases first is sound adoption sequencing.
94. **B** — Documentation should cover steps, inputs, review/approval points, and escalation criteria.
95. **B** — Communicating change, providing guidance, and gathering feedback is core change management.
96. **B** — A recurring, same-pattern task (like structured weekly summaries) is a strong repetitive-task candidate.
97. **B** — Using Claude across drafting, feedback, and iteration reflects true solution design support.
98. **B** — Compliance review should remain in place; Claude supports drafting/analysis but doesn't replace accountability.
99. **B** — Being explicit about strengths (speed, drafting, synthesis) and limits (oversight needed) sets realistic expectations.
100. **B** — A small-group pilot with defined success criteria and structured feedback is the reasonable design.
101. **B** — Gathering information, structuring plans, and surfacing inefficiencies matches the Domain 4 objective directly.

### Domain 5: Configuration and Knowledge Management
102. **B** — Instructions give standing, consistent context/guidance across all conversations in a Project.
103. **B** — Outdated knowledge sources can cause Claude to reference stale information as current.
104. **B** — Periodic review/update/removal keeps a Project's knowledge base reliable over time.
105. **B** — A connector provides live access to current content, avoiding staleness from static uploads.
106. **B** — Conflicting sources should be resolved (update/remove the outdated one) rather than left to chance.
107. **B** — Standing instructions persist across the Project; a single request applies only to that exchange.
108. **B** — Specific, scoped instructions (tone, source constraints, escalation trigger) are far more effective than vague ones.
109. **B** — Different teams often need distinct instructions/knowledge/scope suited to their specific workflow.
110. **B** — Instructions should be updated to reflect the current process, not left stale.
111. **B** — Connecting relevant, permitted business content for a defined task is the appropriate use of a connector.
112. **B** — Testing with representative sample tasks validates a configuration before broader rollout.
113. **B** — Ongoing review and updates as processes/policies/data change is exactly what this objective describes.
114. **A** — Shared purpose, audience, and knowledge needs determine whether to reuse or create a new Project.
115. **B** — Documentation helps others understand, maintain, and correctly use a Project, especially after handoffs.
116. **B** — Overly broad access to sensitive data is the immediate governance/configuration concern.
117. **A, B** — Removing outdated documents and reviewing currency are the two core knowledge-management practices.
118. **A** — The most current, authoritative source should take priority over outdated or unofficial ones.
119. **B** — Standing instructions in the Project apply the requirement consistently, rather than repeating it manually.
120. **B** — Connector access should be scoped to what's relevant and appropriate for the Project's purpose.

### Domain 6: Governance, Risk, and Responsible Use
121. **B** — Anonymizing regulated identifiers before upload satisfies the policy while still enabling the analysis.
122. **B** — Appropriateness in a regulated industry hinges on respecting applicable regulatory/privacy/data-handling rules.
123. **B** — Disclosure decisions should follow organizational policy and applicable regulation/transparency norms.
124. **B** — Using AI output for an employment decision with no bias review is the clearest ethical red flag here.
125. **A** — Internal policy should be followed even when a shortcut would be more convenient.
126. **B** — Confidential client data should be handled per confidentiality obligations, sensitivity classification, and policy.
127. **B** — Close resemblance to copyrighted material without attribution raises IP/originality concerns needing review.
128. **B** — Following defined organizational policies on data handling, use cases, and review requirements is the definition given.
129. **B** — Human manager review for fairness and accuracy is essential before finalizing performance review language.
130. **B** — Generating content to impersonate a real person without consent is a clear inappropriate use case.
131. **B** — Confirming data classification and requirements first is the responsible step when uncertain.
132. **B** — Uncritical acceptance in high-stakes contexts risks unnoticed errors and accountability gaps.
133. **B** — Policy violations involving regulated data should be raised through the appropriate internal channel.
134. **B** — Proper classification and restricting sensitive/regulated data from prohibited uploads is core data-sensitivity practice.
135. **B** — Organizational policy and relevant regulation should be checked first for appropriateness.
136. **B** — Undisclosed AI-generated influence raises real transparency/trust and possible policy/regulatory concerns.
137. **A, B** — Data sensitivity/regulatory status and task necessity are the two key upload considerations.
138. **B** — An unverifiable statistic should be sourced or removed before external publication.
139. **B** — Claude can support drafting/organizing, but evaluative hiring decisions should stay with qualified humans.
140. **B** — Properly anonymized aggregate data generally carries different risk than identifiable personal data, though policy should still be checked.
141. **B** — Ethical awareness centers on fairness, transparency, and accountability effects on people impacted.
142. **B** — The organization's own AI policy or governance/compliance contact is the right resource to consult.
143. **B** — Meeting disclosure, accuracy, and data-handling requirements is correct application of regulatory considerations.
144. **B** — Sensitive matters should use the organization's approved platform/process, not an unapproved one.

### Domain 7: Troubleshooting and Optimization
145. **B** — Vague, generic output across attempts usually traces back to missing context/specificity/constraints.
146. **B** — Isolating and explicitly restating the ignored instruction is the most targeted fix.
147. **B** — A shared template or Project configuration standardizes quality and structure across a team.
148. **B** — Continuing from where it left off, or chunking the request, resolves truncated long outputs.
149. **B** — An explicit, specific format requirement is the direct fix for a wrong-format response.
150. **B** — Building the tone requirement into the prompt/instructions prevents the same issue recurring.
151. **B** — A refined, reusable template captures lessons learned and reduces repeated back-and-forth.
152. **B** — Testing a more capable tier on the same prompt isolates whether tier or prompt is the limiting factor.
153. **B** — Deliberately adjusting prompt/context/configuration based on what did or didn't work is the objective's core.
154. **A** — Gradually declining accuracy over months points first to outdated knowledge sources needing review.
155. **B** — Front-loading context, constraints, format, and examples reduces the number of iteration cycles needed.
156. **B** — Fixing the shared template/instructions at the source scales the correction across the whole team.
157. **A, B** — Reviewing prompt context/constraints and checking model-tier fit are the systematic troubleshooting steps.
158. **B** — Fewer prompts needed for the same quality outcome is a successful efficiency optimization.
159. **B** — Changing one variable at a time isolates the true cause among prompt, knowledge sources, and model tier.
160. **B** — Continuous, results-based refinement to reduce effort while maintaining/improving quality is the definition given.

---

### Notes on using this bank
- This is a **practice** resource for self-assessment against the published blueprint, not a copy of live exam items.
- The real exam mixes single-answer and multiple-response items and states how many answers each item wants — practice both formats.
- The two heaviest domains (Output Evaluation and Validation at 21%, and Workflow Integration and Solution Design at 16%) are worth extra study time.
- Always check Anthropic's current, official exam guide before scheduling, since the blueprint is versioned and "subject to change without notice."

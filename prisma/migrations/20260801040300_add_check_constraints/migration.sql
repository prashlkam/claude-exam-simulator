-- Enum enforcement at the database level (PLAN.md §6.3).
--
-- SQL Server has no native enum type, so the enum-valued columns are NVarChar and the
-- allowed values live in lib/enums.ts. These CHECK constraints mirror that set inside the
-- database, so a buggy or compromised code path — even raw SQL — cannot write an
-- out-of-range value.

ALTER TABLE [dbo].[ExamSession] ADD CONSTRAINT [CK_ExamSession_mode]
  CHECK ([mode] IN ('MOCK', 'REAL'));

ALTER TABLE [dbo].[ExamSession] ADD CONSTRAINT [CK_ExamSession_timing]
  CHECK ([timing] IN ('TIMED', 'UNTIMED'));

ALTER TABLE [dbo].[ExamSession] ADD CONSTRAINT [CK_ExamSession_status]
  CHECK ([status] IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'ABANDONED'));

ALTER TABLE [dbo].[Question] ADD CONSTRAINT [CK_Question_type]
  CHECK ([type] IN ('SINGLE', 'MULTI'));

ALTER TABLE [dbo].[Option] ADD CONSTRAINT [CK_Option_letter]
  CHECK ([letter] IN ('A', 'B', 'C', 'D'));

-- A TIMED session must carry a deadline; an UNTIMED one must not.
ALTER TABLE [dbo].[ExamSession] ADD CONSTRAINT [CK_ExamSession_timing_endsAt]
  CHECK (([timing] = 'TIMED' AND [endsAt] IS NOT NULL)
      OR ([timing] = 'UNTIMED' AND [endsAt] IS NULL));

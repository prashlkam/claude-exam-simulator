BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(30) NOT NULL,
    [email] NVARCHAR(255) NOT NULL,
    [name] NVARCHAR(120),
    [passwordHash] NVARCHAR(255) NOT NULL,
    [emailVerified] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Exam] (
    [id] NVARCHAR(30) NOT NULL,
    [code] NVARCHAR(16) NOT NULL,
    [title] NVARCHAR(200) NOT NULL,
    [realItemCount] INT NOT NULL,
    [durationMinutes] INT NOT NULL,
    [passingScaledScore] INT NOT NULL CONSTRAINT [Exam_passingScaledScore_df] DEFAULT 720,
    [bankSize] INT NOT NULL CONSTRAINT [Exam_bankSize_df] DEFAULT 0,
    CONSTRAINT [Exam_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Exam_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[Domain] (
    [id] NVARCHAR(30) NOT NULL,
    [examId] NVARCHAR(30) NOT NULL,
    [index] INT NOT NULL,
    [name] NVARCHAR(200) NOT NULL,
    [weight] FLOAT(53) NOT NULL,
    CONSTRAINT [Domain_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Domain_examId_index_key] UNIQUE NONCLUSTERED ([examId],[index])
);

-- CreateTable
CREATE TABLE [dbo].[Question] (
    [id] NVARCHAR(30) NOT NULL,
    [externalId] NVARCHAR(64) NOT NULL,
    [examId] NVARCHAR(30) NOT NULL,
    [domainId] NVARCHAR(30) NOT NULL,
    [number] INT NOT NULL,
    [subTopic] NVARCHAR(300),
    [type] NVARCHAR(10) NOT NULL,
    [stem] NVARCHAR(max) NOT NULL,
    [explanation] NVARCHAR(max) NOT NULL,
    [contentHash] NVARCHAR(80) NOT NULL,
    [revision] INT NOT NULL CONSTRAINT [Question_revision_df] DEFAULT 1,
    CONSTRAINT [Question_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Question_externalId_key] UNIQUE NONCLUSTERED ([externalId])
);

-- CreateTable
CREATE TABLE [dbo].[Option] (
    [id] NVARCHAR(30) NOT NULL,
    [questionId] NVARCHAR(30) NOT NULL,
    [letter] NVARCHAR(1) NOT NULL,
    [text] NVARCHAR(max) NOT NULL,
    [isCorrect] BIT NOT NULL,
    CONSTRAINT [Option_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Option_questionId_letter_key] UNIQUE NONCLUSTERED ([questionId],[letter])
);

-- CreateTable
CREATE TABLE [dbo].[ExamSession] (
    [id] NVARCHAR(30) NOT NULL,
    [userId] NVARCHAR(30) NOT NULL,
    [examId] NVARCHAR(30) NOT NULL,
    [mode] NVARCHAR(10) NOT NULL,
    [timing] NVARCHAR(10) NOT NULL,
    [status] NVARCHAR(16) NOT NULL CONSTRAINT [ExamSession_status_df] DEFAULT 'IN_PROGRESS',
    [itemCount] INT NOT NULL,
    [durationMinutes] INT,
    [seed] NVARCHAR(64) NOT NULL,
    [startedAt] DATETIME2 NOT NULL CONSTRAINT [ExamSession_startedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [endsAt] DATETIME2,
    [submittedAt] DATETIME2,
    [lastSeenAt] DATETIME2 NOT NULL CONSTRAINT [ExamSession_lastSeenAt_df] DEFAULT CURRENT_TIMESTAMP,
    [rawScore] INT,
    [rawTotal] INT,
    [scaledScore] INT,
    [passed] BIT,
    CONSTRAINT [ExamSession_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SessionItem] (
    [id] NVARCHAR(30) NOT NULL,
    [sessionId] NVARCHAR(30) NOT NULL,
    [questionId] NVARCHAR(30) NOT NULL,
    [position] INT NOT NULL,
    [optionOrder] NVARCHAR(16) NOT NULL,
    [selectedLetters] NVARCHAR(16),
    [flagged] BIT NOT NULL CONSTRAINT [SessionItem_flagged_df] DEFAULT 0,
    [isCorrect] BIT,
    [answeredAt] DATETIME2,
    [stemSnapshot] NVARCHAR(max) NOT NULL,
    [optionsSnapshot] NVARCHAR(max) NOT NULL,
    CONSTRAINT [SessionItem_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SessionItem_sessionId_questionId_key] UNIQUE NONCLUSTERED ([sessionId],[questionId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Question_examId_domainId_idx] ON [dbo].[Question]([examId], [domainId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ExamSession_userId_examId_submittedAt_idx] ON [dbo].[ExamSession]([userId], [examId], [submittedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ExamSession_userId_status_idx] ON [dbo].[ExamSession]([userId], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SessionItem_sessionId_position_idx] ON [dbo].[SessionItem]([sessionId], [position]);

-- AddForeignKey
ALTER TABLE [dbo].[Domain] ADD CONSTRAINT [Domain_examId_fkey] FOREIGN KEY ([examId]) REFERENCES [dbo].[Exam]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_examId_fkey] FOREIGN KEY ([examId]) REFERENCES [dbo].[Exam]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_domainId_fkey] FOREIGN KEY ([domainId]) REFERENCES [dbo].[Domain]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Option] ADD CONSTRAINT [Option_questionId_fkey] FOREIGN KEY ([questionId]) REFERENCES [dbo].[Question]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ExamSession] ADD CONSTRAINT [ExamSession_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ExamSession] ADD CONSTRAINT [ExamSession_examId_fkey] FOREIGN KEY ([examId]) REFERENCES [dbo].[Exam]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SessionItem] ADD CONSTRAINT [SessionItem_sessionId_fkey] FOREIGN KEY ([sessionId]) REFERENCES [dbo].[ExamSession]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[SessionItem] ADD CONSTRAINT [SessionItem_questionId_fkey] FOREIGN KEY ([questionId]) REFERENCES [dbo].[Question]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

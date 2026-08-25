/*
  SMM database - SQL Server initial migration
  Safe to execute more than once in a development database.
*/

IF DB_ID(N'SmmDb') IS NULL
BEGIN
    CREATE DATABASE [SmmDb];
END;
GO

USE [SmmDb];
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        UserId            INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
        Username          NVARCHAR(80) NOT NULL,
        Email             NVARCHAR(254) NULL,
        PasswordHash      NVARCHAR(255) NULL,
        ApiKeyHash        NVARCHAR(255) NULL,
        IsActive          BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT (1),
        CreatedAt         DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt         DATETIME2(0) NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT UQ_Users_Username UNIQUE (Username),
        CONSTRAINT UQ_Users_Email UNIQUE (Email)
    );
END;
GO

IF OBJECT_ID(N'dbo.Services', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Services (
        ServiceId         INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Services PRIMARY KEY,
        Name              NVARCHAR(160) NOT NULL,
        Category          NVARCHAR(80) NOT NULL,
        RatePerThousand   DECIMAL(12,4) NOT NULL,
        MinimumQuantity   INT NOT NULL,
        MaximumQuantity   INT NOT NULL,
        Description       NVARCHAR(500) NULL,
        IsActive          BIT NOT NULL CONSTRAINT DF_Services_IsActive DEFAULT (1),
        CreatedAt         DATETIME2(0) NOT NULL CONSTRAINT DF_Services_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt         DATETIME2(0) NOT NULL CONSTRAINT DF_Services_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT CK_Services_RateNonNegative CHECK (RatePerThousand >= 0),
        CONSTRAINT CK_Services_QuantityRange CHECK (MinimumQuantity > 0 AND MaximumQuantity >= MinimumQuantity)
    );
END;
GO

IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        OrderId           BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Orders PRIMARY KEY,
        UserId            INT NOT NULL,
        ServiceId         INT NOT NULL,
        TargetUrl         NVARCHAR(2048) NOT NULL,
        Quantity          INT NOT NULL,
        Charge            DECIMAL(12,4) NOT NULL,
        Status            VARCHAR(20) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT ('Pending'),
        CreatedAt         DATETIME2(0) NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt         DATETIME2(0) NOT NULL CONSTRAINT DF_Orders_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT FK_Orders_Services FOREIGN KEY (ServiceId) REFERENCES dbo.Services(ServiceId),
        CONSTRAINT CK_Orders_QuantityPositive CHECK (Quantity > 0),
        CONSTRAINT CK_Orders_ChargeNonNegative CHECK (Charge >= 0),
        CONSTRAINT CK_Orders_Status CHECK (Status IN ('Pending', 'In progress', 'Completed', 'Canceled', 'Failed'))
    );
END;
GO

IF OBJECT_ID(N'dbo.BalanceTransactions', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.BalanceTransactions (
        BalanceTransactionId BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_BalanceTransactions PRIMARY KEY,
        UserId               INT NOT NULL,
        Amount               DECIMAL(12,4) NOT NULL,
        TransactionType      VARCHAR(20) NOT NULL,
        Reference             NVARCHAR(120) NULL,
        CreatedAt             DATETIME2(0) NOT NULL CONSTRAINT DF_BalanceTransactions_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_BalanceTransactions_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT CK_BalanceTransactions_AmountPositive CHECK (Amount > 0),
        CONSTRAINT CK_BalanceTransactions_Type CHECK (TransactionType IN ('Credit', 'Debit', 'Refund'))
    );
END;
GO

IF OBJECT_ID(N'dbo.Payments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Payments (
        PaymentId          BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Payments PRIMARY KEY,
        UserId             INT NOT NULL,
        Amount             DECIMAL(12,4) NOT NULL,
        Provider            VARCHAR(40) NOT NULL,
        ProviderReference  NVARCHAR(160) NULL,
        Status              VARCHAR(20) NOT NULL CONSTRAINT DF_Payments_Status DEFAULT ('Pending'),
        CreatedAt          DATETIME2(0) NOT NULL CONSTRAINT DF_Payments_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt          DATETIME2(0) NOT NULL CONSTRAINT DF_Payments_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_Payments_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT CK_Payments_AmountPositive CHECK (Amount > 0),
        CONSTRAINT CK_Payments_Status CHECK (Status IN ('Pending', 'Approved', 'Rejected', 'Refunded'))
    );
END;
GO

IF OBJECT_ID(N'dbo.OrderStatusHistory', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderStatusHistory (
        OrderStatusHistoryId BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_OrderStatusHistory PRIMARY KEY,
        OrderId             BIGINT NOT NULL,
        PreviousStatus      VARCHAR(20) NULL,
        CurrentStatus       VARCHAR(20) NOT NULL,
        ChangedByUserId     INT NULL,
        CreatedAt           DATETIME2(0) NOT NULL CONSTRAINT DF_OrderStatusHistory_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_OrderStatusHistory_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(OrderId),
        CONSTRAINT FK_OrderStatusHistory_Users FOREIGN KEY (ChangedByUserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT CK_OrderStatusHistory_CurrentStatus CHECK (CurrentStatus IN ('Pending', 'In progress', 'Completed', 'Canceled', 'Failed'))
    );
END;
GO

IF OBJECT_ID(N'dbo.AuditLogs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditLogs (
        AuditLogId         BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_AuditLogs PRIMARY KEY,
        UserId             INT NULL,
        Action              VARCHAR(80) NOT NULL,
        EntityName         VARCHAR(80) NULL,
        EntityId            NVARCHAR(80) NULL,
        Details             NVARCHAR(MAX) NULL,
        RequestId           VARCHAR(80) NULL,
        CreatedAt           DATETIME2(0) NOT NULL CONSTRAINT DF_AuditLogs_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
    );
END;
GO

IF OBJECT_ID(N'dbo.Bookings', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Bookings (
        BookingId        BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Bookings PRIMARY KEY,
        UserId           INT NOT NULL,
        ServiceType      VARCHAR(40) NOT NULL,
        Address          NVARCHAR(500) NOT NULL,
        PreferredDate    DATE NOT NULL,
        PreferredTime    VARCHAR(10) NOT NULL,
        Status           VARCHAR(20) NOT NULL CONSTRAINT DF_Bookings_Status DEFAULT ('Pending'),
        Notes            NVARCHAR(1000) NULL,
        CreatedAt        DATETIME2(0) NOT NULL CONSTRAINT DF_Bookings_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt        DATETIME2(0) NOT NULL CONSTRAINT DF_Bookings_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_Bookings_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT CK_Bookings_Status CHECK (Status IN ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled')),
        CONSTRAINT CK_Bookings_ServiceType CHECK (ServiceType IN ('HVAC Installation', 'HVAC Repair', 'Electrical Installation', 'Electrical Repair', 'Maintenance', 'Inspection'))
    );
END;
GO

IF OBJECT_ID(N'dbo.Quotes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Quotes (
        QuoteId          BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Quotes PRIMARY KEY,
        UserId           INT NOT NULL,
        ServiceType      VARCHAR(40) NOT NULL,
        PropertyType     VARCHAR(40) NOT NULL,
        SquareFootage    INT NOT NULL,
        EquipmentBrand   VARCHAR(80) NULL,
        EfficiencyRating VARCHAR(20) NULL,
        EstimatedCost    DECIMAL(12,2) NOT NULL,
        Details          NVARCHAR(MAX) NULL,
        Status           VARCHAR(20) NOT NULL CONSTRAINT DF_Quotes_Status DEFAULT ('Draft'),
        CreatedAt        DATETIME2(0) NOT NULL CONSTRAINT DF_Quotes_CreatedAt DEFAULT (SYSUTCDATETIME()),
        UpdatedAt        DATETIME2(0) NOT NULL CONSTRAINT DF_Quotes_UpdatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_Quotes_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
        CONSTRAINT CK_Quotes_Status CHECK (Status IN ('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired')),
        CONSTRAINT CK_Quotes_ServiceType CHECK (ServiceType IN ('HVAC Installation', 'HVAC Repair', 'Electrical Installation', 'Electrical Repair')),
        CONSTRAINT CK_Quotes_PropertyType CHECK (PropertyType IN ('Residential', 'Commercial', 'Industrial')),
        CONSTRAINT CK_Quotes_EfficiencyRating CHECK (EfficiencyRating IN ('Standard', 'High', 'Premium')),
        CONSTRAINT CK_Quotes_SquareFootage CHECK (SquareFootage BETWEEN 100 AND 100000)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Quotes_UserId_CreatedAt' AND object_id = OBJECT_ID(N'dbo.Quotes'))
    CREATE INDEX IX_Quotes_UserId_CreatedAt ON dbo.Quotes (UserId, CreatedAt DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Bookings_UserId_CreatedAt' AND object_id = OBJECT_ID(N'dbo.Bookings'))
    CREATE INDEX IX_Bookings_UserId_CreatedAt ON dbo.Bookings (UserId, CreatedAt DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Orders_UserId_CreatedAt' AND object_id = OBJECT_ID(N'dbo.Orders'))
    CREATE INDEX IX_Orders_UserId_CreatedAt ON dbo.Orders (UserId, CreatedAt DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Orders_Status_CreatedAt' AND object_id = OBJECT_ID(N'dbo.Orders'))
    CREATE INDEX IX_Orders_Status_CreatedAt ON dbo.Orders (Status, CreatedAt DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_BalanceTransactions_UserId_CreatedAt' AND object_id = OBJECT_ID(N'dbo.BalanceTransactions'))
    CREATE INDEX IX_BalanceTransactions_UserId_CreatedAt ON dbo.BalanceTransactions (UserId, CreatedAt DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrderStatusHistory_OrderId_CreatedAt' AND object_id = OBJECT_ID(N'dbo.OrderStatusHistory'))
    CREATE INDEX IX_OrderStatusHistory_OrderId_CreatedAt ON dbo.OrderStatusHistory (OrderId, CreatedAt DESC);
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Username = N'demo_user')
BEGIN
    INSERT INTO dbo.Users (Username, Email, PasswordHash, ApiKeyHash)
    VALUES (N'demo_user', N'demo@smm.local', N'4a3b4cecd4f101fb6a4184d5ce4a5fa5:fbf140babf0b8fb37c696a122cedf8e92c0f34b66b565bb57ee985e2b8fd7c128ae1e392d2cf9a9d175f669e872742a214865129677cd33def4bbee64a4814a1', N'development-only-api-key-hash');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Services)
BEGIN
    INSERT INTO dbo.Services (Name, Category, RatePerThousand, MinimumQuantity, MaximumQuantity, Description)
    VALUES
      (N'Instagram Followers', N'Instagram', 12.5000, 50, 10000, N'Seguidores reales de Instagram'),
      (N'Instagram Likes', N'Instagram', 5.0000, 100, 50000, N'Likes en publicaciones de Instagram'),
      (N'Instagram Views', N'Instagram', 2.0000, 500, 100000, N'Visualizaciones en reels'),
      (N'TikTok Followers', N'TikTok', 18.0000, 50, 5000, N'Seguidores de TikTok'),
      (N'TikTok Likes', N'TikTok', 6.5000, 100, 50000, N'Likes en videos de TikTok'),
      (N'YouTube Views', N'YouTube', 3.5000, 500, 100000, N'Visualizaciones en YouTube'),
      (N'YouTube Subscribers', N'YouTube', 25.0000, 50, 2000, N'Suscriptores de YouTube'),
      (N'Spotify Plays', N'Spotify', 15.0000, 100, 10000, N'Reproducciones en Spotify'),
      (N'Telegram Members', N'Telegram', 20.0000, 50, 5000, N'Miembros para canal de Telegram');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.BalanceTransactions)
BEGIN
    DECLARE @DemoUserId INT = (SELECT UserId FROM dbo.Users WHERE Username = N'demo_user');
    INSERT INTO dbo.BalanceTransactions (UserId, Amount, TransactionType, Reference)
    VALUES (@DemoUserId, 156.7500, 'Credit', N'development-seed');
END;
GO

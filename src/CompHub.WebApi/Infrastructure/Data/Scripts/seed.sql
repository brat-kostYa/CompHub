-- Infrastructure/Data/Scripts/seed.sql

-- ============================================================
-- CompHub — Seed Script
-- Re-runnable: clears all data and resets IDENTITY on every run
-- ============================================================

USE CompHub;
GO

EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';
GO

DELETE FROM Reviews;
DELETE FROM OrderItems;
DELETE FROM Orders;
DELETE FROM ProductSpecifications;
DELETE FROM Products;
DELETE FROM SpecificationKeys;
DELETE FROM Categories;
DELETE FROM Brands;
DELETE FROM Users;
GO

DBCC CHECKIDENT ('Reviews',               RESEED, 0);
DBCC CHECKIDENT ('OrderItems',            RESEED, 0);
DBCC CHECKIDENT ('Orders',               RESEED, 0);
DBCC CHECKIDENT ('ProductSpecifications', RESEED, 0);
DBCC CHECKIDENT ('Products',             RESEED, 0);
DBCC CHECKIDENT ('SpecificationKeys',     RESEED, 0);
DBCC CHECKIDENT ('Categories',            RESEED, 0);
DBCC CHECKIDENT ('Brands',               RESEED, 0);
DBCC CHECKIDENT ('Users',                RESEED, 0);
GO

EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';
GO

-- ============================================================
-- BRANDS
-- ============================================================
INSERT INTO Brands (Name, LogoUrl) VALUES
('Intel',          '/images/brands/intel.png'),
('AMD',            '/images/brands/amd.png'),
('NVIDIA',         '/images/brands/nvidia.png'),
('Kingston',       '/images/brands/kingston.png'),
('Samsung',        '/images/brands/samsung.png'),
('Crucial',        '/images/brands/crucial.png'),
('Corsair',        '/images/brands/corsair.png'),
('G.Skill',        '/images/brands/gskill.png'),
('Western Digital','/images/brands/wd.png'),
('Seagate',        '/images/brands/seagate.png'),
('ASUS',           '/images/brands/asus.png'),
('MSI',            '/images/brands/msi.png'),
('Gigabyte',       '/images/brands/gigabyte.png'),
('ASRock',         '/images/brands/asrock.png'),
('Seasonic',       '/images/brands/seasonic.png'),
('be quiet!',      '/images/brands/bequiet.png'),
('Noctua',         '/images/brands/noctua.png'),
('Cooler Master',  '/images/brands/coolermaster.png'),
('NZXT',           '/images/brands/nzxt.png'),
('Sapphire',       '/images/brands/sapphire.png');
GO

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO Categories (Name, Slug, ParentCategoryId) VALUES
('Процесори',             'processors',      NULL),  -- 1
('Відеокарти',            'graphics-cards',  NULL),  -- 2
('Оперативна пам''ять',   'memory',          NULL),  -- 3
('Накопичувачі',          'storage',         NULL),  -- 4
('Материнські плати',     'motherboards',    NULL),  -- 5
('Блоки живлення',        'power-supplies',  NULL),  -- 6
('Корпуси',               'cases',           NULL),  -- 7
('Охолодження',           'cooling',         NULL),  -- 8
('SSD-накопичувачі',      'ssds',            4),     -- 9
('HDD-накопичувачі',      'hdds',            4),     -- 10
('Кулери для CPU',        'cpu-coolers',     8),     -- 11
('Корпусні вентилятори',  'case-fans',       8);     -- 12
GO

-- ============================================================
-- SPECIFICATION KEYS
-- ============================================================

-- Процесори (CategoryId=1)
INSERT INTO SpecificationKeys (Name, Unit, DisplayOrder, CategoryId) VALUES
('Сокет',            NULL,   1, 1),
('Ядра',             NULL,   2, 1),
('Потоки',           NULL,   3, 1),
('Базова частота',   'ГГц',  4, 1),
('Макс. частота',    'ГГц',  5, 1),
('Кеш',              'МБ',   6, 1),
('TDP',              'Вт',   7, 1);

-- Відеокарти (CategoryId=2)
INSERT INTO SpecificationKeys (Name, Unit, DisplayOrder, CategoryId) VALUES
('Відеопам''ять',  'ГБ',  1, 2),
('Тип пам''яті',   NULL,  2, 2),
('Інтерфейс',      NULL,  3, 2),
('TDP',            'Вт',  4, 2);

-- Оперативна пам'ять (CategoryId=3)
INSERT INTO SpecificationKeys (Name, Unit, DisplayOrder, CategoryId) VALUES
('Обсяг',      'ГБ',   1, 3),
('Частота',    'МГц',  2, 3),
('Тип',        NULL,   3, 3),
('Латентність',NULL,   4, 3);

-- SSD (CategoryId=9)
INSERT INTO SpecificationKeys (Name, Unit, DisplayOrder, CategoryId) VALUES
('Обсяг',           'ГБ',    1, 9),
('Інтерфейс',       NULL,    2, 9),
('Форм-фактор',     NULL,    3, 9),
('Читання',         'МБ/с',  4, 9),
('Запис',           'МБ/с',  5, 9);

-- Материнські плати (CategoryId=5)
INSERT INTO SpecificationKeys (Name, Unit, DisplayOrder, CategoryId) VALUES
('Сокет',        NULL,  1, 5),
('Чипсет',       NULL,  2, 5),
('Форм-фактор',  NULL,  3, 5),
('Слоти RAM',    NULL,  4, 5),
('Макс. RAM',    'ГБ',  5, 5);

-- Блоки живлення (CategoryId=6)
INSERT INTO SpecificationKeys (Name, Unit, DisplayOrder, CategoryId) VALUES
('Потужність',         'Вт',   1, 6),
('Сертифікат',         NULL,   2, 6),
('Модульність',        NULL,   3, 6);
GO

-- ============================================================
-- PRODUCTS (ціни в гривнях)
-- ============================================================
INSERT INTO Products (Name, Description, Price, StockQuantity, IsActive, ImageUrl, CreatedAt, CategoryId, BrandId) VALUES

-- ПРОЦЕСОРИ
('Intel Core i9-14900K',
 'Флагманський Desktop-процесор Intel. 24 ядра (8P+16E), 36 МБ кешу L3, буст до 6.0 ГГц. Для тих, кому потрібна максимальна продуктивність без компромісів.',
 23490, 35, 1, '/images/products/i9-14900k.jpg', GETUTCDATE(), 1, 1),

('Intel Core i7-14700K',
 'Потужне 20-ядерне рішення для гемінгу та відеомонтажу. Відмінний баланс ціни та продуктивності для збирань середнього рівня.',
 16200, 60, 1, '/images/products/i7-14700k.jpg', GETUTCDATE(), 1, 1),

('Intel Core i5-14600K',
 'Найкраще співвідношення ціна/продуктивність у лінійці Intel. 14 ядер для ігор і повсякденних задач без зайвої переплати.',
 11750, 90, 1, '/images/products/i5-14600k.jpg', GETUTCDATE(), 1, 1),

('AMD Ryzen 9 7950X',
 '16-ядерний флагман AMD на платформі AM5. Підходить для 3D-рендеру, компіляції та складних багатопотокових задач.',
 27300, 25, 1, '/images/products/ryzen9-7950x.jpg', GETUTCDATE(), 1, 2),

('AMD Ryzen 7 7700X',
 'Восьмиядерний AM5-процесор з відмінними ігровими показниками. Підтримка DDR5 та PCIe 5.0 без доплати.',
 13650, 70, 1, '/images/products/ryzen7-7700x.jpg', GETUTCDATE(), 1, 2),

('AMD Ryzen 5 7600X',
 'Оптимальний вибір для ігрового ПК на AMD. 6 ядер, висока тактова частота та доступна ціна на нову платформу.',
 9750, 110, 1, '/images/products/ryzen5-7600x.jpg', GETUTCDATE(), 1, 2),

-- ВІДЕОКАРТИ
('ASUS ROG Strix RTX 4090 OC',
 '24 ГБ GDDR6X та потрійна система охолодження ROG Strix. Флагман для 4K-гемінгу та задач ШІ без жодних обмежень.',
 70500, 15, 1, '/images/products/rtx4090-rog.jpg', GETUTCDATE(), 2, 11),

('MSI Gaming RTX 4080 Super',
 '16 ГБ GDDR6X — продуктивність Ultra у 4K. Охолодження MSI TRI FROZR 3 для тихої роботи під навантаженням.',
 43200, 28, 1, '/images/products/rtx4080s-msi.jpg', GETUTCDATE(), 2, 12),

('Gigabyte RTX 4070 Ti Eagle OC',
 '12 ГБ GDDR6X для 1440p та 4K-гемінгу. Ефективна система охолодження Eagle з підсвічуванням RGB.',
 31300, 40, 1, '/images/products/rtx4070ti-gigabyte.jpg', GETUTCDATE(), 2, 13),

('Sapphire Nitro+ RX 7900 XTX',
 '24 ГБ GDDR6 та архітектура AMD RDNA 3. Відповідь AMD на флагмани NVIDIA для вимогливих гравців.',
 39100, 22, 1, '/images/products/rx7900xtx-sapphire.jpg', GETUTCDATE(), 2, 20),

-- ОП
('Corsair Vengeance DDR5-6000 32GB',
 'Комплект 2×16 ГБ DDR5 з підтримкою Intel XMP 3.0. Стабільна робота на 6000 МГц з алюмінієвим радіатором.',
 5100, 80, 1, '/images/products/corsair-vengeance-ddr5.jpg', GETUTCDATE(), 3, 7),

('G.Skill Trident Z5 DDR5-6400 64GB',
 'Преміум-пам''ять 64 ГБ DDR5 на 6400 МГц із профілем AMD EXPO та Intel XMP 3.0. Для робочих станцій.',
 8600, 45, 1, '/images/products/gskill-tridentz5.jpg', GETUTCDATE(), 3, 8),

('Kingston Fury Beast DDR4-3200 16GB',
 'Надійний комплект 2×8 ГБ DDR4-3200 для платформ AM4 та LGA1200. Низький профіль для сумісності з кулерами.',
 1950, 150, 1, '/images/products/kingston-fury-ddr4.jpg', GETUTCDATE(), 3, 4),

-- SSD
('Samsung 990 Pro 2TB NVMe',
 'PCIe 4.0 NVMe з читанням до 7450 МБ/с. Ідеальний SSD для геймерів та відеомонтажерів, які цінують швидкість.',
 6900, 95, 1, '/images/products/samsung-990pro.jpg', GETUTCDATE(), 9, 5),

('WD Black SN850X 1TB',
 'PCIe 4.0 NVMe зі сумісністю з PlayStation 5. Читання до 7300 МБ/с — без компромісів у швидкості.',
 4890, 75, 1, '/images/products/wd-sn850x.jpg', GETUTCDATE(), 9, 9),

('Crucial P3 Plus 2TB NVMe',
 'Бюджетний PCIe 4.0 NVMe SSD із відмінними послідовними швидкостями. Найкращий вибір для другого накопичувача.',
 3500, 130, 1, '/images/products/crucial-p3plus.jpg', GETUTCDATE(), 9, 6),

-- МАТЕРИНСЬКІ ПЛАТИ
('ASUS ROG Maximus Z790 Hero',
 'Преміум ATX-плата для Intel 12–14 покоління. Wi-Fi 6E, DDR5, PCIe 5.0 та розширені можливості оверклокінгу.',
 23500, 20, 1, '/images/products/asus-z790-hero.jpg', GETUTCDATE(), 5, 11),

('MSI MAG X670E Tomahawk WiFi',
 'Надійна ATX-плата для Ryzen 7000 (AM5). PCIe 5.0 для SSD та відеокарт, DDR5, Wi-Fi 6E у комплекті.',
 13700, 35, 1, '/images/products/msi-x670e-tomahawk.jpg', GETUTCDATE(), 5, 12),

('ASRock B650M Pro RS',
 'Компактна Micro-ATX плата AM5 для бюджетних збирань на Ryzen 7000. Всі необхідні функції без зайвої переплати.',
 5900, 55, 1, '/images/products/asrock-b650m.jpg', GETUTCDATE(), 5, 14),

-- БЛОКИ ЖИВЛЕННЯ
('Seasonic Focus GX-1000',
 '1000 Вт, 80+ Gold, повністю модульний. 10 років гарантії від Seasonic — найнадійніший вибір для потужних збирань.',
 6600, 50, 1, '/images/products/seasonic-gx1000.jpg', GETUTCDATE(), 6, 15),

('be quiet! Straight Power 12 850W',
 '850 Вт, 80+ Platinum, тихий вентилятор із Semi-modular кабелями. Для тих, хто цінує тишу системи.',
 5850, 45, 1, '/images/products/bequiet-sp12.jpg', GETUTCDATE(), 6, 16);
GO

-- ============================================================
-- PRODUCT SPECIFICATIONS
-- ============================================================

-- i9-14900K (1)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('LGA1700',1,1),('24',1,2),('32',1,3),('3.2',1,4),('6.0',1,5),('36',1,6),('125',1,7);

-- i7-14700K (2)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('LGA1700',2,1),('20',2,2),('28',2,3),('3.4',2,4),('5.6',2,5),('33',2,6),('125',2,7);

-- i5-14600K (3)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('LGA1700',3,1),('14',3,2),('20',3,3),('3.5',3,4),('5.3',3,5),('24',3,6),('125',3,7);

-- Ryzen 9 7950X (4)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('AM5',4,1),('16',4,2),('32',4,3),('4.5',4,4),('5.7',4,5),('64',4,6),('170',4,7);

-- Ryzen 7 7700X (5)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('AM5',5,1),('8',5,2),('16',5,3),('4.5',5,4),('5.4',5,5),('32',5,6),('105',5,7);

-- Ryzen 5 7600X (6)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('AM5',6,1),('6',6,2),('12',6,3),('4.7',6,4),('5.3',6,5),('32',6,6),('105',6,7);

-- RTX 4090 (7)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('24',7,8),('GDDR6X',7,9),('PCIe 4.0 x16',7,10),('450',7,11);

-- RTX 4080 Super (8)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('16',8,8),('GDDR6X',8,9),('PCIe 4.0 x16',8,10),('320',8,11);

-- RTX 4070 Ti (9)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('12',9,8),('GDDR6X',9,9),('PCIe 4.0 x16',9,10),('285',9,11);

-- RX 7900 XTX (10)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('24',10,8),('GDDR6',10,9),('PCIe 4.0 x16',10,10),('355',10,11);

-- Corsair DDR5 (11)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('32',11,12),('6000',11,13),('DDR5',11,14),('CL30',11,15);

-- G.Skill DDR5 (12)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('64',12,12),('6400',12,13),('DDR5',12,14),('CL32',12,15);

-- Kingston DDR4 (13)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('16',13,12),('3200',13,13),('DDR4',13,14),('CL16',13,15);

-- Samsung 990 Pro (14)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('2000',14,16),('PCIe 4.0 NVMe',14,17),('M.2 2280',14,18),('7450',14,19),('6900',14,20);

-- WD SN850X (15)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('1000',15,16),('PCIe 4.0 NVMe',15,17),('M.2 2280',15,18),('7300',15,19),('6600',15,20);

-- Crucial P3 Plus (16)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('2000',16,16),('PCIe 4.0 NVMe',16,17),('M.2 2280',16,18),('5000',16,19),('4200',16,20);

-- ASUS Z790 (17)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('LGA1700',17,21),('Z790',17,22),('ATX',17,23),('4',17,24),('128',17,25);

-- MSI X670E (18)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('AM5',18,21),('X670E',18,22),('ATX',18,23),('4',18,24),('128',18,25);

-- ASRock B650M (19)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('AM5',19,21),('B650',19,22),('Micro-ATX',19,23),('4',19,24),('128',19,25);

-- Seasonic GX-1000 (20)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('1000',20,26),('80+ Gold',20,27),('Повністю модульний',20,28);

-- be quiet! SP12 (21)
INSERT INTO ProductSpecifications (Value, ProductId, SpecificationKeyId) VALUES
('850',21,26),('80+ Platinum',21,27),('Semi-модульний',21,28);
GO

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, PhoneNumber, CreatedAt) VALUES
('admin@comphub.ua',
 '$2a$12$EXAMPLEHASH000000000000000000000000000000000000000000001',
 'Адмін', 'CompHub', '+380501234567', GETUTCDATE()),

('oleksii.kovalenko@gmail.com',
 '$2a$12$EXAMPLEHASH000000000000000000000000000000000000000000002',
 'Олексій', 'Коваленко', '+380671112233', GETUTCDATE()),

('maria.petrenko@ukr.net',
 '$2a$12$EXAMPLEHASH000000000000000000000000000000000000000000003',
 'Марія', 'Петренко', '+380632223344', GETUTCDATE());
GO

-- ============================================================
-- ORDERS
-- ============================================================
INSERT INTO Orders (CreatedAt, Status, TotalAmount, ShippingAddress, ShippingCity, UserId) VALUES
(DATEADD(DAY, -10, GETUTCDATE()), 3, 41050, 'вул. Хрещатик, 1',    'Київ',   2),
(DATEADD(DAY,  -2, GETUTCDATE()), 1, 11750, 'вул. Сумська, 22',    'Харків', 3),
(DATEADD(DAY,  -1, GETUTCDATE()), 0, 36400, 'пр. Шевченка, 15',    'Одеса',  2);
GO

INSERT INTO OrderItems (Quantity, UnitPrice, OrderId, ProductId) VALUES
(1, 31300, 1, 9),
(1,  9750, 1, 6),
(1, 11750, 2, 3),
(1, 31300, 3, 9),
(1,  5100, 3, 11);
GO

-- ============================================================
-- REVIEWS
-- ============================================================
INSERT INTO Reviews (Rating, Comment, CreatedAt, ProductId, UserId) VALUES
(5, 'Відмінний процесор — температури в нормі, апгрейд того вартий. Завантажив систему рендером на 12 годин, жодних нарікань.',
    DATEADD(DAY, -8, GETUTCDATE()), 6, 2),
(4, 'Чудова відеокарта для 1440p. Трохи шумна під максимальним навантаженням, але загалом дуже задоволений.',
    DATEADD(DAY, -7, GETUTCDATE()), 9, 2),
(5, 'Дуже швидка оперативна пам''ять. XMP-профіль 6000 МГц завівся з першого разу в BIOS.',
    DATEADD(DAY, -3, GETUTCDATE()), 11, 3),
(4, 'SSD відмінний — Windows завантажується за 8 секунд. Рекомендую як системний накопичувач.',
    DATEADD(DAY, -1, GETUTCDATE()), 14, 3);
GO

PRINT 'Seed завершено успішно.';
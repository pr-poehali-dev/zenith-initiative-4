
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  image_url VARCHAR(500),
  price NUMERIC(10,2) DEFAULT 10.00,
  steam_id VARCHAR(50)
);

CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  game_id INTEGER REFERENCES games(id),
  purchased_at TIMESTAMP DEFAULT NOW(),
  price NUMERIC(10,2)
);

CREATE TABLE withdrawals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC(10,2) NOT NULL,
  commission NUMERIC(10,2) NOT NULL,
  amount_after_commission NUMERIC(10,2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO games (title, genre, price, steam_id) VALUES
('Counter-Strike 2', 'Шутер', 10.00, '730'),
('Dota 2', 'MOBA', 10.00, '570'),
('PUBG: Battlegrounds', 'Шутер', 10.00, '578080'),
('Rust', 'Выживание', 10.00, '252490'),
('Grand Theft Auto V', 'Экшен', 10.00, '271590'),
('Cyberpunk 2077', 'RPG', 10.00, '1091500'),
('Elden Ring', 'RPG', 10.00, '1245620'),
('Red Dead Redemption 2', 'Приключения', 10.00, '1174180'),
('The Witcher 3', 'RPG', 10.00, '292030'),
('Hollow Knight', 'Инди', 10.00, '367520'),
('Terraria', 'Инди', 10.00, '105600'),
('Stardew Valley', 'Симулятор', 10.00, '413150'),
('Among Us', 'Вечеринка', 10.00, '945360'),
('Apex Legends', 'Шутер', 10.00, '1172470'),
('Valorant', 'Шутер', 10.00, '0'),
('Minecraft', 'Песочница', 10.00, '0'),
('Fall Guys', 'Вечеринка', 10.00, '1097150'),
('Fortnite', 'Шутер', 10.00, '0'),
('Dead by Daylight', 'Хоррор', 10.00, '381210'),
('Escape from Tarkov', 'Шутер', 10.00, '0'),
('Warframe', 'Экшен', 10.00, '230410'),
('Path of Exile', 'RPG', 10.00, '238960'),
('Team Fortress 2', 'Шутер', 10.00, '440'),
('Left 4 Dead 2', 'Шутер', 10.00, '550'),
('Portal 2', 'Головоломка', 10.00, '620'),
('Half-Life: Alyx', 'Шутер', 10.00, '546560'),
('Disco Elysium', 'RPG', 10.00, '632470'),
('Hades', 'Рогалик', 10.00, '1145360'),
('Celeste', 'Платформер', 10.00, '504230'),
('Sekiro: Shadows Die Twice', 'Экшен', 10.00, '814380');

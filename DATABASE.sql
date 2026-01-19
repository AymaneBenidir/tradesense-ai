-- ============================================================================
-- POSTGRESQL EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- TABLE STRUCTURES
-- ============================================================================

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- CHALLENGES
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    author_name VARCHAR(255),
    tier VARCHAR(20) CHECK (tier IN ('starter', 'pro', 'elite')) NOT NULL,
    initial_balance NUMERIC(10,2) NOT NULL,
    current_balance NUMERIC(10,2) NOT NULL,
    highest_balance NUMERIC(10,2) NOT NULL,
    daily_start_balance NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'passed', 'failed')) DEFAULT 'active',
    fail_reason TEXT,
    profit_percent NUMERIC(8,4),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cmi', 'crypto', 'paypal')),
    amount_paid NUMERIC(10,2),
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) REFERENCES users(email)
);

-- TRADES
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('buy', 'sell')) NOT NULL,
    quantity NUMERIC(12,6) NOT NULL,
    entry_price NUMERIC(12,4) NOT NULL,
    exit_price NUMERIC(12,4),
    profit_loss NUMERIC(12,4),
    status VARCHAR(20) CHECK (status IN ('open', 'closed')) DEFAULT 'open',
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) REFERENCES users(email)
);

-- COMMUNITY POSTS
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    author_name VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(20) CHECK (category IN ('strategy', 'analysis', 'question', 'general')),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) REFERENCES users(email)
);

-- COMMENTS
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    author_name VARCHAR(255),
    content TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) REFERENCES users(email)
);

-- COURSES
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('technical', 'fundamental', 'risk_management', 'psychology')),
    duration_minutes INTEGER,
    video_url TEXT,
    thumbnail_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) REFERENCES users(email)
);

-- NEWS ARTICLES
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    source VARCHAR(255),
    category VARCHAR(20) CHECK (category IN ('market', 'crypto', 'morocco', 'global')),
    image_url TEXT,
    external_url TEXT,
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) REFERENCES users(email)
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_challenges_user_email ON challenges(user_email);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_tier ON challenges(tier);
CREATE INDEX idx_challenges_created_date ON challenges(created_date);

CREATE INDEX idx_trades_challenge_id ON trades(challenge_id);
CREATE INDEX idx_trades_user_email ON trades(user_email);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_status ON trades(status);

CREATE INDEX idx_posts_author_email ON community_posts(author_email);
CREATE INDEX idx_posts_category ON community_posts(category);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_email ON comments(author_email);

CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_is_premium ON courses(is_premium);

-- ============================================================================
-- VIEWS
-- ============================================================================
CREATE VIEW v_active_challenges AS
SELECT c.id, c.user_email, u.full_name, c.tier,
       c.current_balance, c.initial_balance,
       c.profit_percent, c.status, c.created_date
FROM challenges c
JOIN users u ON c.user_email = u.email
WHERE c.status = 'active';

CREATE VIEW v_leaderboard AS
SELECT author_name, user_email, tier,
       profit_percent, current_balance,
       initial_balance, status
FROM challenges
WHERE status IN ('active', 'passed')
ORDER BY profit_percent DESC
LIMIT 10;

-- ============================================================================
-- STORED FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_challenge_performance(challenge_uuid UUID)
RETURNS TABLE(
    current_profit_percent NUMERIC,
    daily_loss_percent NUMERIC,
    total_loss_percent NUMERIC,
    should_fail BOOLEAN,
    fail_reason TEXT
)
LANGUAGE plpgsql AS $$
DECLARE v_challenge challenges;
BEGIN
    SELECT * INTO v_challenge FROM challenges WHERE id = challenge_uuid;

    RETURN QUERY
    SELECT
        ((v_challenge.current_balance - v_challenge.initial_balance) / v_challenge.initial_balance) * 100,
        ((v_challenge.daily_start_balance - v_challenge.current_balance) / v_challenge.daily_start_balance) * 100,
        ((v_challenge.initial_balance - v_challenge.current_balance) / v_challenge.initial_balance) * 100,
        (
            ((v_challenge.daily_start_balance - v_challenge.current_balance) / v_challenge.daily_start_balance) * 100 >= 5
            OR
            ((v_challenge.initial_balance - v_challenge.current_balance) / v_challenge.initial_balance) * 100 >= 10
        ),
        CASE
            WHEN ((v_challenge.daily_start_balance - v_challenge.current_balance) / v_challenge.daily_start_balance) * 100 >= 5
                THEN 'Max daily loss exceeded (5%)'
            WHEN ((v_challenge.initial_balance - v_challenge.current_balance) / v_challenge.initial_balance) * 100 >= 10
                THEN 'Max total loss exceeded (10%)'
        END;
END;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_challenges BEFORE UPDATE ON challenges
FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER trg_update_trades BEFORE UPDATE ON trades
FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER trg_update_posts BEFORE UPDATE ON community_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER trg_update_comments BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();


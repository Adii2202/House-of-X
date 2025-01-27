use test_db;

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    message VARCHAR NOT NULL,
    type VARCHAR CHECK (type IN ('error', 'info', 'verbose')) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_type ON logs(type);
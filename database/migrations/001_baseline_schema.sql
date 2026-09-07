-- Migration: 001_baseline_schema
-- Description: Initial schema for Vertical Slice V1 (MariaDB)

CREATE TABLE IF NOT EXISTS people (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    birthYear VARCHAR(50),
    deathYear VARCHAR(50),
    gender VARCHAR(50),
    notes TEXT,
    status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS stories (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    content LONGTEXT,
    status VARCHAR(50),
    updatedAt VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS edges (
    source_id VARCHAR(255),
    target_id VARCHAR(255),
    edge_type VARCHAR(50),
    PRIMARY KEY (source_id, target_id, edge_type)
);

CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    date VARCHAR(50),
    description TEXT
);

CREATE TABLE IF NOT EXISTS images (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    path VARCHAR(255),
    uploadedAt VARCHAR(50)
);

-- Migration: 002_seed_test_data
-- Description: Seed data for testing and development

INSERT IGNORE INTO people (id, name, birthYear, deathYear, gender, notes, status) VALUES 
('p1', 'Trần Trọng Thu', '1915', '1995', 'Nam', 'Gốc tộc', 'PUBLISHED'),
('p2', 'Trần Quốc Anh', '1942', '2010', 'Nam', 'Trưởng nam', 'PUBLISHED'),
('p3', 'Trần Hoàng Nam', '1970', '', 'Nam', 'Cháu đích tôn', 'PUBLISHED');

INSERT IGNORE INTO stories (id, title, author, content, status, updatedAt) VALUES 
('s1', 'Ký ức về người thầy năm xưa', 'Quốc Anh', 'Cha tôi cả đời chỉ bận tâm đến sách vở...', 'PUBLISHED', '2026-09-01');

INSERT IGNORE INTO edges (source_id, target_id, edge_type) VALUES 
('p2', 'p1', 'PARENT'),
('p3', 'p2', 'PARENT'),
('s1', 'p1', 'MENTION');

INSERT IGNORE INTO events (id, title, date, description) VALUES 
('e1', 'Giỗ tổ', '2026-08-15', 'Lễ giỗ tổ hàng năm');

INSERT IGNORE INTO images (id, title, path, uploadedAt) VALUES 
('i1', 'Ảnh gia đình', '/volume1/web/web_images/family.jpg', '2026-09-01');

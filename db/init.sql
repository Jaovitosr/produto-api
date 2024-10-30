CREATE TABLE IF NOT EXISTS Produto (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    estoque INT NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Produto (descricao, preco, estoque) VALUES
('Produto 1', 10.00, 100),
('Produto 2', 15.50, 200),
('Produto 3', 25.00, 150),
('Produto 4', 7.75, 80),
('Produto 5', 12.30, 60);

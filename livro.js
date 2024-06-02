const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './livros.json';

// auxiliar para ler o arquivo JSON
function readBooksFromFile() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// auxiliar para escrever no arquivo JSON
function writeBooksToFile(books) {
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
}

// Listagem
router.get('/', (req, res) => {
    const books = readBooksFromFile();
    res.json(books);
});

// Compra
router.post('./comprar', (req, res) => {
    const { nome } = req.body;
    const books = readBooksFromFile();

    const book = books.find(b => b.nome === nome);
    if (book && book.exemplares > 0) {
        book.exemplares -= 1;
        writeBooksToFile(books);
        res.status(200).send('Livro comprado com sucesso!');
    } else {
        res.status(400).send('Livro não disponível.');
    }
});

// Cadastro
router.post('/', (req, res) => {
    const { nome, autor, genero, exemplares, imagem } = req.body;
    const books = readBooksFromFile();

    books.push({ nome, autor, genero, exemplares, imagem });
    writeBooksToFile(books);
    res.status(201).send('Livro cadastrado com sucesso!');
});

module.exports = router;

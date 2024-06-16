const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './livros.json';

//arquivo JSON
function LerArquivo() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}
// escrever no arquivo JSON
function EditarArquivo(books) {
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
}

// Listagem
router.get('/', (req, res) => {
    const books = LerArquivo();
    res.json(books);
});

// Compra
router.post('./comprar', (req, res) => {
    const { nome } = req.body;
    const books = LerArquivo();

    const book = books.find(b => b.nome === nome);
    if (book && book.exemplares > 0) {
        book.exemplares -= 1;
        EditarArquivo(books);
        res.status(200).send('Livro comprado com sucesso!');
    } else {
        res.status(400).send('Livro não disponível.');
    }
});

// Cadastro
router.post('/', (req, res) => {
    const { nome, autor, genero, exemplares, imagem } = req.body;
    const books = LerArquivo();

    books.push({ nome, autor, genero, exemplares, imagem });
    EditarArquivo(books);
    res.status(201).send('Livro cadastrado com sucesso!');
});

module.exports = router;

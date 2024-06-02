const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const filePath = './livros.json';

//ler o arquivo JSON
function readBooksFromFile() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData.books || [];
    } catch (err) {
        console.error('Erro ao ler o arquivo livros.json:', err);
        return [];
    }
}

//escrever no arquivo JSON
function writeBooksToFile(books) {
    try {
        const jsonData = { books: books };
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    } catch (err) {
        console.error('Erro ao escrever no arquivo livros.json:', err);
    }
}

// Listagem
app.get('/livros', (req, res) => {
    const books = readBooksFromFile();
    res.json(books);
});

// Compra
app.post('/livros/comprar', (req, res) => {
    const { titulo } = req.body;
    if (!titulo) {
        return res.status(400).send('Título do livro é obrigatório.');
    }

    const books = readBooksFromFile();
    console.log('Livros carregados:', books);

    if (!Array.isArray(books)) {
        return res.status(500).send('Erro ao ler os livros.');
    }

    const book = books.find(b => b.titulo === titulo);

    if (!book) {
        return res.status(404).send('Livro não encontrado.');
    }

    if (book.exemplares > 0) {
        book.exemplares -= 1;
        writeBooksToFile(books);
        return res.status(200).send('Livro comprado com sucesso!');
    } else {
        return res.status(400).send('Livro não disponível.');
    }
}); 

// Cadastro
app.post('/livros/cadastro', (req, res) => {
    const { titulo, autor, genero, imagem, exemplares } = req.body;
    if (!titulo || !autor || !genero || !imagem || exemplares === undefined) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const books = readBooksFromFile();
    if (!Array.isArray(books)) {
        return res.status(500).send('Erro ao ler os livros.');
    }

    books.push({ titulo, autor, genero, imagem, exemplares });
    writeBooksToFile(books);
    res.status(201).send('Livro cadastrado com sucesso!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require("express");

const app = express();
const port = 3000;

const produits = [
    {
        "id": 1,
        "name": "table",
        "description": "grande table rectangulaire en bois",
        "categorie": "meubles",
        "prix": 109.99
    },
    {
        "id": 2,
        "name": "balle",
        "description": "ballon de foot",
        "categorie": "jeux",
        "prix": 15.99
    },
    {
        "id": 3,
        "name": "assiette",
        "description": "uen assiette ronde blanche",
        "categorie": "vaisselle",
        "prix": 4.99
    },
]

app.use(express.json());

app.get("/produits", (req, res) => {
    res.json(produits);
});

app.get("/produits/:id", (req, res) => {
    const id = Number(req.params.id);
    const produit = produits.find(p => p.id === id);

    if (!produit) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    res.json(produit);
});

//ajout d'un nouveau produit
app.post("/produits", (req, res) => {
    const nouveauProduit = req.body;
    nouveauProduit.id = Math.max(0, ...produits.map(p => p.id)) + 1;

    produits.push(nouveauProduit);
    res.status(201).json(nouveauProduit);
});

// modif
app.patch("/produits/:id", (req, res) => {
    const id = Number(req.params.id);
    const produit = produits.find(p => p.id === id);

    if (!produit) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    Object.assign(produit, req.body);
    res.json(produit);
});

//remplacer
app.put("/produits/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = produits.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    produits[index] = { id: id, ...req.body };
    res.json(produits[index]);
});

//supprimer
app.delete("/produits/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = produits.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    produits.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`API disponible sur http://localhost:${port}`);
});
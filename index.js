const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const secret = "secrettoken"

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

function authentifier(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Jeton d'accès nécessaire"
        });
    }

    const token = authorization.slice(7);

    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch (erreur) {
        return res.status(401).json({
            message: "Jeton invalide ou expiré"
        });
    }
}

app.post("/auth", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Identifiant et mot de passe obligatoires"
        });
    }

    if (username !== "admin" || password !== "1234") {
        return res.status(401).json({
            message: "Identifiants incorrects"
        });
    }

    const token = jwt.sign(
        { username: username },
        secret,
        { expiresIn: "5m" }
    );

    res.status(200).json({ token: token });
});

app.get("/", (req, res) => {
    res.json({ message: "Bienvenue sur mon API REST de produits !" });
});

app.get("/produits", (req, res) => {
    res.status(200).json(produit);
});

app.get("/produits/:id", (req, res) => {
    const id = Number(req.params.id);
    const produit = produits.find(p => p.id === id);

    if (!produit) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    res.status(200).json(produit);
});

//ajout d'un nouveau produit
app.post("/produits", authentifier, (req, res) => {
    const nouveauProduit = req.body;
    nouveauProduit.id = Math.max(0, ...produits.map(p => p.id)) + 1;

    produits.push(nouveauProduit);
    res.status(201).json(nouveauProduit);
});

// modif
app.patch("/produits/:id", authentifier, (req, res) => {
    const id = Number(req.params.id);
    const produit = produits.find(p => p.id === id);

    if (!produit) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    Object.assign(produit, req.body);
    res.status(200).json(produit);
});

//remplacer
app.put("/produits/:id", authentifier, (req, res) => {
    const id = Number(req.params.id);
    const index = produits.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Produit introuvable" });
    }

    produits[index] = { id: id, ...req.body };
    res.json(produits[index]);
});

//supprimer
app.delete("/produits/:id", authentifier, (req, res) => {
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
/**
 * Site Web Moto Julie Cobas 15.04.2024
 */
  let app = new Vue({
    el: '#app',
    data: { 
      index : 0, //Index de référencement du produit sélectionné
      produits: [ 
        { id: 1,
        modele: 'CMX500 bleue', 
        description : "La CMX500 Rebel, c'est la liberté pour tous les motards, dès le permis A2. Avec son bicylindre en ligne de 471 cm³ logé dans un châssis bas et une suspension, des feux, un confort ainsi que des instruments modernisés, ce petit custom de style Bobber est une moto magnifique avec laquelle vous vous ferez plaisir.",
        image: "img/CMX500 Rebel_bleu.jpg",
        color :"#0049b6",
        stock :6,
        prix: 7500
        }, 
        { id: 2,
          modele: 'CMX500 bordeau', 
          description : "La CMX500 Rebel, c'est la liberté pour tous les motards, dès le permis A2. Avec son bicylindre en ligne de 471 cm³ logé dans un châssis bas et une suspension, des feux, un confort ainsi que des instruments modernisés, ce petit custom de style Bobber est une moto magnifique avec laquelle vous vous ferez plaisir.",
          image: "img/CMX500 Rebel_bordeau.jpg",
          color :"#880015",
          stock : 4,
          prix: 7600
        }, 
        { id: 3,
          modele: 'CMX500 grise', 
          description : "La CMX500 Rebel, c'est la liberté pour tous les motards, dès le permis A2. Avec son bicylindre en ligne de 471 cm³ logé dans un châssis bas et une suspension, des feux, un confort ainsi que des instruments modernisés, ce petit custom de style Bobber est une moto magnifique avec laquelle vous vous ferez plaisir.",
          image: "img/CMX500 Rebel_grise.jpg",
          color :"#65848a",
          stock : 5,
          prix: 7800
        }
        ],
        quantiteSelectionnee: 1, // Défini la quantité initiale
        panier:[], //Création du panier vide
    },
    methods: { //Actions, Evénements
      changeIndex(index){ //Retrouver l'index
        this.index = index;
      },
      formatPrix(prix) { //Conversion prix en format CHF
        return prix.toLocaleString('de-CH');
      },
      ajouterAuPanier(index) {
        try {
          let produit = this.produits[index]; // Récupérer le produit sélectionné à partir de l'index.
          let quantiteDemandee = parseInt(this.quantiteSelectionnee); // Convertir la quantité sélectionnée en entier.
          if (quantiteDemandee <= 0) { // Vérifier si la quantité demandée est inférieure ou égale à 0
            throw new Error(`\nSERVICE CLIENT\n Attention, vous devez saisir une quantité en positif.`); //Message d'alerte
          }
          let quantiteAAjouter = Math.min(quantiteDemandee, produit.stock); // Déterminer la quantité à ajouter en fonction du stock disponible.
          if (quantiteDemandee > produit.stock) { // Si la quantité demandée est supérieure au stock, afficher une alerte.
            alert(`\nSERVICE CLIENT\n\nLa quantité maximale disponible pour ${produit.modele} ` +
                  `a été atteinte.\nNous avons ajouté cette quantité à votre panier.`);
          }
          let produitDansPanier = this.panier.find(item => item.id === produit.id); // Chercher si le produit existe déjà dans le panier.
          if (produitDansPanier) { // Si le produit est déjà dans le panier, augmenter sa quantité.
            produitDansPanier.quantite += quantiteAAjouter;
          } else { // Sinon, 
            this.panier.push({ ...produit, quantite: quantiteAAjouter }); //ajouter le produit au panier avec la quantité déterminée.
          }
          produit.stock -= quantiteAAjouter; // Mettre à jour le stock du produit.
        } catch (error) {
          alert(error.message); // Afficher le message d'erreur
        } finally {
          this.quantiteSelectionnee = 1; // Réinitialiser la quantité sélectionnée pour le prochain produit, indépendamment des erreurs.
        }
      },
      retirerArticle(id) {
        const indexPanier = this.panier.findIndex(item => item.id === id); // Trouve l'index de l'article dans le panier.
        if (indexPanier !== -1) { // Vérifie si l'article est présent dans le panier.
          const produit = this.produits.find(p => p.id === id);// Trouve le produit correspondant dans les produits.
          if (produit) {    // Vérifie si le produit existe.
            if (this.panier[indexPanier].quantite > 1) {  // Si la quantité de l'article est supérieure à 1,
              this.panier[indexPanier].quantite--;// Diminue la quantité de l'article.
              produit.stock++; // Incrémente le stock du produit.
            } else {
              this.panier = this.panier.filter(item => item.id !== id); // Retire le produit du panier si la quantité est à 1.
              produit.stock++; // Réajuste le stock pour le produit supprimé.
            }
          }
        }
      },
      viderPanier() {
        this.panier.forEach(item => {  // Parcourt chaque article dans le panier.
          const produit = this.produits.find(p => p.id === item.id); // Trouve le produit correspondant dans les produits.
          if (produit) { // Vérifie si le produit existe.
            produit.stock += item.quantite; // Réaugmente le stock basé sur la quantité dans le panier.
          }
        });
        this.panier = []; // Vide le panier après réajustement des stocks.
      },
      payer(){
        alert(`\nSERVICE CLIENT\n\nVous allez être redirigé vers votre banque pour finir le paiement`);
      }        
    },
    computed: { // Propriétés calculées basées sur des dépendances
      totalPanier() {
        let total = 0; // Initialisation du total à 0
        for (let item of this.panier) { // Parcourt chaque article dans le panier
          total += item.prix * item.quantite; // Ajoute au total le produit du prix par la quantité
        }
        return total.toLocaleString('de-CH'); // Convertit le total en chaîne formatée (monnaie suisse)
      },
      statutClient() {
        const totalArticles = this.panier.reduce((total, produit) => total + produit.quantite, 0); // Calcule le total d'articles
        if (totalArticles > 1) { // Vérifie si le client a plus d'un article
          return 'Vous êtes devenu un client premium !'; // Client premium si plus d'un article
        }
        return ''; // Retourne une chaîne vide sinon
      }
    }
  });
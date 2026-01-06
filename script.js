const titreInput = document.getElementById("titre");
const texteArea = document.getElementById("texte");
const status = document.getElementById("status");
const dateEl = document.getElementById("date");
const wordCountEl = document.getElementById("wordCount");
const charCountEl = document.getElementById("charCount");
const textesList = document.getElementById("textesList");
const searchInput = document.getElementById("search");
const themeBtn = document.getElementById("themeBtn");

let textes = JSON.parse(localStorage.getItem("textes")) || [];

// Afficher date et heure
function afficherDate() {
    const now = new Date();
    dateEl.textContent = now.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
}
setInterval(afficherDate,1000);
afficherDate();

// Compteur mots/caractères
texteArea.addEventListener("input",()=>{
    wordCountEl.textContent = texteArea.value.trim() ? texteArea.value.trim().split(/\s+/).length : 0;
    charCountEl.textContent = texteArea.value.length;
});

// Enregistrer texte
function enregistrer(){
    const titre = titreInput.value.trim() || "Sans titre";
    const contenu = texteArea.value;
    const date = new Date().toLocaleString("fr-FR");

    // Vérifier si texte existe déjà (update)
    const index = textes.findIndex(t=>t.titre===titre);
    if(index>=0){
        textes[index] = {titre, contenu, date};
    } else {
        textes.push({titre, contenu, date});
    }
    localStorage.setItem("textes", JSON.stringify(textes));
    afficherListe();
    status.textContent = "✅ Texte enregistré avec succès";
}

// Afficher liste
function afficherListe(){
    textesList.innerHTML="";
    textes.forEach(t=>{
        const li = document.createElement("li");
        li.textContent = `${t.titre} (${t.date})`;
        li.onclick = ()=>chargerTexte(t.titre);
        textesList.appendChild(li);
    });
}
afficherListe();

// Charger texte
function chargerTexte(titre=null){
    let t;
    if(titre){
        t = textes.find(x=>x.titre===titre);
    } else {
        t = textes[textes.length-1];
    }
    if(t){
        titreInput.value = t.titre;
        texteArea.value = t.contenu;
        wordCountEl.textContent = t.contenu.trim() ? t.contenu.trim().split(/\s+/).length : 0;
        charCountEl.textContent = t.contenu.length;
        status.textContent = "📂 Texte chargé";
    } else {
        status.textContent = "❌ Aucun texte trouvé";
    }
}

// Supprimer texte
function supprimerTexte(){
    const titre = titreInput.value.trim();
    if(!titre) return;
    textes = textes.filter(t=>t.titre!==titre);
    localStorage.setItem("textes", JSON.stringify(textes));
    afficherListe();
    titreInput.value = "";
    texteArea.value = "";
    wordCountEl.textContent = 0;
    charCountEl.textContent = 0;
    status.textContent = "🗑 Texte supprimé";
}

// Recherche
function filtrerTexte(){
    const search = searchInput.value.toLowerCase();
    textesList.innerHTML="";
    textes.filter(t=>t.titre.toLowerCase().includes(search) || t.contenu.to

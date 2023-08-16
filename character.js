



var apiKey = "ABD7871C-A6FD-B34B-A080-29A7B36D5925DE300744-3D6C-445A-BECC-652E7F666AA9";


var name = "Fapoda"; // Remplacez "Fapoda" par le nom du personnage souhaité
/*
function getListCharacter(apiKey) {
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.guildwars2.com/v2/characters/?access_token=' + apiKey + '&lang=fr')}`)
                    .then(response => response.json())
                    .then(data => console.log(JSON.parse(data.contents)));
  
  return 
}
*/

async function getListCharacter(apiKey) {
  try {
    
    
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.guildwars2.com/v2/characters/?access_token=' + apiKey + '&lang=fr')}`);
    const data = await response.json();
    
    const charactersData = JSON.parse(data.contents);
    
    //console.log(charactersData);
    // Faites ce que vous voulez avec les données ici
    return charactersData;
  } catch (error) {
    console.error(error);
  }
}





function updateCharacter(characterName) {
  


   

  var characterContainer = document.getElementById("characterContainer");

  fetch('https://api.guildwars2.com/v2/characters/' + characterName + '?access_token=' + apiKey)
    .then(response => response.json())
    .then(characterData => {
      //console.log(characterData);

      // Accédez à la liste des objets équipés par le personnage
      const equippedItems = characterData.equipment;
      //console.log(equippedItems); // Affiche la liste des objets équipés

      // Créer un tableau de promesses pour chaque requête d'image d'objet
      const itemImagePromises = equippedItems.map((item) => {
        const itemId = item.id;
        if ("skin" in item) {
          return fetch('https://api.guildwars2.com/v2/skins/' + item.skin + '?lang=fr')
            .then(response => response.json())
            .then(skinData => skinData.icon);
        } else {
        return fetch('https://api.guildwars2.com/v2/items/' + itemId + '?lang=fr')
          .then(response => response.json())
          .then(itemData => itemData.icon);
          }
      });

      // Attendre que toutes les requêtes d'images soient terminées avec Promise.all
      Promise.all(itemImagePromises)
        .then(itemImages => {
          // Vous avez maintenant toutes les images des objets équipés dans le tableau itemImages
          //console.log(itemImages);

          // Créer le contenu HTML final en utilisant les détails de chaque objet équipé
          var renderContainer = "";
          equippedItems.forEach((item, index) => {
            const itemId = item.id;
            const itemSlot = item.slot;
            const itemImage = itemImages[index]; // Récupérer l'image correspondante dans le tableau itemImages

            /*renderContainer += `<div>Élément ${index + 1}: ID de l'objet=${itemId}, Slot=${itemSlot}</div>`;*/

            renderContainer += `<div class="itemBox"><img  src="${itemImage}" alt="Image de l'objet" ><p>ID de l'objet = ${itemId}</p></div>`;
          });

          // Insérer le contenu HTML dans le conteneur
          characterContainer.innerHTML = renderContainer;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des images des objets équipés :', error);
        });
    })
    .catch(error => {
      console.error('Erreur lors de la requête :', error);
  });






}




updateCharacter("Fapoda");
/*
fetch('https://api.guildwars2.com/v2/characters/?access_token=' + apiKey)
    .then(response => response.json())
    .then(characterData => console.log(characterData)
    );
*/

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};




// Récupérer l'élément select
const characterSelect = document.getElementById('characterSelect');

// Récupér;er la liste des personnages
getListCharacter(apiKey).then(data => {
  const selectCharacter = document.getElementById("characterSelect");
  console.log(data);
  let renderSelectcharacter = "";
  for (item of data) {
    console.log(item);
    renderSelectcharacter += `<option value="${item}">${item}</option>`;
  }
  selectCharacter.innerHTML = renderSelectcharacter;
});


// Attacher un événement à l'élément select
characterSelect.addEventListener('change', function(event) {
  // La fonction ci-dessous sera exécutée lorsque l'utilisateur sélectionne une option
  const selectedValue = event.target.value; // Récupérer la valeur de l'option sélectionnée
  console.log('Option sélectionnée :', selectedValue);
  updateCharacter(selectedValue) // Mettre à jour le personnage avec la valeur sélectionnée
  document.getElementById("nameCharacter").innerHTML = selectedValue;
});
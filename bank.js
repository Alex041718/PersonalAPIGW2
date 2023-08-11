var b = "/v2/account/bank";
var apiKey = "ABD7871C-A6FD-B34B-A080-29A7B36D5925DE300744-3D6C-445A-BECC-652E7F666AA9";
var bankContainer = document.getElementById("bankContainer");

fetch('https://api.guildwars2.com' + b + '?access_token=' + apiKey + '&lang=fr')
  .then(response => response.json())
  .then(data => {
    console.log(data);

    // Utiliser map pour créer un tableau de promesses pour chaque requête d'élément
    const itemPromises = data.map((item, index) => {
      if (item !== null) {
        return fetch('https://api.guildwars2.com/v2/items/' + item.id + '?lang=fr')
          .then(response => response.json())
          .then(itemRequest => {
            // Retourner les détails de l'élément dans un objet
            return {
              id: item.id,
              count: item.count,
              binding: item.binding,
              charges: item.charges || null,
              icon: itemRequest.icon,
              name: itemRequest.name
            };
          });
      } else {
        // Retourner un objet pour les éléments nuls
        return {
          id: null,
          count: null,
          binding: null,
          charges: null,
          icon: null,
          name: null
        };
      }
    });

    // Attendre que toutes les requêtes soient terminées avec Promise.all
    Promise.all(itemPromises)
      .then(itemDetails => {
        // Créer le contenu HTML final en utilisant les détails de chaque élément
        var renderContainer = "";
        itemDetails.forEach((itemDetail, index) => {
          if (itemDetail.id !== null) {
            const { id, count, binding, charges, icon, name } = itemDetail;
            
            renderContainer += `<div class="itemBox"><img  src="${icon}" alt="Image de l'objet" ><p>ID de l'objet = ${id}</p><p>count=${count}</p></div>`;

            
            
          } else {
            /*renderContainer += `<div>Élément ${index + 1} est null.</div>`;*/
          }
        });

        // Insérer le contenu HTML dans le conteneur
        bankContainer.innerHTML = renderContainer;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails des éléments :', error);
      });
  })
  .catch(error => {
    console.error('Erreur lors de la requête :', error);
  });

window.onload = async function getUserData () {
    try{
    const entries = new URLSearchParams(window.location.search)
    var login = entries.get('cnpj');
    var id = entries.get('_id');
    var Array;
    var response = await fetch(`https://doasangue2.azurewebsites.net/api/campaign?cnpj=${login}&no_filter=false`)
    var json = await response.json();
    for( let i = 0; json.length > i; i++) {
        if(json[i]._id == id)
        Array = i
    }

    const InfoHTML = 
    `
    <div class="linha"><b>Nome: </b><p>${json[Array].name}</p></div>
    <div class="linha"><b>Detalhes: </b><p>${json[Array].observation}</p></div>
    <div class="linha"><b>Tipos de sangue desejados: </b><p>${json[Array].blood_types}</p></div>
    <div class="linha"><b>Endereço: </b><p>${json[Array].address}</p></div>
    <div class="linha"><b>Cidade: </b><p>${json[Array].city}</p></div>
    <div class="linha"><b>Estado: </b><p>${json[Array].state}</p></div>
    <div class="linha"><b>País: </b><p>${json[Array].country}</p></div>
    <div class="linha"><b>Telefone: </b><p>${json[Array].phone}</p></div>
    `
    //console.log(InfoHTML)
    const div = document.querySelector('[data-js="campaignInfo"]')
    div.innerHTML = InfoHTML
    }catch(error){
        console.log(error)
    }
}   
window.onload = async function getUserData () {
    try{
    const entries = new URLSearchParams(window.location.search)
    var login = entries.get('cnpj');
    var response = await fetch(`https://doasangue2.azurewebsites.net/api/corp?cnpj=${login}&type=data`)
    var json = await response.json();
    console.log(json);
    const InfoHTML = 
    `
    <div class="linha"><b>Nome: </b><p>${json.data.name}</p></div>
    <div class="linha"><b>Endereço: </b><p>${json.data.address}</p></div>
    <div class="linha"><b>Cidade: </b><p>${json.data.city}</p></div>
    <div class="linha"><b>Estado: </b><p>${json.data.state}</p></div>
    <div class="linha"><b>País: </b><p>${json.data.country}</p></div>
    <div class="linha"><b>Telefone: </b><p>${json.data.phone}</p></div>
    `
    console.log(InfoHTML)
    const div = document.querySelector('[data-js="userInfo"]')
    div.innerHTML = InfoHTML
    }catch(error){
        console.log(error)
    }
}   
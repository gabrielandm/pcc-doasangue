window.onload =  async function get_Campanhas (){
    var query = '';
    var login = new URLSearchParams(window.location.search).get('cnpj');
    if(login === null){
        query = 'no_filter=true';
    }else{
        query += `cnpj=${login}&` + 'no_filter=false'
    }
    const response = await fetch(`https://doasangue2.azurewebsites.net/api/campaign?` + query)
    if(response.status === 200){
        const myJson = await response.json();
        //console.log(myJson)

        Promise.all(myJson)
            .then(campanhas => {

                return generateHTML = myJson.reduce((acumulator, campanha) => {
                    let start_date = fixDate(campanha.start_date)
                    let end_date = fixDate(campanha.end_date)
                    
                    acumulator += 
                    `<li class="campanha">
                        <b>${campanha.name}</b>
                        <p>${start_date} - ${end_date}  (${campanha.open_time} - ${campanha.close_time})</p>
                        <div class="lastLine">
                            <p>Endereço: ${campanha.address}</p>
                            <a class="detalhes" href="./InfoCampanha.html?cnpj=${login}&_id=${campanha._id}">DETALHES</a>
                        </div>
                    </li>`
                    return acumulator
                },'')
                //console.log(generateHTML)
            })
            .then(generateHTML => {
                const ul = document.querySelector('[data-js="campanha"]')
                ul.innerHTML = generateHTML
            })
    }
    else{
        console.log(response.status)
    }
    
}

function fixDate (date) {
    date = date.replaceAll('-', '/')
    date = date.split('T')[0]
    return date
}
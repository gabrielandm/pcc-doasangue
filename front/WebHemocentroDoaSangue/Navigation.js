function screenNavigation (Page) {
    var login = new URLSearchParams(window.location.search).get('cnpj');
    switch(Page){
        case 'Campanha':
            window.location.href= `./Campanha.html?cnpj=${login}`
            break;
        case 'DivulgarCampanha':
            window.location.href= `./DivulgarCampanha.html?cnpj=${login}`
            break;
        case 'Dashboard':
            window.location.href= `./Dashboard.html?cnpj=${login}`
            break;
        case 'InfoHemocentro':
            window.location.href= `./InfoHemocentro.html?cnpj=${login}`
            break;
    }
}
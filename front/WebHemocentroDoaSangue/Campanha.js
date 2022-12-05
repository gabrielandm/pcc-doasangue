
async function createCampaign() {
    /*const selectedBloodTypes = []
    for (var i in bloodTypes) {
      if (bloodTypes[i] == true) {
        selectedBloodTypes.push(bloodTypeItems[i]['value']);
      }
    }*/

    const cnpj = new URLSearchParams(window.location.search).get('cnpj')

    const campaignData = {
      cnpj: cnpj,
      start_date: `${document.getElementById('start_date').value}T00:00:00.000+00:00`,
      end_date: `${document.getElementById('end_date').value}T00:00:00.000+00:00`,
      country: 'BR',
      state: 'SP',
      city: document.getElementById('city').value,
      address: document.getElementById('address').value,
      phone: document.getElementById('phone').value,
      observation: document.getElementById('obs').value,
      banner_color: '#d01b1b',
      banner_link: null,
      open_time: '08:00' /*`${openTime.getHours() < 10 ? '0' + openTime.getHours() : openTime.getHours()}:${openTime.getMinutes() < 10 ? '0' + openTime.getMinutes() : openTime.getMinutes()}`*/,
      close_time: '17:00' /*`${closeTime.getHours() < 10 ? '0' + closeTime.getHours() : closeTime.getHours()}:${closeTime.getMinutes() < 10 ? '0' + closeTime.getMinutes() : closeTime.getMinutes()}`*/,
      name: document.getElementById('name').value,
      blood_types: ['A+', 'A-'],
    }

    // POST request to Campaign collection and check if request was successful
    try {
       // console.log(JSON.stringify(campaignData))
      const response = await fetch(`https://doasangue2.azurewebsites.net/api/campaign`,
        {
          method: 'POST',
          body: JSON.stringify(campaignData),
        }
      )
      if (response.status == 201) {
        alert("Campanha criada com sucesso")
      } else {
        console.log(response.status)
        throw new Error('Error creating campaign');
      }
    } catch (e) {
      console.log(e);
    }
  }
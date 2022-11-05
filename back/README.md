# Doa Sangue Back End

Todas as APIs recebem requisições GET (coleta de dados), POST (criação), PUT (Atualização) e DELETE
(Remoção dos dados).


- campaign: https://doasangue2.azurewebsites.net/api/campaign
- corp: https://doasangue2.azurewebsites.net/api/corp
- donation: https://doasangue2.azurewebsites.net/api/donationdate
- user: https://doasangue2.azurewebsites.net/api/user

## Campanhas (campaigns)

### Atributos

|Parametro|Tipo|Descrição|
|---|---|---|
|_id|ObjectId|Index do objeto dentro do MongoDB|
|cnpj|string|CNPJ do hemocentro que criou a campanha|
|start_date|ISODateString|String da data no formato ISO do início da campanha|
|end_date|ISODateString|String da data no formato ISO do fim da campanha|
|creation_date*|ISODateString|String da data no formato ISO da criação da campanha|
|country|string|Sigla de dois caracteres que representa o país onde a campanha será realizada|
|state|string|Sigla de dois caracteres que representa o estado onde a campanha será realizada|
|city|string|Nome da cidade onde a campanha será realizada|
|address|string|Endereço onde a campanha será realizada|
|phone|string|Número de telefone da campanha|
|num_doners*|number|Número de doadores da campanha|
|campaign_rating*|number|Avaliação da campanha|
|observation|string|Observação importante para os doadores terem acesso antes de irem ao local|
|header_color*|string|String da cor em hexadecimal|
|banner_link|string|URL para a imagem da campanha|
|blood_types|array|Array com os tipos sanguíneos que a campanha deseja receber|
|open_time|string|Hora de abertura da campanha, em formato 24 horas|
|close_time|string|Hora de fechamento da campanha, em formato 24 horas|
|coordinates|Object|Com o valor da latitude (latitude) e longitude (logitude), para axibir no mapa o local da doação|
|name|string|Nome da campanha|

\* não é utilizado.

### Requisição POST

Parametros deverão ser enviados no corpo da requisição no formato JSON.

https://doasangue2.azurewebsites.net/api/campaign

Os parametros são os mesmos que existem nos registros do banco de dados (com exceção de alguns):

- ***creation_date***: por padrão é a data de quando a requisição foi realizada;
- ***num_doners***: por padrão é 0;
- ***campaign_rating***: por padrão é 0;
- ***coordinates***: por padrão é: { latitude: -22.907370, longitude: -47.062901 }, coordenada da PUC ou do centro de campinas.

Porém mais alguns parametros devem ser enviados:

- ***image_type*** (string): tipo da imagem que foi enviada pelo usuário;
- ***image*** (string): imagem em formato Base64.

**Retorno**: ***ObjectId*** do documento gerado.

### Requisição GET

Os filtros deverão ser enviados na URL da requisição, o método GET não aceita parametros no corpo da requisição, exemplo:

https://doasangue2.azurewebsites.net/api/campaign?no_Filter=true

|Parametro|Tipo|Descrição|
|---|---|---|
|no_Filter|bool|Define se a busca será relizada com algum filtro, retorna todas as campanhas caso não haja filtros (busca sem filtro é utilizada para coletar as campanhas para o usuário)|
|filters*|string, ISODateString, number|Pode ser qualquer um dos atributos ou mais de um, para que a busca seja realizada da forma desejada|

\* não é o nome do atributo, mas os atributos podem ser enviados dentro da requisição.

**Retorno**: o valor retornado é a lista de campanhas.

### Requisição Put

Mesmos parametros que a requisição POST, pórem, o **ObjectId** do documento deve ser enviado para que seja modificado.

https://doasangue2.azurewebsites.net/api/campaign

**Retorno**: status da requisição, se funcionou, retorna o motivo, caso der certo, apenas retorna que a requisição funcionou.

|Atributo|Descrição|
|---|---|
|status|Situação da requisição, será "updated" se der certo|
|notValidData*|Motivo pelo qual a requisição não funcionou|

\* Retorna esse atributo quando a requisição da errado.

### Requisição Delete

Somente o **ObjectId** do documento, para que seja deletado. O id deve ser enviado na URL da seguinte forma:

https://doasangue2.azurewebsites.net/api/campaign/{id}

**Retorno**: retorna o status da requisição. **status** vai ser "deleted" se der certo.

## Hemocentros (corp)

### Atributos

|Parametro|Tipo|Descrição|
|---|---|---|
|_id|ObjectId|Identificador do documento no MongoDB|
|cnpj|string|CNPJ do hemocentro (login de acesso)|
|pass|string|Senha de acesso para o portal do hemocentro|
|name|string|Nome do hemocentro|
|country|string|Abreviação de 2 caracteres que identifica o país do hemocentro|
|state|string|Abreviação de 2 caracteres que identifica o estado do hemocentro|
|city|string|Nome da cidade onde o hemocentro está localizado|
|coordinates|Object|Contem a latitude (**latitude**) e longitude (**longitude**) do hemocentro|
|address|string|Endereço do hemocentro|
|phone|string|Número de telefone do hemocentro|
|email|string|E-mail do hemocentro|
|entry_date|ISODateString|Data em que o hemocentro entrou para o sistema|
|subsciption_start|ISODateString|Data em que o hemocentro teve sua inscrição iniciada|
|subsciption_end|ISODateString|Data em que o hemocentro terá sua inscrição finalizada|
|subscription_type|number|Indicador de qual nível de inscrição o hemocentro paga|
|profile_link|string|URL para a imagem do hemocentro|

### Requisição POST

Os parametros devem ser enviados pelo corpo da requisição no formato JSON. São os mesmos parametros que os atributos, com uma exceção.

- ***entry_date***: não deve ser enviado, ele é automaticamente definido

**Retorno**: o **ObjectId** (***_id***) do objeto criado.

### Requisição GET

### Requisição PUT

Mesmos parametros que a requisição POST, pórem, o **ObjectId** do documento deve ser enviado para que seja modificado.

### Requisição Delete

Somente o **ObjectId** do documento, para que seja deletado. O id deve ser enviado na URL da seguinte forma:

https://doasangue2.azurewebsites.net/api/corp/{id}

**Retorno**: retorna o status da requisição. **status** vai ser "deleted" se der certo.

## Doações (donationdate)

### Atributos

### Requisição POST

### Requisição GET

### Requisição PUT

Mesmos parametros que a requisição POST, pórem, o **ObjectId** do documento deve ser enviado para que seja modificado.

### Requisição Delete

Somente o **ObjectId** do documento, para que seja deletado. O id deve ser enviado na URL da seguinte forma:

https://doasangue2.azurewebsites.net/api/donationdate/{id}

**Retorno**: retorna o status da requisição. **status** vai ser "deleted" se der certo.

## Usuários (user)

### Atributos

### Requisição POST

### Requisição GET

### Requisição PUT

Mesmos parametros que a requisição POST, pórem, o **ObjectId** do documento deve ser enviado para que seja modificado.

### Requisição Delete

Somente o **ObjectId** do documento, para que seja deletado. O id deve ser enviado na URL da seguinte forma:

https://doasangue2.azurewebsites.net/api/doner/{id}

**Retorno**: retorna o status da requisição. **status** vai ser "deleted" se der certo.

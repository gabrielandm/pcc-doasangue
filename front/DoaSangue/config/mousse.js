const m_campaigns = [
	{
		"name": "Camapnha Doa Mais",
		"cnpj": '34.876.876/0001-00',
		"start_date": '2022-06-12T15:33:33.000000-03:00',
		"end_date": '2023-06-12T15:33:33.000-03:00',
		"open_time": "3:33",
		"close_time": "15:33",
		"country": 'BR',
		"state": 'PE',
		"city": 'Xvs',
		"address": 'R. do Alfinetes, 33',
		"coordinates": {
			"latitude": -7.033889,
			"longitude": -39.408889,
		},
		"phone": '(33) 3333-3333',
		"creation_date": '2022-12-06 15:33:33.000-03:00',
		"num_doners": 12,
		"campaign_rating": 5,
		"observation": 'Estamos recebendo qualquer tipo de sangue, porém os mais importantes são os que foram listados abaixo.',
		"blood_types": ['A+', 'AB+', 'O'],
		"header_color": '#F0D',
		"banner_link": 'www.mousse.com',
	},
	{
		"name": "Camapnha Doa Mais 33",
		"cnpj": '34.876.876/0001-00',
		"start_date": '2022-06-12T15:33:33.000-03:00',
		"end_date": '2023-06-12T15:33:33.000-03:00',
		"open_time": "3:33",
		"close_time": "15:33",
		"country": 'BR',
		"state": 'PE',
		"city": 'Xvs',
		"address": 'R. do Alfinetes, 33',
		"coordinates": {
			"latitude": -8.05,
			"longitude": -34.05
		},
		"phone": '(33) 3333-3333',
		"creation_date": '2022-12-06 15:33:33.000-03:00',
		"num_doners": 12,
		"campaign_rating": 5,
		"observation": 'Estamos recebendo qualquer tipo de sangue, porém os mais importantes são os que foram listados abaixo.',
		"blood_types": ['A+', 'AB+', 'O'],
		"header_color": '#F0D',
		"banner_link": 'www.mousse.com'
	},
]

const m_achievements = [
  {
    // Achievement collection data
    base_name: 'Conquista 0',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    // Achievement level collection data
    level_name: 'Nível 0',
    level_description: 'Doar X vezes',
    progress_required: 10,
    // Doner Achievement collection data
    level: 0,
    current_progress: 3,
    // Date Obtained collection data
    date_obtained: null,
    // Data based on queries
    medal_style: null, // Comes after looking for the highest medal style possible (lvl 0 is the base one, 1 is another and goes on)
    image: null, // just like the medal style, but it's the image in front of the medal
  },
  {
    // Achievement collection data
    base_name: 'Conquista 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    // Achievement level collection data
    level_name: 'Nível 1',
    level_description: 'Doar X vezes',
    progress_required: 20,
    // Doner Achievement collection data
    level: 1,
    current_progress: 7,
    // Date Obtained collection data
    date_obtained: '2020-05-01T03:00:00.000-03:00',
    // Data based on queries
    medal_style: null, // Comes after looking for the highest medal style possible (lvl 0 is the base one, 1 is another and goes on)
    image: null, // just like the medal style, but it's the image in front of the medal
  },
  {
    // Achievement collection data
    base_name: 'Conquista 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    // Achievement level collection data
    level_name: 'Nível 2',
    level_description: 'Doar X vezes',
    progress_required: 30,
    // Doner Achievement collection data
    level: 2,
    current_progress: 13,
    // Date Obtained collection data
    date_obtained: '2020-05-01T03:00:00.000-03:00',
    // Data based on queries
    medal_style: null, // Comes after looking for the highest medal style possible (lvl 0 is the base one, 1 is another and goes on)
    image: null, // just like the medal style, but it's the image in front of the medal
  },
  {
    // Achievement collection data
    base_name: 'Conquista 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    // Achievement level collection data
    level_name: 'Nível 3',
    level_description: 'Doar X vezes',
    progress_required: 40,
    // Doner Achievement collection data
    level: 3,
    current_progress: 23,
    // Date Obtained collection data
    date_obtained: '2020-05-01T03:00:00.000-03:00',
    // Data based on queries
    medal_style: null, // Comes after looking for the highest medal style possible (lvl 0 is the base one, 1 is another and goes on)
    image: null, // just like the medal style, but it's the image in front of the medal
  },
  {
    // Achievement collection data
    base_name: 'Conquista 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    // Achievement level collection data
    level_name: 'Nível 4',
    level_description: 'Doar X vezes',
    progress_required: 50,
    // Doner Achievement collection data
    level: 4,
    current_progress: 33,
    // Date Obtained collection data
    date_obtained: '2020-05-01T03:00:00.000-03:00',
    // Data based on queries
    medal_style: null, // Comes after looking for the highest medal style possible (lvl 0 is the base one, 1 is another and goes on)
    image: null, // just like the medal style, but it's the image in front of the medal
  },
  {
    // Achievement collection data
    base_name: 'Conquista 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    // Achievement level collection data
    level_name: 'Nível 5',
    level_description: 'Doar X vezes',
    progress_required: 60,
    // Doner Achievement collection data
    level: 5,
    current_progress: 43,
    // Date Obtained collection data
    date_obtained: '2020-05-01T03:00:00.000-03:00',
    // Data based on queries
    medal_style: null, // Comes after looking for the highest medal style possible (lvl 0 is the base one, 1 is another and goes on)
    image: null, // just like the medal style, but it's the image in front of the medal
  },
]

export {m_campaigns, m_achievements};

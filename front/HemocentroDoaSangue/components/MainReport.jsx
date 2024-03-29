import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import MapView, { Marker } from 'react-native-maps';


import { colors } from '../style/colors';
import { config } from '../config/config';
import { ActivityIndicator } from 'react-native-paper';

export default function MainReport(props) {
  const [loaded, setLoaded] = useState(false);
  const [weekChartData, setWeekChartData] = useState(null);
  const [projectionChartData, setProjectionChartData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [acumulatedWeekDonations, setAcumulatedWeekDonations] = useState(null);
  const [acumulatedMonthDonations, setAcumulatedMonthDonations] = useState(null);
  const [perCampaignDonations, setPerCampaignDonations] = useState(undefined);
  const [apiData, setApiData] = useState(null);

  // Date stuff
  const wday2nwday = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  /* Map variables */
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitudeDelta, setLatitudeDelta] = useState(null);
  const [longitudeDelta, setLongitudeDelta] = useState(null);
  const [markerData, setMarkerData] = useState(null);

  /* Plot styles */
  const chartStyles = {
    weekLineChart: {
      backgroundColor: colors.lightBlue,
      backgroundGradientFrom: colors.lightBlue,
      backgroundGradientTo: colors.blue,
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 12,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: colors.red
      }
    },
    projectionLineChart: {
      backgroundColor: colors.lightRed,
      backgroundGradientFrom: colors.lightRed,
      backgroundGradientTo: colors.red,
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 12,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: colors.blue
      }
    },
    barChart: {
      backgroundColor: colors.lightBlue,
      backgroundGradientFrom: colors.lightBlue,
      backgroundGradientTo: colors.blue,
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 12,
      },
    },
  }

  // Function to get daily count of donations (30 days from today's date)
  async function getWeekDonations() {
    /* Send today date and maybe consider using moment lib to get the date from 7 days before today */
    const data = {
      labels: [
        wday2nwday[apiData['weekCount'][6]['weekDay']],
        wday2nwday[apiData['weekCount'][5]['weekDay']],
        wday2nwday[apiData['weekCount'][4]['weekDay']],
        wday2nwday[apiData['weekCount'][3]['weekDay']],
        wday2nwday[apiData['weekCount'][2]['weekDay']],
        wday2nwday[apiData['weekCount'][1]['weekDay']],
        wday2nwday[apiData['weekCount'][0]['weekDay']],
      ],
      datasets: [
        {
          data: [
            apiData['weekCount'][6]['count'],
            apiData['weekCount'][5]['count'],
            apiData['weekCount'][4]['count'],
            apiData['weekCount'][3]['count'],
            apiData['weekCount'][2]['count'],
            apiData['weekCount'][1]['count'],
            apiData['weekCount'][0]['count'],
          ]
        }
      ]
    }
    // Set last 7 days daily donations
    setWeekChartData(data);
    // Set last 7 days donations
    setAcumulatedWeekDonations(apiData['weekTotalCount']);
    // Set last 30 days donations
    setAcumulatedMonthDonations(apiData['monthCount'])
    // Set per campaign donations (last 30 days)
    setPerCampaignDonations(`${Math.round(10 * (apiData['monthCount'] / props.campaigns.length)) / 10}`)
  }

  // async function getPerCampaignDonations() {
  //   setPerCampaignDonations({
  //     labels: ["Doa Mais", "Amigável", "Mousse"],
  //     datasets: [
  //       {
  //         data: [
  //           Math.round(Math.random() * 500),
  //           Math.round(Math.random() * 500),
  //           Math.round(Math.random() * 500),
  //         ]
  //       }
  //     ]
  //   });
  // }

  async function getProjectionDonations(period) {
    if (period === 'week') {
      setProjectionChartData({
        labels: ["D", "S", "T", "Q", "Q", "S", "S"],
        datasets: [
          {
            data: [
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100)
            ]
          }
        ]
      })
    } else if (week === 'month') {
      setProjectionChartData({
        labels: ["J", "F", "M", "A", "M", "J"],
        datasets: [
          {
            data: [
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100),
              Math.round(Math.random() * 100)
            ]
          }
        ]
      })
    }
  }

  async function getStorage() {
    setStorageData([
      { label: 'O+', value: Math.random() },
      { label: 'O-', value: Math.random() },
      { label: 'A+', value: Math.random() },
      { label: 'A+', value: Math.random() },
      { label: 'B+', value: Math.random() },
      { label: 'B+', value: Math.random() },
      { label: 'AB+', value: Math.random() },
      { label: 'AB+', value: Math.random() },
    ])
  }

  // Function to get all the location info
  async function setMapLocations(campaigns) {
    // Set locations Array of JSON
    let markerDataTemp = [];
    campaigns.map((value, index) => {
      markerDataTemp.push({
        key: index,
        coordinate: value['coordinates'],
        title: value['name'],
        description: value['address'],
      })
    })
    setMarkerData(markerDataTemp);

    /* Set initial position */
    // Number of campaigns
    let count = 0;
    // To get central latitude and longitude points
    let latitude = 0;
    let longitude = 0;
    // To get latitude delta
    let hLatitude = 0;
    let lLatitude = 0;
    // To get longitude delta
    let hLongitude = 0;
    let lLongitude = 0;
    campaigns.map((value, index) => {
      count += 1;
      latitude += value['coordinates']['latitude'];
      longitude += value['coordinates']['longitude'];
      if (value['coordinates']['latitude'] > hLatitude)
        hLatitude = value['coordinates']['latitude']
      if (value['coordinates']['latitude'] < lLatitude)
        lLatitude = value['coordinates']['latitude']
      if (value['coordinates']['longitude'] > hLongitude)
        hLongitude = value['coordinates']['longitude']
      if (value['coordinates']['longitude'] < lLongitude)
        lLongitude = value['coordinates']['longitude']
    });
    setLatitude(latitude / count);
    setLongitude(longitude / count);
    setLatitudeDelta(Math.abs(hLatitude - lLatitude) * 1.33);
    setLongitudeDelta(Math.abs(hLongitude - lLongitude) * 1.33);
  }

  async function apiCall() {
    const data = {
      idValue: props.cnpj,
      idName: 'corp_cnpj',
    }

    // Get API data
    try {
      const response = await fetch(`${config.donation}?idValue=${data.idValue}&idName=${data.idName}`,
        {
          method: 'GET',
        }
      )
      console.log(response.status);
      if (response.status === 200) {
        const json = await response.json();
        setApiData(json)
        console.log(JSON.stringify(json))
      } else {
        // Make an error appear for the user
        try {
          const json = await response.json();
          console.log(JSON.stringify(json))
        } catch (e) {
          console.log(JSON.stringify(e))
        }
      }
    } catch (e) {
      // Make an error appear for the user
      console.log(JSON.stringify(e));
    }
  }

  useEffect(() => {
    apiCall();
  }, []);

  useEffect(() => {
    if (apiData != null) {
      getWeekDonations();
      // getPerCampaignDonations();
      getProjectionDonations('week');
      getStorage();
      setMapLocations(props.campaigns);
      console.log(perCampaignDonations)
      // true sendo definidos antes da hora?
      setLoaded(true);
      console.log(perCampaignDonations)
    }
  }, [apiData])

  return (
    <View style={styles.column}>
      {loaded ?
        <View>
          <View style={styles.firstRow}></View>
          {/* ❓ Storage control (progress bars) */}
          <View style={styles.box} >
            <Text style={styles.boxHeader} >
              Estoque
            </Text>
            {storageData.map((value, index) => {
              return (
                <View style={styles.columnCenter} key={`mousse3${index}`}>
                  <Text style={styles.boxText}>{value['label']} ({Math.round(value['value'] * 100)}%)</Text>
                  <ProgressBar progress={value['value']} color={colors.red} style={styles.progressBar} />
                </View>
              )
            })}
          </View>
          {/* ❓ Alerting blood type warning (red box) */}
          <View style={styles.boxAlert} >
            <Text style={styles.alertBoxHeader} >Faltando</Text>
            {storageData.map((value, index) => {
              if (value.value < 0.2)
                return <Text style={styles.alertBoxText} key={`mousse2${index}`}>{value['label']}</Text>
              else
                return null
            })}
          </View>
          {/* ❓ Current week acumulated donations (blue box) */}
          <View style={styles.box} >
            <Text style={styles.boxHeader} >Doações da semana</Text>
            <Text style={styles.boxText} >{acumulatedWeekDonations}</Text>
          </View>
          {/* ❓ Current month acumulated donations (blue box) */}
          <View style={styles.box} >
            <Text style={styles.boxHeader} >Doações do mês</Text>
            <Text style={styles.boxText} >{acumulatedMonthDonations}</Text>
          </View>
          {/* ❓ Avarage donations per campaign (blue box) */}
          <View style={styles.box} >
            <Text style={styles.boxHeader} >Doações por campanha (último mês)</Text>
            <Text style={styles.boxText} >{perCampaignDonations}</Text>
          </View>
          {/* ❓ Top 3 or 5 campaigns in total donations
          <View style={styles.row}>
            <Text style={styles.title}>Campanhas com mais doações</Text>
          </View>
          <View style={styles.rowCenter} >
            <BarChart
              style={{
                marginVertical: 10,
                borderRadius: 3
              }}
              data={perCampaignDonations}
              width={Dimensions.get("window").width * 0.9}
              height={220}
              chartConfig={chartStyles.barChart}
            // verticalLabelRotation={0}
            />
          </View> */}
          {/* ❓ Last 7 days donations (Line chart) */}
          <View style={styles.row}>
            <Text style={styles.title}>Doações dos últimos 7 dias</Text>
          </View>
          <View style={styles.rowCenter}>
            <LineChart
              data={weekChartData}
              width={Dimensions.get("window").width * 0.9}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={chartStyles.weekLineChart}
              // bezier
              fromZero
              style={{
                marginVertical: 10,
                borderRadius: 3
              }}
              verticalLabelRotation={0}
            />
          </View>
          {/* ❓ Donation projection (line chart) */}
          <View style={styles.row}>
            <Text style={styles.title}>Projeção de doações</Text>
          </View>
          <View style={styles.rowCenter}>
            <LineChart
              data={projectionChartData}
              width={Dimensions.get("window").width * 0.9} // from react-native
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={chartStyles.projectionLineChart}
              // bezier
              fromZero
              style={{
                marginVertical: 10,
                borderRadius: 3
              }}
              verticalLabelRotation={0}
            />
          </View>
          {/* Map */}
          <View style={styles.rowCenter} >
            <View style={styles.columnCenter} >
              <MapView style={styles.map}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: latitudeDelta,
                  longitudeDelta: longitudeDelta,
                }}
              >
                {markerData.map((value, index) => {
                  return (<Marker
                    key={`mousseMap${value.key}`}
                    coordinate={value.coordinate}
                    title={value.title}
                    description={value.description}
                  />)
                })}
              </MapView>
            </View>
          </View>

          <View style={styles.firstRow}></View>
          <View style={styles.firstRow}></View>
          <View style={styles.firstRow}></View>
          <View style={styles.firstRow}></View>
          <View style={styles.firstRow}></View>
        </View> :
        <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 20,
    flexWrap: 'wrap',
  },
  rowCenter: {
    width: Dimensions.get('window').width * 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginTop: 20,
    marginBottom: 3,
  },
  map: {
    borderWidth: 1,
    margin: 'auto',
    marginTop: 10,
    width: Dimensions.get('window').width * 0.9,
    height: 333,
  },
  chip: {
    marginTop: 5,
    marginLeft: 5,
  },
  progressBar: {
    height: 12,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 3,
    marginBottom: 3,
  },
  dataText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
  },
  text: {
    fontSize: 14,
    marginTop: 2,
    lineHeight: 20,
  },
  textCenter: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 3,
    marginLeft: 45,
    marginRight: 45,

  },
  iconButton: {
    margin: 0,
  },
  box: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: colors.lightBlue,
    borderRadius: 6,
    padding: 6,
    marginBottom: 10,
  },
  boxHeader: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  boxText: {
    fontSize: 14,
  },
  boxAlert: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: colors.red,
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
  },
  alertBoxHeader: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  alertBoxText: {
    fontSize: 14,
    color: colors.white,
  },
  firstRow: {
    height: 12,
  },
});

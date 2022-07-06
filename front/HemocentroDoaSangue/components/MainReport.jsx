import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";


import { colors } from '../style/colors';
import { config } from '../config/config';
import { ActivityIndicator } from 'react-native-paper';

export default function MainReport(props) {
  const [loaded, setLoaded] = useState(false)
  const [weekChartData, setWeekChartData] = useState(null)
  const [projectionChartData, setProjectionChartData] = useState(null)
  const [storageData, setStorageData] = useState(null)
  const [acumulatedWeekDonations, setAcumulatedWeekDonations] = useState(null)
  const [acumulatedMonthDonations, setAcumulatedMonthDonations] = useState(null)
  const [perCampaignDonations, setPerCampaignDonations] = useState(null)

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
            Math.round(Math.random() * 100)]
        }
      ]
    }
    // Set last 7 days daily donations
    setWeekChartData(data);
    // Set last 7 days donations
    setAcumulatedWeekDonations(data['datasets'][0]['data'].reduce((partialSum, a) => partialSum + a, 0));
    // Set last 30 days donations
    setAcumulatedMonthDonations(data['datasets'][0]['data'].reduce((partialSum, a) => partialSum + a, 0) * 4)
  }

  async function getPerCampaignDonations() {
    setPerCampaignDonations({
      labels: ["Doa Mais", "Amigável", "Mousse"],
      datasets: [
        {
          data: [
            Math.round(Math.random() * 500),
            Math.round(Math.random() * 500),
            Math.round(Math.random() * 500),
          ]
        }
      ]
    });
  }

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

  useEffect(() => {
    getWeekDonations();
    getPerCampaignDonations();
    getProjectionDonations('week');
    getStorage();
    setLoaded(true);
  }, []);

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
                  <Text style={styles.boxText}>{value['label']} ({Math.round(value['value']*100)}%)</Text>
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
            <Text style={styles.boxHeader} >Doações por campanha</Text>
            <Text style={styles.boxText} >{Math.round(Math.random() * 200)}</Text>
          </View>
          {/* ❓ Top 3 or 5 campaigns in total donations */}
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
          </View>
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

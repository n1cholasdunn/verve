import {Dimensions, Text, View} from 'react-native';
import React, {Component, useContext, useEffect, useState} from 'react';
import {collection, onSnapshot} from '@firebase/firestore';
import {db} from '../../firebaseConfig';
import {AuthContext} from '../../context/auth';
import {LineChart} from 'react-native-chart-kit';

const CalorieChart = () => {
  let thisMonth = new Date().toLocaleString().slice(5, 7);
  const [dateData, setDateData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const userContext = useContext(AuthContext);

  useEffect(() => {
    const mealQuery = collection(db, 'meal-test');

    onSnapshot(mealQuery, snapshot => {
      let mealList = [];
      snapshot.docs.map(doc => mealList.push({...doc.data(), id: doc.id}));
      mealList = mealList.filter(meal => {
        return (
          meal.date.slice(5, 7) === thisMonth &&
          meal.userId === userContext.UserUID
        );
      });

      const dateMap = {};
      mealList.map(meals => {
        dateMap[meals.date]
          ? (dateMap[meals.date] += meals.totalCalories)
          : (dateMap[meals.date] = meals.totalCalories);
      });

      const dateList = Object.keys(dateMap).map(el => el.slice(8, 10));
      const calorieList = Object.values(dateMap).map(el => el);

      setDateData(dateList);
      setCalorieData(calorieList);
    });
  }, []);

  let graphData = {
    labels: dateData,
    datasets: [
      {
        data: calorieData,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
    ],
  };

  return (
    <View className="mr-10">
      <View className="bg-[#1E1E1E]">
        <Text className="mt-3 mb-6 ml-4 text-2xl text-[#ffffff] ">
          Total Calories - Current Month
        </Text>
        <LineChart
          width={350}
          height={300}
          data={graphData}
          fromZero={true}
          yAxisSuffix="Cal"
          chartConfig={{
            backgroundGradientFrom: '#1E1E1E',
            backgroundGradientTo: '#1E1E1E',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            decimalPlaces: 0,
          }}
        />
      </View>
    </View>
  );
};

export default CalorieChart;

const covid19ImpactEstimator = (data) => {
  // Destructuring the given data
  const {
    region: { name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation },
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = data;

  // Custom Functions and Variables

  // normalize days; check for weeks and months if used
  switch (periodType) {
    case 'weeks':
      timeToElapse *= 7;
      break;
    case 'months':
      timeToElapse *= 30;
  }

  // calculate InfectionsByRequestedTime
  const calculateInfectionsByRequestedTime = (currentlyInfected) => {
    const factor = parseInt(timeToElapse / 3);
    return currentlyInfected * 2 ** factor;
  };
  // calculate AvailableBeds
  const calculateAvailableBeds = (severeCasesByRequestedTime) => {
    const bedsAvailable = totalHospitalBeds * 0.35;
    const shortage = bedsAvailable - severeCasesByRequestedTime;
    const result = shortage < 0 ? shortage : bedsAvailable;
    return parseInt(result);
  };

  // the best case estimation
  const impact = {};
  // challenge 1
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
    impact.currentlyInfected
  );
  // challenge 2
  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;
  impact.hospitalBedsByRequestedTime = calculateAvailableBeds(
    impact.severeCasesByRequestedTime
  );
  // challenge 3
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  impact.casesForVentilatorsByRequestedTime =
    impact.infectionsByRequestedTime * 0.02;
  impact.dollarsInFlight =
    impact.infectionsByRequestedTime *
    avgDailyIncomePopulation *
    avgDailyIncomeInUSD *
    timeToElapse;

  // the severe case estimation
  const severeImpact = {};
  // challenge 1
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
    severeImpact.currentlyInfected
  );
  // challenge 2
  severeImpact.severeCasesByRequestedTime =
    severeImpact.infectionsByRequestedTime * 0.15;
  severeImpact.hospitalBedsByRequestedTime = calculateAvailableBeds(
    severeImpact.severeCasesByRequestedTime
  );
  // challenge 3
  severeImpact.casesForICUByRequestedTime =
    severeImpact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForVentilatorsByRequestedTime =
    severeImpact.infectionsByRequestedTime * 0.02;
  severeImpact.dollarsInFlight =
    severeImpact.infectionsByRequestedTime *
    avgDailyIncomePopulation *
    avgDailyIncomeInUSD *
    timeToElapse;

  return {
    data, // the input data you got
    impact, // your best case estimation
    severeImpact // your severe case estimation
  };
};

const covid19 = covid19ImpactEstimator({
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
});

export default covid19ImpactEstimator;

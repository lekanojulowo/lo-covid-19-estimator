const covid19ImpactEstimator = (data) => {
  // Destructuring the given data
  const {
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation },
    periodType,
    reportedCases,
    totalHospitalBeds
  } = data;
  let { timeToElapse } = data;

  // Custom Functions and Variables

  // normalize days; check for weeks and months if used
  switch (periodType) {
    case 'weeks':
      timeToElapse *= 5;
      break;
    case 'months':
      timeToElapse *= 30;
      break;
    default:
      timeToElapse *= 1;
  }

  // calculate InfectionsByRequestedTime
  const calculateInfectionsByRequestedTime = (currentlyInfected) => {
    const factor = parseInt(timeToElapse / 3, 10);
    return currentlyInfected * 2 ** factor;
  };
  // calculate AvailableBeds
  const calculateAvailableBeds = (severeCasesByRequestedTime) => {
    const bedsAvailable = totalHospitalBeds * 0.35;
    const shortage = bedsAvailable - severeCasesByRequestedTime;
    const result = shortage < 0 ? shortage : bedsAvailable;
    return parseInt(result, 10);
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
  impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
  impact.dollarsInFlight = impact.infectionsByRequestedTime
    * avgDailyIncomePopulation
    * avgDailyIncomeInUSD
    * timeToElapse;

  // the severe case estimation
  const severeImpact = {};
  // challenge 1
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = calculateInfectionsByRequestedTime(
    severeImpact.currentlyInfected
  );
  // challenge 2
  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;
  severeImpact.hospitalBedsByRequestedTime = calculateAvailableBeds(
    severeImpact.severeCasesByRequestedTime
  );
  // challenge 3
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.02;
  severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime
    * avgDailyIncomePopulation
    * avgDailyIncomeInUSD
    * timeToElapse;

  return {
    data, // the input data you got
    impact, // your best case estimation
    severeImpact // your severe case estimation
  };
};

export default covid19ImpactEstimator;

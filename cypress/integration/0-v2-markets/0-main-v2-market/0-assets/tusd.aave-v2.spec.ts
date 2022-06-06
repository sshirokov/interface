import { configEnvWithTenderlyMainnetFork } from '../../../../support/steps/configuration.steps';
import {
  borrow,
  repay,
  withdraw,
  changeBorrowType,
  supply,
} from '../../../../support/steps/main.steps';
import { dashboardAssetValuesVerification } from '../../../../support/steps/verification.steps';
import { skipState } from '../../../../support/steps/common';
import assets from '../../../../fixtures/assets.json';
import constants from '../../../../fixtures/constans.json';

const testData = {
  depositETH: {
    asset: assets.aaveMarket.ETH,
    amount: 0.5,
    hasApproval: true,
  },
  testCases: {
    deposit: {
      asset: assets.aaveMarket.TUSD,
      amount: 50,
      hasApproval: false,
    },
    borrow: [
      {
        asset: assets.aaveMarket.TUSD,
        amount: 50,
        apyType: constants.borrowAPYType.variable,
        hasApproval: true,
      },
      {
        asset: assets.aaveMarket.TUSD,
        amount: 50,
        apyType: constants.borrowAPYType.stable,
        hasApproval: true,
      },
    ],
    changeBorrowType: [
      {
        asset: assets.aaveMarket.TUSD,
        apyType: constants.borrowAPYType.stable,
        newAPY: constants.borrowAPYType.variable,
        hasApproval: true,
      },
      {
        asset: assets.aaveMarket.TUSD,
        apyType: constants.borrowAPYType.variable,
        newAPY: constants.borrowAPYType.stable,
        hasApproval: true,
      },
    ],
    repay: [
      {
        asset: assets.aaveMarket.TUSD,
        apyType: constants.apyType.stable,
        amount: 10,
        hasApproval: true,
        repayOption: constants.repayType.default,
      },
      // {
      //   asset: assets.aaveMarket.TUSD,
      //   apyType: constants.apyType.stable,
      //   amount: 10,
      //   hasApproval: false,
      //   repayOption: constants.repayType.collateral,
      //   assetForRepay: assets.aaveMarket.TUSD,
      // },
    ],
    withdraw: {
      asset: assets.aaveMarket.TUSD,
      isCollateral: true,
      amount: 10,
      hasApproval: true,
    },
  },
  verifications: {
    finalDashboard: [
      {
        type: constants.dashboardTypes.deposit,
        assetName: assets.aaveMarket.TUSD.shortName,
        wrapped: assets.aaveMarket.TUSD.wrapped,
        // amount: 30,
        amount: 40,
        collateralType: constants.collateralType.isCollateral,
        isCollateral: true,
      },
      {
        type: constants.dashboardTypes.borrow,
        assetName: assets.aaveMarket.TUSD.shortName,
        wrapped: assets.aaveMarket.TUSD.wrapped,
        // amount: 80,
        amount: 90,
        apyType: constants.borrowAPYType.stable,
      },
    ],
  },
};

describe('TUSD INTEGRATION SPEC, AAVE V2 MARKET', () => {
  const skipTestState = skipState(false);
  configEnvWithTenderlyMainnetFork({});
  supply(testData.depositETH, skipTestState, true);
  testData.testCases.borrow.forEach((borrowCase) => {
    borrow(borrowCase, skipTestState, true);
  });
  testData.testCases.changeBorrowType.forEach((changeAPRCase) => {
    changeBorrowType(changeAPRCase, skipTestState, true);
  });
  supply(testData.testCases.deposit, skipTestState, true);
  testData.testCases.repay.forEach((repayCase) => {
    repay(repayCase, skipTestState, false);
  });
  withdraw(testData.testCases.withdraw, skipTestState, false);
  dashboardAssetValuesVerification(testData.verifications.finalDashboard, skipTestState);
});

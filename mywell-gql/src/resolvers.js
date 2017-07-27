import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import moment from 'moment';

import { ReadingModel } from './models'

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  parseValue(value) {
    return new Date(value); //value from the client
  },
  serialize(value) {
    return value.getTime(); //value to the client
  },
  parseLiteral(ast) {
     if (ast.kind === Kind.INT) {
       return parseInt(ast.value, 10); // ast value is always in string format
     }
     return null;
   },
});

const weeklyReadingsQuery = async(obj, args, context, info) => {
  if (!args.sumOrAvg) {
    args.sumOrAvg = 'AVG'
  }

  if (['AVG', 'SUM'].indexOf(args.sumOrAvg) === -1) {
    throw new Error(`args.sumOrAvg must be AVG or SUM, instead found: ${args.sumOrAvg}`);
  }

  let startDate = null;
  let endDate = null;

  if (!args.startDate) {
    startDate = moment().add(-1, 'years').format('Y-MM-DD');
  } else {
    startDate = moment(args.startDate).format('Y-MM-DD');
  }

  if (!args.endDate) {
    endDate = moment().add().format('Y-MM-DD');
  } else {
    endDate = moment(args.endDate).format('Y-MM-DD');
  }

  const [rows, fields] =  await context.connection.execute(`SELECT days.date as week, SUM(weekly_average) as value FROM (
    select * from days WHERE date >= STR_TO_DATE(?, '%Y-%m-%d') AND date <= STR_TO_DATE(?, '%Y-%m-%d')
  ) as days
  LEFT JOIN (
    select ${args.sumOrAvg}(value) as weekly_average, cast(date as DATE) as date FROM reading where postcode = ? AND resourceId = ? GROUP BY YEAR(date), WEEKOFYEAR(date)
  ) as averages
  ON days.date = averages.date
  GROUP BY YEAR(days.date), WEEKOFYEAR(days.date)
  ORDER BY days.date`,
  [startDate, endDate, args.postcode, args.resourceId]);

  return rows;
}

const cumulativeWeeklyReadingsQuery = async(obj, args, context, info) => {
  let startDate = null;
  let endDate = null;

  if (!args.startDate) {
    startDate = moment().add(-1, 'years').format('Y-MM-DD');
  } else {
    startDate = moment(args.startDate).format('Y-MM-DD');
  }

  if (!args.endDate) {
    endDate = moment().add().format('Y-MM-DD');
  } else {
    endDate = moment(args.endDate).format('Y-MM-DD');
  }

  const [rows, fields] =  await context.connection.query(`set @cumulative_value := 0; SELECT cumulative_readings.date as week, cumulative_value as value FROM (
      select * from days WHERE date >= STR_TO_DATE(?, '%Y-%m-%d') AND date <= STR_TO_DATE(?, '%Y-%m-%d')
    ) as days
    LEFT OUTER JOIN (
      SELECT week, date, (@cumulative_value := @cumulative_value + weekly_sum) as cumulative_value
      FROM (
        SELECT SUM(value) as weekly_sum, cast(date as DATE) as date, WEEKOFYEAR(date) as week
        FROM reading
        WHERE postcode = ?
          AND resourceId = ?
          AND date >= STR_TO_DATE(?, '%Y-%m-%d')
          AND date <= STR_TO_DATE(?, '%Y-%m-%d')
        GROUP BY YEAR(date), WEEKOFYEAR(date)
      ) as weekly_readings
    ) as cumulative_readings
    ON days.date = cumulative_readings.date
    WHERE cumulative_readings.date IS NOT NULL
    GROUP BY YEAR(cumulative_readings.date), WEEKOFYEAR(cumulative_readings.date)
    ORDER BY cumulative_readings.date`,
    [startDate, endDate, args.postcode, args.resourceId, startDate, endDate]
  );

  console.log(rows[1]);
  return rows[1];
}

const resolvers = {
  DateTime: DateTime,

  Query: {
    resource(root, args) {
      return { id:1, last_value: 10.11, owner: 'Lewis Ji', postcode: 5063 }
    },
    readings: async (obj, {postcode, resourceId}, context, info) => {
      const [rows, fields] =  await context.connection.execute('SELECT * FROM `reading` WHERE `postcode` = ? AND `resourceId` = ?', [postcode, resourceId]);
      return rows;
    },
    weeklyReadings: weeklyReadingsQuery,
    cumulativeWeeklyReadings: cumulativeWeeklyReadingsQuery
  },
};

export default resolvers;

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import graphqlFields from 'graphql-fields';
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

const resourcesQuery = async(obj, args, context, info) => {
  const selectionSet = graphqlFields(info);
  console.log('selectionSet:', selectionSet);

  //TODO: generate/optimize nicely
  const sqlQuery = `SELECT resource.id as id, last_value as lastValue, well_depth as wellDepth, last_date as lastDate, owner, elevation, type, postcode, clientId, Client.username
    FROM resource join Client on resource.clientId = Client.id`;
  const [rows, fields] = await context.connection.execute(sqlQuery);

  //TODO do we need to take the flattened client out of here now?

  return rows;
}

const clientsQuery = async(obj, args, context, info) => {
  const sqlQuery = `SELECT id, mobile_number as mobileNumber, username, email, created, lastUpdated
    FROM Client`;
  const [rows, fields] = await context.connection.execute(sqlQuery);

  return rows;

}

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

  const [rows, fields] =  await context.connection.execute(`SELECT Day.date as week, SUM(weekly_average) as value FROM (
    select * from Day WHERE date >= STR_TO_DATE(?, '%Y-%m-%d') AND date <= STR_TO_DATE(?, '%Y-%m-%d')
  ) as Day
  LEFT JOIN (
    select ${args.sumOrAvg}(value) as weekly_average, cast(date as DATE) as date FROM reading where postcode = ? AND resourceId = ? GROUP BY YEAR(date), WEEKOFYEAR(date)
  ) as averages
  ON Day.date = averages.date
  GROUP BY YEAR(Day.date), WEEKOFYEAR(Day.date)
  ORDER BY Day.date`,
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

  const [rows, fields] =  await context.connection.query(`set @cumulative_value := 0;
  SELECT date as week, (@cumulative_value := @cumulative_value + IFNULL(weekly_sum, 0)) as value FROM (
    SELECT Day.date as date, sum(weekly_sum) as weekly_sum FROM (
      select * from Day WHERE date >= STR_TO_DATE(?, '%Y-%m-%d') AND date <= STR_TO_DATE(?, '%Y-%m-%d')
    ) as Day
    LEFT OUTER JOIN (
        SELECT SUM(value) as weekly_sum, cast(date as DATE) as date, WEEKOFYEAR(date) as week
        FROM reading
        WHERE postcode = ?
          AND resourceId = ?
          AND date >= STR_TO_DATE(?, '%Y-%m-%d')
          AND date <= STR_TO_DATE(?, '%Y-%m-%d')
        GROUP BY YEAR(date), WEEKOFYEAR(date)
      ) as weekly_readings
    ON Day.date = weekly_readings.date
    WHERE Day.date IS NOT NULL
    GROUP BY YEAR(Day.date), WEEKOFYEAR(Day.date)
    ORDER BY Day.date
  ) as sum_table;`,
    [startDate, endDate, args.postcode, args.resourceId, startDate, endDate]
  );
  return rows[1];
}

const resolvers = {
  DateTime: DateTime,

  Query: {
    resources: resourcesQuery,
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

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


/* utils */
const getDefaultStartDate = (startDate) => {
  if (!startDate) {
    return moment().add(-1, 'years').format('Y-MM-DD');
  }

  return startDate = moment(startDate).format('Y-MM-DD');
}

const getDefaultEndDate = (endDate) => {
  if (endDate) {
    return moment().add().format('Y-MM-DD');
  }

  return moment(endDate).format('Y-MM-DD');
}

//TODO: we should probably talk to loopback here...
//TODO: or we could just use LB for auth, and then do everything in SQL (good idea)
const resourceQuery = async(obj, args, context, info) => {
  const sqlQuery = `SELECT concat(resource.id,resource.postcode) as id, id as resourceId, ST_X(geo) as lat, ST_Y(geo) as lng,  last_value as lastValue, well_depth as wellDepth, last_date as lastDate, owner, elevation, type, postcode, clientId
    FROM resource WHERE postcode = ? AND id = ? limit 1`;
  const [rows, fields] = await context.connection.execute(sqlQuery, [args.postcode, args.resourceId]);

  return rows[0];
}

const resourcesQuery = async(obj, args, context, info) => {
  const selectionSet = graphqlFields(info);

  //TODO: generate/optimize nicely

  //We concat id and postcode into a unique Id, as Apollo is having trouble handling composite keys
  //This is probably also best practices, and we can work towards moving our model this direction anyway
  const sqlQuery = `SELECT concat(resource.id,resource.postcode) as id, id as resourceId, ST_X(geo) as lat, ST_Y(geo) as lng,  last_value as lastValue, well_depth as wellDepth, last_date as lastDate, owner, elevation, type, postcode, clientId
    FROM resource`;
  const [rows, fields] = await context.connection.execute(sqlQuery);

  return rows;
}

const readingsQuery =  async (obj, args, context, info) => {
  let startDate = getDefaultStartDate(args.startDate);
  let endDate = getDefaultEndDate(args.endDate);

  const [rows, fields] =  await context.connection.execute(`SELECT *
    FROM reading
    WHERE postcode = ? AND resourceId = ? AND date >= STR_TO_DATE(?, \'%Y-%m-%d\') AND date <= STR_TO_DATE(?, \'%Y-%m-%d\')`,
    [args.postcode, args.resourceId, startDate, endDate]);
  return rows;
};

const clientsQuery = async(obj, args, context, info) => {
  const sqlQuery = `SELECT id, mobile_number as mobileNumber, username, email, created, lastUpdated
    FROM Client`;
  const [rows, fields] = await context.connection.execute(sqlQuery);

  return rows;
}

const clientQuery = async(obj, args, context, info) => {
  const sqlQuery = `SELECT id, mobile_number as mobileNumber, username, email, created, lastUpdated
    FROM Client where id=?`;
  const [rows, fields] = await context.connection.execute(sqlQuery, [args.id]);

  return rows[0];
}

const weeklyReadingsQuery = async(obj, args, context, info) => {
  if (!args.sumOrAvg) {
    args.sumOrAvg = 'AVG'
  }

  if (['AVG', 'SUM'].indexOf(args.sumOrAvg) === -1) {
    throw new Error(`args.sumOrAvg must be AVG or SUM, instead found: ${args.sumOrAvg}`);
  }

  let startDate = getDefaultStartDate(args.startDate);
  let endDate = getDefaultEndDate(args.endDate);

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
    client: clientQuery,
    clients: clientQuery,
    resources: resourcesQuery,
    resource: resourceQuery,
    readings: readingsQuery,
    weeklyReadings: weeklyReadingsQuery,
    cumulativeWeeklyReadings: cumulativeWeeklyReadingsQuery
  },
};

export default resolvers;

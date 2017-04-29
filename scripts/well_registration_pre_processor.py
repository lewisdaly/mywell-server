#!/usr/bin/env python

"""
This script takes well registration data (csv) and converts it into a loopback/MySQL ready format
"""
import sys
import csv


def get_preable():
  return 'var loopback = require(\"loopback\");\n\nconst resources = \n[\n'

def get_formatted_row(row):
  try:
    resource_id = int(row[5])
    lat = float(row[7])
    lng = float(row[6])
    last_value = 0
    last_date = 0
    village_id = int(row[3])
    owner = row[2]
    elevation = 0
    resource_type = 'well'
    postcode = int(row[0])
    well_depth = float(row[8])

    return '{{id:{},geo:new loopback.GeoPoint({{lat:{},lng:{}}}),last_value:{}, last_date:{}, \
villageId:{}, owner:"{}", elevation:{}, type:"{}", postcode:{}, well_depth:{}}}, \
           \n'.format(resource_id, lat, lng, last_value, last_date, village_id, owner, elevation, resource_type, postcode, well_depth)
  except ValueError as e:
    print('Error with row:{}'.format(e))

def get_postable():
  return '];\n\nmodule.exports = resources;\n'

def main():
  try:
    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]
  except IndexError as e:
    print('Usage: {} <input> <output>'.format(sys.argv[0]))
    exit(1)

  output_file = open(output_file_path, 'w')
  output_file.write(get_preable())

  with open(input_file_path, 'r') as input_file:
    csv_data = csv.reader(input_file, delimiter=',', quotechar='|')
    for row in csv_data:
      formatted = get_formatted_row(row)
      if formatted is not None:
        output_file.write(formatted)

  output_file.write(get_postable())
  output_file.close()

if __name__ == '__main__':
  main()

#!/usr/bin/env python

"""
This script takes well registration data (csv) and converts it into a loopback/MySQL ready format
"""
import sys
import csv

def init_globals(row):
  global previous_village
  global current_lats
  global current_lngs

  village_id = int(row[3])
  postcode = int(row[0])

  previous_village = (village_id, postcode)
  current_lats = []
  current_lngs = []

  print('init globals', previous_village)

def get_preable():
  return 'var loopback = require(\"loopback\");\n\nconst villages = \n[\n'

def get_formatted_row(row):
  global previous_village
  global current_lats
  global current_lngs

  try:
    village_id = int(row[3])
    village_name = row[1]
    postcode = int(row[0])
    lat = float(row[7])
    lng = float(row[6])

    print('previous_village', previous_village)

    this_village = (village_id, postcode)
    if this_village == previous_village:
      current_lats.append(lat)
      current_lngs.append(lng)

      return None
    else:
      print('new village', this_village)

      avg_lat = sum(current_lats)/float(len(current_lats))
      avg_lng = sum(current_lngs)/float(len(current_lngs))

      current_lats = []
      current_lngs = []
      previous_village = this_village

      return '{{id:{}, name:"{}", postcode:{}, coordinates:new loopback.GeoPoint({{lat:{},lng:{}}}) }}, \
             \n'.format(village_id, village_name, postcode, avg_lat, avg_lng)

  except ValueError as e:
    print('Error with row:{}'.format(e))

def get_postamble():
  return '];\n\nmodule.exports = villages;\n'

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
    idx = 0
    first_row = None
    for row in csv_data:

      #skip the heading row
      if idx == 1:
        init_globals(row)
        first_row = row

      formatted = get_formatted_row(row)
      if formatted is not None:
        output_file.write(formatted)

      idx = idx + 1

    #Just put back in the first row to trigger the change
    last_row = get_formatted_row(first_row)
    output_file.write(last_row)

  output_file.write(get_postamble())
  output_file.close()

if __name__ == '__main__':
  main()

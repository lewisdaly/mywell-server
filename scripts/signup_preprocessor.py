#!/usr/bin/python

"""
Signup processor takes a signup csv file with the format:

Postcode	Mobile Name	Email	Village Name	Resource Id

And converts it into Village and Resource Registration csv files.
It also performs a lookup to try and convert the village name + postcode into a meaningful latlng
"""

import argparse
import sys
import csv
import json
import os
import sys

class Processor:

  def village_to_jsonstring(self, village):
    return '{{"id":{}, "name":"{}", "postcode":{}, "coordinates":{{"lat":{},"lng":{}}} }} \
           \n'.format(village['id'], village['name'], village['postcode'], village['lat'], village['lng'])

  def resource_to_jsonstring(self, resource):
    return '{{"id":{},"geo":{{"lat":{},"lng":{}}},"villageId":{}, "owner":"{}", "type":"{}", "postcode":{}, "mobile":{}}} \
           \n'.format(resource['id'], resource['lat'], resource['lng'],resource['village_id'],resource['owner'], resource['type'], resource['postcode'], resource['mobile'])

  def lookup_latlng(self, postcode, village_name, country_name):
    #TODO: perform lookup on google maps!}
    return [123.00, 456.00]


  def check_invalid_row(self, row, errors):
    is_invalid = False
    for cell in row:
      if '?' in cell:
        is_invalid = True
        break

    if is_invalid:
      errors.append('skipped row: {}, as it contains questionable characters'.format(row))

    return is_invalid

  def save_villages(self, villages, output_path):
    with open('{}_village.csv'.format(output_path), 'w') as output_file:

      for village in villages:
        output_file.write(self.village_to_jsonstring(village))

  def save_resources(self, resources, output_path):
    with open('{}_resource.csv'.format(output_path), 'w') as output_file:
      writer = csv.writer(output_file, delimiter='\t',quotechar='"', quoting=csv.QUOTE_MINIMAL)

      for resource in resources:
        output_file.write(self.resource_to_jsonstring(resource))

  def process_signups(self, resource_type, input_path, output_path):
    #TODO: Set up types with proper data enforcement - right now we just support raingauge
    if resource_type != 'raingauge':
      print("resource_type: '{}' is unsupported. Currently, only 'raingauge' is supported.".format(resource_type))
      exit(1)

    if input_path is None:
      input_file = sys.stdin
    else:
      input_file = open(input_path, 'r')

    villages = []
    resources = []
    errors = []

    for row in csv.reader(iter(input_file.readline, ''), delimiter=','):
      try:
        #Skip any rows containing invalidness
        if self.check_invalid_row(row, errors):
          continue

        postcode, mobile, owner, email, village_name, resource_id = row[:6]
        latlng = self.lookup_latlng(postcode, village_name, 'India')

        villages.append({
          'id': int(resource_id[0:2]),
          'name': village_name,
          'postcode': int(postcode),
          'lat': latlng[0],
          'lng': latlng[1]
        });

        resources.append({
          'id': int(resource_id),
          'village_id': int(resource_id[0:2]),
          'lat': latlng[0],
          'lng': latlng[1],
          'owner': owner,
          'type': resource_type,
          'postcode': int(postcode),
          'mobile': mobile
        });

      except ValueError as e:
        errors.append('error parsing row: {}, {}'.format(row, e))

    if not output_path:
      for village in villages:
        print village

      for resource in resources:
        print resource
    else:
      self.save_villages(villages, output_path)
      self.save_resources(resources, output_path)

    for error in errors:
      print error


  # def __init__(self):


def main():
  parser = argparse.ArgumentParser(description="Preprocesses signup information into village and resource registration data")
  parser.add_argument('--resource_type', required=True, help="The resource type. [well | raingauge | checkdam]")
  parser.add_argument('--input_path', required=False, help='Where to read csv/tsv from (default: stdin)', default=None)
  parser.add_argument('--output_path', required=False, help='Prefix of where the output file should go. (default: out[_village | _resource])', default=None)
  args = parser.parse_args()

  processor = Processor()
  processor.process_signups(args.resource_type, args.input_path, args.output_path)


if __name__ == '__main__':
  main()

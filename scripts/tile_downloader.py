#! /usr/bin/python

'''
This tool downloads map tiles and saves them as .jpeg images
'''

import urllib2
import Queue
# import thread
from threading import Thread
import os.path

def downloadAndSave(idx, q):
  while True:
    coords = q.get()
    print coords
    url = getMapboxUrlForCoords(coords)
    filename = getFilenameForCoords(coords)
    print url

    if os.path.isfile(filename):
      print 'already exists'
      q.task_done()

    image = urllib2.urlopen(url);
    html = image.read()
    image_file = open(getFilenameForCoords(coords), 'w')
    image_file.write(html)
    image_file.close()
    q.task_done()


def getMapboxUrlForCoords(coords):
  return 'https://api.mapbox.com/styles/v1/lewisdaly/ciuqhjyzo00242iphq3wo7bm4/tiles/256/'\
          + str(coords[2]) + '/'\
          + str(coords[0]) + '/'\
          + str(coords[1]) + '?access_token=pk.eyJ1IjoibGV3aXNkYWx5IiwiYSI6ImNpdXE3ajltaDAwMGYyb2tkdjk2emx3NGsifQ.wnqFweA7kdijEtsgjTJIPw'

def getFilenameForCoords(coords):
  return 'mywell-ui/ionic_rainapp/www/img/maptiles/'\
          + str(coords[2]) + '-'\
          + str(coords[0]) + '-' \
          + str(coords[1]) + '.jpeg';


#return a list of tile coords tuples with the given ranges
def generateCoordsForRangeAtZoom(min_x, max_x, min_y, max_y, zoom):
  x_values = range(min_x, max_x)
  y_values = range(min_y, max_y)

  coords = []

  for x_value in x_values:
    for y_value in y_values:
      coords.append((x_value, y_value, zoom))

  return coords

def main():
  queue = Queue.Queue()

  tile_coords = []
  tile_coords += generateCoordsForRangeAtZoom(46264, 46285, 28141, 28164, 16)

  for coords in tile_coords:
    queue.put(coords)

  # thread.start_new(downloadAndSave, ())
  # Set up some threads to fetch the enclosures
  for i in range(5):
      worker = Thread(target=downloadAndSave, args=(i, queue,))
      worker.setDaemon(True)
      worker.start()

  # Now wait for the queue to be empty, indicating that we have
  # processed all of the downloads.
  print '*** Main thread waiting'
  queue.join()
  print '*** Done'


if __name__ == '__main__':
  main()

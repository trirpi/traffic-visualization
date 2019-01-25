#!/usr/bin/env python3

# This file can be run to update the data from the source.
# The data is scraped from the website and written to a .json file.

import urllib.request
import json
from lxml import etree


def main():
    measure_point_data_url = "http://miv.opendata.belfla.be/miv/configuratie/xml"
    measure_point_xml = urllib.request.urlopen(measure_point_data_url)
    measure_point_root = etree.parse(measure_point_xml).getroot()

    measure_point_data = {}

    for mp in measure_point_root.iter('meetpunt'):
        unique_id = int(mp.attrib['unieke_id'])
        e_data = {}
        for child in mp:
            e_data[child.tag] = child.text
        measure_point_data[unique_id] = e_data

    data_url = "http://miv.opendata.belfla.be/miv/verkeersdata"
    data_xml = urllib.request.urlopen(data_url)
    root = etree.parse(data_xml).getroot()

    # this is where all data is going to be stored, this will be dumped to json at the end
    data = {}

    for measure_point in root.iter('meetpunt'):
        unique_id = measure_point.attrib['unieke_id']
        e_data = {}
        for elt in measure_point:
            if not elt.tag == 'meetdata':
                e_data[elt.tag] = elt.text
            elif elt.attrib['klasse_id'] == '2':
                for measure_data in elt:
                    e_data[measure_data.tag] = measure_data.text
        data[unique_id] = e_data


    # now we should clean the data and translate the dutch key names to something english

if __name__ == "__main__":
    main()

# Name: Noam Rubin
# Course: Dataprocessing
# Date: 29-04-2018
#
# This script converts data from csv to JSON

import csv 
import json

# read csv file
with open("huishoudens.csv", "r") as csv_file:
	fields = ["year", "totaal", "zonder"]
	reader = csv.DictReader(csv_file, fields)
	data = {[row for row in reader]}
	
# write json file
with open("huishoudens.json", "w") as json_file:
 	json.dump(data,json_file)

# Name: Noam Rubin
# Course: Dataprocessing
# Date: 29-04-2018
#
# This script converts data from csv to JSON

import csv 
import json

# read csv file
with open("huishoudens.csv", "r") as csv_file:
<<<<<<< HEAD
	reader = csv.DictReader(csv_file)
	clean_reader = reader
	rows = list(csv_file)

data = {}
data

	for element in rows:
		clean_rows =rows.extend(elem.strip().split(";"))

	print(clean_rows)




# # write json file
# with open("huishoudens.json", "w") as json_file:
# 	json.write(" { data :")
# 	json.dump(rows, json_file, indent=4)
# 	json.write("}")
=======
	fields = ["year", "totaal", "zonder"]
	reader = csv.DictReader(csv_file, fields)
	data = {[row for row in reader]}
	
# write json file
with open("huishoudens.json", "w") as json_file:
 	json.dump(data,json_file)
>>>>>>> d48ac4ba107e1ca2b30948923011411713c7c9b1

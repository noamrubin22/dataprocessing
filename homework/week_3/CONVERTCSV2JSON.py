import csv 
import json

# read csv file
with open("huishoudens.csv", "r") as csv_file:
	reader = csv.DictReader(csv_file)
	clean_reader = reader
	rows = list(csv_file)

	for elem in rows:
		clean_rows =rows.extend(elem.strip().split(";"))

	print(clean_rows)




# # write json file
# with open("huishoudens.json", "w") as json_file:
# 	json.write(" { data :")
# 	json.dump(rows, json_file, indent=4)
# 	json.write("}")

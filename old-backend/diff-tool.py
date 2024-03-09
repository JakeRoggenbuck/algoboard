import sys
import json

if __name__ == "__main__":
    filename1, filename2 = sys.argv[1], sys.argv[2]

    file1 = open(filename1, "r")
    file2 = open(filename2, "r")

    data1 = json.load(file1)
    data2 = json.load(file2)

    all_data = {}

    for k in data2:
        print(k)

    file1.close()
    file2.close()

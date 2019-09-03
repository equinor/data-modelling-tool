import os


def getListOfFiles(dirName):
    allFiles = list()
    try:
        # create a list of file and sub directories
        # names in the given directory
        listOfFile = os.listdir(dirName)
        # Iterate over all the entries
        for entry in listOfFile:
            # Create full nodeId
            fullPath = os.path.join(dirName, entry)
            # If entry is a directory then get the list of files in this directory
            if os.path.isdir(fullPath):
                allFiles = allFiles + getListOfFiles(fullPath)
            else:
                allFiles.append(fullPath)
        return allFiles
    except FileNotFoundError:
        return allFiles

def dimensions_to_int(string):
    if not string:
        return 0
    if string == "*":
        return -1
    try:
        return int(string)
    except ValueError:
        return 0

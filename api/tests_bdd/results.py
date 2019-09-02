from terminaltables import AsciiTable
from colorclass import Color


def colored_status(status, text):
    if status == "passed":
        return Color("{autogreen}%s{/autogreen}" % text)
    elif status == "skipped":
        return Color("{autocyan}%s{/autocyan}" % text)
    else:
        return Color("{autored}%s{/autored}" % text)


def two_decimals(number):
    return "{0:.2f}".format(number)


def print_overview_features(features):
    table_data = [["Feature", "Scenario", "Duration"]]
    for feature in features:
        for scenario in feature.scenarios:
            table_data.append(
                [feature.filename, colored_status(scenario.status, scenario.name), two_decimals(scenario.duration)]
            )
    table = AsciiTable(table_data)
    print(table.table)

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


def print_overview_errors(errors):
    print("Errors: %s" % len(errors))

    for error in errors:
        table_data = [
            ["Feature", "Keyword", "Step", "Line"],
            [error.filename, error.keyword, error.name, str(error.line)],
        ]
        table = AsciiTable(table_data)
        print(table.table)
        # Need a line break to avoid overlapping tables and error messages
        print("\n")
        print(error.error_message)

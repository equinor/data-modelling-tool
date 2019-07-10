def enable_remote_debugging(server='172.17.0.1', port=4444, egg_path='/code/pydevd-pycharm.egg'):
    import sys
    import pydevd

    sys.path.append(egg_path)

    try:
        pydevd.settrace(server, port=port, stdoutToServer=True, stderrToServer=True, suspend=False)
    except Exception as e:
        print("Enable remote debugging failed: " + str(e))

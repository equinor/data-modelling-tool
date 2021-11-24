from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler(timezone="Etc/UTC")
scheduler.start()

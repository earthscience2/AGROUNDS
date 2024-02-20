from django.db import models
from django.contrib.postgres.fields import JSONField

class MatchInfo(models.Model):
    match_code = models.CharField(primary_key=True, max_length=45)
    match_host = models.CharField(max_length=45)
    match_home = models.CharField(max_length=45)
    match_away = models.CharField(max_length=45)
    match_home_player = models.JSONField()
    match_away_player = models.JSONField()
    match_home_result = models.IntegerField()
    match_away_result = models.IntegerField()
    match_official = models.CharField(max_length=45)
    match_starttime = models.CharField(max_length=45)
    match_type = models.JSONField()
    match_goal = models.JSONField(null=True)

    class Meta:
        managed = False
        db_table = 'match_info'

from django.db import models
from django.contrib.postgres.fields import JSONField

# DB폴더에서 이미 불러오고 있음 삭제필요
class LeagueInfo(models.Model):
    league_code = models.CharField(primary_key=True, max_length=45)
    league_host = models.CharField(max_length=45)
    league_name = models.CharField(max_length=45)
    league_startdate = models.CharField(max_length=45)
    league_enddate = models.CharField(max_length=45)
    league_startjoin = models.CharField(max_length=45)
    league_endjoin = models.CharField(max_length=45)
    league_team = models.JSONField()
    league_area = models.CharField(max_length=45, null=True, blank=True)
    league_logo = models.CharField(max_length=45, null=True, blank=True)
    league_winner = models.CharField(max_length=45, null=True, blank=True)
    league_gametype = models.CharField(max_length=45)
    league_official = models.CharField(max_length=45)
    league_description = models.CharField(max_length=45, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'league_info'